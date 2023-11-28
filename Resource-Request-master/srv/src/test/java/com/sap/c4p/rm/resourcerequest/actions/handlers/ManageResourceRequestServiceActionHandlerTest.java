package com.sap.c4p.rm.resourcerequest.actions.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.messages.Message;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.resourcerequest.actions.utils.AssignmentProposalValidator;
import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.handlers.ManageResourceRequestHandler;
import com.sap.c4p.rm.resourcerequest.helpers.StaffingHelper;
import com.sap.c4p.rm.resourcerequest.repository.SupplySyncRepository;
import com.sap.c4p.rm.resourcerequest.utils.Constants;
import com.sap.c4p.rm.resourcerequest.validations.ResourceRequestValidator;

import manageresourcerequestservice.*;

@DisplayName("Unit Test for Resource Request Service Action Handlers")
public class ManageResourceRequestServiceActionHandlerTest {

  /*
   * Class under test
   *
   */
  private static ManageResourceRequestServiceActionHandler cut;

  /*
   * mock objects
   *
   */

  private ManageResourceRequestHandler mockResourceRequestHanlder;
  private ResourceRequestValidator mockResourceRequestValidator;
  private SupplySyncRepository mockSupplySyncRepository;
  private Messages mockMessages;

  private StaffingHelper mockStaffingHelper;
  /*
   * Setup data entity
   */
  private ResourceRequests resourceRequest;

  private Staffing staffing;

  private AssignmentProposalValidator mockAssignmentProposalValidator;

  /*
   * Set up of mock also in before each as both action cannot be called within
   * same scope
   */

  @BeforeEach
  public void setUp() {

    mockResourceRequestHanlder = mock(ManageResourceRequestHandler.class);
    mockResourceRequestValidator = mock(ResourceRequestValidator.class);

    mockSupplySyncRepository = mock(SupplySyncRepository.class);
    mockMessages = mock(Messages.class, RETURNS_DEEP_STUBS);
    mockStaffingHelper = mock(StaffingHelper.class);

    mockAssignmentProposalValidator = mock(AssignmentProposalValidator.class);

    cut = new ManageResourceRequestServiceActionHandler(mockResourceRequestHanlder, mockResourceRequestValidator,
        mockSupplySyncRepository, mockMessages, mockStaffingHelper, mockAssignmentProposalValidator);

    resourceRequest = Struct.create(ResourceRequests.class);
    resourceRequest.setId("51051adf-06f2-4043-9179-abbfa82e182e");
    resourceRequest.setRequestStatusCode(0);

  }

  @Nested
  @DisplayName("Publish Resource Request test")
  class ForwardResourceRequestTest {
    @Test
    @DisplayName("Check on Handler of action Publish Resource Request")
    public void onPublishResourceRequestTest() {

      /*
       * Mock and setup resource request data
       *
       */
      PublishResourceRequestContext mockContext = mock(PublishResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      Messages mockMessage = mock(Messages.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequest);

      when(mockResult.rowCount()).thenReturn((long) 1);

      when(mockContext.getMessages()).thenReturn(mockMessage);

      /*
       * Call the method and test
       */

      cut.onPublishResourceRequest(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(mockResourceRequestValidator, times(1)).validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(),
          resourceRequest.getId());

      verify(mockSupplySyncRepository, times(1)).insertDemand(resourceRequest.getDemandId());

      verify(mockResourceRequestHanlder, times(1)).updateResourceRequestStatus(resourceRequest.getId(),
          ResourceRequests.RELEASE_STATUS_CODE, resourceRequest.getReleaseStatusCode());
      assertEquals(Constants.REQUEST_PUBLISH, resourceRequest.getReleaseStatusCode(), "Release status is incorrect");

      verify(mockMessages, times(1)).throwIfError();

    }

    @Test
    @DisplayName("Unauthorized user tries to publish resource request")
    public void onPublishResourceRequestByUnAuthorizedUserTest() {

      /*
       * Mock and setup resource request data
       *
       */
      PublishResourceRequestContext mockContext = mock(PublishResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequest);

      when(mockResult.rowCount()).thenReturn((long) 0);

      when(mockContext.getMessages()).thenReturn(mockMessages);

      /*
       * Call the method and test
       */

      cut.onPublishResourceRequest(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */
      verify(mockMessages, times(1)).error(MessageKeys.NOT_AUTHORIZED_TO_PUBLISH);
      verify(mockMessages, times(2)).throwIfError();

    }
  }

  @Nested
  @DisplayName("Withdraw Resource Request test")
  class WithdrawResourceRequestTest {
    @Test
    @DisplayName("Check on Handler of action Withdraw Resource Request")
    public void onWithdrawResourceRequestTest() {

      /*
       * Mock and setup resource request data
       *
       */
      WithdrawResourceRequestContext mockContext = mock(WithdrawResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);
      Messages mockMessage = mock(Messages.class);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequest);
      when(mockContext.getMessages()).thenReturn(mockMessage);

      /*
       * Call the method and test
       */

      cut.onWithdrawResourceRequest(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());
      verify(mockResourceRequestValidator, times(1)).checkResourceRequestStaffing(resourceRequest.getId());

      verify(mockSupplySyncRepository, times(1)).deleteDemand(resourceRequest.getDemandId());

      verify(mockResourceRequestHanlder, times(1)).updateResourceRequestStatus(resourceRequest.getId(),
          ResourceRequests.RELEASE_STATUS_CODE, resourceRequest.getReleaseStatusCode());
      assertEquals(Constants.REQUEST_WITHDRAW, resourceRequest.getReleaseStatusCode(), "Release status is incorrect");

      verify(mockMessages, times(1)).throwIfError();
    }
  }

