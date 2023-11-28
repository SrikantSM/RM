package com.sap.c4p.rm.assignment.validation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftService;

import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.HttpStatus;

import assignmentservice.SimulateAsgBasedOnTotalHoursContext;
import assignmentservice.SimulateAssignmentAsRequestedContext;

@Component
public class ValidatorFactory {
  private AssignmentAsRequestedValidator assignmentAsRequestedValidator;
  private AssignmentTotalHoursValidator assignmentTotalHoursValidator;
  private AssignmentDraftsValidator assignmentDraftsValidator;

  @Autowired
  public ValidatorFactory(AssignmentAsRequestedValidator assignmentAsRequestedValidator,
      AssignmentTotalHoursValidator assignmentTotalHoursValidator,
      AssignmentDraftsValidator assignmentDraftsValidator) {
    this.assignmentTotalHoursValidator = assignmentTotalHoursValidator;
    this.assignmentAsRequestedValidator = assignmentAsRequestedValidator;
    this.assignmentDraftsValidator = assignmentDraftsValidator;
  }

  public Validator getValidator(String actionEvent) {

    if (SimulateAsgBasedOnTotalHoursContext.CDS_NAME.equals(actionEvent)) {
      return assignmentTotalHoursValidator;
    } else if (SimulateAssignmentAsRequestedContext.CDS_NAME.equals(actionEvent)) {
      return assignmentAsRequestedValidator;
    } else if (DraftService.EVENT_DRAFT_SAVE.equals(actionEvent)) {
      return assignmentDraftsValidator;
    } else {
      throw new ServiceException(HttpStatus.NOT_IMPLEMENTED, MessageKeys.ACTION_NOT_SUPPORTED, actionEvent);
    }
  }

}
