package com.sap.c4p.rm.assignment.simulation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.sap.cds.Struct;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.assignment.utils.AssignmentSimulationUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;

import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Types;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

import assignmentservice.AssignmentBuckets;

public class AssignmentAsRequestedSimulatorTest {

  private static final int REQUEST_OPEN = 0;
  private static final int REQUEST_PUBLISHED = 1;
  final PersistenceService persistenceService = null;
  Messages messages;

  @Test
  public void validateAssignmentBucketsForAsRequested() {

    DataProvider provider = mock(DataProvider.class);
    AssignmentSimulationUtility utility = new AssignmentSimulationUtility(provider);

    // Prepare requests
    String resourceRequestID = "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4";
    LocalDate startDate = LocalDate.of(2020, Month.OCTOBER, 1);
    LocalDate endDate = LocalDate.of(2020, Month.OCTOBER, 10);
    ResourceRequests resourceRequest = ResourceRequests.create();

    resourceRequest.setStartDate(startDate);
    resourceRequest.setEndDate(endDate);
    resourceRequest.setRequestStatusCode(REQUEST_OPEN);
    resourceRequest.setReleaseStatusCode(REQUEST_PUBLISHED);
    String event = "";
    String entityName = "";

    Instant reqStartTime = Instant.parse("2020-10-01T00:00:00.00Z");
    Instant reqEndTime = Instant.parse("2020-10-10T00:00:00.00Z");

    // Prepare context to be passed to the test method

    EventContext context = EventContext.create(event, entityName);

    context.put("resourceId", "Tatatai");
    context.put("resourceRequestId", "e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4");
    context.put("mode", "I");

    // Prepare resource capacity
    String resourceId = "Tatatai";

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

    when(provider.getResourceCapacities(resourceId, reqStartTime, reqEndTime)).thenReturn(resourceCapacityList);

    // Return resource granularity when requested

    Types resourceBookingGranularity = Struct.create(Types.class);
    resourceBookingGranularity.setBookingGranularityInMinutes(60); // Always 60 in hours cases

    // Prepare request capacity requirement
    List<CapacityRequirements> requestCapacityRequirementList = new ArrayList<>();
    CapacityRequirements requestCapacityRequirement = Struct.create(CapacityRequirements.class);

    Instant startTime = Instant.parse("2020-10-01T08:00:00.00Z");
    Instant endTime = Instant.parse("2020-10-10T08:00:00.00Z");

    requestCapacityRequirement.setStartTime(startTime);
    requestCapacityRequirement.setEndTime(endTime);
    requestCapacityRequirement.setRequestedCapacityInMinutes(60);

    requestCapacityRequirementList.add(requestCapacityRequirement);

    when(provider.getRequestCapacityRequirements(resourceRequestID)).thenReturn(requestCapacityRequirementList);

    // First test, when the requested duration can be accommodated in a single
    // bucket
    this.messages = mock(Messages.class);
    AssignmentAsRequestedSimulator simulator = new AssignmentAsRequestedSimulator(utility, provider, messages);

    Optional<ResourceRequests> resourceRequests = Optional.empty();

    when(provider.getRequestData(resourceRequestID)).thenReturn(resourceRequests);
    List<AssignmentBuckets> actualAssignmentBuckets = simulator.getDistributedAssignmentRecords(context);
    assertEquals(0, actualAssignmentBuckets.size());

    Optional<Types> resourceBookingGranularityInMinutes = Optional.empty();
    when(provider.getResourceBookingGranularityInMinutes(resourceId)).thenReturn(resourceBookingGranularityInMinutes);

    actualAssignmentBuckets = simulator.getDistributedAssignmentRecords(context);
    assertEquals(0, actualAssignmentBuckets.size());

    resourceBookingGranularityInMinutes = Optional.of(resourceBookingGranularity);
    when(provider.getResourceBookingGranularityInMinutes(resourceId)).thenReturn(resourceBookingGranularityInMinutes);

    resourceRequests = Optional.of(resourceRequest);
    when(provider.getRequestData(resourceRequestID)).thenReturn(resourceRequests);
    actualAssignmentBuckets = simulator.getDistributedAssignmentRecords(context);
    assertEquals(1, actualAssignmentBuckets.size());

    // Second test, when requested capcity is expected to be ditributed across two
    // buckets
    startTime = Instant.parse("2020-10-01T00:00:00.00Z");
    endTime = Instant.parse("2020-10-10T00:00:00.00Z");

    requestCapacityRequirement.setStartTime(startTime);
    requestCapacityRequirement.setEndTime(endTime);
    requestCapacityRequirement.setRequestedCapacityInMinutes(540);

    requestCapacityRequirementList.clear();
    requestCapacityRequirementList.add(requestCapacityRequirement);

    when(provider.getRequestCapacityRequirements(resourceRequestID)).thenReturn(requestCapacityRequirementList);
    actualAssignmentBuckets = simulator.getDistributedAssignmentRecords(context);
    assertEquals(2, actualAssignmentBuckets.size());

    // Third test, the resource has no capacity in the given period, an error
    // message is to be expected
    startTime = Instant.parse("2020-10-10T00:00:00.00Z");
    endTime = Instant.parse("2020-10-15T00:00:00.00Z");

    requestCapacityRequirement.setStartTime(startTime);
    requestCapacityRequirement.setEndTime(endTime);
    requestCapacityRequirement.setRequestedCapacityInMinutes(540);

    requestCapacityRequirementList.clear();
    requestCapacityRequirementList.add(requestCapacityRequirement);

    when(provider.getRequestCapacityRequirements(resourceRequestID)).thenReturn(requestCapacityRequirementList);
    actualAssignmentBuckets = simulator.getDistributedAssignmentRecords(context);
    verify(messages, times(1)).error("RESOURCE_HAS_NO_CAPACITY_DURING_THE_PERIOD", startTime, endTime);
    assertEquals(0, actualAssignmentBuckets.size());

  }

}