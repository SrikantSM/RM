package com.sap.c4p.rm.resourcerequest.actions.handlers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
import processresourcerequestservice.AssignAsRequestedContext;
import processresourcerequestservice.MatchingCandidates;

public class AssignAsRequestedActionHandlerTest {

  private CqnAnalyzerWrapper mockCqnAnalyzerWrapper;
  private HttpServletRequest mockHttpServletRequest;
  private AssignmentApiClient mockAssignmentApiClient;
  private AssignAsRequestedActionHandler handler;
  private CqnSelect mockCqnSelect;
  private AssignAsRequestedContext mockContext;
  private AnalysisResult mockAnalysisResult;
  private PersistenceService mockPersistenceService;

  @BeforeEach
  public void createObject() {

    this.mockCqnAnalyzerWrapper = mock(CqnAnalyzerWrapper.class);
    this.mockHttpServletRequest = mock(HttpServletRequest.class);
    this.mockAssignmentApiClient = mock(AssignmentApiClient.class);
    this.mockCqnSelect = mock(CqnSelect.class);
    this.mockContext = mock(AssignAsRequestedContext.class);
    this.mockAnalysisResult = mock(AnalysisResult.class);
    this.mockPersistenceService = mock(PersistenceService.class);

    this.handler = new AssignAsRequestedActionHandler(mockCqnAnalyzerWrapper, mockAssignmentApiClient,
        mockHttpServletRequest, mockPersistenceService);
  }

  @Test
  @DisplayName("Check if onAssignAsRequested throws an exception if resourceRequestId is empty")
  public void validateonAssignAsRequestedForRequestId() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put(MatchingCandidates.RESOURCE_REQUEST_ID, "");
    map.put(MatchingCandidates.RESOURCE_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignAsRequested(mockContext);
    });

  }

  @Test
  @DisplayName("Check if onAssignAsRequested throws an exception if resourceId is empty")
  public void validateonAssignAsRequestedForResourceId() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put(MatchingCandidates.RESOURCE_REQUEST_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put(MatchingCandidates.RESOURCE_ID, "");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignAsRequested(mockContext);
    });

  }

  @Test
  @DisplayName("Check if onAssignAsRequested throws an exception if authorization is empty")
  public void validateonAssignAsRequestedForAuthorizationEmpty() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put(MatchingCandidates.RESOURCE_REQUEST_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put(MatchingCandidates.RESOURCE_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    JSONObject mockAssignmentSimulation = new JSONObject();
    when(mockAssignmentApiClient.simulateAssignment(any(String.class), any(String.class), any(String.class),
        any(String.class))).thenReturn(mockAssignmentSimulation);
    String mockAuthorization = "";
    String mockAcceptLanguage = "en";

    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignAsRequested(mockContext);
    });

  }

  @Test
  @DisplayName("Check if onAssignAsRequested throws an exception if assignmentSimulation is empty")
  public void validateonAssignAsRequestedForAssignmentSimulationEmtpy() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put(MatchingCandidates.RESOURCE_REQUEST_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put(MatchingCandidates.RESOURCE_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    JSONObject mockAssignmentSimulation = new JSONObject();
    when(mockAssignmentApiClient.simulateAssignment(any(String.class), any(String.class), any(String.class),
        any(String.class))).thenReturn(mockAssignmentSimulation);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";

    when(mockHttpServletRequest.getHeader(any(String.class))).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignAsRequested(mockContext);
    });

  }

  @Test
  @DisplayName("Check if onAssignAsRequested throws an exception if assignmentDraft is empty")
  public void validateonAssignAsRequestedForAssignmentDraftEmpty() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put(MatchingCandidates.RESOURCE_REQUEST_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put(MatchingCandidates.RESOURCE_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    JSONObject mockAssignmentSimulation = mock(JSONObject.class);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";

    when(mockHttpServletRequest.getHeader(any(String.class))).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);

    when(mockAssignmentApiClient.simulateAssignment(any(String.class), any(String.class), any(String.class),
        any(String.class))).thenReturn(mockAssignmentSimulation);
    JSONObject mockAssignmentDraft = new JSONObject();
    when(mockAssignmentApiClient.createAssignmentDraft(mockAssignmentSimulation, mockAuthorization, mockAcceptLanguage))
        .thenReturn(mockAssignmentDraft);

    assertThrows(ServiceException.class, () -> {
      handler.onAssignAsRequested(mockContext);
    });

  }

  @Test
  @DisplayName("Check if onAssignAsRequested throws an exception if assignmentActive is empty")
  public void validateonAssignAsRequestedForAssignmentActiveEmpty() {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put(MatchingCandidates.RESOURCE_REQUEST_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put(MatchingCandidates.RESOURCE_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    JSONObject mockAssignmentSimulation = mock(JSONObject.class);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";

    when(mockHttpServletRequest.getHeader(any(String.class))).thenReturn(mockAuthorization);
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
      handler.onAssignAsRequested(mockContext);
    });

  }

  @Test
  @DisplayName("Check onAssignAsRequested() for matchingCandidates")
  public void validateonAssignAsRequestedForMatchingCandidates() throws JSONException {

    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put(MatchingCandidates.RESOURCE_REQUEST_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    map.put(MatchingCandidates.RESOURCE_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    JSONObject mockAssignmentSimulation = mock(JSONObject.class);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";

    when(mockHttpServletRequest.getHeader(any(String.class))).thenReturn(mockAuthorization);
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
    handler.onAssignAsRequested(mockContext);
    verify(mockContext).setCompleted();

  }

}
