package com.sap.c4p.rm.resourcerequest.actions.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.net.URISyntaxException;

import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.ServiceException;

public class AssignmentApiClientTest {

  private HttpClient mockhttpClient;
  private AssignmentServiceUrl mockAssignmentServiceUrl;
  private AssignmentApiClient assignmentApiClient;
  private AssignmentJsonObject mockAssignmentJsonObject;

  @BeforeEach
  public void createObject() {
    this.mockhttpClient = mock(HttpClient.class);
    this.mockAssignmentServiceUrl = mock(AssignmentServiceUrl.class);
    this.mockAssignmentJsonObject = mock(AssignmentJsonObject.class);
    this.assignmentApiClient = new AssignmentApiClient(mockhttpClient, mockAssignmentServiceUrl,
        mockAssignmentJsonObject);

  }

  @Test
  @DisplayName("Check if simulateAssignment() throws an exception if the empty Json error is returned")
  public void validateSimulateAssignmentForEmptyJsonError()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {

    String mockJson = "{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\",\"mode\":\"I\"}";
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSimulationType = "simulateAsgBasedOnTotalHours";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\",\"mode\":\"I\"}}"));

    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = new JSONObject();
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.simulateAssignment(mockJson, mockAuthorization, mockSimulationType, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if simulateAssignment() throws an exception if the empty error message is returned")
  public void validateSimulateAssignmentForEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {

    String mockJson = "{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\",\"mode\":\"I\"}";
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSimulationType = "simulateAsgBasedOnTotalHours";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\",\"mode\":\"I\"}}"));

    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);
    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.simulateAssignment(mockJson, mockAuthorization, mockSimulationType, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if simulateAssignment() throws an exception for the non empty error message")
  public void validateSimulateAssignmentForNonEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {

    String mockJson = "{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\",\"mode\":\"I\"}";
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSimulationType = "simulateAsgBasedOnTotalHours";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\",\"mode\":\"I\"}}"));

    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "error message";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);
    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.simulateAssignment(mockJson, mockAuthorization, mockSimulationType, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if simulateAssignment() returns expected Json")
  public void validateSimulateAssignment()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockJson = "{\"duration\":\"10\",\"resourceId\":\"d771ad92-26e5-4aed-9173-49406112b5b2\",\"start\":\"2020-10-01\",\"end\":\"2020-10-02\",\"resourceRequestId\":\"4cc7b653-67f2-449a-9852-7f37d64c5931\",\"mode\":\"I\"}";
    String mockSimulationType = "/SimulateAsgBasedOnTotalHours";
    String mockAuthorization = "Basic YXV0aGVudGljYXRlZC11c2VyOnBhc3M=";
    String mockAcceptLanguage = "en";
    HttpResponse mockSimulationResponse = mock(HttpResponse.class);
    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockSimulationResponse);

    String mockJsonstring = "{\"HasActiveEntity\":false,\"bookedCapacityInMinutes\":600,\"modifiedAt\":null,\"HasDraftEntity\":false,\"resourceRequest_ID\":\"4cc7b653-67f2-449a-9852-7f37d64c5931\",\"@context\":\"$metadata#Assignments(assignmentBuckets())/$entity\",\"createdAt\":null,\"IsActiveEntity\":false,\"createdBy\":null,\"assignmentBuckets\":[{\"assignment_ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\",\"createdAt\":null,\"IsActiveEntity\":false,\"HasActiveEntity\":false,\"createdBy\":null,\"bookedCapacityInMinutes\":300,\"modifiedAt\":null,\"HasDraftEntity\":false,\"modifiedBy\":null,\"startTime\":\"2020-10-01T00:00:00Z\",\"ID\":\"e7733ecc-a387-4f07-86da-410e55defb54\",\"capacityRequirement_ID\":null},{\"assignment_ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\",\"createdAt\":null,\"IsActiveEntity\":false,\"HasActiveEntity\":false,\"createdBy\":null,\"bookedCapacityInMinutes\":300,\"modifiedAt\":null,\"HasDraftEntity\":false,\"modifiedBy\":null,\"startTime\":\"2020-10-02T00:00:00Z\",\"ID\":\"f060663f-5387-447e-a6ec-a472e2760775\",\"capacityRequirement_ID\":null}],\"resource_ID\":\"d771ad92-26e5-4aed-9173-49406112b5b2\",\"modifiedBy\":null,\"ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\"}";

    JSONObject mockAssignment = new JSONObject(mockJsonstring);
    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockSimulationResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(200);
    JSONObject actualAssignmentJson = assignmentApiClient.simulateAssignment(mockJson, mockAuthorization,
        mockSimulationType, mockAcceptLanguage);
    String actualAssignmentJsonString = actualAssignmentJson.toString();
    String expectedAssignmentJsonString = "{\"HasActiveEntity\":false,\"bookedCapacityInMinutes\":600,\"modifiedAt\":null,\"HasDraftEntity\":false,\"resourceRequest_ID\":\"4cc7b653-67f2-449a-9852-7f37d64c5931\",\"createdAt\":null,\"IsActiveEntity\":false,\"createdBy\":null,\"assignmentBuckets\":[{\"assignment_ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\",\"createdAt\":null,\"IsActiveEntity\":false,\"HasActiveEntity\":false,\"createdBy\":null,\"bookedCapacityInMinutes\":300,\"modifiedAt\":null,\"HasDraftEntity\":false,\"modifiedBy\":null,\"startTime\":\"2020-10-01T00:00:00Z\",\"ID\":\"e7733ecc-a387-4f07-86da-410e55defb54\",\"capacityRequirement_ID\":null},{\"assignment_ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\",\"createdAt\":null,\"IsActiveEntity\":false,\"HasActiveEntity\":false,\"createdBy\":null,\"bookedCapacityInMinutes\":300,\"modifiedAt\":null,\"HasDraftEntity\":false,\"modifiedBy\":null,\"startTime\":\"2020-10-02T00:00:00Z\",\"ID\":\"f060663f-5387-447e-a6ec-a472e2760775\",\"capacityRequirement_ID\":null}],\"resource_ID\":\"d771ad92-26e5-4aed-9173-49406112b5b2\",\"modifiedBy\":null,\"ID\":\"cd436e33-75ba-4089-9429-672bcd0b6e72\"}";
    assertEquals(expectedAssignmentJsonString, actualAssignmentJsonString);
  }

  @Test
  @DisplayName("Check if simulateAssignment() throws an exception for the invalid Json")
  public void validateSimulateAssignmentForInvalidJson()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {

    String mockJson = "{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}";
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSimulationType = "simulateAsgBasedOnTotalHours";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);
    JSONObject mockAssignment = new JSONObject();
    mockAssignment.put("resourceId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignment.put("resourceRequestId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.simulateAssignment(mockJson, mockAuthorization, mockSimulationType, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if createAssignmentDraft() throws an exception for empty error message")
  public void validateCreateAssignmentDraftForEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    JSONObject mockAssignment = mock(JSONObject.class);

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);
    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.createAssignmentDraft(mockAssignment, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if createAssignmentDraft() throws an exception for the non empty error message")
  public void validateCreateAssignmentDraftForNonEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    JSONObject mockAssignment = mock(JSONObject.class);

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "error message";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);
    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.createAssignmentDraft(mockAssignment, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if createAssignmentDraft() throws an exception for empty Json error")
  public void validateCreateAssignmentDraftForEmptyJsonError()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    JSONObject mockAssignment = mock(JSONObject.class);

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    JSONObject mockError = new JSONObject();
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.createAssignmentDraft(mockAssignment, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if createAssignmentDraft() throws an exception for invalid Json")
  public void validateCreateAssignmentDraftForInvalidJson()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {

    JSONObject mockAssignment = new JSONObject();
    mockAssignment.put("resourceId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignment.put("resourceRequestId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.createAssignmentDraft(mockAssignment, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if activateAssignment() throws an exception for empty Json error")
  public void validateActivateAssignmentForEmptyJsonError()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = new JSONObject();
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.activateAssignment(mockAssignment, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if activateAssignment() throws an exception for empty error message")
  public void validateActivateAssignmentForEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockMessage = "";
    when(mockError.getString(any(String.class))).thenReturn(mockMessage);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.activateAssignment(mockAssignment, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if activateAssignment() throws an exception for non empty error message")
  public void validateActivateAssignmentForNonEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "error message";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.activateAssignment(mockAssignment, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if activateAssignment() throws an exception for invalid Json")
  public void validateActivateAssignmentForInvalidJson()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {

    JSONObject mockAssignment = new JSONObject();
    mockAssignment.put("resourceId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignment.put("resourceRequestId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPost.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.activateAssignment(mockAssignment, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if getAssignment() throws an exception for empty assignment id")
  public void validateGetAssignmentForEmptyAssignmentId()
      throws URISyntaxException, ClientProtocolException, IOException {

    String mockAssignmentId = "";
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.getAssignment(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if getAssignment() throws an exception for empty json error")
  public void validateGetAsignmentForEmptyJsonError()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpGet.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = new JSONObject();
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);

    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.getAssignment(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if getAssignment() throws an exception for empty error message")
  public void validateGetAssignmentForEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpGet.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.getAssignment(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if getAssignment() throws an exception for non empty error message ")
  public void validateGetAssignmentForNonEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpGet.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "error message";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.getAssignment(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if getAssignment() throws an exception for invalid Json")
  public void validateGetAssignmentForInvalidJson()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";

    JSONObject mockAssignment = new JSONObject();
    mockAssignment.put("resourceId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignment.put("resourceRequestId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpGet.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.getAssignment(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if getAssignmentWithBuckets() throws an exception for empty assignment id")
  public void validateGetAssignmentWithBucketsForEmptyAssignmentId()
      throws URISyntaxException, ClientProtocolException, IOException {

    String mockAssignmentId = "";
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.getAssignmentwithBuckets(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if getAssignmentWithBuckets() throws an exception for empty json error")
  public void validateGetAsignmentWithBucketsForEmptyJsonError()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpGet.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = new JSONObject();
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);

    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.getAssignmentwithBuckets(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if getAssignmentWithBuckets() throws an exception for empty error message")
  public void validateGetAssignmentWithBucketsForEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpGet.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.getAssignmentwithBuckets(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if getAssignmentWithBuckets() throws an exception for non empty error message ")
  public void validateGetAssignmentWithBucketsForNonEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpGet.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "error message";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.getAssignmentwithBuckets(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if getAssignmentWithBuckets() throws an exception for invalid Json")
  public void validateGetAssignmentWithBucketsForInvalidJson()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";

    JSONObject mockAssignment = new JSONObject();
    mockAssignment.put("resourceId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignment.put("resourceRequestId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpGet.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.getAssignmentwithBuckets(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if changeAssigment() throws an exception for empty error message")
  public void validateChangeAssignmentForEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    JSONObject mockAssignment = mock(JSONObject.class);

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPatch.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);
    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.changeAssignment(mockAssignmentId, mockAuthorization, mockAssignment, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if changeAssignment() throws an exception for the non empty error message")
  public void validateChangeAssignmentForNonEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    JSONObject mockAssignment = mock(JSONObject.class);

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPatch.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "error message";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);
    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.changeAssignment(mockAssignmentId, mockAuthorization, mockAssignment, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if changeAssignment() throws an exception for empty Json error")
  public void validateChangeAssignmentForEmptyJsonError()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    JSONObject mockAssignment = mock(JSONObject.class);

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPatch.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    JSONObject mockError = new JSONObject();
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.changeAssignment(mockAssignmentId, mockAuthorization, mockAssignment, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if changeAssignment() throws an exception for invalid Json")
  public void validateChangeAssignmentForInvalidJson()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    JSONObject mockAssignment = new JSONObject();
    mockAssignment.put("resourceId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignment.put("resourceRequestId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpPatch.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.changeAssignment(mockAssignmentId, mockAuthorization, mockAssignment, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if deleteAssignment() throws an exception for empty assignment id")
  public void validateDeleteAssignmentForEmptyAssignmentId()
      throws URISyntaxException, ClientProtocolException, IOException {

    String mockAssignmentId = "";
    String mockDeletedAssignmentId = "";
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    assertEquals(mockDeletedAssignmentId,
        assignmentApiClient.deleteAssignment(mockAssignmentId, mockAuthorization, mockAcceptLanguage));

  }

  @Test
  @DisplayName("Check if deleteAssignment() throws an exception for empty Json error")
  public void validateDeleteAsignmentForEmptyJsonError()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpDelete.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = new JSONObject();
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);

    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.deleteAssignment(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if deleteAssignment() throws an exception for empty error message")
  public void validateDeleteAssignmentForEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpDelete.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.deleteAssignment(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if deleteAssignment() throws an exception for non empty error message")
  public void validateDeleteAssignmentForNonEmptyErrorMessage()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpDelete.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);
    JSONObject mockError = mock(JSONObject.class);
    when(mockAssignment.getJSONObject(any(String.class))).thenReturn(mockError);
    String mockErrorMessage = "error message";
    when(mockError.getString(any(String.class))).thenReturn(mockErrorMessage);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.deleteAssignment(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if deleteAssignment() throws an exception for invalid Json")
  public void validateDeleteAssignmentForInvalidJson()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";

    JSONObject mockAssignment = new JSONObject();
    mockAssignment.put("resourceId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignment.put("resourceRequestId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    HttpResponse mockPostResponse = mock(HttpResponse.class);

    mockPostResponse.setEntity(new StringEntity(
        "{ERROR_STRING:{\"resourceId\":\"e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4\",\"resourceRequestId\":\"0a944173-9b29-400b-8710-c697883cf334\",\"start\":\"2019-01-01\",\"end\":\"2019-01-01\",\"duration\":\"8\"}}"));

    when(mockhttpClient.execute(any(HttpDelete.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(500);

    when(mockAssignmentJsonObject.getAssignmentJsonObject(any(HttpResponse.class))).thenReturn(mockAssignment);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    String mockSchema = "https";
    when(mockAssignmentServiceUrl.getSchema()).thenReturn(mockSchema);
    String mockHost = "localhost:8081";
    when(mockAssignmentServiceUrl.getHost()).thenReturn(mockHost);

    assertThrows(ServiceException.class, () -> {
      assignmentApiClient.deleteAssignment(mockAssignmentId, mockAuthorization, mockAcceptLanguage);

    });

  }

  @Test
  @DisplayName("Check if deleteAssignment() returns a valid assignmentId")
  public void validateDeleteAssignment()
      throws URISyntaxException, ClientProtocolException, IOException, JSONException {
    String mockAssignmentId = "cd436e33-75ba-4089-9429-672bcd0b6e72";
    String mockAuthorization = "Basic YXV0aGVudGljYXRlZC11c2VyOnBhc3M=";
    JSONObject mockAssignment = mock(JSONObject.class);
    when(mockAssignment.getString(any(String.class))).thenReturn("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    String mockAcceptLanguage = "en";
    HttpResponse mockPostResponse = mock(HttpResponse.class);

    when(mockhttpClient.execute(any(HttpDelete.class))).thenReturn(mockPostResponse);

    StatusLine mockStatusLine = mock(StatusLine.class);

    when(mockPostResponse.getStatusLine()).thenReturn(mockStatusLine);
    when(mockStatusLine.getStatusCode()).thenReturn(200);

    assertEquals("cd436e33-75ba-4089-9429-672bcd0b6e72",
        assignmentApiClient.deleteAssignment(mockAssignmentId, mockAuthorization, mockAcceptLanguage));

  }

}
