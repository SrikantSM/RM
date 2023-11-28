package com.sap.c4p.rm.resourcerequest.actions.utils;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

import java.util.HashMap;
import java.util.Map;

import com.sap.cds.Struct;
import com.sap.cds.services.messages.Message;
import manageresourcerequestservice.ResourceRequests;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;

public class AssignmentProposalValidatorTest {

  private Messages mockMessages;

  private CqnAnalyzerWrapper mockCqnAnalyzerWrapper;

  private PersistenceService mockPersistenceService;

  private Message mockMsg;

  /**
   * Class to be tested.
   */
  AssignmentProposalValidator cut;

  @BeforeEach
  public void setUp() {
    this.mockMessages = mock(Messages.class);
    this.mockMsg = mock(Message.class);
    this.mockCqnAnalyzerWrapper = mock(CqnAnalyzerWrapper.class);
    this.mockPersistenceService = mock(PersistenceService.class);
    cut = new AssignmentProposalValidator(mockMessages, mockCqnAnalyzerWrapper, mockPersistenceService);

  }

  @Nested
  public class checkAssignmentExistsTest {
    @Test
    public void testCheckAssignmentExistsWhenAssignmentNotPresent() {
      String assignmentId = "d060f554-0217-4b91-961d-9c67af41cdf7";
      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 0);

      /**
       * Call to the method to be tested
       */
      cut.checkAssignmentExists(assignmentId);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
      verify(mockResult, times(1)).rowCount();
      verify(mockMessages, times(1)).error(MessageKeys.PROPOSAL_CHANGED);
      verify(mockMessages, times(1)).throwIfError();
    }

    @Test
    public void testCheckAssignmentExistsWhenAssignmentPresent() {
      String assignmentId = "d060f554-0217-4b91-961d-9c67af41cdf7";
      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);

      /**
       * Call to the method to be tested
       */
      cut.checkAssignmentExists(assignmentId);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
      verify(mockResult, times(1)).rowCount();
      verify(mockMessages, times(0)).error(MessageKeys.PROPOSAL_CHANGED);
      verify(mockMessages, times(0)).throwIfError();
    }
  }

  @Nested
  public class ValidateAssignmentTest {
    @Test
    public void testValidateAssignment() {
      AssignmentProposalValidator spyOfCut = spy(cut);

      CdsModel mockCdsModel = mock(CdsModel.class);
      CqnSelect mockCqnSelect = mock(CqnSelect.class);
      CqnAnalyzer mockCqnAnalyzer = mockCqnAnalyzerWrapper.create(mockCdsModel);
      AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);

      when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);
      when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnSelect)).thenReturn(mockAnalysisResult);

      Map<String, Object> keys = new HashMap<>();
      keys.put("assignment_ID", "");

      when(mockAnalysisResult.targetKeys()).thenReturn(keys);
      doNothing().when(spyOfCut).checkAssignmentExists("");

      /**
       * Call to the method to be tested.
       */
      spyOfCut.validateAssignment(mockCdsModel, mockCqnSelect);

      verify(mockCqnAnalyzerWrapper, times(1)).analyze(mockCqnAnalyzer, mockCqnSelect);
      verify(mockAnalysisResult, times(1)).targetKeys();
      verify(spyOfCut, times(1)).checkAssignmentExists("");
    }

  }


  @Nested
  public class checkResourceRequestStatusTest {
    @Test
    public void testResourceRequestResolvedStatus() {
      String resReqId = "d060f554-0217-4b91-961d-9c67af41cdf7";
      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      ResourceRequests resReq = Struct.create(ResourceRequests.class);
      resReq.setRequestStatusCode(1);
      when(mockResult.single(ResourceRequests.class)).thenReturn(resReq);
      when(mockMessages.error(any(), any())).thenReturn(mockMsg);
      when(mockMsg.target((String) any(), any())).thenReturn(mockMsg);
      /**
       * Call to the method to be tested
       */
      cut.checkResourceRequestStatus(resReqId);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
      verify(mockResult, times(1)).rowCount();
      verify(mockMessages, times(1)).error(MessageKeys.REQUEST_STATUS_RESOLVED_OPERATION, 1);
      verify(mockMessages, times(1)).throwIfError();
    }

    @Test
    public void testResourceRequestOpenStatus() {
      String resReqId = "d060f554-0217-4b91-961d-9c67af41cdf7";
      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      ResourceRequests resReq = Struct.create(ResourceRequests.class);
      resReq.setRequestStatusCode(0);
      when(mockResult.single(ResourceRequests.class)).thenReturn(resReq);

      /**
       * Call to the method to be tested
       */
      cut.checkResourceRequestStatus(resReqId);

      verify(mockPersistenceService, times(1)).run(any(CqnSelect.class));
      verify(mockResult, times(1)).rowCount();
      verify(mockMessages, times(0)).error(MessageKeys.REQUEST_STATUS_RESOLVED_OPERATION, 1);
      verify(mockMessages, times(0)).throwIfError();
    }
  }




}
