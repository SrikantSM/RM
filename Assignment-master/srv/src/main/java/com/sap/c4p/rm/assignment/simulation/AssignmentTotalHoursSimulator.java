package com.sap.c4p.rm.assignment.simulation;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.EventContext;

import com.sap.c4p.rm.assignment.config.LoggingMarker;
import com.sap.c4p.rm.assignment.utils.AssignmentSimulationUtility;
import com.sap.c4p.rm.assignment.utils.AssignmentUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;

import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Types;

import assignmentservice.AssignmentBuckets;
import assignmentservice.SimulateAsgBasedOnTotalHoursContext;

@Component
public class AssignmentTotalHoursSimulator implements AssignmentSimulator {
  private AssignmentSimulationUtility utility;
  List<Capacity> resourceCapacityList;

  private DataProvider dataProvider;

  private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentTotalHoursSimulator.class);
  private static final Marker SIMULATION_MARKER = LoggingMarker.SIMULATION_MARKER.getMarker();

  @Autowired
  public AssignmentTotalHoursSimulator(AssignmentSimulationUtility utility, DataProvider dataProvider) {
    this.utility = utility;
    this.dataProvider = dataProvider;
  }

  @Override
  public List<AssignmentBuckets> getDistributedAssignmentRecords(final EventContext context) {
    LOGGER.debug(SIMULATION_MARKER,
        "Entered method getDistributedAssignmentRecords of class AssignmentTotalHoursSimulator");

    LOGGER.info(SIMULATION_MARKER, "All the validations were successful!");

    Instant assignedStart = null;
    Instant assignedEnd = null;

    String resourceId = context.get(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID).toString();

    try {
      assignedStart = AssignmentUtility
          .getInstantObjectFromDateString(context.get(SimulateAsgBasedOnTotalHoursContext.START).toString());
      assignedEnd = AssignmentUtility
          .getInstantObjectFromDateString(context.get(SimulateAsgBasedOnTotalHoursContext.END).toString());
    } catch (DateTimeParseException e) {
      LOGGER.warn(SIMULATION_MARKER, "Error while parsing the dates: StartDate - {}, EndDate - {}",
          context.get(SimulateAsgBasedOnTotalHoursContext.START), context.get(SimulateAsgBasedOnTotalHoursContext.END));
    }

    if (assignedStart == null || assignedEnd == null)
      return Collections.emptyList();

    resourceCapacityList = dataProvider.getResourceCapacities(resourceId, assignedStart, assignedEnd);

    int hoursToStaff = 0;
    try {
      hoursToStaff = Integer.parseInt(context.get(SimulateAsgBasedOnTotalHoursContext.DURATION).toString());
    } catch (NumberFormatException e) {
      LOGGER.error("Could not parse entered duration value.");
    }

    Optional<Types> resourceBookingGranularityInMinutes = dataProvider
        .getResourceBookingGranularityInMinutes(resourceId);
    if (resourceBookingGranularityInMinutes.isPresent()) {
      return (utility.getDistributedAssignmentBuckets(
          resourceBookingGranularityInMinutes.get().getBookingGranularityInMinutes(), hoursToStaff,
          resourceCapacityList));
    } else {
      return Collections.emptyList();
    }

  }

}