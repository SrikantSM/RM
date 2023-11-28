package com.sap.c4p.rm.assignment.utils;

import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.hoursToMinutes;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.minutesToHours;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.EmptyResultException;

import com.sap.resourcemanagement.resource.Capacity;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;
import capacityservice.AssignmentBucketsPerDay;
import capacityservice.AssignmentBucketsYearMonthAggregate;
import capacityservice.AssignmentBucketsYearWeekAggregate;
import capacityservice.AssignmentsDetailsForCapacityGrid;

@Component
public class AssignmentSimulationUtility {
  private DataProvider dataProvider;
  private static final String INITIAL_TIME_PERIOD = "190001";
  private static final String INITIAL_YEAR_DATE = "1900-01-01";

  @Autowired
  public AssignmentSimulationUtility(DataProvider dataProvider) {
    this.dataProvider = dataProvider;
  }

  public List<AssignmentBuckets> getDistributedAssignmentBuckets(int resourceBookingGranularityInMinutes,
      int hoursToDistribute, List<Capacity> resourceCapacityList) {

    List<Capacity> resourceCapacityMoreThanZeroList = resourceCapacityList.stream()
        .filter(capacityRecord -> capacityRecord.getWorkingTimeInMinutes() > 0).collect(Collectors.toList());

    List<Capacity> resourceCapacityToStaffList = resourceCapacityMoreThanZeroList.isEmpty() ? resourceCapacityList
        : resourceCapacityMoreThanZeroList;

    int numOfDaysToDistribute = resourceCapacityToStaffList.size();

    if (numOfDaysToDistribute > 0 && hoursToDistribute > 0) {
      int hoursAssignedEqually = hoursToDistribute
          / (numOfDaysToDistribute * minutesToHours(resourceBookingGranularityInMinutes));
      int hoursAssignedSequentially = hoursToDistribute
          % (numOfDaysToDistribute * minutesToHours(resourceBookingGranularityInMinutes));

      if (hoursAssignedEqually > 0) {
        return populateBucketsEqually(resourceCapacityToStaffList, hoursAssignedEqually, hoursAssignedSequentially);

      } else if (hoursAssignedSequentially > 0) {
        return populateBucketsSequentially(resourceCapacityToStaffList, hoursAssignedSequentially);
      }
    }
    return Collections.emptyList();
  }

  private List<AssignmentBuckets> populateBucketsEqually(List<Capacity> resourceCapacityToStaffList,
      int hoursAssignedEqually, int hoursAssignedSequentially) {

    List<AssignmentBuckets> assignmentBucketList = new ArrayList<>(resourceCapacityToStaffList.size());
    for (Capacity capacityRecord : resourceCapacityToStaffList) {
      AssignmentBuckets newBucket = AssignmentBuckets.create();
      newBucket
          .setBookedCapacityInMinutes(hoursToMinutes(hoursAssignedEqually + (hoursAssignedSequentially-- > 0 ? 1 : 0)));
      newBucket.setId(UUID.randomUUID().toString());
      newBucket.setStartTime(capacityRecord.getStartTime());
      assignmentBucketList.add(newBucket);
    }
    return assignmentBucketList;
  }

  private List<AssignmentBuckets> populateBucketsSequentially(List<Capacity> resourceCapacityToStaffList,
      int hoursAssignedSequentially) {

    List<AssignmentBuckets> assignmentBucketList = new ArrayList<>();
    for (Capacity capacityRecord : resourceCapacityToStaffList) {
      if (hoursAssignedSequentially <= 0)
        break;
      AssignmentBuckets newBucket = AssignmentBuckets.create();
      newBucket.setBookedCapacityInMinutes(hoursToMinutes(hoursAssignedSequentially-- > 0 ? 1 : 0));
      newBucket.setId(UUID.randomUUID().toString());
      newBucket.setStartTime(capacityRecord.getStartTime());
      assignmentBucketList.add(newBucket);
    }
    return assignmentBucketList;
  }

  public List<Capacity> getFilteredCapacityList(List<Capacity> resourceCapacityList,
      Instant requestCapacityRequirementStartTime, Instant requestCapacityRequirementEndTime) {

    List<Capacity> filteredCapacityList = new ArrayList<>();

    boolean atLeastOneMatchingCapacityFound = false;

    for (int i = 0; i < resourceCapacityList.size(); i++) {
      Capacity resourceCapacityEntry = resourceCapacityList.get(i);
      Instant resourceCapacityStartTime = resourceCapacityEntry.getStartTime();

      if (resourceCapacityStartTime.compareTo(requestCapacityRequirementStartTime) >= 0
          && resourceCapacityStartTime.compareTo(requestCapacityRequirementEndTime) < 0) {
        atLeastOneMatchingCapacityFound = true;
        Capacity capacityRecord = Capacity.create();
        capacityRecord.setStartTime(resourceCapacityStartTime);
        capacityRecord.setWorkingTimeInMinutes(resourceCapacityEntry.getWorkingTimeInMinutes());
        filteredCapacityList.add(capacityRecord);
      } else if (atLeastOneMatchingCapacityFound) {
        break;
      }
    }
    return filteredCapacityList;
  }

