package com.sap.c4p.rm.assignment.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.enums.AssignmentStatus;
import com.sap.c4p.rm.assignment.simulation.AssignmentSimulator;
import com.sap.c4p.rm.assignment.validation.AssignmentValidator;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;
import assignmentservice.SimulateAsgBasedOnTotalHoursContext;

public class AssignmentServiceHandlerUtilityTest {

  private AssignmentServiceHandlerUtility classUnderTest;
  private AssignmentValidator mockAssignmentValidator;

  private static final Object RESOURCE_ID = "resource_id";
  private static final Object REQUEST_ID = "request_id";

  @BeforeEach
  public void setUp() {
    mockAssignmentValidator = mock(AssignmentValidator.class);
    classUnderTest = new AssignmentServiceHandlerUtility(mockAssignmentValidator);
  }

  @Test
  void actionResultCorrectWhenBucketListNotEmpty() {
    EventContext mockContext = mock(EventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID)).thenReturn(RESOURCE_ID);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID)).thenReturn(REQUEST_ID);

    AssignmentBuckets mockBucket1 = AssignmentBuckets.create();
    mockBucket1.setBookedCapacityInMinutes(60);
    AssignmentBuckets mockBucket2 = AssignmentBuckets.create();
    mockBucket2.setBookedCapacityInMinutes(120);
    List<AssignmentBuckets> mockBucketList = new ArrayList<>();
    mockBucketList.add(mockBucket1);
    mockBucketList.add(mockBucket2);

    AssignmentSimulator mockSimulator = mock(AssignmentSimulator.class);
    when(mockSimulator.getDistributedAssignmentRecords(mockContext)).thenReturn(mockBucketList);

    Assignments actualAssignmentResult = classUnderTest.buildActionResult(mockContext, mockSimulator);
    assertEquals(180, actualAssignmentResult.getBookedCapacityInMinutes());
    assertEquals(2, actualAssignmentResult.getAssignmentBuckets().size());
    assertEquals(actualAssignmentResult.getId(),
        actualAssignmentResult.getAssignmentBuckets().get(0).getAssignmentId());
    assertEquals(actualAssignmentResult.getId(),
        actualAssignmentResult.getAssignmentBuckets().get(1).getAssignmentId());
  }

  @Test
  void actionResultCorrectWhenBucketListEmpty() {
    EventContext mockContext = mock(EventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID)).thenReturn(RESOURCE_ID);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID)).thenReturn(REQUEST_ID);

    AssignmentSimulator mockSimulator = mock(AssignmentSimulator.class);
    when(mockSimulator.getDistributedAssignmentRecords(mockContext)).thenReturn(Collections.emptyList());

    Assignments actualAssignmentResult = classUnderTest.buildActionResult(mockContext, mockSimulator);
    assertEquals(0, actualAssignmentResult.getBookedCapacityInMinutes());
    assertEquals(0, actualAssignmentResult.getAssignmentBuckets().size());
  }

  @Test
  void validateAuthorizationForRequestAndResourceReturnsFailureMessages() {
    Messages dummyMessage = mock(Messages.class);
    when(mockAssignmentValidator.getMessages()).thenReturn(dummyMessage);
    assertEquals(dummyMessage, classUnderTest.validateAuthorizationForRequestAndResource(null, null));
  }

  @Test
  void validateResourceRequestStatusesReturnsFailureMessages() {
    Messages dummyMessage = mock(Messages.class);
    when(mockAssignmentValidator.getMessages()).thenReturn(dummyMessage);
    assertEquals(dummyMessage, classUnderTest.validateResourceRequestStatuses(null));
  }

  @Test
  void actionResultSetToSoftBookedIfSoftBookingStatusProvided() {
    EventContext mockContext = mock(EventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID)).thenReturn(RESOURCE_ID);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID)).thenReturn(REQUEST_ID);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE))
        .thenReturn(AssignmentStatus.SOFTBOOKED.getCode());

    AssignmentSimulator mockSimulator = mock(AssignmentSimulator.class);
    when(mockSimulator.getDistributedAssignmentRecords(mockContext)).thenReturn(Collections.emptyList());

    Assignments actualAssignmentResult = classUnderTest.buildActionResult(mockContext, mockSimulator);
    assertEquals(AssignmentStatus.SOFTBOOKED.getCode(), actualAssignmentResult.getAssignmentStatusCode().intValue());
  }

  @Test
  void actionResultSetToHardBookedIfHardBookingStatusProvided() {
    EventContext mockContext = mock(EventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID)).thenReturn(RESOURCE_ID);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID)).thenReturn(REQUEST_ID);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE))
        .thenReturn(AssignmentStatus.HARDBOOKED.getCode());

    AssignmentSimulator mockSimulator = mock(AssignmentSimulator.class);
    when(mockSimulator.getDistributedAssignmentRecords(mockContext)).thenReturn(Collections.emptyList());

    Assignments actualAssignmentResult = classUnderTest.buildActionResult(mockContext, mockSimulator);
    assertEquals(AssignmentStatus.HARDBOOKED.getCode(), actualAssignmentResult.getAssignmentStatusCode().intValue());
  }

  @Test
  void actionResultSetToProposedIfProposedStatusProvided() {
    EventContext mockContext = mock(EventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID)).thenReturn(RESOURCE_ID);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID)).thenReturn(REQUEST_ID);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE))
        .thenReturn(AssignmentStatus.PROPOSED.getCode());

    AssignmentSimulator mockSimulator = mock(AssignmentSimulator.class);
    when(mockSimulator.getDistributedAssignmentRecords(mockContext)).thenReturn(Collections.emptyList());

    Assignments actualAssignmentResult = classUnderTest.buildActionResult(mockContext, mockSimulator);
    assertEquals(AssignmentStatus.PROPOSED.getCode(), actualAssignmentResult.getAssignmentStatusCode().intValue());
  }

  @Test
  void actionResultSetToHardBookedByDefaultIfNoStatusProvided() {
    EventContext mockContext = mock(EventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID)).thenReturn(RESOURCE_ID);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID)).thenReturn(REQUEST_ID);
    when(mockContext.get(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE)).thenReturn(null);

    AssignmentSimulator mockSimulator = mock(AssignmentSimulator.class);
    when(mockSimulator.getDistributedAssignmentRecords(mockContext)).thenReturn(Collections.emptyList());

    Assignments actualAssignmentResult = classUnderTest.buildActionResult(mockContext, mockSimulator);
    assertEquals(AssignmentStatus.HARDBOOKED.getCode(), actualAssignmentResult.getAssignmentStatusCode());
  }

}
