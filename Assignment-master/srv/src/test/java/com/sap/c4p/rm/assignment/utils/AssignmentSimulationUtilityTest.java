package com.sap.c4p.rm.assignment.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.EmptyResultException;
import com.sap.cds.Struct;

import com.sap.resourcemanagement.resource.Capacity;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;
import capacityservice.AssignmentBucketsPerDay;
import capacityservice.AssignmentBucketsYearMonthAggregate;
import capacityservice.AssignmentBucketsYearWeekAggregate;
import capacityservice.AssignmentsDetailsForCapacityGrid;

public class AssignmentSimulationUtilityTest {

  AssignmentSimulationUtility cut;
  private DataProvider mockDataProvider;
  private static final String ASSIGNMENT_ID = "assignment_id";
  private static final String RESOURCE_ID = "resource_id";
  private static final String RESOURCEREQUEST_ID = "resourcerequest_id";
  private static final String ASSIGNMENT_BUCKET_ID = "assignment_bucket_id";
  private static final String ASSIGNMENT_BUCKET_ID2 = "assignment_bucket_id2";

  @BeforeEach
  public void createObject() {
    mockDataProvider = mock(DataProvider.class);
    cut = new AssignmentSimulationUtility(mockDataProvider);
  }

  @Test
  @DisplayName("Assignment distribution tests")
  public void getDistributedAssignmentBuckets() {

    /*
     * Note that for all these tests, it is assumed that the granularity is always
     * 60mins. We know that the tests will fail if the granularity can have other
     * values. The class will need rework in such a situation
     */
    int resourceBookingGranularityInMinutes = 60;
    int hoursToDistribute = 10;
    Capacity resourceCapacity1 = Struct.create(Capacity.class);
    Capacity resourceCapacity2 = Struct.create(Capacity.class);
    List<Capacity> resourceCapacityList = new ArrayList<>();

    resourceCapacity1.setResourceId("RES1");
    resourceCapacity1.setWorkingTimeInMinutes(480);
    Instant startTime = Instant.parse("2020-10-10T08:00:00.00Z");
    resourceCapacity1.setStartTime(startTime);

    resourceCapacityList.add(resourceCapacity1);

    resourceCapacity2.setResourceId("RES1");
    resourceCapacity2.setWorkingTimeInMinutes(30);
    startTime = Instant.parse("2020-10-11T08:00:00.00Z");
    resourceCapacity2.setStartTime(startTime);

    resourceCapacityList.add(resourceCapacity2);

    // Simple case, distribute equally, the hours on both days should be the same
    List<AssignmentBuckets> assignmentBuckets = cut.getDistributedAssignmentBuckets(resourceBookingGranularityInMinutes,
        hoursToDistribute, resourceCapacityList);
    assertEquals(assignmentBuckets.get(0).getBookedCapacityInMinutes(),
        assignmentBuckets.get(1).getBookedCapacityInMinutes(), "The distribution is unequal");

    // If nothing to distribute, then return nothing.
    assignmentBuckets = cut.getDistributedAssignmentBuckets(resourceBookingGranularityInMinutes, 0,
        resourceCapacityList);
    assertEquals(0, assignmentBuckets.size(), "Why is there a bucket when there was nothing to be distributed");

    // If hours to distribute is can't be distributed equally, then there must be a
    // single bucket
    assignmentBuckets = cut.getDistributedAssignmentBuckets(resourceBookingGranularityInMinutes, 1,
        resourceCapacityList);
    assertEquals(1, assignmentBuckets.size(),
        "The distribution has happened for multiple days while it was expected to be for just 1 day");

    // If the required hours is not a multiple of granularity, and if it is big
    // enough to be distributed across multiple days, then the distribution is
    // expected to be unequal.
    assignmentBuckets = cut.getDistributedAssignmentBuckets(resourceBookingGranularityInMinutes, 9,
        resourceCapacityList);
    assertTrue(
        assignmentBuckets.get(0).getBookedCapacityInMinutes() > assignmentBuckets.get(1).getBookedCapacityInMinutes(),
        "Unequal distribution was expected but not seen");
    assertEquals(300, assignmentBuckets.get(0).getBookedCapacityInMinutes(),
        "The expected hours is different on the first day");
    assertEquals(240, assignmentBuckets.get(1).getBookedCapacityInMinutes(),
        "The expected hours is different on the second day");
  }

