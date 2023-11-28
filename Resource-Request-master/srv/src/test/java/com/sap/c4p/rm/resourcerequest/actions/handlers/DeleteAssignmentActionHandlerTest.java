
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
import processresourcerequestservice.DeleteAssignmentContext;

public class DeleteAssignmentActionHandlerTest {

  CqnAnalyzerWrapper mockCqnAnalyzerWrapper = null;
  AssignmentApiClient mockAssignmentApiClient = null;
  HttpServletRequest mockHttpServletRequest = null;
  PersistenceService mockPersistenceService = null;
  DeleteAssignmentActionHandler mockHandler = null;

  @BeforeEach
  public void createObject() {

    this.mockCqnAnalyzerWrapper = mock(CqnAnalyzerWrapper.class);
    this.mockAssignmentApiClient = mock(AssignmentApiClient.class);
    this.mockHttpServletRequest = mock(HttpServletRequest.class);
    this.mockPersistenceService = mock(PersistenceService.class);

    this.mockHandler = new DeleteAssignmentActionHandler(mockCqnAnalyzerWrapper, mockAssignmentApiClient,
        mockHttpServletRequest, mockPersistenceService);
  }

  @Test

  @DisplayName("Check if onDeleteAssignment throws an exception if assignmentId is empty")
  public void validateOnDeleteAssignmentForAssignmentId() {

    final DeleteAssignmentContext mockContext = mock(DeleteAssignmentContext.class);
    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    CqnSelect mockCqnSelect = mock(CqnSelect.class);
    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "");

    AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);

    assertThrows(ServiceException.class, () -> {
      mockHandler.onDeleteAssignment(mockContext);

    });

  }

  @Test

  @DisplayName("Check if onDeleteAssignment throws an exception if assignmentBeforeDeletion is empty")
  public void validateOnDeleteAssignmentForAssignmentBeforeDeletion() {

    final DeleteAssignmentContext mockContext = mock(DeleteAssignmentContext.class);
    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    CqnSelect mockCqnSelect = mock(CqnSelect.class);
    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);
    String mockAuthorization = "authorization";
    String locale = "en";
    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(locale);
    JSONObject mockAssignmentBeforeDeletion = new JSONObject();
    when(mockAssignmentApiClient.getAssignment("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4", mockAuthorization, locale))
        .thenReturn(mockAssignmentBeforeDeletion);

    assertThrows(ServiceException.class, () -> {
      mockHandler.onDeleteAssignment(mockContext);

    });

  }

  @Test

  @DisplayName("Check if onDeleteAssignment throws an exception if deletedAssignmentId is empty")
  public void validateOnDeleteAssignmentForDeletedAssignmentIdEmpty() {

    final DeleteAssignmentContext mockContext = mock(DeleteAssignmentContext.class);
    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    CqnSelect mockCqnSelect = mock(CqnSelect.class);
    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);
    JSONObject mockAssignmentBeforeDeletion = mock(JSONObject.class);
    when(mockAssignmentApiClient.getAssignment("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4", mockAuthorization,
        mockAcceptLanguage)).thenReturn(mockAssignmentBeforeDeletion);
    String mockDeletedAssignmentId = "";
    when(mockAssignmentApiClient.deleteAssignment("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4", mockAuthorization,
        mockAcceptLanguage)).thenReturn(mockDeletedAssignmentId);
    assertThrows(ServiceException.class, () -> {
      mockHandler.onDeleteAssignment(mockContext);

    });

  }

  @Test

  @DisplayName("Validate onDeleteAssignment() for staffing")
  public void validateOnDeleteAssignmentForStaffing() {

    final DeleteAssignmentContext mockContext = mock(DeleteAssignmentContext.class);
    CdsModel mockCdsModel = mock(CdsModel.class);
    when(mockContext.getModel()).thenReturn(mockCdsModel);
    CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);

    when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);

    CqnSelect mockCqnSelect = mock(CqnSelect.class);
    when(mockContext.getCqn()).thenReturn(mockCqnSelect);

    HashMap<String, Object> map = new HashMap<>();

    map.put("assignment_ID", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");

    AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);

    when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);
    when(mockAnalysisResult.targetKeys()).thenReturn(map);
    String mockAuthorization = "authorization";
    String mockAcceptLanguage = "en";
    when(mockHttpServletRequest.getHeader("Authorization")).thenReturn(mockAuthorization);
    when(mockHttpServletRequest.getHeader("Accept-Language")).thenReturn(mockAcceptLanguage);
    JSONObject mockAssignmentBeforeDeletion = mock(JSONObject.class);
    when(mockAssignmentApiClient.getAssignment("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4", mockAuthorization,
        mockAcceptLanguage)).thenReturn(mockAssignmentBeforeDeletion);
    String mockDeletedAssignmentId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    when(mockAssignmentApiClient.deleteAssignment("e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4", mockAuthorization,
        mockAcceptLanguage)).thenReturn(mockDeletedAssignmentId);
    String mockResourceId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    try {
      when(mockAssignmentBeforeDeletion.get(any(String.class))).thenReturn(mockResourceId);
    } catch (JSONException e) {
      throw new RuntimeException(e);
    }
    Result mockResult = mock(Result.class);
    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
    Optional<Row> mockRow = Optional.empty();
    when(mockResult.first()).thenReturn(mockRow);
    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    Message mockMessage = mock(Message.class);
    when(mockContext.getMessages().success(any(String.class), any(String.class))).thenReturn(mockMessage);
    mockHandler.onDeleteAssignment(mockContext);
    verify(mockContext).setCompleted();

  }

}
