package com.sap.c4p.rm.assignment.validation;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftService;

import assignmentservice.SimulateAsgBasedOnTotalHoursContext;
import assignmentservice.SimulateAssignmentAsRequestedContext;

public class ValidatorFactoryTest {

  private static AssignmentAsRequestedValidator assignmentAsRequestedValidator;
  private static AssignmentTotalHoursValidator assignmentTotalHoursValidator;
  private static AssignmentDraftsValidator assignmentDraftsValidator;

  private static ValidatorFactory classUnderTest;

  @BeforeAll
  public static void createObject() {
    assignmentAsRequestedValidator = mock(AssignmentAsRequestedValidator.class);
    assignmentTotalHoursValidator = mock(AssignmentTotalHoursValidator.class);
    assignmentDraftsValidator = mock(AssignmentDraftsValidator.class);
    classUnderTest = new ValidatorFactory(assignmentAsRequestedValidator, assignmentTotalHoursValidator,
        assignmentDraftsValidator);
  }

  @Test
  @DisplayName("AssignmentTotalHoursValidator instance returned when asked for")
  public void returnsAssignmentTotalHoursValidatorWhenAsked() {
    assertTrue(classUnderTest
        .getValidator(SimulateAsgBasedOnTotalHoursContext.CDS_NAME) instanceof AssignmentTotalHoursValidator);
  }

  @Test
  @DisplayName("AssignmentAsRequestedValidator instance returned when asked for")
  public void returnsAssignmentAsRequestedValidatorWhenAsked() {
    assertTrue(classUnderTest
        .getValidator(SimulateAssignmentAsRequestedContext.CDS_NAME) instanceof AssignmentAsRequestedValidator);
  }

  @Test
  @DisplayName("AssignmentDraftsValidator instance returned when asked for")
  public void returnsAssignmentDraftsValidatorWhenAsked() {
    assertTrue(classUnderTest.getValidator(DraftService.EVENT_DRAFT_SAVE) instanceof AssignmentDraftsValidator);
  }

  @Test
  @DisplayName("Service exception raised when unknown validator instance asked")
  public void raisesExceptionWhenAskedForUnknownValidatorInstance() {
    assertThrows(ServiceException.class, () -> classUnderTest.getValidator("PleaseGiveMeAValidator"));
  }
}