package com.sap.c4p.rm.assignment.utils;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.sap.cds.CdsLockTimeoutException;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.resource.BookedCapacityAggregate;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;

public class AssignmentDependentEntityUpdateUtilityTest {

  private DataProvider mockDataProvider;
  private PersistenceService mockPersistenceService;
  private AssignmentDependentEntityUpdateUtility classUnderTest;

  private static final String ASSIGNMENT_ID = "assignmentId";
  private static final String RESOURCE_ID = "resourceId";

  @BeforeEach
  public void setUp() {
    mockDataProvider = mock(DataProvider.class);
    mockPersistenceService = mock(PersistenceService.class);
    classUnderTest = new AssignmentDependentEntityUpdateUtility(mockDataProvider, mockPersistenceService);
  }

  @Test
  public void resourceBookedCapacityUpdatedOnAssignmentCreate() {

    Assignments newAssignmentWithBuckets = Assignments.create();
    newAssignmentWithBuckets.setId(ASSIGNMENT_ID);
    newAssignmentWithBuckets.setResourceId(RESOURCE_ID);

    List<AssignmentBuckets> newAssignmentBuckets = new ArrayList<>();
    AssignmentBuckets bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '1');
    Instant start = LocalDate.parse("2021-01-01").atStartOfDay().toInstant(ZoneOffset.UTC);
    bucket.setStartTime(start);
    newAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '2');
    bucket.setStartTime(LocalDate.parse("2021-01-02").atStartOfDay().toInstant(ZoneOffset.UTC));
    newAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '3');
    Instant end = LocalDate.parse("2021-01-03").atStartOfDay().toInstant(ZoneOffset.UTC);
    bucket.setStartTime(end);
    newAssignmentBuckets.add(bucket);

    newAssignmentWithBuckets.setAssignmentBuckets(newAssignmentBuckets);

    Assignments oldAssignmentWithBuckets = Assignments.create();

    List<BookedCapacityAggregate> dummyBookedCapacityAggregateList = new ArrayList<>();

    when(mockDataProvider.getResourceBookedCapacityAggregate(RESOURCE_ID, start, end))
        .thenReturn(dummyBookedCapacityAggregateList);

    classUnderTest.updateResourceBookedCapacity(oldAssignmentWithBuckets, newAssignmentWithBuckets);

    verify(mockDataProvider).getResourceBookedCapacityAggregate(RESOURCE_ID, start, end);

    verify(mockPersistenceService).run(any(CqnSelect.class));
    verify(mockPersistenceService).run(any(CqnUpsert.class));
    verify(mockPersistenceService).run(any(CqnDelete.class));

  }

  @Test
  public void resourceBookedCapacityUpdatedOnAssignmentUpdate() {

    Assignments oldAssignmentWithBuckets = Assignments.create();
    oldAssignmentWithBuckets.setId(ASSIGNMENT_ID);
    oldAssignmentWithBuckets.setResourceId(RESOURCE_ID);

    List<AssignmentBuckets> oldAssignmentBuckets = new ArrayList<>();
    AssignmentBuckets bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '1');
    Instant start = LocalDate.parse("2021-01-01").atStartOfDay().toInstant(ZoneOffset.UTC);
    bucket.setStartTime(start);
    oldAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '2');
    bucket.setStartTime(LocalDate.parse("2021-01-02").atStartOfDay().toInstant(ZoneOffset.UTC));
    oldAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '3');
    bucket.setStartTime(LocalDate.parse("2021-01-03").atStartOfDay().toInstant(ZoneOffset.UTC));
    oldAssignmentBuckets.add(bucket);

    oldAssignmentWithBuckets.setAssignmentBuckets(oldAssignmentBuckets);

    Assignments newAssignmentWithBuckets = Assignments.create();
    newAssignmentWithBuckets.setId(ASSIGNMENT_ID);
    newAssignmentWithBuckets.setResourceId(RESOURCE_ID);

    List<AssignmentBuckets> newAssignmentBuckets = new ArrayList<>();
    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '1');
    bucket.setStartTime(LocalDate.parse("2021-01-03").atStartOfDay().toInstant(ZoneOffset.UTC));
    newAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '2');
    bucket.setStartTime(LocalDate.parse("2021-01-04").atStartOfDay().toInstant(ZoneOffset.UTC));
    newAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '3');
    Instant end = LocalDate.parse("2021-01-05").atStartOfDay().toInstant(ZoneOffset.UTC);
    bucket.setStartTime(end);
    newAssignmentBuckets.add(bucket);

    newAssignmentWithBuckets.setAssignmentBuckets(newAssignmentBuckets);

    List<BookedCapacityAggregate> dummyBookedCapacityAggregateList = new ArrayList<>();

    when(mockDataProvider.getResourceBookedCapacityAggregate(RESOURCE_ID, start, end))
        .thenReturn(dummyBookedCapacityAggregateList);

    classUnderTest.updateResourceBookedCapacity(oldAssignmentWithBuckets, newAssignmentWithBuckets);

    verify(mockDataProvider).getResourceBookedCapacityAggregate(RESOURCE_ID, start, end);

    verify(mockPersistenceService).run(any(CqnSelect.class));
    verify(mockPersistenceService).run(any(CqnUpsert.class));
    verify(mockPersistenceService).run(any(CqnDelete.class));

  }

  @Test
  public void resourceBookedCapacityUpdatedOnAssignmentDelete() {

    Assignments oldAssignmentWithBuckets = Assignments.create();
    oldAssignmentWithBuckets.setId(ASSIGNMENT_ID);
    oldAssignmentWithBuckets.setResourceId(RESOURCE_ID);

    List<AssignmentBuckets> oldAssignmentBuckets = new ArrayList<>();
    AssignmentBuckets bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '1');
    Instant start = LocalDate.parse("2021-01-01").atStartOfDay().toInstant(ZoneOffset.UTC);
    bucket.setStartTime(start);
    oldAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '2');
    bucket.setStartTime(LocalDate.parse("2021-01-02").atStartOfDay().toInstant(ZoneOffset.UTC));
    oldAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '3');
    Instant end = LocalDate.parse("2021-01-03").atStartOfDay().toInstant(ZoneOffset.UTC);
    bucket.setStartTime(end);
    oldAssignmentBuckets.add(bucket);

    oldAssignmentWithBuckets.setAssignmentBuckets(oldAssignmentBuckets);

    Assignments newAssignmentWithBuckets = Assignments.create();

    List<BookedCapacityAggregate> dummyBookedCapacityAggregateList = new ArrayList<>();

    when(mockDataProvider.getResourceBookedCapacityAggregate(RESOURCE_ID, start, end))
        .thenReturn(dummyBookedCapacityAggregateList);

    classUnderTest.updateResourceBookedCapacity(oldAssignmentWithBuckets, newAssignmentWithBuckets);

    verify(mockDataProvider).getResourceBookedCapacityAggregate(RESOURCE_ID, start, end);

    verify(mockPersistenceService).run(any(CqnSelect.class));
    verify(mockPersistenceService).run(any(CqnUpsert.class));
    verify(mockPersistenceService).run(any(CqnDelete.class));

  }

  @Test
  public void serviceExceptionRaisedOnFailureToAcquireLockOnAssignmentCreate() {

    Assignments newAssignmentWithBuckets = Assignments.create();
    newAssignmentWithBuckets.setId(ASSIGNMENT_ID);
    newAssignmentWithBuckets.setResourceId(RESOURCE_ID);

    List<AssignmentBuckets> newAssignmentBuckets = new ArrayList<>();
    AssignmentBuckets bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '1');
    Instant start = LocalDate.parse("2021-01-01").atStartOfDay().toInstant(ZoneOffset.UTC);
    bucket.setStartTime(start);
    newAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '2');
    bucket.setStartTime(LocalDate.parse("2021-01-02").atStartOfDay().toInstant(ZoneOffset.UTC));
    newAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '3');
    Instant end = LocalDate.parse("2021-01-03").atStartOfDay().toInstant(ZoneOffset.UTC);
    bucket.setStartTime(end);
    newAssignmentBuckets.add(bucket);

    newAssignmentWithBuckets.setAssignmentBuckets(newAssignmentBuckets);

    Assignments oldAssignmentWithBuckets = Assignments.create();

    when(mockPersistenceService.run(any(CqnSelect.class))).thenThrow(CdsLockTimeoutException.class);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateResourceBookedCapacity(oldAssignmentWithBuckets, newAssignmentWithBuckets));

    verifyNoInteractions(mockDataProvider);
    verify(mockPersistenceService, times(0)).run(any(CqnUpsert.class));
    verify(mockPersistenceService, times(0)).run(any(CqnDelete.class));

  }

  @Test
  public void serviceExceptionRaisedOnFailureToAcquireLockOnAssignmentUpdate() {

    Assignments oldAssignmentWithBuckets = Assignments.create();
    oldAssignmentWithBuckets.setId(ASSIGNMENT_ID);
    oldAssignmentWithBuckets.setResourceId(RESOURCE_ID);

    List<AssignmentBuckets> oldAssignmentBuckets = new ArrayList<>();
    AssignmentBuckets bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '1');
    Instant start = LocalDate.parse("2021-01-01").atStartOfDay().toInstant(ZoneOffset.UTC);
    bucket.setStartTime(start);
    oldAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '2');
    bucket.setStartTime(LocalDate.parse("2021-01-02").atStartOfDay().toInstant(ZoneOffset.UTC));
    oldAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '3');
    bucket.setStartTime(LocalDate.parse("2021-01-03").atStartOfDay().toInstant(ZoneOffset.UTC));
    oldAssignmentBuckets.add(bucket);

    oldAssignmentWithBuckets.setAssignmentBuckets(oldAssignmentBuckets);

    Assignments newAssignmentWithBuckets = Assignments.create();
    newAssignmentWithBuckets.setId(ASSIGNMENT_ID);
    newAssignmentWithBuckets.setResourceId(RESOURCE_ID);

    List<AssignmentBuckets> newAssignmentBuckets = new ArrayList<>();
    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '1');
    bucket.setStartTime(LocalDate.parse("2021-01-03").atStartOfDay().toInstant(ZoneOffset.UTC));
    newAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '2');
    bucket.setStartTime(LocalDate.parse("2021-01-04").atStartOfDay().toInstant(ZoneOffset.UTC));
    newAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '3');
    Instant end = LocalDate.parse("2021-01-05").atStartOfDay().toInstant(ZoneOffset.UTC);
    bucket.setStartTime(end);
    newAssignmentBuckets.add(bucket);

    newAssignmentWithBuckets.setAssignmentBuckets(newAssignmentBuckets);

    when(mockPersistenceService.run(any(CqnSelect.class))).thenThrow(CdsLockTimeoutException.class);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateResourceBookedCapacity(oldAssignmentWithBuckets, newAssignmentWithBuckets));

    verifyNoInteractions(mockDataProvider);
    verify(mockPersistenceService, times(0)).run(any(CqnUpsert.class));
    verify(mockPersistenceService, times(0)).run(any(CqnDelete.class));

  }

  @Test
  public void serviceExceptionRaisedOnFailureToAcquireLockOnAssignmentDelete() {

    Assignments oldAssignmentWithBuckets = Assignments.create();
    oldAssignmentWithBuckets.setId(ASSIGNMENT_ID);
    oldAssignmentWithBuckets.setResourceId(RESOURCE_ID);

    List<AssignmentBuckets> oldAssignmentBuckets = new ArrayList<>();
    AssignmentBuckets bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '1');
    Instant start = LocalDate.parse("2021-01-01").atStartOfDay().toInstant(ZoneOffset.UTC);
    bucket.setStartTime(start);
    oldAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '2');
    bucket.setStartTime(LocalDate.parse("2021-01-02").atStartOfDay().toInstant(ZoneOffset.UTC));
    oldAssignmentBuckets.add(bucket);

    bucket = AssignmentBuckets.create();
    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setId(ASSIGNMENT_ID + '3');
    Instant end = LocalDate.parse("2021-01-03").atStartOfDay().toInstant(ZoneOffset.UTC);
    bucket.setStartTime(end);
    oldAssignmentBuckets.add(bucket);

    oldAssignmentWithBuckets.setAssignmentBuckets(oldAssignmentBuckets);

    Assignments newAssignmentWithBuckets = Assignments.create();

    when(mockPersistenceService.run(any(CqnSelect.class))).thenThrow(CdsLockTimeoutException.class);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateResourceBookedCapacity(oldAssignmentWithBuckets, newAssignmentWithBuckets));

    verifyNoInteractions(mockDataProvider);
    verify(mockPersistenceService, times(0)).run(any(CqnUpsert.class));
    verify(mockPersistenceService, times(0)).run(any(CqnDelete.class));

  }

}
