package com.sap.c4p.rm.assignment.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

import com.sap.resourcemanagement.assignment.AssignmentBuckets;
import com.sap.resourcemanagement.assignment.AssignmentBucketsForYearWeek;
import com.sap.resourcemanagement.assignment.Assignments;
import com.sap.resourcemanagement.organization.DeliveryOrganizationCostCenters;
import com.sap.resourcemanagement.resource.BookedCapacityAggregate;
import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Headers;
import com.sap.resourcemanagement.resource.ResourceDetails;
import com.sap.resourcemanagement.resource.ResourceDetailsForTimeWindow;
import com.sap.resourcemanagement.resource.Types;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.supply.AssignmentBucketsYearMonthAggregate;
import com.sap.resourcemanagement.workforce.workassignment.ExtnWorkAssignmentFirstJobDetails;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignmentFirstJobDetails;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;

public class DataProviderTest {

  private static final String RESOURCE_ID = "resource_id";
  private static final String REQUEST_ID = "request_id";
  private static final String ASSIGNMENT_ID = "assignment_id";
  private PersistenceService mockDbService;
  private DraftService mockDraftService;
  private CdsRuntime mockCdsRuntime;

  private DataProvider classUnderTest;

  @BeforeEach
  void setup() {
    mockDbService = mock(PersistenceService.class, RETURNS_DEEP_STUBS);
    mockDraftService = mock(DraftService.class, RETURNS_DEEP_STUBS);
    mockCdsRuntime = mock(CdsRuntime.class, RETURNS_DEEP_STUBS);

    classUnderTest = new DataProvider(mockDbService, mockDraftService, mockCdsRuntime);
  }