  @Nested
  @DisplayName("Unit tests for onAssignmentProposalAccept")
  class AcceptAssignmentProposalTest {
    @Test
    public void ValidateOnAssignmentProposalAcceptOnSuccess() {
      ManageResourceRequestServiceActionHandler spyOfCut = Mockito.spy(cut);

      AcceptAssignmentProposalContext mockContext = mock(AcceptAssignmentProposalContext.class);
      Result mockResult = mock(Result.class);
      CqnService mockCqnService = mock(CqnService.class);
      CqnSelect mockSelect = mock(CqnSelect.class);
      CdsModel mockCdsModel = mock(CdsModel.class);

      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockContext.getCqn()).thenReturn(mockSelect);

      doNothing().when(mockAssignmentProposalValidator).validateAssignment(mockCdsModel, mockSelect);

      staffing = Struct.create(Staffing.class);
      staffing.setAssignmentStatusCode(2);

      when(mockContext.getService()).thenReturn(mockCqnService);
      when((mockCqnService).run(mockSelect)).thenReturn(mockResult);
      when(mockResult.single(Staffing.class)).thenReturn(staffing);
      when(mockContext.getMessages()).thenReturn(mockMessages);

      doReturn(204).when(mockStaffingHelper).updateAssignment(Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_STATUS_CODE,
          staffing);
      /**
       * Call to the method to be tested
       */
      spyOfCut.onAssignmentProposalAccept(mockContext);

      verify(mockStaffingHelper, times(1)).updateAssignment(Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_STATUS_CODE,
          staffing);
      verify(mockContext, times(1)).setResult(staffing);
      verify(mockContext, times(1)).setCompleted();
      verify(mockContext, times(1)).getMessages();
      assertEquals(Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_STATUS_CODE, staffing.getAssignmentStatusCode());
      verify(mockAssignmentProposalValidator, times(1)).validateAssignment(mockCdsModel, mockSelect);
    }

    @DisplayName("Test Case when Assignment Status is not proposed(2)")
    @Test
    public void ValidateOnAssignmentProposalAcceptOnError() {
      ManageResourceRequestServiceActionHandler spyOfCut = Mockito.spy(cut);

      AcceptAssignmentProposalContext mockContext = mock(AcceptAssignmentProposalContext.class);
      Result mockResult = mock(Result.class);
      CqnService mockCqnService = mock(CqnService.class);
      CqnSelect mockSelect = mock(CqnSelect.class);
      CdsModel mockCdsModel = mock(CdsModel.class);

      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockContext.getCqn()).thenReturn(mockSelect);

      doNothing().when(mockAssignmentProposalValidator).validateAssignment(mockCdsModel, mockSelect);

      Message mockErrorMessage = mock(Message.class);

      staffing = Struct.create(Staffing.class);
      staffing.setAssignmentStatusCode(1);

      when(mockContext.getService()).thenReturn(mockCqnService);
      when((mockCqnService).run(mockSelect)).thenReturn(mockResult);
      when(mockResult.single(Staffing.class)).thenReturn(staffing);

