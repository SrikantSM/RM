package com.sap.c4p.rm.assignment.validation;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.Struct;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.utils.DataProvider;

import com.sap.resourcemanagement.assignment.Assignments;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

import assignmentservice.SimulateAssignmentAsRequestedContext;

public class AssignmentAsRequestedValidatorTest {

  AssignmentAsRequestedValidator classUnderTest;

//  private PersistenceService mockPersistenceService;
  private DataProvider provider;
  private AssignmentValidator validator;
  private EventContext context;
  private Messages messages;
  private String resourceId = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
  private String resourceRequestID = "req1";

  @BeforeEach
  public void setUp() {
    this.messages = mock(Messages.class);
    this.provider = mock(DataProvider.class);
    this.validator = mock(AssignmentValidator.class);
    this.classUnderTest = new AssignmentAsRequestedValidator(messages, validator, provider);
    this.context = EventContext.create("", "");
  }

  @Test
  @DisplayName("check if validateFinalPayloadTest()")
  void requestIDNull() {

    context.put(SimulateAssignmentAsRequestedContext.RESOURCE_REQUEST_ID, "");
    context.put(SimulateAssignmentAsRequestedContext.RESOURCE_ID, "");
    context.put(SimulateAssignmentAsRequestedContext.MODE, "U");

    classUnderTest.validate(context);

    // We have not passed request id as part of the context. Expect an error.
    verify(messages, times(1)).error("REQUEST_ID_NULL");

    // Since we haven't provided resource ID as part of the context, expect an error
    // for that too
    verify(messages, times(1)).error("RESOURCE_ID_NULL");

  }

  @Test
  void validateAssignmentExistsError() {

    // Now put the resource id and request ID for further tests
    context.put(SimulateAssignmentAsRequestedContext.RESOURCE_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    context.put(SimulateAssignmentAsRequestedContext.RESOURCE_REQUEST_ID, "req1");

    // If the mode is insert and there is an existing assignment, expect an error
    context.put(SimulateAssignmentAsRequestedContext.MODE, "I");

    Assignments assignment = Struct.create(Assignments.class);
    assignment.setId("existing_asg_ID1");
    Optional<Assignments> existingAssignment = Optional.of(assignment);
    when(provider.getAssignmentForResourceAndRequest(resourceId, resourceRequestID)).thenReturn(existingAssignment);

    classUnderTest.validate(context);

    verify(messages, times(1)).error("ASSIGNMENT_EXISTS_FOR_RES_AND_REQ");
  }

  @Test
  void validateResourceAvailabilityIsCalled() {

    context.put(SimulateAssignmentAsRequestedContext.RESOURCE_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    context.put(SimulateAssignmentAsRequestedContext.RESOURCE_REQUEST_ID, "req1");
    context.put(SimulateAssignmentAsRequestedContext.MODE, "U");
    // When the resourceRequest data is present, check that the resource
    // availability validation is done
    ResourceRequests resourceRequests = ResourceRequests.create();

    resourceRequests.setId("req1");
    resourceRequests.setStartDate(LocalDate.of(2020, 10, 01));
    resourceRequests.setEndDate(LocalDate.of(2020, 10, 11));

    Optional<ResourceRequests> resourceRequest = Optional.of(resourceRequests);
    when(provider.getRequestData("req1")).thenReturn(resourceRequest);

    classUnderTest.validate(context);

    verify(validator, times(1)).validateResourceAvailability(resourceId, Instant.parse("2020-10-01T00:00:00.00Z"),
        Instant.parse("2020-10-11T00:00:00.00Z"));
  }

  @Test
  void validateErrorOnMissingRequestCapacity() {

    context.put(SimulateAssignmentAsRequestedContext.RESOURCE_ID, "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    context.put(SimulateAssignmentAsRequestedContext.RESOURCE_REQUEST_ID, "req1");
    context.put(SimulateAssignmentAsRequestedContext.MODE, "U");

    // If the capacity requirement is missing, then again expect an error
    List<CapacityRequirements> requestCapacityRequirementList = new ArrayList<>();
    when(provider.getRequestCapacityRequirements("req1")).thenReturn(requestCapacityRequirementList);

    classUnderTest.validate(context);
    verify(messages, times(1)).error("MISSING_REQUEST_CAPACITY_REQUIREMENT");

  }
}