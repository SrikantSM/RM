package com.sap.c4p.rm.assignment.simulation;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.ServiceException;

import assignmentservice.SimulateAsgBasedOnTotalHoursContext;
import assignmentservice.SimulateAssignmentAsRequestedContext;

public class AssignmentSimulatorFactoryTest {

  private AssignmentSimulatorFactory classUnderTest;

  private AssignmentAsRequestedSimulator mockAssignmentAsRequestedSimulator;
  private AssignmentTotalHoursSimulator mockAssignmentTotalHoursSimulator;

  @BeforeEach
  public void setUp() {
    mockAssignmentAsRequestedSimulator = mock(AssignmentAsRequestedSimulator.class);
    mockAssignmentTotalHoursSimulator = mock(AssignmentTotalHoursSimulator.class);

    classUnderTest = new AssignmentSimulatorFactory(mockAssignmentAsRequestedSimulator,
        mockAssignmentTotalHoursSimulator);
  }

  @Test
  @DisplayName("AssignmentTotalHoursSimulator instance returned when asked for")
  public void returnsAssignmentTotalHoursSimulatorWhenAsked() {
    assertTrue(classUnderTest
        .getAssignmentSimulator(SimulateAsgBasedOnTotalHoursContext.CDS_NAME) instanceof AssignmentTotalHoursSimulator);
  }

  @Test
  @DisplayName("AssignmentAsRequestedSimulator instance returned when asked for")
  public void returnsAssignmentAsRequestedSimulatorWhenAsked() {
    assertTrue(classUnderTest.getAssignmentSimulator(
        SimulateAssignmentAsRequestedContext.CDS_NAME) instanceof AssignmentAsRequestedSimulator);
  }

  @Test
  @DisplayName("Service exception raised when unknown simulator instance asked")
  public void raisesExceptionWhenAskedForUnknownSimulatorInstance() {
    assertThrows(ServiceException.class, () -> classUnderTest.getAssignmentSimulator("PleaseGiveMeASimulator"));
  }
}