      doReturn(mockErrorMessage).when(mockMessages).error(MessageKeys.PROPOSAL_NOT_EXISTS);
      when(mockErrorMessage.target(anyString())).thenReturn(null);

      /**
       * Call to the method to be tested
       */
      spyOfCut.onAssignmentProposalAccept(mockContext);

      verify(mockStaffingHelper, times(0)).updateAssignment(Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_STATUS_CODE,
          staffing);
      verify(mockMessages, times(1)).error(MessageKeys.PROPOSAL_NOT_EXISTS);
      verify(mockContext, times(0)).setResult(staffing);
      verify(mockContext, times(0)).setCompleted();
      verify(mockContext, times(0)).getMessages();
      assertEquals(1, staffing.getAssignmentStatusCode());
      verify(mockAssignmentProposalValidator, times(1)).validateAssignment(mockCdsModel, mockSelect);
    }

    @DisplayName("Test Case when Assignment Status is proposed, but update Assignment returns 400")
    @Test
    public void ValidateOnAssignmentProposalAcceptOnStatus400() {
      ManageResourceRequestServiceActionHandler spyOfCut = Mockito.spy(cut);

      AcceptAssignmentProposalContext mockContext = mock(AcceptAssignmentProposalContext.class);
      Result mockResult = mock(Result.class);
      CqnService mockCqnService = mock(CqnService.class);
      CqnSelect mockSelect = mock(CqnSelect.class);
      CdsModel mockCdsModel = mock(CdsModel.class);

      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockContext.getCqn()).thenReturn(mockSelect);

      doNothing().when(mockAssignmentProposalValidator).validateAssignment(mockCdsModel, mockSelect);

      staffing = Struct.create(Staffing.class);
      staffing.setAssignmentStatusCode(2);

      when(mockContext.getService()).thenReturn(mockCqnService);
      when((mockCqnService).run(mockSelect)).thenReturn(mockResult);
      when(mockResult.single(Staffing.class)).thenReturn(staffing);

      doReturn(400).when(mockStaffingHelper).updateAssignment(Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_STATUS_CODE,
          staffing);

      /**
       * Call to the method to be tested
       */
      spyOfCut.onAssignmentProposalAccept(mockContext);