  @Test
  @DisplayName("Assignment distribution from active reference assignment")
  public void getDistributedAssignmentBucketsFromActiveAssignmentReference() {

    when(mockDataProvider.getAssignmentHeaderDraft(ASSIGNMENT_ID)).thenThrow(EmptyResultException.class);

    // This is the case of copying from the original assignment
    com.sap.resourcemanagement.assignment.AssignmentBuckets mockAssignmentBucket = com.sap.resourcemanagement.assignment.AssignmentBuckets
        .create();
    mockAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockAssignmentBucket.setAssignmentId(ASSIGNMENT_ID);

    Instant bucketStartTime = LocalDate.of(2020, 1, 1).atStartOfDay().toInstant(ZoneOffset.UTC);
    mockAssignmentBucket.setStartTime(bucketStartTime);

    List<com.sap.resourcemanagement.assignment.AssignmentBuckets> mockBucketList = new ArrayList<>();
    mockBucketList.add(mockAssignmentBucket);

    when(mockDataProvider.getAssignmentBuckets(ASSIGNMENT_ID)).thenReturn(mockBucketList);

    List<AssignmentBuckets> assignmentBuckets = cut.getDistributionFromReferenceAssignment(ASSIGNMENT_ID);

    assertEquals(bucketStartTime, assignmentBuckets.get(0).getStartTime(),
        "Did not return the bucket of the reference assignment");

  }

  @Test
  @DisplayName("Assignment distribution from draft reference assignment")
  public void getDistributedAssignmentBucketsFromDraftAssignmentReference() {

    Assignments draftAssignment = Struct.create(Assignments.class);
    draftAssignment.setId(ASSIGNMENT_ID);
    draftAssignment.setResourceId(RESOURCE_ID);
    draftAssignment.setResourceRequestId(RESOURCEREQUEST_ID);
    draftAssignment.setHasActiveEntity(true);

    when(mockDataProvider.getAssignmentHeaderDraft(ASSIGNMENT_ID)).thenReturn(draftAssignment);

    // This is the case of copying from the draft assignment
    assignmentservice.AssignmentBuckets mockDraftAssignmentBucket = assignmentservice.AssignmentBuckets.create();
    mockDraftAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockDraftAssignmentBucket.setAssignmentId(ASSIGNMENT_ID);
    Instant bucketStartTime = LocalDate.of(2020, 1, 1).atStartOfDay().toInstant(ZoneOffset.UTC);
    mockDraftAssignmentBucket.setStartTime(bucketStartTime);
    List<assignmentservice.AssignmentBuckets> mockDraftBucketList = new ArrayList<>();
    mockDraftBucketList.add(mockDraftAssignmentBucket);
    when(mockDataProvider.getAssignmentBucketsDraft(ASSIGNMENT_ID)).thenReturn(mockDraftBucketList);

    List<AssignmentBuckets> assignmentBuckets = cut.getDistributionFromReferenceAssignment(ASSIGNMENT_ID);

    assertEquals(bucketStartTime, assignmentBuckets.get(0).getStartTime(),
        "Did not return the bucket of the reference draft assignment");

  }

