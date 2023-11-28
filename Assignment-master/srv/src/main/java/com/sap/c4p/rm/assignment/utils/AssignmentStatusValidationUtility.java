package com.sap.c4p.rm.assignment.utils;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.enums.AssignmentStatus;
import com.sap.c4p.rm.assignment.gen.MessageKeys;

public class AssignmentStatusValidationUtility {

  private AssignmentStatusValidationUtility() {
    // Add a private constructor to hide the implicit public one.
    throw new IllegalStateException("Utility class");
  }

  public static void validateAssignmentStatusChange(int existingStatus, int statusToBeUpdatedTo, Messages messages) {

    /* Check that the status(to be updated) itself is a valid one or not */
    if (!isValidAssignmentStatus(statusToBeUpdatedTo, messages)) {
      return;
    }

    if (existingStatus == AssignmentStatus.REJECTED.getCode()) {
      // Rejected assignment can only be deleted. No status transition allowed.
      Optional.ofNullable(messages)
          .ifPresent(message -> message.error(MessageKeys.ASSIGNMENT_STATUS_CHANGE_FOR_REJECTED_NOT_ALLOWED));
      return;
    }

    /* If status remains unchanged then nothing to do */
    if (existingStatus == statusToBeUpdatedTo) {
      return;
    }

    /*
     * Status transition checks - NOTE: flow will reach here if status to be updated
     * is different from existing status
     */
    if (existingStatus == AssignmentStatus.HARDBOOKED.getCode()) {
      // From hard-booked, not possible to transition to any other status (so far)
      Optional.ofNullable(messages)
          .ifPresent(message -> message.error(MessageKeys.ASSIGNMENT_STATUS_CHANGE_FOR_HARDBOOKED_NOT_ALLOWED));
      return;
    }

    if (existingStatus == AssignmentStatus.SOFTBOOKED.getCode()) {
      // From soft-booked we can only go to hard-booked
      if (statusToBeUpdatedTo != AssignmentStatus.HARDBOOKED.getCode()) {
        Optional.ofNullable(messages).ifPresent(message -> message.error(MessageKeys.SOFTBOOKED_TO_HARDBOOKED_ONLY));
      }
      return;
    }

    if (existingStatus == AssignmentStatus.PROPOSED.getCode()) {
      // From proposed we can only go to Accepted or Rejected
      if (!(statusToBeUpdatedTo == AssignmentStatus.ACCEPTED.getCode()
          || statusToBeUpdatedTo == AssignmentStatus.REJECTED.getCode())) {
        Optional.ofNullable(messages)
            .ifPresent(message -> message.error(MessageKeys.ONLY_ACCEPTED_REJECTED_ALLOWED_FOR_PROPOSED));
      }
      return;
    }

    if (existingStatus == AssignmentStatus.ACCEPTED.getCode()) {
      // Can only "Soft/Hard book" an Accepted assignment
      if (!(statusToBeUpdatedTo == AssignmentStatus.SOFTBOOKED.getCode()
          || statusToBeUpdatedTo == AssignmentStatus.HARDBOOKED.getCode())) {
        Optional.ofNullable(messages)
            .ifPresent(message -> message.error(MessageKeys.ONLY_HARD_SOFT_BOOKED_ALLOWED_FOR_ACCEPTED));
      }
    }

  }

  public static boolean isValidAssignmentStatus(int assignmentStatusCode, Messages messages) {
    Set<Integer> validAssignmentStatusSet = Stream.of(AssignmentStatus.values()).map(AssignmentStatus::getCode)
        .collect(Collectors.toCollection(HashSet::new));
    if (!validAssignmentStatusSet.contains(assignmentStatusCode)) {
      Optional.ofNullable(messages).ifPresent(message -> message.error((MessageKeys.INVALID_ASSIGNMENT_STATUS_CODE)));
      return false;
    }
    return true;
  }

}
