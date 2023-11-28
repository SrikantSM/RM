package com.sap.c4p.rm.assignment.validation;

import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.hoursToMinutes;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.config.LoggingMarker;
import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.DataProvider;

import com.sap.resourcemanagement.assignment.Assignments;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

import assignmentservice.SimulateAsgBasedOnTotalHoursContext;

@Component
public class AssignmentTotalHoursValidator implements Validator {

  private static final String INSERT_MODE = "I";
  private static final String CHANGE_MODE = "C";

  private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentTotalHoursValidator.class);
  private static final Marker TOTALHOURS_VALIDATOR = LoggingMarker.TOTALHOURS_VALIDATOR.getMarker();

  private Messages messages;
  private AssignmentValidator validator;
  private DataProvider dataProvider;

  @Autowired
  public AssignmentTotalHoursValidator(Messages messages, AssignmentValidator validator, DataProvider dataProvider) {
    this.messages = messages;
    this.validator = validator;
    this.dataProvider = dataProvider;
  }

  public Messages validate(EventContext context) {

    String resourceRequestId = context.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_REQUEST_ID).toString();
    if (resourceRequestId.isEmpty()) {
      LOGGER.error(TOTALHOURS_VALIDATOR, "Resource request ID is empty");
      messages.error(MessageKeys.REQUEST_ID_NULL);
    }

    validator.validateResourceRequestStatuses(resourceRequestId);
    validator.validateAssignmentStatus(
        Integer.parseInt(context.get(SimulateAsgBasedOnTotalHoursContext.ASSIGNMENT_STATUS_CODE).toString()));

    String resourceId = context.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID).toString();
    if (resourceId.isEmpty()) {
      LOGGER.error(TOTALHOURS_VALIDATOR, "Resource Id is empty");
      messages.error(MessageKeys.RESOURCE_ID_NULL);
    }
    Instant assignedStart = getInstantFromDateString(context.get(SimulateAsgBasedOnTotalHoursContext.START).toString());
    Instant assignedEnd = getInstantFromDateString(context.get(SimulateAsgBasedOnTotalHoursContext.END).toString());

    if (assignedStart == null || assignedEnd == null) {
      return messages;
    }

    String assignedDurationString = context.get(SimulateAsgBasedOnTotalHoursContext.DURATION).toString();

    int durationInMinutes = validateAssignedDuration(assignedDurationString);

    validateAssignedStartLessThanEnd(assignedStart, assignedEnd);

    validator.validateResourceBookingGranularity(resourceId, durationInMinutes);

    Optional<ResourceRequests> resourceRequest = dataProvider.getRequestData(resourceRequestId);
    if (resourceRequest.isPresent()) {
      validator.validateAssignedDatesAgainstRequestDates(assignedStart, assignedEnd, resourceRequest.get());
      LOGGER.debug(TOTALHOURS_VALIDATOR, "Assigned dates start:{} and end:{} lie within the request dates",
          assignedStart, assignedEnd);
    } else {
      messages.error(MessageKeys.REQUEST_NOT_FOUND);
    }

    validator.validateResourceAvailability(resourceId, assignedStart, assignedEnd);

    String mode = context.get(SimulateAsgBasedOnTotalHoursContext.MODE).toString();
    Optional<Assignments> existingAssignment = dataProvider.getAssignmentForResourceAndRequest(resourceId,
        resourceRequestId);
    if (mode.equals(INSERT_MODE) && existingAssignment.isPresent()) {
      LOGGER.error(TOTALHOURS_VALIDATOR,
          "Simulation was run for create assignment, however there is an existing assignment between request and resource.");
      messages.error(MessageKeys.ASSIGNMENT_EXISTS_FOR_RES_AND_REQ);
    } else if (mode.equals(CHANGE_MODE) && !existingAssignment.isPresent()) {
      LOGGER.info(TOTALHOURS_VALIDATOR, "Simulation was called for change assignment");
      LOGGER.warn(TOTALHOURS_VALIDATOR,
          "There is no existing assignment between request and resource. There must be an existing assignment in simulation while changing assignment");
      messages.error(MessageKeys.ASSIGNMENT_NOT_EXISTS_FOR_RES_AND_REQ);
    }
    return messages;
  }

  private int validateAssignedDuration(String durationHoursString) {
    try {
      int durationInMinutes = hoursToMinutes(Integer.parseInt(durationHoursString));
      validateAssignedDurationIsGreaterThanZero(durationInMinutes);
      return durationInMinutes;
    } catch (NumberFormatException e) {
      LOGGER.warn(TOTALHOURS_VALIDATOR, "Number format of duration is incorrect");
      messages.error(MessageKeys.REQUESTED_DURATION_INVALID);
    }
    return 0;
  }

  private Instant getInstantFromDateString(final String date) {
    LocalDateTime localDateTime = null;
    Instant instantDateTime = null;
    try {
      LocalDate localDate = LocalDate.parse(date);
      localDateTime = localDate.atStartOfDay();

    } catch (DateTimeParseException e) {
      messages.error(MessageKeys.INVALID_DATE_FORMAT, date);
    }
    if (localDateTime != null) {
      instantDateTime = localDateTime.toInstant(ZoneOffset.UTC);
    }
    return instantDateTime;
  }

  private void validateAssignedStartLessThanEnd(Instant assignedStart, Instant assignedEnd) {
    LOGGER.debug(TOTALHOURS_VALIDATOR,
        "Entered method validateAssignedStartLessThanEnd of class AssignmentTotalHoursSimulator");
    if (assignedStart.isAfter(assignedEnd)) {
      LOGGER.warn(TOTALHOURS_VALIDATOR, "Start date of simulation is after end date");
      messages.error(MessageKeys.ASSIGNED_START_NOT_LESS_THAN_END, assignedStart);
    }
  }

  private void validateAssignedDurationIsGreaterThanZero(int assignedDuration) {
    LOGGER.debug(TOTALHOURS_VALIDATOR,
        "Entered method validateAssignedDurationIsGreaterThanZero of class AssignmentTotalHoursSimulator");
    if (assignedDuration <= 0) {
      LOGGER.warn(TOTALHOURS_VALIDATOR, "Duration value for simulation is zero or negative");
      messages.error(MessageKeys.REQUESTED_DURATION_INVALID, assignedDuration);
    }
  }

}