  @Test
  @DisplayName("Fill in the gaps with 0 duration entries")
  public void fillTheMissingBucketsOnCreate() {

    // Prepare resource capacity
    List<Capacity> resourceCapacityList = new ArrayList<>();
    Capacity resourceCapacity = Struct.create(Capacity.class);
    resourceCapacity.setWorkingTimeInMinutes(480);
    resourceCapacity.setStartTime(Instant.parse("2020-10-01T08:00:00.00Z"));
    resourceCapacity.setEndTime(Instant.parse("2020-10-01T16:00:00.00Z"));
    resourceCapacityList.add(resourceCapacity);

    resourceCapacity = Struct.create(Capacity.class);
    resourceCapacity.setStartTime(Instant.parse("2020-10-02T08:00:00.00Z"));
    resourceCapacity.setEndTime(Instant.parse("2020-10-02T16:00:00.00Z"));
    resourceCapacity.setWorkingTimeInMinutes(480);
    resourceCapacityList.add(resourceCapacity);

    resourceCapacity = Struct.create(Capacity.class);
    resourceCapacity.setStartTime(Instant.parse("2020-10-03T08:00:00.00Z"));
    resourceCapacity.setEndTime(Instant.parse("2020-10-03T16:00:00.00Z"));
    resourceCapacity.setWorkingTimeInMinutes(480);
    resourceCapacityList.add(resourceCapacity);

    resourceCapacity = Struct.create(Capacity.class);
    resourceCapacity.setStartTime(Instant.parse("2020-10-04T08:00:00.00Z"));
    resourceCapacity.setEndTime(Instant.parse("2020-10-04T16:00:00.00Z"));
    resourceCapacity.setWorkingTimeInMinutes(480);
    resourceCapacityList.add(resourceCapacity);

    resourceCapacity = Struct.create(Capacity.class);
    resourceCapacity.setStartTime(Instant.parse("2020-10-05T08:00:00.00Z"));
    resourceCapacity.setEndTime(Instant.parse("2020-10-05T16:00:00.00Z"));
    resourceCapacity.setWorkingTimeInMinutes(480);
    resourceCapacityList.add(resourceCapacity);

    resourceCapacity = Struct.create(Capacity.class);
    resourceCapacity.setStartTime(Instant.parse("2020-10-06T08:00:00.00Z"));
    resourceCapacity.setEndTime(Instant.parse("2020-10-06T16:00:00.00Z"));
    resourceCapacity.setWorkingTimeInMinutes(480);
    resourceCapacityList.add(resourceCapacity);

    resourceCapacity = Struct.create(Capacity.class);
    resourceCapacity.setStartTime(Instant.parse("2020-10-07T08:00:00.00Z"));
    resourceCapacity.setEndTime(Instant.parse("2020-10-07T16:00:00.00Z"));
    resourceCapacity.setWorkingTimeInMinutes(480);
    resourceCapacityList.add(resourceCapacity);

    resourceCapacity = Struct.create(Capacity.class);
    resourceCapacity.setStartTime(Instant.parse("2020-10-08T08:00:00.00Z"));
    resourceCapacity.setEndTime(Instant.parse("2020-10-08T16:00:00.00Z"));
    resourceCapacity.setWorkingTimeInMinutes(480);
    resourceCapacityList.add(resourceCapacity);

    resourceCapacity = Struct.create(Capacity.class);
    resourceCapacity.setStartTime(Instant.parse("2020-10-09T08:00:00.00Z"));
    resourceCapacity.setEndTime(Instant.parse("2020-10-09T16:00:00.00Z"));
    resourceCapacity.setWorkingTimeInMinutes(480);
    resourceCapacityList.add(resourceCapacity);

    resourceCapacity = Struct.create(Capacity.class);
    resourceCapacity.setStartTime(Instant.parse("2020-10-10T08:00:00.00Z"));
    resourceCapacity.setEndTime(Instant.parse("2020-10-10T16:00:00.00Z"));
    resourceCapacity.setWorkingTimeInMinutes(480);
    resourceCapacityList.add(resourceCapacity);

    when(mockDataProvider.getResourceCapacities(any(), any(), any())).thenReturn(resourceCapacityList);

    // Prepare the existing buckets
    assignmentservice.AssignmentBuckets mockDraftAssignmentBucket = assignmentservice.AssignmentBuckets.create();
    mockDraftAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockDraftAssignmentBucket.setAssignmentId(ASSIGNMENT_ID);
    Instant bucketStartTime = Instant.parse("2020-10-01T08:00:00.00Z");
    mockDraftAssignmentBucket.setStartTime(bucketStartTime);
    List<assignmentservice.AssignmentBuckets> mockDraftBucketList = new ArrayList<>();
    mockDraftBucketList.add(mockDraftAssignmentBucket);

    mockDraftAssignmentBucket = assignmentservice.AssignmentBuckets.create();
    mockDraftAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID2);
    mockDraftAssignmentBucket.setAssignmentId(ASSIGNMENT_ID);
    bucketStartTime = Instant.parse("2020-10-05T08:00:00.00Z");
    mockDraftAssignmentBucket.setStartTime(bucketStartTime);
    mockDraftBucketList.add(mockDraftAssignmentBucket);

    Instant requestStartTime = LocalDate.of(2020, 10, 1).atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant requestEndTime = LocalDate.of(2020, 10, 20).atStartOfDay().toInstant(ZoneOffset.UTC);

    List<AssignmentBuckets> assignmentBuckets = cut.fillTheMissingBucketsOnCreate(ASSIGNMENT_ID, mockDraftBucketList,
        requestStartTime, requestEndTime, RESOURCE_ID);