  public List<AssignmentBuckets> getDistributionFromReferenceAssignment(String referenceAssignment) {

    List<AssignmentBuckets> assignmentBuckets = new ArrayList<>();

    // Check if there's an existing draft already...
    try {
      assignmentservice.Assignments draftAssignment = dataProvider.getAssignmentHeaderDraft(referenceAssignment);

      if (draftAssignment != null) {

        // If there is an existing draft, that will be given a higher preference. (so
        // that we are copying the changes as well)
        List<AssignmentBuckets> draftBuckets = dataProvider.getAssignmentBucketsDraft(referenceAssignment);

        for (AssignmentBuckets draftBucket : draftBuckets) {

          AssignmentBuckets newBucket = AssignmentBuckets.create();
          newBucket.setBookedCapacityInMinutes(draftBucket.getBookedCapacityInMinutes());
          newBucket.setId(UUID.randomUUID().toString());
          newBucket.setStartTime(draftBucket.getStartTime());
          assignmentBuckets.add(newBucket);
        }

      }
    } catch (EmptyResultException e) {

      // Copy the distribution from the original active assignment
      List<com.sap.resourcemanagement.assignment.AssignmentBuckets> referenceAssignmentBuckets = dataProvider
          .getAssignmentBuckets(referenceAssignment);

      if (!referenceAssignmentBuckets.isEmpty()) {

        for (com.sap.resourcemanagement.assignment.AssignmentBuckets assignmentBucket : referenceAssignmentBuckets) {

          AssignmentBuckets newBucket = AssignmentBuckets.create();
          newBucket.setBookedCapacityInMinutes(assignmentBucket.getBookedCapacityInMinutes());
          newBucket.setId(UUID.randomUUID().toString());
          newBucket.setStartTime(assignmentBucket.getStartTime());
          assignmentBuckets.add(newBucket);

        }
      }
    }

    return assignmentBuckets;

  }

  public List<AssignmentBuckets> fillTheMissingBucketsOnCreate(String assignmentID,
      List<AssignmentBuckets> assignmentBuckets, Instant requestStartTime, Instant requestEndTime, String resourceID) {

    // While we can return 0 distribution where there is no actual bucket using CDS
    // magic on load,
    // we need a way to return these 0 entries in case of create, copy, cut
    // scenarios where there
    // can be pockets within the permitted period (read request validity) where the
    // distribution is
    // zero.

    List<Capacity> resourceCapacityList = dataProvider.getResourceCapacities(resourceID, requestStartTime,
        requestEndTime);

    for (int i = 0; i < resourceCapacityList.size(); i++) {

      Capacity resourceCapacityEntry = resourceCapacityList.get(i);

      AssignmentBuckets bucket = assignmentBuckets.stream()
          .filter(assignmentBucket -> resourceCapacityEntry.getStartTime().equals(assignmentBucket.getStartTime()))
          .findAny().orElse(null);

      if (bucket == null) {

        // Resource is available and in the period of the request, but no bucket exists,
        // add one!
        AssignmentBuckets newBucket = AssignmentBuckets.create();
        newBucket.setBookedCapacityInMinutes(0);
        newBucket.setAssignmentId(assignmentID);
        newBucket.setStartTime(resourceCapacityEntry.getStartTime());
        assignmentBuckets.add(newBucket);

      }
    }

    return assignmentBuckets;

  }

  public int getAssignmentStatusCode(Integer sentAssignmentStatusCode, String referenceAssignment) {

    int assignmentStatusCode = sentAssignmentStatusCode == null ? 0 : sentAssignmentStatusCode.intValue();

    if (referenceAssignment != null) {

      try {

        Assignments referenceAssignmentHeaderDraft = dataProvider.getAssignmentHeaderDraft(referenceAssignment);

        assignmentStatusCode = referenceAssignmentHeaderDraft.getAssignmentStatusCode().intValue();

      } catch (EmptyResultException e) {

        Optional<com.sap.resourcemanagement.assignment.Assignments> referenceAssignmentHeader = dataProvider
            .getAssignmentHeader(referenceAssignment);

        if (referenceAssignmentHeader.isPresent()) {

          assignmentStatusCode = referenceAssignmentHeader.get().getAssignmentStatusCode().intValue();

        }

      }

    }

    return assignmentStatusCode;

  }

