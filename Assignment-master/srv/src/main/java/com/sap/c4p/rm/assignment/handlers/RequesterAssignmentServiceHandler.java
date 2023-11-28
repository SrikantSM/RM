package com.sap.c4p.rm.assignment.handlers;

import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.setEditDraft;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.assignment.enums.AssignmentStatus;
import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.AssignmentDraftsUtility;
import com.sap.c4p.rm.assignment.utils.HttpStatus;
import com.sap.c4p.rm.assignment.validation.AssignmentDraftsValidator;
import com.sap.c4p.rm.assignment.validation.AssignmentValidator;

import assignmentservice.Assignments;
import requesterassignmentservice.RequesterAssignmentService_;
import requesterassignmentservice.SetAssignmentStatusContext;

@Component
@ServiceName(RequesterAssignmentService_.CDS_NAME)
public class RequesterAssignmentServiceHandler implements EventHandler {

  private static final String REQUESTED_RES_ORG_USER_IS_AUTHORIZED_FOR = "RequestedResourceOrganization";
  private AssignmentValidator validator;
  private AssignmentDraftsValidator draftsValidator;
  private AssignmentDraftsUtility draftUtility;

  @Autowired
  public RequesterAssignmentServiceHandler(AssignmentValidator validator, AssignmentDraftsValidator draftsValidator,
      final AssignmentDraftsUtility draftUtility) {
    this.validator = validator;
    this.draftsValidator = draftsValidator;
    this.draftUtility = draftUtility;
  }

  @On(event = SetAssignmentStatusContext.CDS_NAME)
  public synchronized void setAssignmentStatus(SetAssignmentStatusContext context) {

    String assignmentId = context.getAssignmentID();
    int statusToBeSet = context.getStatus().intValue();

    if (!(statusToBeSet == AssignmentStatus.ACCEPTED.getCode()
        || statusToBeSet == AssignmentStatus.REJECTED.getCode())) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.INVALID_ASSIGNMENT_STATUS_CHANGE_BY_REQUESTER);
    }

    Assignments editDraft = draftUtility.getEditDraftForUser(assignmentId, context.getUserInfo().getName(),
        context.getMessages(), true, true);
    context.getMessages().throwIfError();

    if (editDraft == null) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENT_UNAVAILABLE_FOR_EDIT);
    }

    /* Check for RequesterAssignmentService specific authorization requirements */
    validator.validateAuthorizationForAcceptReject(editDraft.getResourceRequestId(),
        context.getUserInfo().getAttributeValues(REQUESTED_RES_ORG_USER_IS_AUTHORIZED_FOR));
    validator.getMessages().throwIfError();

    draftUtility.updateAssignmentStatus(assignmentId, statusToBeSet);
    /*
     * Run business validations on header + bucket drafts -> status transition
     * validity checked as part of this validation
     */
    draftsValidator.validate(assignmentId).throwIfError();

    setEditDraft(assignmentId);
    draftUtility.activateEditDraft(assignmentId);

    context.setCompleted();
  }

}
