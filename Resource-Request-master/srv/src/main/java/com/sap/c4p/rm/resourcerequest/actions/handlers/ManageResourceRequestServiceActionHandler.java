package com.sap.c4p.rm.resourcerequest.actions.handlers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.actions.utils.AssignmentProposalValidator;
import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.handlers.ManageResourceRequestHandler;
import com.sap.c4p.rm.resourcerequest.helpers.StaffingHelper;
import com.sap.c4p.rm.resourcerequest.repository.SupplySyncRepository;
import com.sap.c4p.rm.resourcerequest.utils.Constants;
import com.sap.c4p.rm.resourcerequest.validations.ResourceRequestValidator;

import manageresourcerequestservice.*;

@Component
@ServiceName(ManageResourceRequestService_.CDS_NAME)
public class ManageResourceRequestServiceActionHandler implements EventHandler {

  private ManageResourceRequestHandler manageResourceRequestHanlder;
  private ResourceRequestValidator resourceRequestValidator;
  private SupplySyncRepository supplySyncRepository;
  private Messages messages;
  private StaffingHelper staffingHelper;

  private AssignmentProposalValidator assignmentProposalValidator;

  @Autowired
  PersistenceService srv;

  @Autowired
  ManageResourceRequestServiceActionHandler(ManageResourceRequestHandler manageResourceRequestHanlder,
      ResourceRequestValidator resourceRequestValidator, SupplySyncRepository supplySyncRepository, Messages messages,
      StaffingHelper staffingHelper, AssignmentProposalValidator assignmentProposalValidator) {

    this.manageResourceRequestHanlder = manageResourceRequestHanlder;
    this.resourceRequestValidator = resourceRequestValidator;
    this.supplySyncRepository = supplySyncRepository;
    this.messages = messages;
    this.staffingHelper = staffingHelper;
    this.assignmentProposalValidator = assignmentProposalValidator;
  }

  @On(event = Constants.ACTION_PUBLISH_RESOURCE_REQUEST, entity = ResourceRequests_.CDS_NAME)
  public void onPublishResourceRequest(final PublishResourceRequestContext context) {

    CqnSelect select = context.getCqn();

    Result resourceRequestResult = ((CqnService) context.getService()).run(select);

    /*
     * If result row count is not equal to one, then user is not authorized to
     * perform publish action
     */

    if (resourceRequestResult.rowCount() != 1) {
      messages.error(MessageKeys.NOT_AUTHORIZED_TO_PUBLISH).target("in", ResourceRequests_.class,
          ResourceRequests_::requestedResourceOrg_ID);

      /*
       * Raise an exception
       */
      messages.throwIfError();
    }

    final ResourceRequests resourceRequest = resourceRequestResult.single(ResourceRequests.class);

    /*
     * Check if allowed to perform an action First Resource Request should not be in
     * draft mode Second check request status
     *
     */
    resourceRequestValidator.validateRequestedResourceOrganizationExist(resourceRequest.getRequestedResourceOrgId(),
        ResourceRequests_.CDS_NAME);
    resourceRequestValidator.checkPublishWithdrawAllowed(resourceRequest.getIsActiveEntity());

    resourceRequestValidator.validateRequestStatusCode(resourceRequest.getRequestStatusCode());

    resourceRequestValidator.validateProjectRoleIdIfExists(resourceRequest.getProjectRoleId(), resourceRequest.getId());

    /*
     * Set the release status value to publish
     */

    resourceRequest.setReleaseStatusCode(Constants.REQUEST_PUBLISH);

    manageResourceRequestHanlder.updateResourceRequestStatus(resourceRequest.getId(),
        ResourceRequests.RELEASE_STATUS_CODE, resourceRequest.getReleaseStatusCode());

    // Store Demand ID during Publish

    supplySyncRepository.insertDemand(resourceRequest.getDemandId());

    /*
     * Raise an exception if error occured
     */
    messages.throwIfError();

    context.getMessages().success(MessageKeys.PUBLISH_REQUEST_SUCCESS);

    context.setResult(resourceRequest);

    context.setCompleted();

  }