  public List<AssignmentBucketsPerDay> prepareAssignmentBucketsPerDayResult(
      List<AssignmentBuckets> sortedAssignmentBuckets, LocalDate gridStartDate, LocalDate gridEndDate) {

    // Returns the buckets in the required format between the grid start and end

    List<AssignmentBucketsPerDay> assignmentBucketsPerDayResult = new ArrayList<>();

    for (AssignmentBuckets assignmentBucket : sortedAssignmentBuckets) {

      LocalDate bucketStartDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();

      if (bucketStartDate.isBefore(gridStartDate) || bucketStartDate.isAfter(gridEndDate)) {
        continue;
      }

      AssignmentBucketsPerDay assignmentBucketsPerDay = AssignmentBucketsPerDay.create();

      // Set the assingment ID
      assignmentBucketsPerDay.setAssignmentId(assignmentBucket.getAssignmentId());

      // Time period is a key. Let's fill that too
      assignmentBucketsPerDay.setTimePeriod(bucketStartDate.toString());

      // Onto other fields
      assignmentBucketsPerDay.setDate(bucketStartDate);

      // Get the booked capacity in hours
      assignmentBucketsPerDay.setBookedCapacityInHours(minutesToHours(assignmentBucket.getBookedCapacityInMinutes()));

      assignmentBucketsPerDayResult.add(assignmentBucketsPerDay);

    }

    return assignmentBucketsPerDayResult;

  }

  public List<AssignmentBucketsYearWeekAggregate> prepareAssignmentBucketsYearWeekResult(
      List<AssignmentBuckets> assignmentBuckets, LocalDate gridStartDate, LocalDate gridEndDate) {

    AssignmentBucketsYearWeekAggregate assignmentBucketsYearWeekAggregate;
    String newTimePeriod;
    String previousTimePeriod = INITIAL_TIME_PERIOD;
    Integer totalBookedCapacityInMinutes = 0;
    LocalDate startDate = LocalDate.parse(INITIAL_YEAR_DATE);
    LocalDate endDate = LocalDate.parse(INITIAL_YEAR_DATE);
    boolean pendingRecord = false;
    String assignmentID = null;

    List<AssignmentBucketsYearWeekAggregate> assignmentYearWeekAggregateResult = new ArrayList<>();

    for (AssignmentBuckets assignmentBucket : assignmentBuckets) {

      LocalDate bucketStartDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();

      if (bucketStartDate.isBefore(gridStartDate) || bucketStartDate.isAfter(gridEndDate)) {
        continue;
      }

      assignmentBucketsYearWeekAggregate = AssignmentBucketsYearWeekAggregate.create();

      // Set the assingment ID
      assignmentBucketsYearWeekAggregate.setAssignmentId(assignmentBucket.getAssignmentId());

      // Time period is yearweek in case of weeklyaggregation
      int yearWeek = bucketStartDate.get(WeekFields.ISO.weekOfWeekBasedYear()); // *******Review: Is the use of ISO
                                                                                // correct here?
      int year = bucketStartDate.get(WeekFields.ISO.weekBasedYear());

      newTimePeriod = Integer.toString(year) + Integer.toString(yearWeek);
      if (previousTimePeriod.equals(INITIAL_TIME_PERIOD)) {
        previousTimePeriod = newTimePeriod;
        startDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();
      }

      if (newTimePeriod.equals(previousTimePeriod)) {

        totalBookedCapacityInMinutes += assignmentBucket.getBookedCapacityInMinutes();
        endDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();
        assignmentID = assignmentBucket.getAssignmentId();
        pendingRecord = true;

      } else {

        assignmentBucketsYearWeekAggregate.setTimePeriod(previousTimePeriod);

        // Set the start and end date
        assignmentBucketsYearWeekAggregate.setStartDate(startDate);
        assignmentBucketsYearWeekAggregate.setEndDate(endDate);
        // Get the booked capacity in hours
        assignmentBucketsYearWeekAggregate.setBookedCapacityInHours(minutesToHours(totalBookedCapacityInMinutes));

        assignmentYearWeekAggregateResult.add(assignmentBucketsYearWeekAggregate);

        // For the next iteration
        previousTimePeriod = newTimePeriod;
        totalBookedCapacityInMinutes = assignmentBucket.getBookedCapacityInMinutes();
        startDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();
        endDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();

      }

    }

    // For the final record...
    if (pendingRecord) {
      assignmentBucketsYearWeekAggregate = AssignmentBucketsYearWeekAggregate.create();
      assignmentBucketsYearWeekAggregate.setAssignmentId(assignmentID);
      assignmentBucketsYearWeekAggregate.setTimePeriod(previousTimePeriod);
      assignmentBucketsYearWeekAggregate.setStartDate(startDate);
      assignmentBucketsYearWeekAggregate.setEndDate(endDate); // Review: This may not be the last date of the week
                                                              // itself,
                                                              // check if that is correct?
      assignmentBucketsYearWeekAggregate.setBookedCapacityInHours(minutesToHours(totalBookedCapacityInMinutes));
      assignmentYearWeekAggregateResult.add(assignmentBucketsYearWeekAggregate);
    }

    return assignmentYearWeekAggregateResult;

  }

