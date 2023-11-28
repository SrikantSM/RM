package com.sap.c4p.rm.resourcerequest.helpers;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.hcp.cf.logging.common.LogContext;

import com.sap.c4p.rm.resourcerequest.actions.utils.AssignmentServiceUrl;
import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;

import jakarta.servlet.http.HttpServletRequest;
import manageresourcerequestservice.ManageResourceRequestService_;
import manageresourcerequestservice.Staffing;

@Component
@ServiceName(ManageResourceRequestService_.CDS_NAME)
@Profile({ "cloud" })
public class StaffingHelperImpl implements StaffingHelper {

  private static final Logger LOGGER = LoggerFactory.getLogger(StaffingHelperImpl.class);

  private static final String SET_ASSIGNMENT_STATUS = "/SetAssignmentStatus";

  private static final String EXCEPTION_STRING = "Exception: {}";

  private static final String ODATA_V4_REQUESTER_ASSIGNMENT_SERVICE = "/odata/v4/RequesterAssignmentService";

  private static final String X_CORRELATION_ID = "X-CorrelationID";

  private static final String JSON_UTF_8_CONTENT_TYPE = "application/json;charset=UTF-8;IEEE754Compatible=true";

  private HttpServletRequest httpServletRequest;

  private AssignmentServiceUrl assignmentServiceUrl;

  private HttpClient httpClient;

  @Autowired
  public StaffingHelperImpl(AssignmentServiceUrl assignmentServiceUrl, HttpServletRequest httpServletRequest) {
    this.assignmentServiceUrl = assignmentServiceUrl;
    this.assignmentServiceUrl.setUrl(this.assignmentServiceUrl.getAssignmentServiceUrl());
    this.httpClient = HttpClientBuilder.create().build();
    this.httpServletRequest = httpServletRequest;
  }

  // Overloaded Constructor for Mocking
  public StaffingHelperImpl(HttpServletRequest httpServletRequest, AssignmentServiceUrl assignmentServiceUrl,
      HttpClient httpClient) {
    this.httpServletRequest = httpServletRequest;
    this.assignmentServiceUrl = assignmentServiceUrl;
    this.httpClient = httpClient;
  }

  @Override
  public int updateAssignment(int assignmentStatusCode, Staffing staffing) {

    int responseStatusCode;

    String assignmentID = staffing.getAssignmentId();

    String authorization = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
    String locale = httpServletRequest.getHeader(HttpHeaders.ACCEPT_LANGUAGE);

    String json = new JSONObject().put("assignmentID", assignmentID).put("status", assignmentStatusCode).toString();

    String path = ODATA_V4_REQUESTER_ASSIGNMENT_SERVICE + SET_ASSIGNMENT_STATUS;
    String uriString = getUriStringForGivenPath(path);
    URI uri = getURIObjectFromURIString(uriString);

    HttpPost httpPost = new HttpPost(uri);
    addCommonHeaderParametersToRequest(httpPost, authorization, locale);

    try {

      StringEntity entity = new StringEntity(json);
      httpPost.setEntity(entity);

    } catch (UnsupportedEncodingException e) {
      LOGGER.error(EXCEPTION_STRING, e);
    }

    try {
      HttpResponse response = httpClient.execute(httpPost);
      responseStatusCode = response.getStatusLine().getStatusCode();

      if (responseStatusCode >= 400) {
        String reasonPhrase = response.getStatusLine().getReasonPhrase();
        LOGGER.warn("Error: Simulation Response: statusCode = {} ({})", responseStatusCode, reasonPhrase);

      }
    } catch (IOException | JSONException | ParseException | IllegalArgumentException e) {
      LOGGER.warn(EXCEPTION_STRING, e.getMessage());
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, "");
    } finally {
      httpPost.reset();
    }

    return responseStatusCode;
  }

  public String getUriStringForGivenPath(String path) {
    return assignmentServiceUrl.getSchema() + "://" + assignmentServiceUrl.getHost() + path;
  }

  public URI getURIObjectFromURIString(String uriString) {
    URI uri;
    try {
      uri = new URI(uriString);
    } catch (URISyntaxException | NullPointerException e) {
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.INCORRECT_ASSIGNMENT_ACTION_URI);
    }
    return uri;
  }

  public void addCommonHeaderParametersToRequest(HttpRequestBase httpRequestURI, String authorization, String locale) {

    httpRequestURI.addHeader(HttpHeaders.CONTENT_TYPE, JSON_UTF_8_CONTENT_TYPE);
    httpRequestURI.addHeader(HttpHeaders.ACCEPT, ContentType.APPLICATION_JSON.toString());
    httpRequestURI.addHeader(HttpHeaders.AUTHORIZATION, authorization);
    httpRequestURI.addHeader(HttpHeaders.ACCEPT_LANGUAGE, locale);

    // Extract Co-relation ID from LogContext and set it in header for every HTTP
    // request
    String correlationId = LogContext.getCorrelationId();
    httpRequestURI.addHeader(X_CORRELATION_ID, correlationId);
  }

}
