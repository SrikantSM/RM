package com.sap.c4p.rm.assignment.utils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Message.Severity;
import com.sap.cds.services.messages.Messages;

import assignment.Assignments;
import assignmentservice.AssignmentBuckets;

public class AssignmentUtility {

  private static final int NUMBER_OF_MINUTES_IN_ONE_HOUR = 60;
  private static Map<String, Boolean> editDraftMap = new HashMap<>();

  private AssignmentUtility() {
    // meant only for pure static behavior
  }

  public static int hoursToMinutes(int numOfHours) {
    return numOfHours * NUMBER_OF_MINUTES_IN_ONE_HOUR;
  }

  public static int minutesToHours(int numOfMinutes) {
    return numOfMinutes / NUMBER_OF_MINUTES_IN_ONE_HOUR;
  }

  public static boolean isEditDraft(String assignmentId) {
    return editDraftMap.getOrDefault(assignmentId, false);
  }

  public static void setEditDraft(String assignmentId) {
    editDraftMap.put(assignmentId, true);
  }

  public static void raiseExceptionIfError(Messages messages) {
    messages.stream().filter(message -> message.getSeverity() == Severity.ERROR).findFirst().ifPresent(errorMessage -> {
      throw new ServiceException(HttpStatus.BAD_REQUEST, errorMessage.getMessage());
    });
  }

  public static void addTarget(Messages messages, String target) {
    messages.stream().forEach(message -> message.target(target));
  }

  public static void raiseExceptionIfErrorWithTarget(Messages messages, String target) {

    addTarget(messages, target);
    messages.throwIfError();

  }

  public static Instant getInstantObjectFromDateString(final String date) {
    return LocalDate.parse(date).atStartOfDay().toInstant(ZoneOffset.UTC);
  }

  public static Map<String, LocalDate> getHeaderDates(List<AssignmentBuckets> assignmentBuckets) {

    LocalDate startDate = LocalDate.parse("9999-01-01");
    LocalDate endDate = LocalDate.parse("1800-01-01");
    Map<String, LocalDate> result = new HashMap<>();

    for (AssignmentBuckets assignmentBucket : assignmentBuckets) {

      if (startDate.isAfter(assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate()))
        startDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();
      if (endDate.isBefore(assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate()))
        endDate = assignmentBucket.getStartTime().atZone(ZoneOffset.UTC).toLocalDate();
    }

    result.put(Assignments.START_DATE, startDate);
    result.put(Assignments.END_DATE, endDate);

    return result;
  }

  public static String getNumberStateForUtilizationValue(int totalAvgUtilPercentage) {
    if (totalAvgUtilPercentage < 70 || totalAvgUtilPercentage > 120) {
      return "Negative"; // Red, Error
    } else if (totalAvgUtilPercentage >= 80 && totalAvgUtilPercentage <= 110) {
      return "Positive"; // Green, Success
    }
    return "Critical"; // Orange, Warning
  }

  public static LocalDate[] getStartAndEndDateForCalendarMonth(String calendarMonth) {
    String year = calendarMonth.substring(0, 4);
    String month = calendarMonth.substring(4);
    YearMonth yearMonth = YearMonth.of(Integer.parseInt(year), Integer.parseInt(month));
    LocalDate monthStartDate = yearMonth.atDay(1);
    LocalDate monthEndDate = yearMonth.atEndOfMonth();
    return new LocalDate[] { monthStartDate, monthEndDate };
  }

}
