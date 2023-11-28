package com.sap.c4p.rm.resourcerequest.actions.handlers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Optional;

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
import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;

import jakarta.servlet.http.HttpServletRequest;
import processresourcerequestservice.AssignForSpecificPeriodContext;

public class AssignResourceRequestActionHandlerTest {

  private CqnAnalyzerWrapper mockCqnAnalyzerWrapper;
  private HttpServletRequest mockHttpServletRequest;
  private AssignmentApiClient mockAssignmentApiClient;
  private AssignResourceRequestActionHandler handler;
  private CqnSelect mockCqnSelect;
  private AssignForSpecificPeriodContext mockContext;
  private AnalysisResult mockAnalysisResult;
  private PersistenceService mockPersistenceService;

  @BeforeEach
  public void createObject() {

    this.mockCqnAnalyzerWrapper = mock(CqnAnalyzerWrapper.class);
    this.mockHttpServletRequest = mock(HttpServletRequest.class);
    this.mockAssignmentApiClient = mock(AssignmentApiClient.class);
    this.mockCqnSelect = mock(CqnSelect.class);
    this.mockContext = mock(AssignForSpecificPeriodContext.class);
    this.mockAnalysisResult = mock(AnalysisResult.class);
    this.mockPersistenceService = mock(PersistenceService.class);

    this.handler = new AssignResourceRequestActionHandler(mockCqnAnalyzerWrapper, mockAssignmentApiClient,
        mockHttpServletRequest, mockPersistenceService);
  }

  @Test
  @DisplayName("Check if onAssignForSpecificPeriod throws an exception if resourceRequestId is empty")
  public void validateOnAssignForSpecificPeriodForRequestId() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("resourceRequest_ID", "");
    map.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("projectRole_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignForSpecificPeriod(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onAssignForSpecificPeriod throws an exception if resourceId is empty")
  public void validateOnAssignForSpecificPeriodForResourceId() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("resource_ID", "");
    map.put("projectRole_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignForSpecificPeriod(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onAssignForSpecificPeriod throws an exception if start date is null")
  public void validateOnAssignForNullStartDate() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("projectRole_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = null;
    LocalDate mockEndDate = LocalDate.now().plusDays(2);
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignForSpecificPeriod(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onAssignForSpecificPeriod throws an exception if end date is null")
  public void validateOnAssignForNullEndDate() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("projectRole_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = null;
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignForSpecificPeriod(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onAssignForSpecificPeriod throws an exception if duration is zero")
  public void validateOnAssignForZeroDuration() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("projectRole_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = LocalDate.now();
    Integer mockDuration = 0;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignForSpecificPeriod(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onAssignForSpecificPeriod throws an exception if end date is less than start date")
  public void validateOnAssignForEndDateLessThanStart() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("projectRole_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now().plusDays(2);
    LocalDate mockEndDate = LocalDate.now();
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignForSpecificPeriod(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onAssignForSpecificPeriod throws an exception if assignmentSimulation is empty")
  public void validateOnAssignForAssignmentSimulationEmpty() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("projectRole_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = LocalDate.now().plusDays(2);
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);
    JSONObject mockAssignmentSimulation = new JSONObject();
    when(mockAssignmentApiClient.simulateAssignment(any(String.class), any(String.class), any(String.class),
        any(String.class))).thenReturn(mockAssignmentSimulation);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";

    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignForSpecificPeriod(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onAssignForSpecificPeriod throws an exception if assignmentDraft is empty")
  public void validateOnAssignForAssignmentDraftEmpty() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("projectRole_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = LocalDate.now().plusDays(2);
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);
    JSONObject mockAssignmentSimulation = mock(JSONObject.class);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";

    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);

    when(mockAssignmentApiClient.simulateAssignment(any(String.class), any(String.class), any(String.class),
        any(String.class))).thenReturn(mockAssignmentSimulation);
    JSONObject mockAssignmentDraft = new JSONObject();
    when(mockAssignmentApiClient.createAssignmentDraft(mockAssignmentSimulation, mockAuthorization, mockAcceptLanguage))
        .thenReturn(mockAssignmentDraft);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignForSpecificPeriod(mockContext);

    });

  }

  @Test
  @DisplayName("Check if onAssignForSpecificPeriod throws an exception if assignmentActive is empty")
  public void validateOnAssignForAssignmentActiveEmpty() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("projectRole_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = LocalDate.now().plusDays(2);
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);
    JSONObject mockAssignmentSimulation = mock(JSONObject.class);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";

    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);

    when(mockAssignmentApiClient.simulateAssignment(any(String.class), any(String.class), any(String.class),
        any(String.class))).thenReturn(mockAssignmentSimulation);
    JSONObject mockAssignmentDraft = mock(JSONObject.class);
    when(mockAssignmentApiClient.createAssignmentDraft(mockAssignmentSimulation, mockAuthorization, mockAcceptLanguage))
        .thenReturn(mockAssignmentDraft);
    JSONObject mockAssignmentActive = new JSONObject();
    when(mockAssignmentApiClient.activateAssignment(mockAssignmentDraft, mockAuthorization, mockAcceptLanguage))
        .thenReturn(mockAssignmentActive);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignForSpecificPeriod(mockContext);

    });

  }

  @Test
  @DisplayName("Check onAssignForSpecificPeriod() for matchingCandidates ")
  public void validateOnAssignForMatchingCandidate() throws JSONException {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("resourceRequest_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("resource_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put("projectRole_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    LocalDate mockStartDate = LocalDate.now();
    LocalDate mockEndDate = LocalDate.now().plusDays(2);
    Integer mockDuration = 600;
    when((mockContext).getAssignedStart()).thenReturn(mockStartDate);
    when((mockContext).getAssignedEnd()).thenReturn(mockEndDate);
    when((mockContext).getAssignedDuration()).thenReturn(mockDuration);
    JSONObject mockAssignmentSimulation = mock(JSONObject.class);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";

//		when(mockHttpServletRequest.getHeader(any(String.class))).thenReturn(mockAuthorization);
//		when(mockHttpServletRequest.getHeader(any(String.class))).thenReturn(mockAcceptLanguage);

    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);

    when(mockAssignmentApiClient.simulateAssignment(any(String.class), any(String.class), any(String.class),
        any(String.class))).thenReturn(mockAssignmentSimulation);
    JSONObject mockAssignmentDraft = mock(JSONObject.class);
    when(mockAssignmentApiClient.createAssignmentDraft(mockAssignmentSimulation, mockAuthorization, mockAcceptLanguage))
        .thenReturn(mockAssignmentDraft);
    JSONObject mockAssignmentActive = mock(JSONObject.class);
    String mockResultAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    when(mockAssignmentActive.get(any(String.class))).thenReturn(mockResultAssignmentId);
    when(mockAssignmentApiClient.activateAssignment(mockAssignmentDraft, mockAuthorization, mockAcceptLanguage))
        .thenReturn(mockAssignmentActive);

    Result mockResult = mock(Result.class);
    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
    Optional<Row> mockRow = Optional.empty();
    when(mockResult.first()).thenReturn(mockRow);
    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    Message mockMessage = mock(Message.class);
    when(mockContext.getMessages().success(any(String.class), any(String.class))).thenReturn(mockMessage);
    handler.onAssignForSpecificPeriod(mockContext);
    verify(mockContext).setCompleted();
  }
}
