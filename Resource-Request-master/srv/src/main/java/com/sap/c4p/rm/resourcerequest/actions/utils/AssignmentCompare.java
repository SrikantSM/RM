package com.sap.c4p.rm.resourcerequest.actions.utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;

public class AssignmentCompare {

  private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentCompare.class);
  private static final Marker CHANGE_ASSIGNMENT_MARKER = LoggingMarker.CHANGE_ASSIGNMENT.getMarker();

  private static final String START_TIME = "startTime";
  private static final String ASSIGNMENT_BUCKETS = "assignmentBuckets";
  private static final String ASSIGNMENT_ID = "assignment_ID";
  private static final String ID = "ID";

  public JSONObject compareForAssigmentChange(String assignmentId, final JSONObject oldAssignment,
      final JSONObject simulatedAssignment) {

    LOGGER.debug(CHANGE_ASSIGNMENT_MARKER, "Entered method compareForAssignmentChange in class Assignment Compare");

    JSONObject simulatedAssignmentSingleBucket;
    JSONObject oldAssignmentSingleBucket;
    String simulatedAssignmentSingleBucketStartDateString;
    String oldAssignmentId;
    String oldAssignmentDate;
    LocalDate simulatedAssignmentSingleBucketStartDate;
    JSONArray changedAssignmentBuckets = new JSONArray();

    // Get the simulated assignment buckets
    JSONArray simulatedAssignmentBuckets = simulatedAssignment.getJSONArray(ASSIGNMENT_BUCKETS);

    // Get the old assignment buckets start and end date
    JSONArray oldAssignmentBuckets = oldAssignment.getJSONArray(ASSIGNMENT_BUCKETS);

    int firstElement = 0;
    int lastElement = oldAssignmentBuckets.length() - 1;

    // Get the first and last assignment bucket
    JSONObject firstOldAssignmentBucket = (JSONObject) oldAssignmentBuckets.get(firstElement);
    JSONObject lastOldAssignmentBucket = (JSONObject) oldAssignmentBuckets.get(lastElement);

    LOGGER.debug(
        "First assignment bucket : {}, while last assignment bucket : {}. Here the assumption is that the buckets will be sorted",
        firstOldAssignmentBucket, lastOldAssignmentBucket);

    // Get the old assignment start and end dates. Convert from String to LocalDate
    // format
    final String oldAssignmentStartDateString = (String) firstOldAssignmentBucket.get(START_TIME);
    final LocalDate oldAssignmentStartDate = LocalDate.parse(oldAssignmentStartDateString,
        DateTimeFormatter.ISO_DATE_TIME);
    final String oldAssignmentEndDateString = (String) lastOldAssignmentBucket.get(START_TIME);
    final LocalDate oldAssignmentEndDate = LocalDate.parse(oldAssignmentEndDateString, DateTimeFormatter.ISO_DATE_TIME);

    LOGGER.debug("Start date: {} and end date: {}", oldAssignmentStartDateString, oldAssignmentEndDateString);

    // Create a map of old Assignments date and IDs. This will be needed to update
    // the assignmentBuckets
    HashMap<LocalDate, String> oldAssignmentsDateMap = new HashMap<>();
    for (int i = 0; i < oldAssignmentBuckets.length(); i++) {
      oldAssignmentSingleBucket = (JSONObject) oldAssignmentBuckets.get(i);

      // Get the start time in String format
      oldAssignmentDate = (String) oldAssignmentSingleBucket.get(START_TIME);

      // Update the map with new entry
      oldAssignmentsDateMap.put(LocalDate.parse(oldAssignmentDate, DateTimeFormatter.ISO_DATE_TIME),
          (String) oldAssignmentSingleBucket.get("ID"));
    }

    // Loop through the simulated buckets and update the assignment buckets IDs
    for (int i = 0; i < simulatedAssignmentBuckets.length(); i++) {

      // Get the simulated Assignment Bucket
      simulatedAssignmentSingleBucket = (JSONObject) simulatedAssignmentBuckets.get(i);

      // Remove IsActiveEntity, HasActiveEntity and HasDraftEntity fields from
      // Assignment Buckets
      // Since we are directly working with active-entities as a result these fields
      // can be removed
      simulatedAssignmentSingleBucket.remove("IsActiveEntity");
      simulatedAssignmentSingleBucket.remove("HasActiveEntity");
      simulatedAssignmentSingleBucket.remove("HasDraftEntity");

      // Update the assignment_ID field for all new buckets
      simulatedAssignmentSingleBucket.put(ASSIGNMENT_ID, assignmentId);

      // Get the start time date
      simulatedAssignmentSingleBucketStartDateString = (String) simulatedAssignmentSingleBucket.get(START_TIME);
      simulatedAssignmentSingleBucketStartDate = LocalDate.parse(simulatedAssignmentSingleBucketStartDateString,
          DateTimeFormatter.ISO_DATE_TIME);

      // Check whether the bucket under consideration is an update
      if ((simulatedAssignmentSingleBucketStartDate.isAfter(oldAssignmentStartDate)
          && simulatedAssignmentSingleBucketStartDate.isBefore(oldAssignmentEndDate))
          || simulatedAssignmentSingleBucketStartDate.isEqual(oldAssignmentStartDate)
          || simulatedAssignmentSingleBucketStartDate.isEqual(oldAssignmentEndDate)) {

        LOGGER.debug("Assignment bucket for date : {} will be updated with new values",
            simulatedAssignmentSingleBucketStartDateString);

        oldAssignmentId = oldAssignmentsDateMap.get(simulatedAssignmentSingleBucketStartDate);
        // Update the simulated Assignment Buckets with old Assignment ID
        if (oldAssignmentId != null) {
          simulatedAssignmentSingleBucket.put(ID, oldAssignmentId);
        }
      }

      // Add the bucket into new array
      changedAssignmentBuckets.put(simulatedAssignmentSingleBucket);

    }

    // Update the header ID of simulated buckets with existing assignment ID
    simulatedAssignment.put(ID, assignmentId);

    // Remove IsActiveEntity, HasActiveEntity and HasDraftEntity fields from
    // Assignment Header
    // Since we are directly working with active-entities as a result these fields
    // can be removed
    simulatedAssignment.remove("IsActiveEntity");
    simulatedAssignment.remove("HasActiveEntity");
    simulatedAssignment.remove("HasDraftEntity");

    LOGGER.debug(CHANGE_ASSIGNMENT_MARKER,
        "Successfully completed processing compareForAssignmentChange in class Assignment Compare");
    // Add the child buckets to header and return the object
    return simulatedAssignment.put(ASSIGNMENT_BUCKETS, changedAssignmentBuckets);

  }

}