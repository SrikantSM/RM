package com.sap.c4p.rm.resourcerequest.actions.utils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.hcp.cf.logging.common.LogContext;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;

@Component
public class AssignmentApiClient {

  private AssignmentServiceUrl assignmentServiceUrl;

  private HttpClient httpClient;
  private AssignmentJsonObject assignmentJsonObject;

  private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentApiClient.class);
  private static final Marker MARKER = LoggingMarker.CREATE_ASSIGNMENT.getMarker();
  private static final Marker SIMULATE_ASSIGNMENT_MARKER = LoggingMarker.SIMULATE_ASSIGNMENT_MARKER.getMarker();
  private static final Marker DELETE_ASSIGNMENT_MARKER = LoggingMarker.DELETE_ASSIGNMENT.getMarker();
  private static final Marker CHANGE_ASSIGNMENT_MARKER = LoggingMarker.CHANGE_ASSIGNMENT.getMarker();
  private static final String EXCEPTION_STRING = "Exception: {}";
  private static final String EXCEPTION_PATH_WRONG = "Error: path is wrong: {}";
  private static final String EXCEPTION_ASSIGNMENT_MISSING = "Error: Assignment Id missing";

  private static final String ERROR_STRING = "error";
  private static final String MESSAGE_STRING = "message";
  private static final String JSON_UTF_8_CONTENT_TYPE = "application/json;charset=UTF-8;IEEE754Compatible=true";
  private static final String ASSIGNMENTS = "/Assignments";
  private static final String ASSIGNMENT_ID_EQ = "/Assignments(ID=";
  private static final String IS_ACTIVE_ENTITY_FALSE = ",IsActiveEntity=false)";
  private static final String IS_ACTIVE_ENTITY_TRUE = ",IsActiveEntity=true)";
  private static final String ASSIGNMENT_DRAFT_ACTIVATE = "/AssignmentService.draftActivate";
  private static final String ODATA_V4_ASSIGNMENT_SERVICE = "/odata/v4/AssignmentService";
  private static final String EXPLICITY_REQUEST_SORTED_ASSIGNMENT_BUCKETS = "?$expand=assignmentBuckets($orderby=startTime)";

  private static final String X_CORRELATION_ID = "X-CorrelationID";

  @Autowired
  public AssignmentApiClient(final AssignmentServiceUrl assignmentServiceUrl) {
    this.assignmentServiceUrl = assignmentServiceUrl;
    this.assignmentServiceUrl.setUrl(this.assignmentServiceUrl.getAssignmentServiceUrl());
    this.httpClient = HttpClientBuilder.create().build();
    this.assignmentJsonObject = new AssignmentJsonObject();

  }

  // Overloaded constructor for mocking
  public AssignmentApiClient(HttpClient httpClient, AssignmentServiceUrl assignmentServiceUrl,
      AssignmentJsonObject assignmentJsonObject) {
    this.assignmentServiceUrl = assignmentServiceUrl;
    this.httpClient = httpClient;
    this.assignmentJsonObject = assignmentJsonObject;

  }

  public JSONObject simulateAssignment(String json, String authorization, String simulationType, String locale) {

    LOGGER.debug(SIMULATE_ASSIGNMENT_MARKER, "Entered simulateAssignment method in AssignmentApiClient class");
    LOGGER.debug(SIMULATE_ASSIGNMENT_MARKER, "Payload for simulation request : {}", json);

    JSONObject assignment;

    // e.g. /odata/v4/AssignmentService/simulateAsgBasedOnTotalHours
    String path = ODATA_V4_ASSIGNMENT_SERVICE + simulationType;
    String uriString = getUriStringForGivenPath(path);
    URI uri = getURIObjectFromURIString(uriString, MARKER, path);

    // httpPost: Simulate Assignment
    HttpPost httpPost = new HttpPost(uri);
    addCommonHeaderParametersToRequest(httpPost, authorization, locale);

    try {

      StringEntity entity = new StringEntity(json);
      httpPost.setEntity(entity);

    } catch (UnsupportedEncodingException e) {
      LOGGER.error(MARKER, EXCEPTION_STRING, e);
    }

    try {

      // Simulate Assignment
      HttpResponse simulationResponse = httpClient.execute(httpPost);

      assignment = assignmentJsonObject.getAssignmentJsonObject(simulationResponse);

      int statusCode = simulationResponse.getStatusLine().getStatusCode();
      String reasonPhrase = simulationResponse.getStatusLine().getReasonPhrase();

      if (statusCode >= 400) {

        LOGGER.warn(MARKER, "Error: Simulation Response: statusCode = {} ({})", statusCode, reasonPhrase);

        // Get message details, if returned by assignment service
        JSONObject error = assignment.getJSONObject(ERROR_STRING);

        if (!error.isEmpty()) {

          String message = error.getString(MESSAGE_STRING);

          if (!message.isEmpty()) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, message, "");
          } else {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_SIMULATION_FAILURE);
          }

        } else {
          throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_SIMULATION_FAILURE);
        }

      } else {

        // Clean-up the simulation result, by removing the @context property, so that
        // the simulated assignment can be reused in the draft creation
        if (!assignment.isEmpty()) {
          assignment.remove("@context");
        }

        LOGGER.info(MARKER, "Simulation Response: {}", assignment);

      }

    } catch (IOException | JSONException | ParseException | IllegalArgumentException e) {

      LOGGER.warn(MARKER, EXCEPTION_STRING, e.getMessage());
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_SIMULATION_FAILURE);

    } finally {

      // Method execution has consumed, so release connection
      httpPost.reset();

    }

    return assignment;
  }

  public JSONObject createAssignmentDraft(JSONObject assignment, String authorization, String locale) {

    LOGGER.debug(MARKER, "Enter method createAssignmentDraft in AssignmentApiClient class");
    LOGGER.debug(MARKER, "Payload for draft creation: {}", assignment);

    // e.g. /odata/v4/AssignmentService/Assignments
    String path = ODATA_V4_ASSIGNMENT_SERVICE + ASSIGNMENTS;
    String uriString = getUriStringForGivenPath(path);

    URI uri = getURIObjectFromURIString(uriString, MARKER, path);

    StringEntity draftEntity = new StringEntity(assignment.toString(), ContentType.APPLICATION_JSON);

    // httpPost: Create Assignment Draft
    HttpPost httpPost = new HttpPost(uri);
    addCommonHeaderParametersToRequest(httpPost, authorization, locale);

    httpPost.setEntity(draftEntity);

    try {

      HttpResponse draftResponse = httpClient.execute(httpPost);

      assignment = assignmentJsonObject.getAssignmentJsonObject(draftResponse);
      int statusCode = draftResponse.getStatusLine().getStatusCode();
      String reasonPhrase = draftResponse.getStatusLine().getReasonPhrase();

      if (statusCode >= 400) {

        LOGGER.warn(MARKER, "Error: Draft Creation Response: statusCode = {} ({})", statusCode, reasonPhrase);

        // Get message details, if returned by assignment service
        JSONObject error = assignment.getJSONObject(ERROR_STRING);

        if (!error.isEmpty()) {

          String message = error.getString(MESSAGE_STRING);

          if (!message.isEmpty()) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, message, "");
          } else {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DRAFT_CREATION_FAILURE);
          }

        } else {
          throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DRAFT_CREATION_FAILURE);
        }

      } else {
        LOGGER.info(MARKER, "Draft Creation Response: {}", draftResponse);
      }

    } catch (IOException | JSONException | org.apache.http.ParseException | IllegalArgumentException e) {

      LOGGER.warn(MARKER, EXCEPTION_STRING, e.getMessage());
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DRAFT_CREATION_FAILURE);

    } finally {

      // Method execution has consumed, so release connection
      httpPost.reset();

    }

    return assignment;

  }

  public JSONObject activateAssignment(JSONObject assignment, String authorization, String locale) {

    LOGGER.debug(MARKER, "Enter method activateAssignment in AssignmentApiClient class");

    String assignmentId = null;

    if (!assignment.isEmpty()) {

      try {

        assignmentId = assignment.getString("ID");

      } catch (JSONException e) {
        LOGGER.error(MARKER, "Error: Draft Assignment does not have any field called 'ID' :{}", e.getMessage());
      }

    } else {
      LOGGER.error(MARKER, "Error: Assignment creation did not return any assignment");
    }

    // e.g.
    // /odata/v4/AssignmentService/Assignments(ID=123...789,IsActiveEntity=false)/AssignmentService.draftActivate
    String path = ODATA_V4_ASSIGNMENT_SERVICE + ASSIGNMENT_ID_EQ + assignmentId + IS_ACTIVE_ENTITY_FALSE
        + ASSIGNMENT_DRAFT_ACTIVATE;

    String uriString = getUriStringForGivenPath(path);
    URI uri = getURIObjectFromURIString(uriString, DELETE_ASSIGNMENT_MARKER, path);

    // httpPost: Activate Assignment Draft
    HttpPost httpPost = new HttpPost(uri);
    addCommonHeaderParametersToRequest(httpPost, authorization, locale);

    httpPost.setEntity(new StringEntity("{}", ContentType.APPLICATION_JSON));

    try {

      HttpResponse activeationResponse = httpClient.execute(httpPost);

      assignment = assignmentJsonObject.getAssignmentJsonObject(activeationResponse);
      int statusCode = activeationResponse.getStatusLine().getStatusCode();
      String reasonPhrase = activeationResponse.getStatusLine().getReasonPhrase();

      if (statusCode >= 400) {

        LOGGER.warn(MARKER, "Error: Assignment Activation Response: statusCode = {} ({})", statusCode, reasonPhrase);

        // Get message details, if returned by assignment service
        JSONObject error = assignment.getJSONObject(ERROR_STRING);

        if (!error.isEmpty()) {

          String message = error.getString(MESSAGE_STRING);

          if (!message.isEmpty()) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, message, "");
          } else {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DRAFT_ACTIVATION_FAILURE);
          }

        } else {
          throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DRAFT_ACTIVATION_FAILURE);
        }

      } else {

        LOGGER.info(MARKER, "Activation Response: {}", activeationResponse);

      }

    } catch (IOException | JSONException | org.apache.http.ParseException | IllegalArgumentException e) {

      LOGGER.warn(MARKER, EXCEPTION_STRING, e.getMessage());
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DRAFT_ACTIVATION_FAILURE);

    } finally {

      // Method execution has consumed, so release connection
      httpPost.reset();

    }

    return assignment;
  }

  public JSONObject getAssignment(String assignmentId, String authorization, String locale) {

    LOGGER.debug(DELETE_ASSIGNMENT_MARKER,
        "Entered method getAssignment of AssigmentApiClinet, check to db is done before deletion");

    JSONObject assignment;

    if (assignmentId.isEmpty()) {
      LOGGER.warn(DELETE_ASSIGNMENT_MARKER, EXCEPTION_ASSIGNMENT_MISSING);
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DELETION_FAILURE);
    }

    // e.g.
    // /odata/v4/AssignmentService/Assignments(ID=123...789,IsActiveEntity=true)
    String path = ODATA_V4_ASSIGNMENT_SERVICE + ASSIGNMENT_ID_EQ + assignmentId + IS_ACTIVE_ENTITY_TRUE;
    String uriString = getUriStringForGivenPath(path);
    URI uri = getURIObjectFromURIString(uriString, DELETE_ASSIGNMENT_MARKER, path);

    HttpGet httpGet = new HttpGet(uri);
    addCommonHeaderParametersToRequest(httpGet, authorization, locale);

    try {

      HttpResponse getResponse = httpClient.execute(httpGet);

      assignment = assignmentJsonObject.getAssignmentJsonObject(getResponse);
      int statusCode = getResponse.getStatusLine().getStatusCode();
      String reasonPhrase = getResponse.getStatusLine().getReasonPhrase();

      if (statusCode >= 400) {

        LOGGER.warn(DELETE_ASSIGNMENT_MARKER, "Error: Get Assignment Response: statusCode = {} ({})", statusCode,
            reasonPhrase);

        // Get message details, if returned by assignment service
        JSONObject error = assignment.getJSONObject(ERROR_STRING);

        if (!error.isEmpty()) {

          String message = error.getString(MESSAGE_STRING);

          if (!message.isEmpty()) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, message, "");
          } else {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DELETION_FAILURE);
          }

        } else {
          throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DELETION_FAILURE);
        }

      } else {

        LOGGER.info(DELETE_ASSIGNMENT_MARKER, "Get Assignment Response: {}", getResponse);

      }

    } catch (IOException | JSONException | org.apache.http.ParseException | IllegalArgumentException e) {

      LOGGER.warn(DELETE_ASSIGNMENT_MARKER, EXCEPTION_STRING, e.getMessage());
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DELETION_FAILURE);

    } finally {

      // Method execution has consumed, so release connection
      httpGet.reset();

    }

    return assignment;
  }

  public JSONObject getAssignmentwithBuckets(String assignmentId, String authorization, String locale) {

    LOGGER.debug(CHANGE_ASSIGNMENT_MARKER, "Entered method getAssignmentwithBuckets in AssignmentApiClient class");

    JSONObject assignment;

    if (assignmentId.isEmpty()) {
      LOGGER.warn(CHANGE_ASSIGNMENT_MARKER, EXCEPTION_ASSIGNMENT_MISSING);
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.GET_ASSIGNMENT_FAILURE);
    }

    // e.g.
    // /odata/v4/AssignmentService/Assignments(ID=123...789,IsActiveEntity=true)?$expand=assignmentBuckets($orderby=startTime)
    String path = ODATA_V4_ASSIGNMENT_SERVICE + ASSIGNMENT_ID_EQ + assignmentId + IS_ACTIVE_ENTITY_TRUE
        + EXPLICITY_REQUEST_SORTED_ASSIGNMENT_BUCKETS;
    String uriString = getUriStringForGivenPath(path);
    URI uri = getURIObjectFromURIString(uriString, CHANGE_ASSIGNMENT_MARKER, path);

    HttpGet httpGet = new HttpGet(uri);
    addCommonHeaderParametersToRequest(httpGet, authorization, locale);

    try {

      HttpResponse getResponse = httpClient.execute(httpGet);

      assignment = assignmentJsonObject.getAssignmentJsonObject(getResponse);
      int statusCode = getResponse.getStatusLine().getStatusCode();
      String reasonPhrase = getResponse.getStatusLine().getReasonPhrase();

      if (statusCode >= 400) {

        LOGGER.warn(CHANGE_ASSIGNMENT_MARKER, "Error: Get Assignment with Buckets Response: statusCode = {} ({})",
            statusCode, reasonPhrase);

        // Get message details, if returned by assignment service
        JSONObject error = assignment.getJSONObject(ERROR_STRING);

        if (!error.isEmpty()) {

          String message = error.getString(MESSAGE_STRING);

          if (!message.isEmpty()) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, message, "");
          } else {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.GET_ASSIGNMENT_FAILURE);
          }

        } else {
          throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.GET_ASSIGNMENT_FAILURE);
        }

      } else {

        LOGGER.info(CHANGE_ASSIGNMENT_MARKER, "Get Assignment Response: {}", getResponse);

      }

    } catch (IOException | JSONException | org.apache.http.ParseException | IllegalArgumentException e) {

      LOGGER.warn(CHANGE_ASSIGNMENT_MARKER, EXCEPTION_STRING, e.getMessage());
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.GET_ASSIGNMENT_FAILURE);

    } finally {

      // Method execution has consumed, so release connection
      httpGet.reset();

    }

    return assignment;
  }

  public String deleteAssignment(String assignmentId, String authorization, String locale) {

    LOGGER.debug(DELETE_ASSIGNMENT_MARKER, "Entered method deleteAssignment in class AssignmentApiClient");

    String deletedAssignmentId = "";

    if (assignmentId.isEmpty()) {
      LOGGER.error(DELETE_ASSIGNMENT_MARKER, EXCEPTION_ASSIGNMENT_MISSING);
      return deletedAssignmentId;
    }

    // e.g.
    // /odata/v4/AssignmentService/Assignments(ID=123...789,IsActiveEntity=true)
    String path = ODATA_V4_ASSIGNMENT_SERVICE + ASSIGNMENT_ID_EQ + assignmentId + IS_ACTIVE_ENTITY_TRUE;
    String uriString = getUriStringForGivenPath(path);
    URI uri = getURIObjectFromURIString(uriString, DELETE_ASSIGNMENT_MARKER, path);

    HttpDelete httpDelete = new HttpDelete(uri);
    addCommonHeaderParametersToRequest(httpDelete, authorization, locale);

    try {

      HttpResponse deletionResponse = httpClient.execute(httpDelete);

      int statusCode = deletionResponse.getStatusLine().getStatusCode();
      String reasonPhrase = deletionResponse.getStatusLine().getReasonPhrase();

      if (statusCode >= 200 && statusCode < 400) {
        deletedAssignmentId = assignmentId;
      }

      if (statusCode >= 400) {

        LOGGER.warn(DELETE_ASSIGNMENT_MARKER, "Error: Assignment Deletion Response: statusCode = {} ({})", statusCode,
            reasonPhrase);

        JSONObject entity = assignmentJsonObject.getAssignmentJsonObject(deletionResponse);

        // Get message details, if returned by assignment service
        JSONObject error = entity.getJSONObject(ERROR_STRING);

        if (!error.isEmpty()) {

          String message = error.getString(MESSAGE_STRING);

          if (!message.isEmpty()) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, message, "");
          } else {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DELETION_FAILURE);
          }

        } else {
          throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DELETION_FAILURE);
        }

      } else {

        LOGGER.info(DELETE_ASSIGNMENT_MARKER, "Deletion Response: {}", deletionResponse);

      }

    } catch (IOException | JSONException | org.apache.http.ParseException | IllegalArgumentException e) {

      LOGGER.warn(DELETE_ASSIGNMENT_MARKER, EXCEPTION_STRING, e.getMessage());
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_DELETION_FAILURE);

    } finally {

      // Method execution has consumed, so release connection
      httpDelete.reset();

    }

    return deletedAssignmentId;
  }

  /*
   * The header values cannot be manipulated directly by users, the actions
   * originate from approuter where users are already authenticated. The solution
   * was to use regexp to sanitize the header values, this leads to another sonar
   * security issue- S4784 Additionally the regexp check would be performance
   * intensive
   * 
   * @SuppressWarnings({"javasecurity:S5167"}) did not suppress the sonar warning
   * and as a result suppressing all sonar checks on this method
   */

  private void addCommonHeaderParametersToRequest(HttpRequestBase httpRequestURI, String authorization, String locale) {

    httpRequestURI.addHeader(HttpHeaders.CONTENT_TYPE, JSON_UTF_8_CONTENT_TYPE);
    httpRequestURI.addHeader(HttpHeaders.ACCEPT, ContentType.APPLICATION_JSON.toString());
    httpRequestURI.addHeader(HttpHeaders.AUTHORIZATION, authorization);
    httpRequestURI.addHeader(HttpHeaders.ACCEPT_LANGUAGE, locale);

    // Extract Co-relation ID from LogContext and set it in header for every HTTP
    // request
    String correlationId = LogContext.getCorrelationId();
    httpRequestURI.addHeader(X_CORRELATION_ID, correlationId);
  }

  private String getUriStringForGivenPath(String path) {
    return assignmentServiceUrl.getSchema() + "://" + assignmentServiceUrl.getHost() + path;
  }

  private URI getURIObjectFromURIString(String uriString, Marker marker, String path) {
    URI uri;
    try {
      uri = new URI(uriString);
    } catch (URISyntaxException | NullPointerException e) {
      LOGGER.error(marker, EXCEPTION_STRING, e);
      LOGGER.error(marker, EXCEPTION_PATH_WRONG, path);
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.INCORRECT_ASSIGNMENT_ACTION_URI);
    }
    return uri;
  }

  public JSONObject changeAssignment(String assignmentId, String authorization, JSONObject assignment, String locale) {

    LOGGER.debug(CHANGE_ASSIGNMENT_MARKER, "Entered method changeAssignment of class AssignmentApiClient class");
    LOGGER.debug(CHANGE_ASSIGNMENT_MARKER, "payload for HTTP Patch request : {}", assignment);

    // e.g. /odata/v4/AssignmentService/Assignments(ID=83ec..d4,IsActiveEntity=true)
    String path = ODATA_V4_ASSIGNMENT_SERVICE + ASSIGNMENT_ID_EQ + assignmentId + IS_ACTIVE_ENTITY_TRUE;
    String uriString = getUriStringForGivenPath(path);

    URI uri = getURIObjectFromURIString(uriString, CHANGE_ASSIGNMENT_MARKER, path);

    StringEntity draftEntity = new StringEntity(assignment.toString(), ContentType.APPLICATION_JSON);

    // httpPUT: Update Assignment header and Assignment Buckets
    HttpPatch httpPatch = new HttpPatch(uri);
    addCommonHeaderParametersToRequest(httpPatch, authorization, locale);

    httpPatch.setEntity(draftEntity);

    try {

      HttpResponse changeResponse = httpClient.execute(httpPatch);

      assignment = assignmentJsonObject.getAssignmentJsonObject(changeResponse);
      int statusCode = changeResponse.getStatusLine().getStatusCode();
      String reasonPhrase = changeResponse.getStatusLine().getReasonPhrase();

      if (statusCode >= 400) {

        LOGGER.warn(CHANGE_ASSIGNMENT_MARKER, "Error: Assignment Change Response: statusCode = {} ({})", statusCode,
            reasonPhrase);

        // Get message details, if returned by assignment service
        JSONObject error = assignment.getJSONObject(ERROR_STRING);

        if (!error.isEmpty()) {

          String message = error.getString(MESSAGE_STRING);

          if (!message.isEmpty()) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, message, "");
          } else {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_CHANGE_FAILURE);
          }

        } else {
          throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_CHANGE_FAILURE);
        }

      } else {

        LOGGER.info(CHANGE_ASSIGNMENT_MARKER, "Assignment Change Response: {}", changeResponse);
      }

    } catch (IOException | JSONException | org.apache.http.ParseException | IllegalArgumentException e) {

      LOGGER.warn(CHANGE_ASSIGNMENT_MARKER, EXCEPTION_STRING, e.getMessage());
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ASSIGNMENT_CHANGE_FAILURE);

    } finally {

      // Method execution has consumed, so release connection
      httpPatch.reset();

    }

    return assignment;
  }

}