    assertEquals(10, assignmentBuckets.size(), "The method did not fill the expected number of blanks");

  }

  @Test
  @DisplayName("Get default assignment status code")
  public void getDefaultAssignmentStatusCode() {

    int assignmentStatusCode = cut.getAssignmentStatusCode(null, null);

    assertEquals(0, assignmentStatusCode, "Default assignment status code is not hardbooked! (0)");

  }

  @Test
  @DisplayName("Get assignment status code when sent without other reference")
  public void getSentAssignmentStatusCode() {

    int sentStatusCode = 1;
    int assignmentStatusCode = cut.getAssignmentStatusCode(sentStatusCode, null);

    assertEquals(1, assignmentStatusCode, "The assignment status code is NOT set to the sent assignment status code");

  }

  @Test
  @DisplayName("Get assignment status code from reference active assignment")
  public void getAssignmentStatusCodeFromReference() {

    int sentStatusCode = 1;
    String referenceAssignment = ASSIGNMENT_ID;

    when(mockDataProvider.getAssignmentHeaderDraft(ASSIGNMENT_ID)).thenThrow(EmptyResultException.class);

    com.sap.resourcemanagement.assignment.Assignments dummyAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();

    dummyAssignment.setAssignmentStatusCode(0);

    when(mockDataProvider.getAssignmentHeader(ASSIGNMENT_ID)).thenReturn(Optional.of(dummyAssignment));

    int assignmentStatusCode = cut.getAssignmentStatusCode(sentStatusCode, referenceAssignment);

    assertEquals(0, assignmentStatusCode, "Assignemnt status is not copied from the reference active assignment");

  }

  @Test
  @DisplayName("Get assignment status code from draft reference")
  public void getAssignmentStatusCodeFromDraftReference() {

    int sentStatusCode = 1;
    String referenceAssignment = ASSIGNMENT_ID;

    Assignments draftAssignment = Struct.create(Assignments.class);
    draftAssignment.setId(ASSIGNMENT_ID);
    draftAssignment.setAssignmentStatusCode(0);

    when(mockDataProvider.getAssignmentHeaderDraft(ASSIGNMENT_ID)).thenReturn(draftAssignment);

    int assignmentStatusCode = cut.getAssignmentStatusCode(sentStatusCode, referenceAssignment);

    assertEquals(0, assignmentStatusCode, "Assignment code is not copied from the reference draft assignment");

  }

  @Test
  @DisplayName("Prepare Assignment Bucket Per Day Result")
  public void prepareAssignmentBucketsPerDayResult() {

    List<AssignmentBuckets> assignmentBucketList = new ArrayList<>();

    AssignmentBuckets assignmentBucket;

    for (int i = 1; i < 11; i++) {

      assignmentBucket = Struct.create(AssignmentBuckets.class);
      assignmentBucket.setId("Bucket1" + i);
      assignmentBucket.setAssignmentId(ASSIGNMENT_ID);
      assignmentBucket.setBookedCapacityInMinutes(60);
      assignmentBucket.setStartTime(LocalDate.of(2020, 10, i).atStartOfDay().toInstant(ZoneOffset.UTC));
      assignmentBucketList.add(assignmentBucket);
    }

    LocalDate gridStartDate = LocalDate.of(2020, 10, 2);
    LocalDate gridEndDate = LocalDate.of(2020, 10, 8);

    List<AssignmentBucketsPerDay> assignmentBucketsPerDayResult = cut
        .prepareAssignmentBucketsPerDayResult(assignmentBucketList, gridStartDate, gridEndDate);

    assertEquals(7, assignmentBucketsPerDayResult.size(),
        "Assignment daily distribution not prepared in accodance with grid date");

  }

  @Test
  @DisplayName("Prepare Assignment Bucket Weekly Result")
  public void prepareAssignmentBucketsYearWeekResult() {

    List<AssignmentBuckets> assignmentBucketList = new ArrayList<>();

    AssignmentBuckets assignmentBucket;

    for (int i = 1; i < 30; i++) {

      assignmentBucket = Struct.create(AssignmentBuckets.class);
      assignmentBucket.setId("Bucket1" + i);
      assignmentBucket.setAssignmentId(ASSIGNMENT_ID);
      assignmentBucket.setBookedCapacityInMinutes(60);
      assignmentBucket.setStartTime(LocalDate.of(2020, 10, i).atStartOfDay().toInstant(ZoneOffset.UTC));
      assignmentBucketList.add(assignmentBucket);
    }

    LocalDate gridStartDate = LocalDate.of(2020, 10, 2);
    LocalDate gridEndDate = LocalDate.of(2020, 10, 20);

    List<AssignmentBucketsYearWeekAggregate> assignmentBucketsWeeklyResult = cut
        .prepareAssignmentBucketsYearWeekResult(assignmentBucketList, gridStartDate, gridEndDate);

    assertEquals(4, assignmentBucketsWeeklyResult.size(),
        "Weekly distribution not prepared in accordance with grid date");
    assertEquals("202040", assignmentBucketsWeeklyResult.get(0).getTimePeriod(), "Week timeperiod is not correct");
    assertEquals(3, assignmentBucketsWeeklyResult.get(0).getBookedCapacityInHours(),
        "Week capacity aggregation is not correct");

    assertEquals("202043", assignmentBucketsWeeklyResult.get(3).getTimePeriod(), "Week timeperiod is not correct");
    assertEquals(2, assignmentBucketsWeeklyResult.get(3).getBookedCapacityInHours(),
        "Week capacity aggregation is not correct");
  }

  @Test
  @DisplayName("Prepare Assignment Bucket Monthly Result")
  public void prepareAssignmentBucketsMonthlyResult() {

    List<AssignmentBuckets> assignmentBucketList = new ArrayList<>();

    AssignmentBuckets assignmentBucket;

    for (int i = 1; i < 32; i++) {

      assignmentBucket = Struct.create(AssignmentBuckets.class);
      assignmentBucket.setId("Bucket1" + i);
      assignmentBucket.setAssignmentId(ASSIGNMENT_ID);
      assignmentBucket.setBookedCapacityInMinutes(60);
      assignmentBucket.setStartTime(LocalDate.of(2020, 10, i).atStartOfDay().toInstant(ZoneOffset.UTC));
      assignmentBucketList.add(assignmentBucket);
    }

    for (int i = 1; i < 31; i++) {

      assignmentBucket = Struct.create(AssignmentBuckets.class);
      assignmentBucket.setId("Bucket1" + i);
      assignmentBucket.setAssignmentId(ASSIGNMENT_ID);
      assignmentBucket.setBookedCapacityInMinutes(60);
      assignmentBucket.setStartTime(LocalDate.of(2020, 11, i).atStartOfDay().toInstant(ZoneOffset.UTC));
      assignmentBucketList.add(assignmentBucket);
    }

    LocalDate gridStartDate = LocalDate.of(2020, 10, 2);
    LocalDate gridEndDate = LocalDate.of(2020, 11, 20);

    List<AssignmentBucketsYearMonthAggregate> assignmentBucketsMonthlyResult = cut
        .prepareAssignmentBucketsYearMonthResult(assignmentBucketList, gridStartDate, gridEndDate);

    assertEquals(2, assignmentBucketsMonthlyResult.size(),
        "Monthly distribution not prepared in accordance with grid date");

    assertEquals("202010", assignmentBucketsMonthlyResult.get(0).getTimePeriod(), "Month timeperiod is not correct");
    assertEquals(30, assignmentBucketsMonthlyResult.get(0).getBookedCapacityInHours(),
        "Month capacity aggregation is not correct");

    assertEquals("202011", assignmentBucketsMonthlyResult.get(1).getTimePeriod(), "Month timeperiod is not correct");
    assertEquals(20, assignmentBucketsMonthlyResult.get(1).getBookedCapacityInHours(),
        "Month capacity aggregation is not correct");
  }

  @Test
  @DisplayName("Derive assignment dates from buckets")
  public void getHeaderDatesFromBuckets() {

    List<AssignmentBuckets> assignmentBucketList = new ArrayList<>();

    AssignmentBuckets assignmentBucket;

    for (int i = 1; i < 32; i++) {

      assignmentBucket = Struct.create(AssignmentBuckets.class);
      assignmentBucket.setId("Bucket1" + i);
      assignmentBucket.setAssignmentId(ASSIGNMENT_ID);
      assignmentBucket.setBookedCapacityInMinutes(60);
      assignmentBucket.setStartTime(LocalDate.of(2020, 10, i).atStartOfDay().toInstant(ZoneOffset.UTC));
      assignmentBucketList.add(assignmentBucket);
    }

    for (int i = 1; i < 25; i++) {

      assignmentBucket = Struct.create(AssignmentBuckets.class);
      assignmentBucket.setId("Bucket1" + i);
      assignmentBucket.setAssignmentId(ASSIGNMENT_ID);
      assignmentBucket.setBookedCapacityInMinutes(60);
      assignmentBucket.setStartTime(LocalDate.of(2020, 11, i).atStartOfDay().toInstant(ZoneOffset.UTC));
      assignmentBucketList.add(assignmentBucket);
    }

    Map<String, LocalDate> headerDates = cut.getHeaderDatesFromBuckets(assignmentBucketList);

    assertEquals("2020-10-01", headerDates.get(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_START_DATE).toString(),
        "Monthly distribution not prepared in accordance with grid date");
    assertEquals("2020-11-24", headerDates.get(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_END_DATE).toString(),
        "Monthly distribution not prepared in accordance with grid date");

  }

}
