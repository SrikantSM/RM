package com.sap.c4p.rm.assignment.simulation;

import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.minutesToHours;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
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
import com.sap.c4p.rm.assignment.utils.AssignmentSimulationUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;

import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Types;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

import assignmentservice.AssignmentBuckets;
import assignmentservice.SimulateAssignmentAsRequestedContext;

@Component
public class AssignmentAsRequestedSimulator implements AssignmentSimulator {

  private AssignmentSimulationUtility utility;
  List<Capacity> resourceCapacityList;
  List<CapacityRequirements> requestCapacityRequirementList;

  private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentAsRequestedSimulator.class);
  private static final Marker SIMULATION_MARKER = LoggingMarker.SIMULATION_MARKER.getMarker();

  private DataProvider dataProvider;
  private Messages messages;

  @Autowired
  public AssignmentAsRequestedSimulator(AssignmentSimulationUtility utility, DataProvider dataProvider,
      Messages messages) {
    this.dataProvider = dataProvider;
    this.utility = utility;
    this.messages = messages;
  }

  @Override
  public List<AssignmentBuckets> getDistributedAssignmentRecords(final EventContext context) {
    LOGGER.debug(SIMULATION_MARKER,
        "Entered method getDistributedAssignmentRecords of class AssignmentAsRequestedSimulator");

    LOGGER.info(SIMULATION_MARKER, "All the validations were successful!");

    String resourceRequestId = context.get(SimulateAssignmentAsRequestedContext.RESOURCE_REQUEST_ID).toString();
    String resourceId = context.get(SimulateAssignmentAsRequestedContext.RESOURCE_ID).toString();

    List<AssignmentBuckets> assignmentBuckets = new ArrayList<>();

    Optional<ResourceRequests> resourceRequest = dataProvider.getRequestData(resourceRequestId);
    if (resourceRequest.isPresent()) {
      Instant requestStart = resourceRequest.get().getStartDate().atStartOfDay().toInstant(ZoneOffset.UTC);
      Instant requestEnd = resourceRequest.get().getEndDate().atStartOfDay().toInstant(ZoneOffset.UTC);
      resourceCapacityList = dataProvider.getResourceCapacities(resourceId, requestStart, requestEnd);
    } else {
      return Collections.emptyList();
    }

    Optional<Types> resourceBookingGranularityInMinutes = dataProvider
        .getResourceBookingGranularityInMinutes(resourceId);

    requestCapacityRequirementList = dataProvider.getRequestCapacityRequirements(resourceRequestId);

    for (CapacityRequirements capacityRequirementEntry : requestCapacityRequirementList) {
      List<AssignmentBuckets> assignmentDistributionList = null;

      Instant requestCapacityRequirementStartTime = capacityRequirementEntry.getStartTime();
      Instant requestCapacityRequirementEndTime = capacityRequirementEntry.getEndTime();

      int hoursToStaff = minutesToHours(capacityRequirementEntry.getRequestedCapacityInMinutes());

      List<Capacity> filteredCapacityList = utility.getFilteredCapacityList(resourceCapacityList,
          requestCapacityRequirementStartTime, requestCapacityRequirementEndTime);

      if (filteredCapacityList.isEmpty()) {
        // In the AsRequested case, if we cannot fulfill any capacity requirement, we
        // cannot fulfill
        // all capacity requirement, thus we return with an empty list.
        messages.error(MessageKeys.RESOURCE_HAS_NO_CAPACITY_DURING_THE_PERIOD, requestCapacityRequirementStartTime,
            requestCapacityRequirementEndTime);
        return Collections.emptyList();
      }
      if (resourceBookingGranularityInMinutes.isPresent()) {
        assignmentDistributionList = utility.getDistributedAssignmentBuckets(
            resourceBookingGranularityInMinutes.get().getBookingGranularityInMinutes(), hoursToStaff,
            filteredCapacityList);
      }

      assignmentBuckets.addAll(assignmentDistributionList);

    }
    LOGGER.debug(SIMULATION_MARKER,
        "Completed successfully processing assignment records in assignments as requested simulator");
    return assignmentBuckets;

  }

}