  @On(event = Constants.ACTION_WITHDRAW_RESOURCE_REQUEST, entity = ResourceRequests_.CDS_NAME)
  public void onWithdrawResourceRequest(final WithdrawResourceRequestContext context) {

    CqnSelect select = context.getCqn();

    final ResourceRequests resourceRequest = ((CqnService) context.getService()).run(select)
        .single(ResourceRequests.class);

    /*
     * If result row count is not equal to one, then user is not authorized to
     * perform withdraw action
     */

    if (resourceRequest.isEmpty()) {
      messages.error(MessageKeys.NOT_AUTHORIZED_TO_WITHDRAW).target("in", ResourceRequests_.class,
          ResourceRequests_::requestedResourceOrg_ID);

      /*
       * Raise an exception
       */
      messages.throwIfError();
    }

    /*
     * Check if resource request is in draft mode Check if resource request status
     * is valid resolved or invalid
     *
     */
    resourceRequestValidator.checkPublishWithdrawAllowed(resourceRequest.getIsActiveEntity());
    resourceRequestValidator.validateRequestStatusCode(resourceRequest.getRequestStatusCode());

    /*
     * Check Staffing status and decide whether withdraw is allowed or not.
     */

    resourceRequestValidator.checkResourceRequestStaffing(resourceRequest.getId());

    /**
     * Check if assignment proposal exists.
     */
    resourceRequestValidator.checkAssignmentProposalExists(resourceRequest);

    /*
     * Set the release status value to withdraw
     */

    resourceRequest.setReleaseStatusCode(Constants.REQUEST_WITHDRAW);

    manageResourceRequestHanlder.updateResourceRequestStatus(resourceRequest.getId(),
        ResourceRequests.RELEASE_STATUS_CODE, resourceRequest.getReleaseStatusCode());

    // Remove demand ID from supply table during withdraw
    supplySyncRepository.deleteDemand(resourceRequest.getDemandId());

    /*
     * Raise an exception if error occured
     */
    messages.throwIfError();

    context.getMessages().success(MessageKeys.WITHDRAW_REQUEST_SUCCESS);

    context.setResult(resourceRequest);

    context.setCompleted();

  }

  @On(event = Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_PROPOSAL, entity = Staffing_.CDS_NAME)
  public void onAssignmentProposalAccept(final AcceptAssignmentProposalContext context) {

    CdsModel model = context.getModel();
    CqnSelect query = context.getCqn();

    final Staffing staffing = ((CqnService) context.getService()).run(query).single(Staffing.class);
    assignmentProposalValidator.checkResourceRequestStatus(staffing.getResourceRequestId());

    assignmentProposalValidator.validateAssignment(model, query);

    int currentStatusCode = staffing.getAssignmentStatusCode();

    if (currentStatusCode == 2) {

      staffing.setAssignmentStatusCode(Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_STATUS_CODE);

      int responseStatusCode = staffingHelper.updateAssignment(Constants.AssignmentStatus.ACCEPT_ASSIGNMENT_STATUS_CODE,
          staffing);

      if (responseStatusCode == 200 || responseStatusCode == 204) {
        context.setResult(staffing);
        context.getMessages().success(MessageKeys.PROPOSAL_ACCEPTED, staffing.getResourceName());
        context.setCompleted();
      }
    } else {
      messages.error(MessageKeys.PROPOSAL_NOT_EXISTS).target("in", ResourceRequests_.class,
          resourceRequests -> resourceRequests
              .staffingDetails(staffing1 -> staffing1.assignment_ID().eq(staffing.getAssignmentId())).assignment_ID());
      messages.throwIfError();

    }
  }

  @On(event = Constants.AssignmentStatus.REJECT_ASSIGNMENT_PROPOSAL, entity = Staffing_.CDS_NAME)
  public void onAssignmentProposalReject(final RejectAssignmentProposalContext context) {

    CdsModel model = context.getModel();
    CqnSelect query = context.getCqn();

    final Staffing staffing = ((CqnService) context.getService()).run(query).single(Staffing.class);
    assignmentProposalValidator.checkResourceRequestStatus(staffing.getResourceRequestId());

    assignmentProposalValidator.validateAssignment(model, query);

    int currentStatusCode = staffing.getAssignmentStatusCode();

    if (currentStatusCode == 2) {

      staffing.setAssignmentStatusCode(Constants.AssignmentStatus.REJECT_ASSIGNMENT_STATUS_CODE);

      int responseStatusCode = staffingHelper.updateAssignment(Constants.AssignmentStatus.REJECT_ASSIGNMENT_STATUS_CODE,
          staffing);

      if (responseStatusCode == 200 || responseStatusCode == 204) {
        context.setResult(staffing);
        context.getMessages().success(MessageKeys.PROPOSAL_REJECTED, staffing.getResourceName());
        context.setCompleted();
      }
    } else {
      messages.error(MessageKeys.PROPOSAL_NOT_EXISTS).target("in", ResourceRequests_.class,
          resourceRequests -> resourceRequests
              .staffingDetails(staffing1 -> staffing1.assignment_ID().eq(staffing.getAssignmentId())).assignment_ID());
      messages.throwIfError();
    }
  }

}
