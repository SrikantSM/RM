package com.sap.c4p.rm.resourcerequest.actions.handlers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Optional;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Message;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.actions.utils.AssignmentApiClient;
import com.sap.c4p.rm.resourcerequest.actions.utils.AssignmentCompare;
import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;

import jakarta.servlet.http.HttpServletRequest;
import processresourcerequestservice.ChangeAssignmentContext;

public class ChangeAssignmentActionHandlerTest {

  private CqnAnalyzerWrapper mockCqnAnalyzerWrapper;
  private HttpServletRequest mockHttpServletRequest;
  private AssignmentApiClient mockAssignmentApiClient;
  private AssignmentCompare mockAssignmentCompare;
  private ChangeAssignmentActionHandler handler;
  private CqnSelect mockCqnSelect;
  private ChangeAssignmentContext mockContext;
  private AnalysisResult mockAnalysisResult;
  private PersistenceService mockPersistenceService;

  @BeforeEach
  public void createObject() {

    this.mockCqnAnalyzerWrapper = mock(CqnAnalyzerWrapper.class);
    this.mockHttpServletRequest = mock(HttpServletRequest.class);
    this.mockAssignmentApiClient = mock(AssignmentApiClient.class);
    this.mockAssignmentCompare = mock(AssignmentCompare.class);
    this.mockCqnSelect = mock(CqnSelect.class);
    this.mockContext = mock(ChangeAssignmentContext.class);
    this.mockAnalysisResult = mock(AnalysisResult.class);
    this.mockPersistenceService = mock(PersistenceService.class);

    this.handler = new ChangeAssignmentActionHandler(mockCqnAnalyzerWrapper, mockAssignmentApiClient,
        mockHttpServletRequest, mockPersistenceService);
  }