      verify(mockStaffingHelper, times(1)).updateAssignment(Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_STATUS_CODE,
          staffing);
      // Verify mockContext with setResult is not called
      verify(mockContext, times(0)).setResult(staffing);
      verify(mockContext, times(0)).setCompleted();
      verify(mockContext, times(0)).getMessages();
      verify(mockAssignmentProposalValidator, times(1)).validateAssignment(mockCdsModel, mockSelect);
    }
  }

  @Nested
  @DisplayName("Unit tests for onAssignmentProposalReject")
  class RejectAssignmentProposalTest {
    @Test
    public void ValidateOnAssignmentProposalRejectOnSuccess() {
      ManageResourceRequestServiceActionHandler spyOfCut = Mockito.spy(cut);

      RejectAssignmentProposalContext mockContext = mock(RejectAssignmentProposalContext.class);
      Result mockResult = mock(Result.class);
      CqnService mockCqnService = mock(CqnService.class);
      CqnSelect mockSelect = mock(CqnSelect.class);
      CdsModel mockCdsModel = mock(CdsModel.class);

      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockContext.getCqn()).thenReturn(mockSelect);

      doNothing().when(mockAssignmentProposalValidator).validateAssignment(mockCdsModel, mockSelect);

      staffing = Struct.create(Staffing.class);
      staffing.setAssignmentStatusCode(2);

      when(mockContext.getService()).thenReturn(mockCqnService);
      when((mockCqnService).run(mockSelect)).thenReturn(mockResult);
      when(mockResult.single(Staffing.class)).thenReturn(staffing);
      when(mockContext.getMessages()).thenReturn(mockMessages);
      doReturn(204).when(mockStaffingHelper).updateAssignment(Constants.AssignmentStatus.REJECT_ASSIGNMENT_STATUS_CODE,
          staffing);

      /**
       * Call to the method to be tested
       */
      spyOfCut.onAssignmentProposalReject(mockContext);

      verify(mockStaffingHelper, times(1)).updateAssignment(Constants.AssignmentStatus.REJECT_ASSIGNMENT_STATUS_CODE,
          staffing);
      verify(mockContext, times(1)).setResult(staffing);
      verify(mockContext, times(1)).setCompleted();
      verify(mockContext, times(1)).getMessages();
      assertEquals(Constants.AssignmentStatus.REJECT_ASSIGNMENT_STATUS_CODE, staffing.getAssignmentStatusCode());
      verify(mockAssignmentProposalValidator, times(1)).validateAssignment(mockCdsModel, mockSelect);

    }

    @DisplayName("Test Case when Assignment Status is not proposed(2)")
    @Test
    public void ValidateOnAssignmentProposalRejectOnError() {
      ManageResourceRequestServiceActionHandler spyOfCut = Mockito.spy(cut);

      RejectAssignmentProposalContext mockContext = mock(RejectAssignmentProposalContext.class);
      Result mockResult = mock(Result.class);
      CqnService mockCqnService = mock(CqnService.class);
      CqnSelect mockSelect = mock(CqnSelect.class);
      CdsModel mockCdsModel = mock(CdsModel.class);

      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockContext.getCqn()).thenReturn(mockSelect);

      doNothing().when(mockAssignmentProposalValidator).validateAssignment(mockCdsModel, mockSelect);

      Message mockErrorMessage = mock(Message.class);

      staffing = Struct.create(Staffing.class);
      staffing.setAssignmentStatusCode(0);

      when(mockContext.getService()).thenReturn(mockCqnService);
      when((mockCqnService).run(mockContext.getCqn())).thenReturn(mockResult);
      when(mockResult.single(Staffing.class)).thenReturn(staffing);

      doReturn(mockErrorMessage).when(mockMessages).error(MessageKeys.PROPOSAL_NOT_EXISTS);
      when(mockErrorMessage.target(anyString())).thenReturn(null);

      /**
       * Call to the method to be tested
       */
      spyOfCut.onAssignmentProposalReject(mockContext);

      // Verify that UpdateAssignment is not called.
      verify(mockStaffingHelper, times(0)).updateAssignment(Constants.AssignmentStatus.REJECT_ASSIGNMENT_STATUS_CODE,
          staffing);
      verify(mockMessages, times(1)).error(MessageKeys.PROPOSAL_NOT_EXISTS);
      // Verify mockContext- SetResult is called with staffing Object.
      verify(mockContext, times(0)).setResult(staffing);
      verify(mockContext, times(0)).setCompleted();
      verify(mockContext, times(0)).getMessages();
      assertEquals(0, staffing.getAssignmentStatusCode());
      verify(mockAssignmentProposalValidator, times(1)).validateAssignment(mockCdsModel, mockSelect);
    }

    @DisplayName("Test Case when Assignment Status is proposed, but update Assignment returns 400")
    @Test
    public void ValidateOnAssignmentProposalRejectOnStatus400() {
      ManageResourceRequestServiceActionHandler spyOfCut = Mockito.spy(cut);

      RejectAssignmentProposalContext mockContext = mock(RejectAssignmentProposalContext.class);
      Result mockResult = mock(Result.class);
      CqnService mockCqnService = mock(CqnService.class);
      CqnSelect mockSelect = mock(CqnSelect.class);
      CdsModel mockCdsModel = mock(CdsModel.class);

      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockContext.getCqn()).thenReturn(mockSelect);

      doNothing().when(mockAssignmentProposalValidator).validateAssignment(mockCdsModel, mockSelect);

      staffing = Struct.create(Staffing.class);
      staffing.setAssignmentStatusCode(2);

      when(mockContext.getService()).thenReturn(mockCqnService);
      when((mockCqnService).run(mockContext.getCqn())).thenReturn(mockResult);
      when(mockResult.single(Staffing.class)).thenReturn(staffing);

      doReturn(400).when(mockStaffingHelper).updateAssignment(Constants.AssignmentStatus.REJECT_ASSIGNMENT_STATUS_CODE,
          staffing);

      /**
       * Call to the method to be tested
       */
      spyOfCut.onAssignmentProposalReject(mockContext);

      verify(mockStaffingHelper, times(1)).updateAssignment(Constants.AssignmentStatus.REJECT_ASSIGNMENT_STATUS_CODE,
          staffing);
      // Verify mockContext with setResult is not called
      verify(mockContext, times(0)).setResult(staffing);
      verify(mockContext, times(0)).setCompleted();
      verify(mockContext, times(0)).getMessages();
      verify(mockAssignmentProposalValidator, times(1)).validateAssignment(mockCdsModel, mockSelect);
    }
  }
}
