package com.sap.c4p.rm.assignment.validation;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
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
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

import assignmentservice.SimulateAssignmentAsRequestedContext;

@Component
public class AssignmentAsRequestedValidator implements Validator {

  private static final String INSERT_MODE = "I";

  private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentAsRequestedValidator.class);
  private static final Marker ASSIGNMENTASREQUESTED_SIMULATION_VALIDATOR_MARKER = LoggingMarker.ASSIGNMENTASREQUESTED_SIMULATION_VALIDATOR_MARKER
      .getMarker();
  private Messages messages;
  private AssignmentValidator validator;
  private DataProvider dataProvider;

  @Autowired
  public AssignmentAsRequestedValidator(Messages messages, AssignmentValidator validator, DataProvider dataProvider) {
    this.messages = messages;
    this.validator = validator;
    this.dataProvider = dataProvider;
  }

  public Messages validate(EventContext context) {

    String resourceRequestId = context.get(SimulateAssignmentAsRequestedContext.RESOURCE_REQUEST_ID).toString();
    if (resourceRequestId.isEmpty()) {
      LOGGER.error(ASSIGNMENTASREQUESTED_SIMULATION_VALIDATOR_MARKER, "Resource request ID is empty");
      messages.error(MessageKeys.REQUEST_ID_NULL);
    }

    validator.validateResourceRequestStatuses(resourceRequestId);

    String resourceId = context.get(SimulateAssignmentAsRequestedContext.RESOURCE_ID).toString();
    if (resourceId.isEmpty()) {
      LOGGER.error(ASSIGNMENTASREQUESTED_SIMULATION_VALIDATOR_MARKER, "Resource Id is empty");
      messages.error(MessageKeys.RESOURCE_ID_NULL);
    }

    Optional<Assignments> existingAssignment = dataProvider.getAssignmentForResourceAndRequest(resourceId,
        resourceRequestId);
    String mode = context.get(SimulateAssignmentAsRequestedContext.MODE).toString();
    if (mode.equals(INSERT_MODE) && existingAssignment.isPresent()) {
      LOGGER.warn(ASSIGNMENTASREQUESTED_SIMULATION_VALIDATOR_MARKER,
          "Simulation was run for create assignment, However there is an existing assignment between request and resource");
      messages.error(MessageKeys.ASSIGNMENT_EXISTS_FOR_RES_AND_REQ);
    }

    Optional<ResourceRequests> resourceRequest = dataProvider.getRequestData(resourceRequestId);
    if (resourceRequest.isPresent()) {
      Instant requestStart = resourceRequest.get().getStartDate().atStartOfDay().toInstant(ZoneOffset.UTC);
      Instant requestEnd = resourceRequest.get().getEndDate().atStartOfDay().toInstant(ZoneOffset.UTC);
      LOGGER.debug(ASSIGNMENTASREQUESTED_SIMULATION_VALIDATOR_MARKER, "Request start date:{} and request end date:{}",
          requestStart, requestEnd);
      validator.validateResourceAvailability(resourceId, requestStart, requestEnd);
    }

    List<CapacityRequirements> requestCapacityRequirementList = dataProvider
        .getRequestCapacityRequirements(resourceRequestId);
    if (requestCapacityRequirementList.isEmpty()) {
      messages.error(MessageKeys.MISSING_REQUEST_CAPACITY_REQUIREMENT);
    }

    return messages;
  }

}