  @Test
  @DisplayName("Check if onChangeAssignment throws an exception if AssignmentId is empty")
  public void validateOnChangeForAssignmentId() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    assertThrows(ServiceException.class, () -> {
      handler.onChangeAssignment(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onChangeAssignment throws an exception if start date is null")
  public void validateOnChangeForNullStartDate() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = null;
    LocalDate mockEndDate = LocalDate.now().plusDays(2);
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);

    assertThrows(ServiceException.class, () -> {
      handler.onChangeAssignment(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onChangeAssignment throws an exception if end date is null")
  public void validateOnChangeForNullEndDate() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = null;
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);

    assertThrows(ServiceException.class, () -> {
      handler.onChangeAssignment(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onChangeAssignment throws an exception if duration is zero")
  public void validateOnChangeForZeroDuration() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = LocalDate.now();
    Integer mockDuration = 0;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);

    assertThrows(ServiceException.class, () -> {
      handler.onChangeAssignment(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onChangeAssignment throws an exception if end date is less than start date")
  public void validateOnChangeForEndDateLessThanStart() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now().plusDays(2);
    LocalDate mockEndDate = LocalDate.now();
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);

    assertThrows(ServiceException.class, () -> {
      handler.onChangeAssignment(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onChangeAssignment throws an exception if assignmentBeforeChange is empty")
  public void validateOnChangeForAssignmentwithBucketsEmpty() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = LocalDate.now().plusDays(2);
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);
    JSONObject mockAssignmentBeforeChange = new JSONObject();
    when(mockAssignmentApiClient.getAssignmentwithBuckets(any(String.class), any(String.class), any(String.class)))
        .thenReturn(mockAssignmentBeforeChange);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";

    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);

    assertThrows(ServiceException.class, () -> {
      handler.onChangeAssignment(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onChangeAssignment throws an exception if resourceRequestId is empty")
  public void validateOnChangeForRequestId() throws JSONException {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = LocalDate.now().plusDays(2);
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);
    JSONObject mockAssignmentBeforeChange = new JSONObject();
    mockAssignmentBeforeChange.put("resourceRequest_ID", "");
    mockAssignmentBeforeChange.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    when(mockAssignmentApiClient.getAssignmentwithBuckets(any(String.class), any(String.class), any(String.class)))
        .thenReturn(mockAssignmentBeforeChange);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);

    assertThrows(ServiceException.class, () -> {
      handler.onChangeAssignment(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onChangeAssignment throws an exception if resourceId is empty")
  public void validateOnChangeForResourceId() throws JSONException {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = LocalDate.now().plusDays(2);
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);
    JSONObject mockAssignmentBeforeChange = new JSONObject();
    mockAssignmentBeforeChange.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignmentBeforeChange.put("resource_ID", "");
    when(mockAssignmentApiClient.getAssignmentwithBuckets(any(String.class), any(String.class), any(String.class)))
        .thenReturn(mockAssignmentBeforeChange);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);
    assertThrows(ServiceException.class, () -> {
      handler.onChangeAssignment(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onChangeAssignment throws an exception if assignmentAfterSimulation is empty")
  public void validateOnChangeForAssignmentSimulationEmpty() throws JSONException {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = LocalDate.now().plusDays(2);
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);

    JSONObject mockAssignmentBeforeChange = new JSONObject();
    mockAssignmentBeforeChange.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignmentBeforeChange.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    when(mockAssignmentApiClient.getAssignmentwithBuckets(any(String.class), any(String.class), any(String.class)))
        .thenReturn(mockAssignmentBeforeChange);

    JSONObject mockAssignmentAfterSimulation = new JSONObject();
    when(mockAssignmentApiClient.simulateAssignment(any(String.class), any(String.class), any(String.class),
        any(String.class))).thenReturn(mockAssignmentAfterSimulation);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);
    assertThrows(ServiceException.class, () -> {
      handler.onChangeAssignment(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onChangeAssignment throws an exception if assignmentAfterChange is empty")
  public void validateOnChangeForAssignmentChangeEmpty() throws JSONException {
    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = LocalDate.now().plusDays(2);
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);

    JSONObject mockAssignmentBeforeChange = new JSONObject();
    JSONArray assignmentBuckets = new JSONArray();
    HashMap<String, Object> BucketsMap = new HashMap<>();
    BucketsMap.put("startTime", "2020-07-28T00:00:00Z");
    BucketsMap.put("ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    assignmentBuckets.put(BucketsMap);
    mockAssignmentBeforeChange.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignmentBeforeChange.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignmentBeforeChange.put("assignmentBuckets", assignmentBuckets);
    when(mockAssignmentApiClient.getAssignmentwithBuckets(any(String.class), any(String.class), any(String.class)))
        .thenReturn(mockAssignmentBeforeChange);

    JSONObject mockAssignmentAfterSimulation = new JSONObject();
    JSONArray simulatedAssignmentBuckets = new JSONArray();
    mockAssignmentAfterSimulation.put("assignmentBuckets", simulatedAssignmentBuckets);
    when(mockAssignmentApiClient.simulateAssignment(any(String.class), any(String.class), any(String.class),
        any(String.class))).thenReturn(mockAssignmentAfterSimulation);

    JSONObject mockassignmentAfterComparison = mock(JSONObject.class);
    when(mockAssignmentCompare.compareForAssigmentChange(any(String.class), any(JSONObject.class),
        any(JSONObject.class))).thenReturn(mockassignmentAfterComparison);

    JSONObject mockAssignmentAfterChange = new JSONObject();
    when(mockAssignmentApiClient.changeAssignment(any(String.class), any(String.class), any(JSONObject.class),
        any(String.class))).thenReturn(mockAssignmentAfterChange);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);

    assertThrows(ServiceException.class, () -> {
      handler.onChangeAssignment(mockContext);

    });

  }

  @Test
  @DisplayName("Check onChangeAssignment for Staffing ")
  public void validateOnChangeForStaffing() throws JSONException {
    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = LocalDate.now().plusDays(2);
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);

    JSONObject mockAssignmentBeforeChange = new JSONObject();
    JSONArray assignmentBuckets = new JSONArray();
    HashMap<String, Object> BucketsMap = new HashMap<>();
    BucketsMap.put("startTime", "2020-07-28T00:00:00Z");
    BucketsMap.put("ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    assignmentBuckets.put(BucketsMap);
    mockAssignmentBeforeChange.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignmentBeforeChange.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    mockAssignmentBeforeChange.put("assignmentBuckets", assignmentBuckets);
    when(mockAssignmentApiClient.getAssignmentwithBuckets(any(String.class), any(String.class), any(String.class)))
        .thenReturn(mockAssignmentBeforeChange);

    JSONObject mockAssignmentAfterSimulation = new JSONObject();
    JSONArray simulatedAssignmentBuckets = new JSONArray();
    mockAssignmentAfterSimulation.put("assignmentBuckets", simulatedAssignmentBuckets);
    when(mockAssignmentApiClient.simulateAssignment(any(String.class), any(String.class), any(String.class),
        any(String.class))).thenReturn(mockAssignmentAfterSimulation);

    JSONObject mockassignmentAfterComparison = mock(JSONObject.class);
    when(mockAssignmentCompare.compareForAssigmentChange(any(String.class), any(JSONObject.class),
        any(JSONObject.class))).thenReturn(mockassignmentAfterComparison);

    JSONObject mockAssignmentAfterChange = mock(JSONObject.class);
    when(mockAssignmentApiClient.changeAssignment(any(String.class), any(String.class), any(JSONObject.class),
        any(String.class))).thenReturn(mockAssignmentAfterChange);

    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);
    Result mockResult = mock(Result.class);
    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
    Optional<Row> mockRow = Optional.empty();
    when(mockResult.first()).thenReturn(mockRow);
    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    Message mockMessage = mock(Message.class);
    when(mockContext.getMessages().success(any(String.class), any(String.class))).thenReturn(mockMessage);

    handler.onChangeAssignment(mockContext);
    verify(mockContext).setCompleted();
  }
}