  @Test
  void resourceCapacityIsCorrectlyReturned() {
    List<Capacity> mockResult = Arrays.asList(new Capacity[] { Capacity.create() });
    when(mockDbService.run(any(CqnSelect.class)).listOf(Capacity.class)).thenReturn(mockResult);
    assertIterableEquals(mockResult, classUnderTest.getResourceCapacities(RESOURCE_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingResourceCapacityIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).listOf(Capacity.class)).thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getResourceCapacities(RESOURCE_ID));
  }

  @Test
  void resourceCapacityWithDatesIsCorrectlyReturned() {
    List<Capacity> mockResult = Arrays.asList(new Capacity[] { Capacity.create() });
    when(mockDbService.run(any(CqnSelect.class)).listOf(Capacity.class)).thenReturn(mockResult);
    assertIterableEquals(mockResult, classUnderTest.getResourceCapacities(RESOURCE_ID, Instant.now(), Instant.now()));
  }

  @Test
  void exceptionFromDbServiceWhenReadingResourceCapacityWithDatesIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).listOf(Capacity.class)).thenThrow(ServiceException.class);
    assertThrows(ServiceException.class,
        () -> classUnderTest.getResourceCapacities(RESOURCE_ID, Instant.now(), Instant.now()));
  }

  @Test
  void requestDataIsCorrectlyReturned() {
    ResourceRequests mockResult = ResourceRequests.create();
    when(mockDbService.run(any(CqnSelect.class)).first(ResourceRequests.class)).thenReturn(Optional.of(mockResult));
    assertEquals(Optional.of(mockResult), classUnderTest.getRequestData(REQUEST_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingRequestDataIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).first(ResourceRequests.class)).thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getRequestData(REQUEST_ID));
  }

  @Test
  void resourceDataIsCorrectlyReturned() {
    Headers mockResult = Headers.create();
    when(mockDbService.run(any(CqnSelect.class)).first(Headers.class)).thenReturn(Optional.of(mockResult));
    assertEquals(Optional.of(mockResult), classUnderTest.getResourceData(RESOURCE_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingResourceDataIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).first(Headers.class)).thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getResourceData(RESOURCE_ID));
  }

  @Test
  void resourceBookingGranularityIsCorrectlyReturned() {
    Types mockResult = Types.create();
    when(mockDbService.run(any(CqnSelect.class)).first(Types.class)).thenReturn(Optional.of(mockResult));
    assertEquals(Optional.of(mockResult), classUnderTest.getResourceBookingGranularityInMinutes(RESOURCE_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingResourceBookingGranularityIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).first(Types.class)).thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getResourceBookingGranularityInMinutes(RESOURCE_ID));
  }

  @Test
  void assignmentForResourceAndRequestIsCorrectlyReturned() {
    Assignments mockResult = Assignments.create();
    when(mockDbService.run(any(CqnSelect.class)).first(Assignments.class)).thenReturn(Optional.of(mockResult));
    assertEquals(Optional.of(mockResult), classUnderTest.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingAssignmentForResourceAndRequestIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).first(Assignments.class)).thenThrow(ServiceException.class);
    assertThrows(ServiceException.class,
        () -> classUnderTest.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID));
  }

  @Test
  void assignmentHeaderIsCorrectlyReturned() {
    Assignments mockResult = Assignments.create();
    when(mockDbService.run(any(CqnSelect.class)).first(Assignments.class)).thenReturn(Optional.of(mockResult));
    assertEquals(Optional.of(mockResult), classUnderTest.getAssignmentHeader(ASSIGNMENT_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingAssignmentHeaderIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).first(Assignments.class)).thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getAssignmentHeader(ASSIGNMENT_ID));
  }

  @Test
  void resourceEmploymentDetailsIsCorrectlyReturned() {
    ResourceDetails mockResult = ResourceDetails.create();
    when(mockDbService.run(any(CqnSelect.class)).first(ResourceDetails.class)).thenReturn(Optional.of(mockResult));
    assertEquals(Optional.of(mockResult), classUnderTest.getResourceEmploymentDetails(RESOURCE_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingResourceEmploymentDetailsIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).first(ResourceDetails.class)).thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getResourceEmploymentDetails(RESOURCE_ID));
  }

  @Test
  void matchingTimeSliceIsCorrectlyReturned() {
    ResourceDetailsForTimeWindow mockResult = ResourceDetailsForTimeWindow.create();
    when(mockDbService.run(any(CqnSelect.class)).first(ResourceDetailsForTimeWindow.class))
        .thenReturn(Optional.of(mockResult));
    assertEquals(Optional.of(mockResult), classUnderTest.getMatchingTimeSlice(RESOURCE_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingMatchingTimeSliceIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).first(ResourceDetailsForTimeWindow.class))
        .thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getMatchingTimeSlice(RESOURCE_ID));
  }

  @Test
  void workAssignmentDetailIsCorrectlyReturned() {
    WorkAssignments mockResult = WorkAssignments.create();
    when(mockDbService.run(any(CqnSelect.class)).first(WorkAssignments.class)).thenReturn(Optional.of(mockResult));
    assertEquals(Optional.of(mockResult), classUnderTest.getWorkAssignmentDetails(RESOURCE_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingWorkAssignmentDetailsIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).first(WorkAssignments.class)).thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getWorkAssignmentDetails(RESOURCE_ID));
  }

  @Test
  void capacityRequirementIsCorrectlyReturned() {
    List<CapacityRequirements> mockResult = Arrays.asList(new CapacityRequirements[] { CapacityRequirements.create() });
    when(mockDbService.run(any(CqnSelect.class)).listOf(CapacityRequirements.class)).thenReturn(mockResult);
    assertIterableEquals(mockResult, classUnderTest.getRequestCapacityRequirements(REQUEST_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingCapacityRequirementIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).listOf(CapacityRequirements.class)).thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getRequestCapacityRequirements(REQUEST_ID));
  }

  @Test
  void assignmentBucketsAreCorrectlyReturned() {
    List<AssignmentBuckets> mockResult = Arrays.asList(new AssignmentBuckets[] { AssignmentBuckets.create() });
    when(mockDbService.run(any(CqnSelect.class)).listOf(AssignmentBuckets.class)).thenReturn(mockResult);
    assertIterableEquals(mockResult, classUnderTest.getAssignmentBuckets(ASSIGNMENT_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingAssignmentBucketsIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).listOf(AssignmentBuckets.class)).thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getAssignmentBuckets(ASSIGNMENT_ID));
  }

  @Test
  void assignmentBucketsYearMonthAggregateIsCorrectlyReturned() {
    List<AssignmentBucketsYearMonthAggregate> mockResult = Arrays
        .asList(new AssignmentBucketsYearMonthAggregate[] { AssignmentBucketsYearMonthAggregate.create() });
    when(mockDbService.run(any(CqnSelect.class)).listOf(AssignmentBucketsYearMonthAggregate.class))
        .thenReturn(mockResult);
    assertIterableEquals(mockResult, classUnderTest.getMonthlyAggregatedAssignment(ASSIGNMENT_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingAssignmentBucketsYearMonthAggregateIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).listOf(AssignmentBucketsYearMonthAggregate.class))
        .thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getMonthlyAggregatedAssignment(ASSIGNMENT_ID));
  }

  @Test
  void workAssignmentFirstJobDetailIsCorrectlyReturned() {
    List<WorkAssignmentFirstJobDetails> mockResult = Arrays
        .asList(new WorkAssignmentFirstJobDetails[] { WorkAssignmentFirstJobDetails.create() });
    when(mockDbService.run(any(CqnSelect.class)).listOf(WorkAssignmentFirstJobDetails.class)).thenReturn(mockResult);
    assertIterableEquals(mockResult, classUnderTest.getCostCenterRecords(RESOURCE_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingWorkAssignmentFirstJobDetailIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).listOf(WorkAssignmentFirstJobDetails.class))
        .thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getCostCenterRecords(RESOURCE_ID));
  }

  @Test
  void assignmentBucketsFromDraftServiceCorrectlyReturned() {
    assignmentservice.Assignments mockAssignment = assignmentservice.Assignments.create();
    List<assignmentservice.AssignmentBuckets> mockResult = Arrays
        .asList(new assignmentservice.AssignmentBuckets[] { assignmentservice.AssignmentBuckets.create() });
    mockAssignment.setAssignmentBuckets(mockResult);
    when(mockDraftService.run(any(CqnSelect.class)).single(assignmentservice.Assignments.class))
        .thenReturn(mockAssignment);
    assertIterableEquals(mockResult, classUnderTest.getAssignmentBucketsFromDraftService(ASSIGNMENT_ID));
  }

  @Test
  void exceptionFromDraftServiceWhenReadingAssignmentBucketsIsCorrectlyForwarded() {
    when(mockDraftService.run(any(CqnSelect.class)).single(assignmentservice.Assignments.class))
        .thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getAssignmentBucketsFromDraftService(ASSIGNMENT_ID));
  }

  @Test
  void assignmentServiceBucketsCorrectlyReturned() {
    List<assignmentservice.AssignmentBuckets> mockResult = Arrays
        .asList(new assignmentservice.AssignmentBuckets[] { assignmentservice.AssignmentBuckets.create() });
    when(mockDbService.run(any(CqnSelect.class)).listOf(assignmentservice.AssignmentBuckets.class))
        .thenReturn(mockResult);
    assertIterableEquals(mockResult, classUnderTest.getAssignmentServiceBuckets(ASSIGNMENT_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingAssignmentServiceBucketsIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).listOf(assignmentservice.AssignmentBuckets.class))
        .thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getAssignmentServiceBuckets(ASSIGNMENT_ID));
  }

  @Test
  void assignmentWithBucketsCorrectlyReturned() {
    assignmentservice.Assignments mockAssignment = mock(assignmentservice.Assignments.class);
    when(mockDbService.run(any(CqnSelect.class)).single(assignmentservice.Assignments.class))
        .thenReturn(mockAssignment);
    assertEquals(mockAssignment, classUnderTest.getAssignmentWithBuckets(ASSIGNMENT_ID));
    verify(mockAssignment, times(1)).setAssignmentBuckets(any());
  }

  @Test
  void exceptionFromDbServiceWhenReadingAssignmentWithBucketsIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).single(assignmentservice.Assignments.class))
        .thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getAssignmentWithBuckets(ASSIGNMENT_ID));
  }

  @Test
  void assignmentBucketDraftsCorrectlyReturned() {
    List<assignmentservice.AssignmentBuckets> mockResult = Arrays
        .asList(new assignmentservice.AssignmentBuckets[] { assignmentservice.AssignmentBuckets.create() });
    when(mockDraftService.run(any(CqnSelect.class)).listOf(assignmentservice.AssignmentBuckets.class))
        .thenReturn(mockResult);
    assertIterableEquals(mockResult, classUnderTest.getAssignmentBucketsDraft(ASSIGNMENT_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingAssignmentBucketDraftsIsCorrectlyForwarded() {
    when(mockDraftService.run(any(CqnSelect.class)).listOf(assignmentservice.AssignmentBuckets.class))
        .thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getAssignmentBucketsDraft(ASSIGNMENT_ID));
  }

  @Test
  void assignmentHeaderDraftCorrectlyReturned() {
    assignmentservice.Assignments mockAssignment = mock(assignmentservice.Assignments.class);
    when(mockDraftService.run(any(CqnSelect.class)).single(assignmentservice.Assignments.class))
        .thenReturn(mockAssignment);
    assertEquals(mockAssignment, classUnderTest.getAssignmentHeaderDraft(ASSIGNMENT_ID));
  }

  @Test
  void exceptionFromDbServiceWhenReadingAssignmentHeaderDraftIsCorrectlyForwarded() {
    when(mockDraftService.run(any(CqnSelect.class)).single(assignmentservice.Assignments.class))
        .thenThrow(ServiceException.class);
    assertThrows(ServiceException.class, () -> classUnderTest.getAssignmentHeaderDraft(ASSIGNMENT_ID));
  }

  @Test
  void costCenterListCorrectlyReturned() {
    List<DeliveryOrganizationCostCenters> mockResult = Arrays
        .asList(new DeliveryOrganizationCostCenters[] { DeliveryOrganizationCostCenters.create() });
    when(mockDbService.run(any(CqnSelect.class)).listOf(DeliveryOrganizationCostCenters.class)).thenReturn(mockResult);
    assertIterableEquals(mockResult, classUnderTest.getlistCostCenters(Arrays.asList(new String[] { "CCIN", "CCDE" })));
  }

  @Test
  void dbNotQueriedWhenInputParameterListIsEmpty() {
    List<DeliveryOrganizationCostCenters> mockResult = Collections.emptyList();
    assertIterableEquals(mockResult, classUnderTest.getlistCostCenters(Collections.emptyList()));
    verifyNoInteractions(mockDbService);
  }

  @Test
  void exceptionFromDbServiceWhenReadingCostCenterListIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).listOf(DeliveryOrganizationCostCenters.class))
        .thenThrow(ServiceException.class);
    assertThrows(ServiceException.class,
        () -> classUnderTest.getlistCostCenters(Arrays.asList(new String[] { "CCIN", "CCDE" })));
  }

  @Test
  void bookedCapacityAggregatesAreCorrectlyReturned() {
    List<BookedCapacityAggregate> mockResult = Arrays
        .asList(new BookedCapacityAggregate[] { BookedCapacityAggregate.create() });
    when(mockDbService.run(any(CqnSelect.class)).listOf(BookedCapacityAggregate.class)).thenReturn(mockResult);
    assertIterableEquals(mockResult,
        classUnderTest.getResourceBookedCapacityAggregate(RESOURCE_ID, Instant.now(), Instant.now()));
  }

  @Test
  void exceptionFromDbServiceWhenReadingBookedCapacityAggregatesIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).listOf(BookedCapacityAggregate.class))
        .thenThrow(ServiceException.class);
    assertThrows(ServiceException.class,
        () -> classUnderTest.getResourceBookedCapacityAggregate(RESOURCE_ID, Instant.now(), Instant.now()));
  }

  @Test
  void exceptionFromDbServiceWhenReadingAssignmentBucketsForYearWeekIsCorrectlyForwarded() {
    when(mockDbService.run(any(CqnSelect.class)).listOf(AssignmentBucketsForYearWeek.class))
        .thenThrow(ServiceException.class);
    assertThrows(ServiceException.class,
        () -> classUnderTest.getExistingAssignmentBucketsForYearWeeks(ASSIGNMENT_ID, Arrays.asList("202201")));
  }

  @Test
  void dbNotQueriedWhenInputYearWeekParameterListIsEmpty() {
    assertEquals(Collections.emptyList(),
        classUnderTest.getExistingAssignmentBucketsForYearWeeks(ASSIGNMENT_ID, Collections.emptyList()));
    verifyNoInteractions(mockDbService);
  }

  @Test
  void assignmentBucketsForYearWeekAreCorrectlyReturned() {
    List<AssignmentBucketsForYearWeek> mockResult = Arrays
        .asList(new AssignmentBucketsForYearWeek[] { AssignmentBucketsForYearWeek.create() });
    when(mockDbService.run(any(CqnSelect.class)).listOf(AssignmentBucketsForYearWeek.class)).thenReturn(mockResult);
    assertIterableEquals(mockResult,
        classUnderTest.getExistingAssignmentBucketsForYearWeeks(ASSIGNMENT_ID, Arrays.asList("202201")));
  }

  @Test
  void getResourceValidityForTheGivenPeriodAndResourceOrg() {

    Instant startDate = Instant.now();
    Instant endDate = Instant.now();

    RequestContextRunner mockContextRunner = mock(RequestContextRunner.class);
    when(mockCdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    Optional<ExtnWorkAssignmentFirstJobDetails> extnJobDetails = Optional.empty();
    when(mockDbService.run(any(CqnSelect.class)).first(ExtnWorkAssignmentFirstJobDetails.class))
        .thenReturn(extnJobDetails);

    Optional<ExtnWorkAssignmentFirstJobDetails> extnJobDetailsResults = classUnderTest.getResourceValidity(startDate,
        endDate, "resourceId", "requestID");

    // Can't seem to get inside the run part of the requestContextRunner
    assertEquals(extnJobDetailsResults, null); // TODO

  }

}
