package com.sap.c4p.rm.assignment.validation;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.Struct;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.utils.DataProvider;

import com.sap.resourcemanagement.assignment.Assignments;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

import assignmentservice.SimulateAsgBasedOnTotalHoursContext;

public class AssignmentTotalHoursValidatorTest {

  AssignmentTotalHoursValidator classUnderTest;
  private DataProvider provider;
  private AssignmentValidator validator;
  private EventContext context;
  private Messages messages;
  private String resourceId = "res1";
  private String resourceRequestID = "req1";

  @BeforeEach
  public void createObject() {
    this.messages = mock(Messages.class);
    this.provider = mock(DataProvider.class);
    this.validator = mock(AssignmentValidator.class);
    this.classUnderTest = new AssignmentTotalHoursValidator(messages, validator, provider);
    this.context = EventContext.create("", "");
  }

  @Test
  @DisplayName("1. check if validateResourceAvailability() throws an error in case of missing request ID")
  public void validateRequestIDMissing() {

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID, "");
    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "");
    context.put(SimulateAsgBasedOnTotalHoursContext.MODE, "U");
    context.put(SimulateAsgBasedOnTotalHoursContext.START, ""); // LocalDate.of(2020, 05, 01));
    context.put(SimulateAsgBasedOnTotalHoursContext.END, LocalDate.of(2020, 05, 01)); // LocalDate.of(2020, 05, 01));
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, 5);
    context.put(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE, "0");

    classUnderTest.validate(context);

    // We have not passed request id as part of the context. Expect an error.
    verify(messages, times(1)).error("REQUEST_ID_NULL");

    // Since we haven't provided resource ID as part of the context, expect an error
    // for that too
    verify(messages, times(1)).error("RESOURCE_ID_NULL");

  }

  @Test
  @DisplayName("1b. check if validateResourceAvailability() throws an error in case of missing request ID")
  public void validateMissingAssignedEnd() {

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID, "");
    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "");
    context.put(SimulateAsgBasedOnTotalHoursContext.MODE, "U");
    context.put(SimulateAsgBasedOnTotalHoursContext.START, LocalDate.of(2020, 05, 01));
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, 5);
    context.put(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE, "0");

    classUnderTest.validate(context);

    // We have not passed request id as part of the context. Expect an error.
    verify(messages, times(1)).error("REQUEST_ID_NULL");

    // Since we haven't provided resource ID as part of the context, expect an error
    // for that too
    verify(messages, times(1)).error("RESOURCE_ID_NULL");

    verify(messages, times(0)).error("ASSIGNMENT_EXISTS_FOR_RES_AND_REQ");

  }

  @Test
  @DisplayName("2. check method termination in case of missing assigned start and end")
  public void validateNullAssignedStartEnd() {

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID, "req1");
    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "res1");
    context.put(SimulateAsgBasedOnTotalHoursContext.MODE, "I");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, 5);
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "2020-10-01T00:00:00.00Z");
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020-10-11T00:00:00.00Z");
    context.put(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE, "0");

    classUnderTest.validate(context);

    // There should be no errors on request id or resource ID
    verify(messages, times(0)).error("REQUEST_ID_NULL");

    verify(messages, times(0)).error("RESOURCE_ID_NULL");

    // Since the assigned start and end are also null, the method should've
    // terminated in advance
    verify(messages, times(0)).error("ASSIGNMENT_EXISTS_FOR_RES_AND_REQ");

  }

  @Test
  @DisplayName("3. check error message in case request has been deleted in the background")
  public void validateRequestNotFound() {

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID, "req1");
    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "res1");
    context.put(SimulateAsgBasedOnTotalHoursContext.MODE, "U");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, 5);
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "2020-10-01T00:00:00.00Z");
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020-10-11T00:00:00.00Z");
    context.put(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE, "0");

    classUnderTest.validate(context);

    // Since the assigned start and end are also null, the method should've
    // terminated in advance
    verify(messages, times(0)).error("REQUEST_NOT_FOUND");

  }

  @Test
  @DisplayName("4. check error message in case assignment already exists for the given request and resource")
  public void validateAsgnExistsForResourceAndRequest() {

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID, "req1");
    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "res1");
    context.put(SimulateAsgBasedOnTotalHoursContext.MODE, "I");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, 5);
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "2020-10-01");
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020-10-11");
    context.put(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE, "0");

    ResourceRequests resourceRequests = ResourceRequests.create();

    resourceRequests.setId("req1");
    resourceRequests.setStartDate(LocalDate.of(2020, 10, 01));
    resourceRequests.setEndDate(LocalDate.of(2020, 10, 11));

    Optional<ResourceRequests> resourceRequest = Optional.of(resourceRequests);
    when(provider.getRequestData("req1")).thenReturn(resourceRequest);

    Assignments assignment = Struct.create(Assignments.class);
    assignment.setId("existing_asg_ID1");
    Optional<Assignments> existingAssignment = Optional.of(assignment);
    when(provider.getAssignmentForResourceAndRequest(resourceId, resourceRequestID)).thenReturn(existingAssignment);

    classUnderTest.validate(context);

    // As wer're trying to insert, and there is an existing assignment, expect to
    // see an error
    verify(messages, times(1)).error("ASSIGNMENT_EXISTS_FOR_RES_AND_REQ");

  }

  @Test
  @DisplayName("4b. check no error message in case assignment already exists for the given request and resource but it not an insert case")
  public void validateAsgnExistsForResourceAndRequestChangeCase() {

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID, "req1");
    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "res1");
    context.put(SimulateAsgBasedOnTotalHoursContext.MODE, "C");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, 5);
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "2020-10-01");
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020-10-11");
    context.put(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE, "0");

    ResourceRequests resourceRequests = ResourceRequests.create();

    resourceRequests.setId("req1");
    resourceRequests.setStartDate(LocalDate.of(2020, 10, 01));
    resourceRequests.setEndDate(LocalDate.of(2020, 10, 11));

    Optional<ResourceRequests> resourceRequest = Optional.of(resourceRequests);
    when(provider.getRequestData("req1")).thenReturn(resourceRequest);

    Assignments assignment = Struct.create(Assignments.class);
    assignment.setId("existing_asg_ID1");
    Optional<Assignments> existingAssignment = Optional.of(assignment);
    when(provider.getAssignmentForResourceAndRequest(resourceId, resourceRequestID)).thenReturn(existingAssignment);

    classUnderTest.validate(context);

    // As wer're trying to insert, and there is an existing assignment, expect to
    // see an error
    verify(messages, times(0)).error("ASSIGNMENT_EXISTS_FOR_RES_AND_REQ");

  }

  @Test
  @DisplayName("5. check error message in case of change on a non existing assignment")
  public void validateAsgnNotExistsForResourceAndRequest() {

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID, "req1");
    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "res1");
    context.put(SimulateAsgBasedOnTotalHoursContext.MODE, "C");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, 5);
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "2020-10-01");
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020-10-11");
    context.put(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE, "0");

    ResourceRequests resourceRequests = ResourceRequests.create();

    resourceRequests.setId("req1");
    resourceRequests.setStartDate(LocalDate.of(2020, 10, 01));
    resourceRequests.setEndDate(LocalDate.of(2020, 10, 11));

    Optional<ResourceRequests> resourceRequest = Optional.of(resourceRequests);
    when(provider.getRequestData("req1")).thenReturn(resourceRequest);

    Optional<Assignments> existingAssignment = Optional.empty();
    when(provider.getAssignmentForResourceAndRequest(resourceId, resourceRequestID)).thenReturn(existingAssignment);

    classUnderTest.validate(context);

    // As we're trying to insert, and there is an existing assignment, expect to see
    // an error
    verify(messages, times(1)).error("ASSIGNMENT_NOT_EXISTS_FOR_RES_AND_REQ");

  }

  @Test
  @DisplayName("5b. check no error message in case of change on a non existing assignment")
  public void validateAsgnNotExistsForResourceAndRequestInsertCase() {

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID, "req1");
    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "res1");
    context.put(SimulateAsgBasedOnTotalHoursContext.MODE, "I");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, 5);
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "2020-10-01");
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020-10-11");
    context.put(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE, "0");

    ResourceRequests resourceRequests = ResourceRequests.create();

    resourceRequests.setId("req1");
    resourceRequests.setStartDate(LocalDate.of(2020, 10, 01));
    resourceRequests.setEndDate(LocalDate.of(2020, 10, 11));

    Optional<ResourceRequests> resourceRequest = Optional.of(resourceRequests);
    when(provider.getRequestData("req1")).thenReturn(resourceRequest);

    Optional<Assignments> existingAssignment = Optional.empty();
    when(provider.getAssignmentForResourceAndRequest(resourceId, resourceRequestID)).thenReturn(existingAssignment);

    classUnderTest.validate(context);

    // As we're trying to insert, and there is an existing assignment, expect to see
    // an error
    verify(messages, times(0)).error("ASSIGNMENT_NOT_EXISTS_FOR_RES_AND_REQ");

  }

  @Test
  @DisplayName("6. check error message in case of invalid date format")
  public void validateInvalidDateFormat() {

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID, "req1");
    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "res1");
    context.put(SimulateAsgBasedOnTotalHoursContext.MODE, "C");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, 5);
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "2020/10/01"); // Tuttut, bad dates
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020/10/11");
    context.put(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE, "0");

    ResourceRequests resourceRequests = ResourceRequests.create();

    resourceRequests.setId("req1");
    resourceRequests.setStartDate(LocalDate.of(2020, 10, 01));
    resourceRequests.setEndDate(LocalDate.of(2020, 10, 11));

    Optional<ResourceRequests> resourceRequest = Optional.of(resourceRequests);
    when(provider.getRequestData("req1")).thenReturn(resourceRequest);

    Optional<Assignments> existingAssignment = Optional.empty();
    when(provider.getAssignmentForResourceAndRequest(resourceId, resourceRequestID)).thenReturn(existingAssignment);

    classUnderTest.validate(context);

    verify(messages, times(1)).error("INVALID_DATE_FORMAT", "2020/10/01");

  }

  @Test
  @DisplayName("7. check error message in case zero duration")
  public void validateZeroDuration() {

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID, "req1");
    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "res1");
    context.put(SimulateAsgBasedOnTotalHoursContext.MODE, "C");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, 0);
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "2020-10-01");
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020-10-11");
    context.put(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE, "0");

    ResourceRequests resourceRequests = ResourceRequests.create();

    resourceRequests.setId("req1");
    resourceRequests.setStartDate(LocalDate.of(2020, 10, 01));
    resourceRequests.setEndDate(LocalDate.of(2020, 10, 11));

    Optional<ResourceRequests> resourceRequest = Optional.of(resourceRequests);
    when(provider.getRequestData("req1")).thenReturn(resourceRequest);

    Optional<Assignments> existingAssignment = Optional.empty();
    when(provider.getAssignmentForResourceAndRequest(resourceId, resourceRequestID)).thenReturn(existingAssignment);

    classUnderTest.validate(context);

    verify(messages, times(1)).error("REQUESTED_DURATION_INVALID", 0);

  }

  @Test
  @DisplayName("7b. check error message in case of invalid duration")
  public void validateInvalidDuration() {

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID, "req1");
    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "res1");
    context.put(SimulateAsgBasedOnTotalHoursContext.MODE, "C");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, "o");
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "2020-10-01");
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020-10-11");
    context.put(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE, "0");

    ResourceRequests resourceRequests = ResourceRequests.create();

    resourceRequests.setId("req1");
    resourceRequests.setStartDate(LocalDate.of(2020, 10, 01));
    resourceRequests.setEndDate(LocalDate.of(2020, 10, 11));

    Optional<ResourceRequests> resourceRequest = Optional.of(resourceRequests);
    when(provider.getRequestData("req1")).thenReturn(resourceRequest);

    Optional<Assignments> existingAssignment = Optional.empty();
    when(provider.getAssignmentForResourceAndRequest(resourceId, resourceRequestID)).thenReturn(existingAssignment);

    classUnderTest.validate(context);

    verify(messages, times(1)).error("REQUESTED_DURATION_INVALID");

  }

  @Test
  @DisplayName("8. check error message in case start is greater than end")
  public void validateStartLessThanEnd() {

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID, "req1");
    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "res1");
    context.put(SimulateAsgBasedOnTotalHoursContext.MODE, "C");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, 5);
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "2020-10-21");
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020-10-11");
    context.put(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE, "0");

    ResourceRequests resourceRequests = ResourceRequests.create();

    resourceRequests.setId("req1");
    resourceRequests.setStartDate(LocalDate.of(2020, 10, 01));
    resourceRequests.setEndDate(LocalDate.of(2020, 10, 11));

    Optional<ResourceRequests> resourceRequest = Optional.of(resourceRequests);
    when(provider.getRequestData("req1")).thenReturn(resourceRequest);

    Optional<Assignments> existingAssignment = Optional.empty();
    when(provider.getAssignmentForResourceAndRequest(resourceId, resourceRequestID)).thenReturn(existingAssignment);

    classUnderTest.validate(context);

    // As we're trying to insert, and there is an existing assignment, expect to see
    // an error
    verify(messages, times(1)).error("ASSIGNED_START_NOT_LESS_THAN_END", Instant.parse("2020-10-21T00:00:00.00Z"));

  }
}
