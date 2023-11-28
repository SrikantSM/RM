package com.sap.c4p.rm.assignment.simulation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.sap.cds.Struct;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.assignment.utils.AssignmentSimulationUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;

import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Types;

import assignmentservice.AssignmentBuckets;
import assignmentservice.SimulateAsgBasedOnTotalHoursContext;

public class AssignmentTotalHoursSimulatorTest {

  final PersistenceService persistenceService = null;

  @Test

  public void validateMapRowListToAssignmentContainerList() {
    String event = "";
    String entityName = "";
    EventContext context = EventContext.create(event, entityName);

    DataProvider provider = mock(DataProvider.class);
    AssignmentSimulationUtility utility = mock(AssignmentSimulationUtility.class);

    context.put(SimulateAsgBasedOnTotalHoursContext.RESOURCE_ID, "Tatatai");
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "2020-10-01");
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020-10-10");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, 120);

    // Resource Capacities
    Instant reqStartTime = Instant.parse("2020-10-01T00:00:00.00Z");
    Instant reqEndTime = Instant.parse("2020-10-10T00:00:00.00Z");

    List<Capacity> resourceCapacityList = new ArrayList<>();
    Capacity resourceCapacity = Struct.create(Capacity.class);
    resourceCapacity.setWorkingTimeInMinutes(480);
    resourceCapacity.setStartTime(Instant.parse("2020-10-01T08:00:00.00Z"));
    resourceCapacity.setEndTime(Instant.parse("2020-10-01T16:00:00.00Z"));

    resourceCapacityList.add(resourceCapacity);

    Capacity resourceCapacity2 = Struct.create(Capacity.class);
    resourceCapacity2.setStartTime(Instant.parse("2020-10-02T08:00:00.00Z"));
    resourceCapacity2.setEndTime(Instant.parse("2020-10-02T16:00:00.00Z"));
    resourceCapacity2.setWorkingTimeInMinutes(480);

    resourceCapacityList.add(resourceCapacity2);

    String resourceId = "Tatatai";

    when(provider.getResourceCapacities(resourceId, reqStartTime, reqEndTime)).thenReturn(resourceCapacityList);

    // Mock granularity
    Types resourceBookingGranularity = Struct.create(Types.class);
    resourceBookingGranularity.setBookingGranularityInMinutes(60); // Always 60 in hours cases
    Optional<Types> resourceBookingGranularityInMinutes = Optional.of(resourceBookingGranularity);

    when(provider.getResourceBookingGranularityInMinutes(resourceId)).thenReturn(resourceBookingGranularityInMinutes);

    // Mock resulting buckets
    AssignmentBuckets assignmentBucket = Struct.create(AssignmentBuckets.class);
    assignmentBucket.setId("Bucket1");

    List<AssignmentBuckets> assignmentBucketList = new ArrayList<>();
    assignmentBucketList.add(assignmentBucket);

    when(utility.getDistributedAssignmentBuckets(60, 120, resourceCapacityList)).thenReturn(assignmentBucketList);

    // Positive scenario, when the input is valid, expect a result
    AssignmentTotalHoursSimulator simulator = new AssignmentTotalHoursSimulator(utility, provider);

    List<AssignmentBuckets> actualAssignmentBuckets = simulator.getDistributedAssignmentRecords(context);

    assertEquals(1, actualAssignmentBuckets.size());

    // Negative scenario, when the the input is corrupt, expect empty output
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "");

    actualAssignmentBuckets = simulator.getDistributedAssignmentRecords(context);
    assertEquals(0, actualAssignmentBuckets.size());

    // More negative scenarios. No start date
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "");
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020-10-10");

    actualAssignmentBuckets = simulator.getDistributedAssignmentRecords(context);

    assertEquals(0, actualAssignmentBuckets.size());

    // More negative scenarios, invalid duration
    context.put(SimulateAsgBasedOnTotalHoursContext.START, "2020-10-01");
    context.put(SimulateAsgBasedOnTotalHoursContext.END, "2020-10-10");
    context.put(SimulateAsgBasedOnTotalHoursContext.DURATION, "o");

    actualAssignmentBuckets = simulator.getDistributedAssignmentRecords(context);
    assertEquals(0, actualAssignmentBuckets.size());

    // No granularity
    resourceBookingGranularityInMinutes = Optional.empty();
    when(provider.getResourceBookingGranularityInMinutes(resourceId)).thenReturn(resourceBookingGranularityInMinutes);
    actualAssignmentBuckets = simulator.getDistributedAssignmentRecords(context);
    assertEquals(0, actualAssignmentBuckets.size());

  }
}