  public List<AssignmentBucketsYearMonthAggregate> prepareAssignmentBucketsYearMonthResult(
      List<AssignmentBuckets> assignmentBuckets, LocalDate gridStartDate, LocalDate gridEndDate) {

    AssignmentBucketsYearMonthAggregate assignmentBucketsYearMonthAggregate;
    String newTimePeriod;
    String previousTimePeriod = INITIAL_TIME_PERIOD;
    Integer totalBookedCapacityInMinutes = 0;
    LocalDate startDate = LocalDate.parse(INITIAL_YEAR_DATE);
    LocalDate endDate = LocalDate.parse(INITIAL_YEAR_DATE);
    boolean pendingRecord = false;
    String assignmentID = null;

    List<AssignmentBucketsYearMonthAggregate> assignmentYearMonthAggregateResult = new ArrayList<>();

    for (AssignmentBuckets assignmentBucket : assignmentBuckets) {

      LocalDate bucketStartDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();

      if (bucketStartDate.isBefore(gridStartDate) || bucketStartDate.isAfter(gridEndDate)) {
        continue;
      }

      assignmentBucketsYearMonthAggregate = AssignmentBucketsYearMonthAggregate.create();

      // Set the assingment ID
      assignmentBucketsYearMonthAggregate.setAssignmentId(assignmentBucket.getAssignmentId());

      // Time period is yearmonth in case of monthlyaggregation
      YearMonth currYearMonth = YearMonth.from(bucketStartDate);
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMM");

      newTimePeriod = formatter.format(currYearMonth);

      if (previousTimePeriod.equals(INITIAL_TIME_PERIOD)) {
        previousTimePeriod = newTimePeriod;
        startDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();
      }

      if (newTimePeriod.equals(previousTimePeriod)) {

        totalBookedCapacityInMinutes += assignmentBucket.getBookedCapacityInMinutes();
        endDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();
        assignmentID = assignmentBucket.getAssignmentId();
        pendingRecord = true;

      } else {

        assignmentBucketsYearMonthAggregate.setTimePeriod(previousTimePeriod);

        // Set the start and end date
        assignmentBucketsYearMonthAggregate.setStartDate(startDate);
        assignmentBucketsYearMonthAggregate.setEndDate(endDate);
        // Get the booked capacity in hours
        assignmentBucketsYearMonthAggregate.setBookedCapacityInHours(minutesToHours(totalBookedCapacityInMinutes));

        assignmentYearMonthAggregateResult.add(assignmentBucketsYearMonthAggregate);

        // For the next iteration
        previousTimePeriod = newTimePeriod;
        totalBookedCapacityInMinutes = assignmentBucket.getBookedCapacityInMinutes();
        startDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();
        endDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();

      }

    }

    // For the final record...
    if (pendingRecord) {
      assignmentBucketsYearMonthAggregate = AssignmentBucketsYearMonthAggregate.create();
      assignmentBucketsYearMonthAggregate.setAssignmentId(assignmentID);
      assignmentBucketsYearMonthAggregate.setTimePeriod(previousTimePeriod);
      assignmentBucketsYearMonthAggregate.setStartDate(startDate);
      assignmentBucketsYearMonthAggregate.setEndDate(endDate); // Review: This may not be the last date of the month
                                                               // itself,
                                                               // check if that is correct?
      assignmentBucketsYearMonthAggregate.setBookedCapacityInHours(minutesToHours(totalBookedCapacityInMinutes));

      assignmentYearMonthAggregateResult.add(assignmentBucketsYearMonthAggregate);
    }

    return assignmentYearMonthAggregateResult;
  }

  public Map<String, LocalDate> getHeaderDatesFromBuckets(List<AssignmentBuckets> assignmentBuckets) {

    LocalDate startDate = LocalDate.parse("9999-01-01");
    LocalDate endDate = LocalDate.parse("1800-01-01");
    Map<String, LocalDate> result = new HashMap<>();

    for (AssignmentBuckets assignmentBucket : assignmentBuckets) {

      if (startDate.isAfter(assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate()))
        startDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();
      if (endDate.isBefore(assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate()))
        endDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();
    }

    result.put(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_START_DATE, startDate);
    result.put(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_END_DATE, endDate);

    return result;

  }

}