package com.sap.c4p.rm.projectintegrationadapter.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataException;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmnd;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;

import com.sap.c4p.rm.projectintegrationadapter.enums.AssignmentStatus;
import com.sap.c4p.rm.projectintegrationadapter.repository.AssignmentRepository;

import com.sap.resourcemanagement.assignment.AssignmentBuckets;
import com.sap.resourcemanagement.assignment.Assignments;
import com.sap.resourcemanagement.assignment.AssignmentsView;
import com.sap.resourcemanagement.integration.SupplySyncDetails;
import com.sap.resourcemanagement.resource.CapacityView;
import com.sap.resourcemanagement.resource.ResourceDetails;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.supply.AssignmentBucketsYearMonthAggregate;

import io.vavr.control.Option;

public class AssignmentServiceTest {

  private static final String DEMAND = "resourceDemand";
  private static final String SUPPLY = "resourceSupply";
  private static final String WORK_PACKAGE = "workPackage";
  private static final String REQUEST_ID = "resourceRequestId";
  private static final String WFPID = "workforcePersonUserID";
  private static final String RESOURCE_ID = "resourceId";
  private static final String ASSIGNMENT_ID = "assignmentId";

  private AssignmentService cut;
  public AssignmentRepository mockAssignmentRepository;

  @BeforeEach
  public void setUp() {
    mockAssignmentRepository = mock(AssignmentRepository.class, RETURNS_DEEP_STUBS);
    cut = new AssignmentService(mockAssignmentRepository);
  }

  @Test
  void getDemandsToQuerySupplyForForwardsCallToRepository() {
    cut.getDemandsToQuerySupplyFor();
    verify(mockAssignmentRepository).getRMDemandIdsToQuerySupplyFor();
  }

  @Test
  void deleteDemandFromSupplySyncTableForwardsCallToRepository() {
    SupplySyncDetails inputDemand = SupplySyncDetails.create();
    cut.deleteDemandFromSupplySyncTable(inputDemand);
    verify(mockAssignmentRepository).deleteDemandFromSupplySyncTable(inputDemand);
  }

  @Test
  void deleteAssignmentsForResourceRequestsForwardsCallToRepository() {
    cut.deleteAssignmentsForResourceRequests(REQUEST_ID);
    verify(mockAssignmentRepository).deleteAssignmentsForResourceRequests(REQUEST_ID);
  }

  @Test
  void assignmentNotCreatedIfPublishedRequestDoesNotExist() {

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE))
        .thenReturn(Optional.ofNullable(null));

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository, times(0)).insertAssignmentAndSupply(any(), any());
  }

  @Test
  void assignmentNotCreatedIfResourceDoesNotExistForWorkforcePerson() {

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE))
        .thenReturn(Optional.of(ResourceRequests.create()));
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.ofNullable(null));

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository, times(0)).insertAssignmentAndSupply(any(), any());
  }

  @Test
  void assignmentNotCreatedIfSupplyIdNotProvidedByS4() {

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(null);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE))
        .thenReturn(Optional.of(ResourceRequests.create()));
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID))
        .thenReturn(Optional.of(ResourceDetails.create()));

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository, times(0)).insertAssignmentAndSupply(any(), any());
  }

  @Test
  void assignmentNotCreatedIfExistingHardBookedAssignmentExists() {

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    Assignments mockAssignment = Assignments.create();
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode()); // existing assignment is hard booked
    Optional<Assignments> existingAssignment = Optional.of(mockAssignment);
    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(existingAssignment);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository, times(0)).insertAssignmentAndSupply(any(), any());
  }

  @Test
  void softBookedAssignmentDeletedIfSupplyInS4IsCreated() {

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ASSIGNMENT_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode()); // existing assignment is soft booked
    Optional<Assignments> existingAssignment = Optional.of(mockAssignment);
    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(existingAssignment);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.emptyList();
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository, times(1)).deleteAssignment(ASSIGNMENT_ID);
  }

  @Test
  void proposedAssignmentDeletedIfSupplyInS4IsCreated() {

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    Assignments proposedAssignment = Assignments.create();
    proposedAssignment.setId(ASSIGNMENT_ID);
    proposedAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    Optional<Assignments> existingAssignment = Optional.of(proposedAssignment);
    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(existingAssignment);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.emptyList();
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository, times(1)).deleteAssignment(ASSIGNMENT_ID);
  }

  @Test
  void acceptedAssignmentDeletedIfSupplyInS4IsCreated() {

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    Assignments acceptedAssignment = Assignments.create();
    acceptedAssignment.setId(ASSIGNMENT_ID);
    acceptedAssignment.setAssignmentStatusCode(AssignmentStatus.ACCEPTED.getCode());
    Optional<Assignments> existingAssignment = Optional.of(acceptedAssignment);
    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(existingAssignment);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.emptyList();
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository, times(1)).deleteAssignment(ASSIGNMENT_ID);
  }

  @Test
  void rejectedAssignmentDeletedIfSupplyInS4IsCreated() {

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    Assignments rejectedAssignment = Assignments.create();
    rejectedAssignment.setId(ASSIGNMENT_ID);
    rejectedAssignment.setAssignmentStatusCode(AssignmentStatus.REJECTED.getCode());
    Optional<Assignments> existingAssignment = Optional.of(rejectedAssignment);
    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(existingAssignment);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.emptyList();
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository, times(1)).deleteAssignment(ASSIGNMENT_ID);
  }

  @Test
  void hardBookedAssignmentCreatedForS4SupplyIfOnlySoftBookedAssignmentExists() {

    int STAFFED_HOURS_FROM_S4 = 42;

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ASSIGNMENT_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode()); // existing assignment is soft booked
    Optional<Assignments> existingAssignment = Optional.of(mockAssignment);
    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(existingAssignment);

    CapacityView resourceCapacity = CapacityView.create();
    resourceCapacity.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    List<CapacityView> resourceCapacityList = Collections.singletonList(resourceCapacity);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository).insertAssignmentAndSupply(
        argThat(asgn -> asgn.getResourceId() == RESOURCE_ID && asgn.getResourceRequestId() == REQUEST_ID
            && asgn.getAssignmentStatusCode() == AssignmentStatus.HARDBOOKED.getCode()
            && asgn.getBookedCapacityInMinutes() == STAFFED_HOURS_FROM_S4 * 60),
        eq(SUPPLY));
  }

  @Test
  void hardBookedAssignmentCreatedForS4SupplyIfOnlyProposedAssignmentExists() {

    int STAFFED_HOURS_FROM_S4 = 42;

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    Assignments proposedAssignment = Assignments.create();
    proposedAssignment.setId(ASSIGNMENT_ID);
    proposedAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    Optional<Assignments> existingAssignment = Optional.of(proposedAssignment);
    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(existingAssignment);

    CapacityView resourceCapacity = CapacityView.create();
    resourceCapacity.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    List<CapacityView> resourceCapacityList = Collections.singletonList(resourceCapacity);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository).insertAssignmentAndSupply(
        argThat(asgn -> asgn.getResourceId() == RESOURCE_ID && asgn.getResourceRequestId() == REQUEST_ID
            && asgn.getAssignmentStatusCode() == AssignmentStatus.HARDBOOKED.getCode()
            && asgn.getBookedCapacityInMinutes() == STAFFED_HOURS_FROM_S4 * 60),
        eq(SUPPLY));
  }

  @Test
  void hardBookedAssignmentCreatedForS4SupplyIfOnlyAcceptedAssignmentExists() {

    int STAFFED_HOURS_FROM_S4 = 42;

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    Assignments acceptedAssignment = Assignments.create();
    acceptedAssignment.setId(ASSIGNMENT_ID);
    acceptedAssignment.setAssignmentStatusCode(AssignmentStatus.ACCEPTED.getCode());
    Optional<Assignments> existingAssignment = Optional.of(acceptedAssignment);
    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(existingAssignment);

    CapacityView resourceCapacity = CapacityView.create();
    resourceCapacity.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    List<CapacityView> resourceCapacityList = Collections.singletonList(resourceCapacity);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository).insertAssignmentAndSupply(
        argThat(asgn -> asgn.getResourceId() == RESOURCE_ID && asgn.getResourceRequestId() == REQUEST_ID
            && asgn.getAssignmentStatusCode() == AssignmentStatus.HARDBOOKED.getCode()
            && asgn.getBookedCapacityInMinutes() == STAFFED_HOURS_FROM_S4 * 60),
        eq(SUPPLY));
  }

  @Test
  void hardBookedAssignmentCreatedForS4SupplyIfOnlyRejectedAssignmentExists() {

    int STAFFED_HOURS_FROM_S4 = 42;

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    Assignments rejectedAssignment = Assignments.create();
    rejectedAssignment.setId(ASSIGNMENT_ID);
    rejectedAssignment.setAssignmentStatusCode(AssignmentStatus.REJECTED.getCode());
    Optional<Assignments> existingAssignment = Optional.of(rejectedAssignment);
    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(existingAssignment);

    CapacityView resourceCapacity = CapacityView.create();
    resourceCapacity.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    List<CapacityView> resourceCapacityList = Collections.singletonList(resourceCapacity);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository).insertAssignmentAndSupply(
        argThat(asgn -> asgn.getResourceId() == RESOURCE_ID && asgn.getResourceRequestId() == REQUEST_ID
            && asgn.getAssignmentStatusCode() == AssignmentStatus.HARDBOOKED.getCode()
            && asgn.getBookedCapacityInMinutes() == STAFFED_HOURS_FROM_S4 * 60),
        eq(SUPPLY));
  }

  @Test
  void hardBookedAssignmentCreatedForS4SupplyIfNoAssignmentExists() {

    int STAFFED_HOURS_FROM_S4 = 42;

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacity = CapacityView.create();
    resourceCapacity.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    List<CapacityView> resourceCapacityList = Collections.singletonList(resourceCapacity);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository).insertAssignmentAndSupply(
        argThat(asgn -> asgn.getResourceId() == RESOURCE_ID && asgn.getResourceRequestId() == REQUEST_ID
            && asgn.getAssignmentStatusCode() == AssignmentStatus.HARDBOOKED.getCode()
            && asgn.getBookedCapacityInMinutes() == STAFFED_HOURS_FROM_S4 * 60),
        eq(SUPPLY));
  }

  @Test
  void asgnCreatedForS4SupplyWhenSomeMonthsWhereResourceHasZeroAvailabilityHaveZeroEffortsInS4() {

    int STAFFED_HOURS_FROM_S4 = 42;

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 02, 28));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    // Resource available only in Jan 2022
    CapacityView resourceCapacity = CapacityView.create();
    resourceCapacity.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    List<CapacityView> resourceCapacityList = Collections.singletonList(resourceCapacity);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    // Non zero supply distribution for Jan 2022
    EngmntProjRsceSupDistr engmntProjRsceSupDistr1 = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr1.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr1.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr1.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));

    // Zero supply distribution for Feb 2022
    EngmntProjRsceSupDistr engmntProjRsceSupDistr2 = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr2.getCalendarMonth()).thenReturn("02");
    when(engmntProjRsceSupDistr2.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr2.getQuantity()).thenReturn(BigDecimal.ZERO);

    List<EngmntProjRsceSupDistr> supplyDistributionList = Arrays.asList(engmntProjRsceSupDistr1,
        engmntProjRsceSupDistr2);
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository).insertAssignmentAndSupply(
        argThat(asgn -> asgn.getResourceId() == RESOURCE_ID && asgn.getResourceRequestId() == REQUEST_ID
            && asgn.getAssignmentStatusCode() == AssignmentStatus.HARDBOOKED.getCode()
            && asgn.getBookedCapacityInMinutes() == STAFFED_HOURS_FROM_S4 * 60),
        eq(SUPPLY));
  }

  @Test
  void hardBookedAssignmentNotCreatedForS4SupplyIfRequestDoesNotExists() {

    int STAFFED_HOURS_FROM_S4 = 42;

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(Optional.empty());

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository, times(0)).insertAssignmentAndSupply(any(), any());
  }

  @Test
  void staffedHoursCorrectlyDistributedOnAssignmentCreateWhenNumberOfAvailableDaysLessThanStaffedHours() {

    int STAFFED_HOURS_FROM_S4 = 3;

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    ArgumentCaptor<Assignments> captureAssignment = ArgumentCaptor.forClass(Assignments.class);

    verify(mockAssignmentRepository).insertAssignmentAndSupply(captureAssignment.capture(), eq(SUPPLY));
    assertEquals(captureAssignment.getValue().getResourceId(), RESOURCE_ID);
    assertEquals(captureAssignment.getValue().getResourceRequestId(), REQUEST_ID);
    assertEquals(captureAssignment.getValue().getAssignmentStatusCode(), AssignmentStatus.HARDBOOKED.getCode());
    assertEquals(captureAssignment.getValue().getBookedCapacityInMinutes(), STAFFED_HOURS_FROM_S4 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().size(), 2);
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(0).getAssignmentId());
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(1).getAssignmentId());
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(0).getBookedCapacityInMinutes(), 2 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(1).getBookedCapacityInMinutes(), 1 * 60);
  }

  @Test
  void staffedHoursCorrectlyDistributedOnAssignmentCreateWhenNumberOfAvailableDaysEqualToStaffedHours() {

    int STAFFED_HOURS_FROM_S4 = 2;

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    ArgumentCaptor<Assignments> captureAssignment = ArgumentCaptor.forClass(Assignments.class);

    verify(mockAssignmentRepository).insertAssignmentAndSupply(captureAssignment.capture(), eq(SUPPLY));
    assertEquals(captureAssignment.getValue().getResourceId(), RESOURCE_ID);
    assertEquals(captureAssignment.getValue().getResourceRequestId(), REQUEST_ID);
    assertEquals(captureAssignment.getValue().getAssignmentStatusCode(), AssignmentStatus.HARDBOOKED.getCode());
    assertEquals(captureAssignment.getValue().getBookedCapacityInMinutes(), STAFFED_HOURS_FROM_S4 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().size(), 2);
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(0).getAssignmentId());
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(1).getAssignmentId());
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(0).getBookedCapacityInMinutes(), 1 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(1).getBookedCapacityInMinutes(), 1 * 60);
  }

  @Test
  void staffedHoursCorrectlyDistributedOnAssignmentCreateWhenNumberOfAvailableDaysMoreThanStaffedHours() {

    int STAFFED_HOURS_FROM_S4 = 2;

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    ArgumentCaptor<Assignments> captureAssignment = ArgumentCaptor.forClass(Assignments.class);

    verify(mockAssignmentRepository).insertAssignmentAndSupply(captureAssignment.capture(), eq(SUPPLY));
    assertEquals(captureAssignment.getValue().getResourceId(), RESOURCE_ID);
    assertEquals(captureAssignment.getValue().getResourceRequestId(), REQUEST_ID);
    assertEquals(captureAssignment.getValue().getAssignmentStatusCode(), AssignmentStatus.HARDBOOKED.getCode());
    assertEquals(captureAssignment.getValue().getBookedCapacityInMinutes(), STAFFED_HOURS_FROM_S4 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().size(), 2);
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(0).getAssignmentId());
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(1).getAssignmentId());
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(0).getBookedCapacityInMinutes(), 1 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(1).getBookedCapacityInMinutes(), 1 * 60);
  }

  @Test
  void assignmentNotCreatedWhenStaffedHoursFromS4IsZero() {

    int STAFFED_HOURS_FROM_S4 = 0;

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    ResourceDetails mockResourceDetails = ResourceDetails.create();
    mockResourceDetails.setResourceId(RESOURCE_ID);
    Optional<ResourceDetails> resourceDetails = Optional.of(mockResourceDetails);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(resourceDetails);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));

    List<EngmntProjRsceSupDistr> supplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);
    Option<List<EngmntProjRsceSupDistr>> supplyDistributionListOption = Option.of(supplyDistributionList);
    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent()).thenReturn(supplyDistributionListOption);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);

    cut.createAssignment(resourceSuppliesFromS4List);

    verify(mockAssignmentRepository, times(0)).insertAssignmentAndSupply(any(), any());
  }

  @Test
  void existingHardBookedAssignmentsGetDeletedIfS4SupplyIsDeleted() throws ODataException {

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(Collections.emptyList());

    Assignments hardBookedAssignment1 = Assignments.create();
    hardBookedAssignment1.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    Assignments hardBookedAssignment2 = Assignments.create();
    hardBookedAssignment2.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    Assignments softBookedAssignment1 = Assignments.create();
    softBookedAssignment1.setId(ASSIGNMENT_ID);
    softBookedAssignment1.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());

    List<Assignments> existingAssignments = Arrays.asList(hardBookedAssignment1, hardBookedAssignment2,
        softBookedAssignment1);
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE)).thenReturn(existingAssignments);
    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID)).thenReturn(Collections.emptyList());

    ResourceRequests resourceRequest = ResourceRequests.create();

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, resourceRequest);

    verify(mockAssignmentRepository).deleteAssignments(argThat(asgnList -> asgnList.size() == 2
        && asgnList.get(0).getAssignmentStatusCode().intValue() == AssignmentStatus.HARDBOOKED.getCode()
        && asgnList.get(1).getAssignmentStatusCode().intValue() == AssignmentStatus.HARDBOOKED.getCode()));
  }

  @Test
  void existingHardBookedAssignmentsGetDeletedIfS4SupplyIsPartiallyDeleted() throws ODataException {

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    Assignments hardBookedAssignment1 = Assignments.create();
    hardBookedAssignment1.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    hardBookedAssignment1.setResourceId(RESOURCE_ID);

    Assignments hardBookedAssignment2 = Assignments.create();
    hardBookedAssignment2.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    List<Assignments> existingAssignments = Arrays.asList(hardBookedAssignment1, hardBookedAssignment2);
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE)).thenReturn(existingAssignments);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID)).thenReturn(Collections.emptyList());

    ResourceRequests resourceRequest = null;

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, resourceRequest);

    verify(mockAssignmentRepository).deleteAssignments(argThat(asgnList -> asgnList.size() == 1));
  }

  @Test
  void assignmentUpdatesSkippedIfRequestObjectIsNull() throws ODataException {

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(Collections.emptyList());

    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.emptyList());

    ResourceRequests resourceRequest = null;

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, resourceRequest);

    verify(mockAssignmentRepository, times(0)).updateAssignmentBuckets(any(), any(), any());
  }

  @Test
  void newHardBookedAssignmentCreatedIfNoneExistedBeforeDuringS4UpdateFlow() throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.emptyList());
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    ArgumentCaptor<Assignments> captureAssignment = ArgumentCaptor.forClass(Assignments.class);
    verify(mockAssignmentRepository).insertAssignmentAndSupply(captureAssignment.capture(), eq(SUPPLY));
    assertEquals(captureAssignment.getValue().getResourceId(), RESOURCE_ID);
    assertEquals(captureAssignment.getValue().getResourceRequestId(), REQUEST_ID);
    assertEquals(captureAssignment.getValue().getAssignmentStatusCode(), AssignmentStatus.HARDBOOKED.getCode());
    assertEquals(captureAssignment.getValue().getBookedCapacityInMinutes(), STAFFED_HOURS_FROM_S4 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().size(), 2);
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(0).getAssignmentId());
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(1).getAssignmentId());
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(0).getBookedCapacityInMinutes(), 1 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(1).getBookedCapacityInMinutes(), 1 * 60);
  }

  @Test
  void existingSoftBookedAssignmentForRequestResourcePairDeletedAndNewHardBookedAssignmentCreated()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments softBookedAssignment = Assignments.create();
    softBookedAssignment.setId(ASSIGNMENT_ID);
    softBookedAssignment.setResourceId(RESOURCE_ID);
    softBookedAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(softBookedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository).deleteAssignment(ASSIGNMENT_ID);

    ArgumentCaptor<Assignments> captureAssignment = ArgumentCaptor.forClass(Assignments.class);
    verify(mockAssignmentRepository).insertAssignmentAndSupply(captureAssignment.capture(), eq(SUPPLY));
    assertEquals(captureAssignment.getValue().getResourceId(), RESOURCE_ID);
    assertEquals(captureAssignment.getValue().getResourceRequestId(), REQUEST_ID);
    assertEquals(captureAssignment.getValue().getAssignmentStatusCode(), AssignmentStatus.HARDBOOKED.getCode());
    assertEquals(captureAssignment.getValue().getBookedCapacityInMinutes(), STAFFED_HOURS_FROM_S4 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().size(), 2);
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(0).getAssignmentId());
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(1).getAssignmentId());
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(0).getBookedCapacityInMinutes(), 1 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(1).getBookedCapacityInMinutes(), 1 * 60);
  }

  @Test
  void existingProposedAssignmentForRequestResourcePairDeletedAndNewHardBookedAssignmentCreated()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments proposedAssignment = Assignments.create();
    proposedAssignment.setId(ASSIGNMENT_ID);
    proposedAssignment.setResourceId(RESOURCE_ID);
    proposedAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(proposedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository).deleteAssignment(ASSIGNMENT_ID);

    ArgumentCaptor<Assignments> captureAssignment = ArgumentCaptor.forClass(Assignments.class);
    verify(mockAssignmentRepository).insertAssignmentAndSupply(captureAssignment.capture(), eq(SUPPLY));
    assertEquals(captureAssignment.getValue().getResourceId(), RESOURCE_ID);
    assertEquals(captureAssignment.getValue().getResourceRequestId(), REQUEST_ID);
    assertEquals(captureAssignment.getValue().getAssignmentStatusCode(), AssignmentStatus.HARDBOOKED.getCode());
    assertEquals(captureAssignment.getValue().getBookedCapacityInMinutes(), STAFFED_HOURS_FROM_S4 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().size(), 2);
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(0).getAssignmentId());
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(1).getAssignmentId());
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(0).getBookedCapacityInMinutes(), 1 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(1).getBookedCapacityInMinutes(), 1 * 60);
  }

  @Test
  void existingAcceptedAssignmentForRequestResourcePairDeletedAndNewHardBookedAssignmentCreated()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments acceptedAssignment = Assignments.create();
    acceptedAssignment.setId(ASSIGNMENT_ID);
    acceptedAssignment.setResourceId(RESOURCE_ID);
    acceptedAssignment.setAssignmentStatusCode(AssignmentStatus.ACCEPTED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(acceptedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository).deleteAssignment(ASSIGNMENT_ID);

    ArgumentCaptor<Assignments> captureAssignment = ArgumentCaptor.forClass(Assignments.class);
    verify(mockAssignmentRepository).insertAssignmentAndSupply(captureAssignment.capture(), eq(SUPPLY));
    assertEquals(captureAssignment.getValue().getResourceId(), RESOURCE_ID);
    assertEquals(captureAssignment.getValue().getResourceRequestId(), REQUEST_ID);
    assertEquals(captureAssignment.getValue().getAssignmentStatusCode(), AssignmentStatus.HARDBOOKED.getCode());
    assertEquals(captureAssignment.getValue().getBookedCapacityInMinutes(), STAFFED_HOURS_FROM_S4 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().size(), 2);
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(0).getAssignmentId());
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(1).getAssignmentId());
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(0).getBookedCapacityInMinutes(), 1 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(1).getBookedCapacityInMinutes(), 1 * 60);
  }

  @Test
  void existingRejectedAssignmentForRequestResourcePairDeletedAndNewHardBookedAssignmentCreated()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments rejectedAssignment = Assignments.create();
    rejectedAssignment.setId(ASSIGNMENT_ID);
    rejectedAssignment.setResourceId(RESOURCE_ID);
    rejectedAssignment.setAssignmentStatusCode(AssignmentStatus.REJECTED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(rejectedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository).deleteAssignment(ASSIGNMENT_ID);

    ArgumentCaptor<Assignments> captureAssignment = ArgumentCaptor.forClass(Assignments.class);
    verify(mockAssignmentRepository).insertAssignmentAndSupply(captureAssignment.capture(), eq(SUPPLY));
    assertEquals(captureAssignment.getValue().getResourceId(), RESOURCE_ID);
    assertEquals(captureAssignment.getValue().getResourceRequestId(), REQUEST_ID);
    assertEquals(captureAssignment.getValue().getAssignmentStatusCode(), AssignmentStatus.HARDBOOKED.getCode());
    assertEquals(captureAssignment.getValue().getBookedCapacityInMinutes(), STAFFED_HOURS_FROM_S4 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().size(), 2);
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(0).getAssignmentId());
    assertEquals(captureAssignment.getValue().getId(),
        captureAssignment.getValue().getAssignmentBuckets().get(1).getAssignmentId());
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(0).getBookedCapacityInMinutes(), 1 * 60);
    assertEquals(captureAssignment.getValue().getAssignmentBuckets().get(1).getBookedCapacityInMinutes(), 1 * 60);
  }

  @Test
  void existingSoftBookedAssignmentBucketsForRequestOnDifferentResourceOutsideRequestDatesAreDeleted()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;
    String differentResourceId = RESOURCE_ID + "2";

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments softBookedAssignment = Assignments.create();
    softBookedAssignment.setId(ASSIGNMENT_ID);
    softBookedAssignment.setResourceId(differentResourceId);
    softBookedAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(softBookedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 02));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 02));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository).deleteAssignmentBuckets(argThat(bucketList -> bucketList.size() == 2));
  }

  @Test
  void existingProposedAssignmentBucketsForRequestOnDifferentResourceOutsideRequestDatesAreDeleted()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;
    String differentResourceId = RESOURCE_ID + "2";

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments proposedAssignment = Assignments.create();
    proposedAssignment.setId(ASSIGNMENT_ID);
    proposedAssignment.setResourceId(differentResourceId);
    proposedAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(proposedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 02));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 02));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository).deleteAssignmentBuckets(argThat(bucketList -> bucketList.size() == 2));
  }

  @Test
  void existingAcceptedAssignmentBucketsForRequestOnDifferentResourceOutsideRequestDatesAreDeleted()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;
    String differentResourceId = RESOURCE_ID + "2";

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments acceptedAssignment = Assignments.create();
    acceptedAssignment.setId(ASSIGNMENT_ID);
    acceptedAssignment.setResourceId(differentResourceId);
    acceptedAssignment.setAssignmentStatusCode(AssignmentStatus.ACCEPTED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(acceptedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 02));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 02));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository).deleteAssignmentBuckets(argThat(bucketList -> bucketList.size() == 2));
  }

  @Test
  void existingRejectedAssignmentBucketsForRequestOnDifferentResourceOutsideRequestDatesAreNOTDeleted()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;
    String differentResourceId = RESOURCE_ID + "2";

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments rejectedAssignment = Assignments.create();
    rejectedAssignment.setId(ASSIGNMENT_ID);
    rejectedAssignment.setResourceId(differentResourceId);
    rejectedAssignment.setAssignmentStatusCode(AssignmentStatus.REJECTED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(rejectedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 02));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 02));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository, times(0)).deleteAssignmentBuckets(argThat(bucketList -> bucketList.size() == 2));
  }

  @Test
  void existingSoftBookedAssignmentForRequestOnDifferentResourceCompletelyOutsideRequestDatesIsDeleted()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;
    String differentResourceId = RESOURCE_ID + "2";

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments softBookedAssignment = Assignments.create();
    softBookedAssignment.setId(ASSIGNMENT_ID);
    softBookedAssignment.setResourceId(differentResourceId);
    softBookedAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(softBookedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setStartTime(LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 02));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository).deleteAssignment(ASSIGNMENT_ID);
  }

  @Test
  void existingProposedAssignmentForRequestOnDifferentResourceCompletelyOutsideRequestDatesIsDeleted()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;
    String differentResourceId = RESOURCE_ID + "2";

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments proposedAssignment = Assignments.create();
    proposedAssignment.setId(ASSIGNMENT_ID);
    proposedAssignment.setResourceId(differentResourceId);
    proposedAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(proposedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setStartTime(LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 02));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository).deleteAssignment(ASSIGNMENT_ID);
  }

  @Test
  void existingAcceptedAssignmentForRequestOnDifferentResourceCompletelyOutsideRequestDatesIsDeleted()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;
    String differentResourceId = RESOURCE_ID + "2";

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments acceptedAssignment = Assignments.create();
    acceptedAssignment.setId(ASSIGNMENT_ID);
    acceptedAssignment.setResourceId(differentResourceId);
    acceptedAssignment.setAssignmentStatusCode(AssignmentStatus.ACCEPTED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(acceptedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setStartTime(LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 02));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository).deleteAssignment(ASSIGNMENT_ID);
  }

  @Test
  void existingRejectedAssignmentForRequestOnDifferentResourceCompletelyOutsideRequestDatesIsNOTDeleted()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;
    String differentResourceId = RESOURCE_ID + "2";

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments rejectedAssignment = Assignments.create();
    rejectedAssignment.setId(ASSIGNMENT_ID);
    rejectedAssignment.setResourceId(differentResourceId);
    rejectedAssignment.setAssignmentStatusCode(AssignmentStatus.REJECTED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(rejectedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setStartTime(LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 02));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository, times(0)).deleteAssignment(ASSIGNMENT_ID);
  }

  @Test
  void existingSoftBookedAssignmentForRequestOnDifferentResourceCompletelyWithinRequestDatesIsNotChanged()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;
    String differentResourceId = RESOURCE_ID + "2";

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments softBookedAssignment = Assignments.create();
    softBookedAssignment.setId(ASSIGNMENT_ID);
    softBookedAssignment.setResourceId(differentResourceId);
    softBookedAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(softBookedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setStartTime(LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 05));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 06).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository, times(0)).deleteAssignment(ASSIGNMENT_ID);
    verify(mockAssignmentRepository, times(0)).deleteAssignmentBuckets(any());
  }

  @Test
  void existingProposedAssignmentForRequestOnDifferentResourceCompletelyWithinRequestDatesIsNotChanged()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;
    String differentResourceId = RESOURCE_ID + "2";

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments proposedAssignment = Assignments.create();
    proposedAssignment.setId(ASSIGNMENT_ID);
    proposedAssignment.setResourceId(differentResourceId);
    proposedAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(proposedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setStartTime(LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 05));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 06).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository, times(0)).deleteAssignment(ASSIGNMENT_ID);
    verify(mockAssignmentRepository, times(0)).deleteAssignmentBuckets(any());
  }

  @Test
  void existingAcceptedAssignmentForRequestOnDifferentResourceCompletelyWithinRequestDatesIsNotChanged()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;
    String differentResourceId = RESOURCE_ID + "2";

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments acceptedAssignment = Assignments.create();
    acceptedAssignment.setId(ASSIGNMENT_ID);
    acceptedAssignment.setResourceId(differentResourceId);
    acceptedAssignment.setAssignmentStatusCode(AssignmentStatus.ACCEPTED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(acceptedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setStartTime(LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 05));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 06).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository, times(0)).deleteAssignment(ASSIGNMENT_ID);
    verify(mockAssignmentRepository, times(0)).deleteAssignmentBuckets(any());
  }

  @Test
  void existingRejectedAssignmentForRequestOnDifferentResourceCompletelyWithinRequestDatesIsNotChanged()
      throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 2;
    String differentResourceId = RESOURCE_ID + "2";

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments rejectedAssignment = Assignments.create();
    rejectedAssignment.setId(ASSIGNMENT_ID);
    rejectedAssignment.setResourceId(differentResourceId);
    rejectedAssignment.setAssignmentStatusCode(AssignmentStatus.REJECTED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(rejectedAssignment));
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.emptyList());

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setStartTime(LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBuckets(ASSIGNMENT_ID))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 05));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 06).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 05).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository, times(0)).deleteAssignment(ASSIGNMENT_ID);
    verify(mockAssignmentRepository, times(0)).deleteAssignmentBuckets(any());
  }

  @Test
  void existingHardBookedAssignmentHoursUpdatedIfS4HoursUpdated() throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 4;

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments hardBookedAssignment = Assignments.create();
    hardBookedAssignment.setId(ASSIGNMENT_ID);
    hardBookedAssignment.setResourceId(RESOURCE_ID);
    hardBookedAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(hardBookedAssignment));

    AssignmentBucketsYearMonthAggregate bucketsYearMonthAggregate = AssignmentBucketsYearMonthAggregate.create();
    bucketsYearMonthAggregate.setAssignmentId(ASSIGNMENT_ID);
    bucketsYearMonthAggregate.setYearMonth("202201");
    bucketsYearMonthAggregate.setBookedCapacityInHours(2); // Existing staffing is for 2 hours
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.singletonList(bucketsYearMonthAggregate));

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setId("bucket1");
    bucket1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setId("bucket2");
    bucket2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));

    when(mockAssignmentRepository.getAssignmentBucketsForPeriod(any(), any(), any()))
        .thenReturn(Arrays.asList(bucket1, bucket2));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 31));
    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay3 = CapacityView.create();
    resourceCapacityDay3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2,
        resourceCapacityDay3);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    when(mockAssignmentRepository.getResourceStaffedOnAssignment(ASSIGNMENT_ID)).thenReturn(RESOURCE_ID);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository).updateAssignmentBuckets(eq(ASSIGNMENT_ID),
        argThat(bucketsToInsert -> bucketsToInsert.size() == 3),
        argThat(bucketsToDelete -> bucketsToDelete.size() == 2));
  }

  @Test
  void existingHardBookedAssignmentTruncatedIfRequestTruncated() throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 4;

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments hardBookedAssignment = Assignments.create();
    hardBookedAssignment.setId(ASSIGNMENT_ID);
    hardBookedAssignment.setResourceId(RESOURCE_ID);
    hardBookedAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(hardBookedAssignment));

    AssignmentBucketsYearMonthAggregate bucketsYearMonthAggregate = AssignmentBucketsYearMonthAggregate.create();
    bucketsYearMonthAggregate.setAssignmentId(ASSIGNMENT_ID);
    bucketsYearMonthAggregate.setYearMonth("202201");
    bucketsYearMonthAggregate.setBookedCapacityInHours(4); // Existing staffing is for 4 hours
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.singletonList(bucketsYearMonthAggregate));

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setId("bucket1");
    bucket1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setId("bucket2");
    bucket2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket3 = AssignmentBuckets.create();
    bucket3.setId("bucket3");
    bucket3.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket4 = AssignmentBuckets.create();
    bucket4.setId("bucket4");
    bucket4.setStartTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC));
    when(mockAssignmentRepository.getAssignmentBucketsForPeriod(any(), any(), any()))
        .thenReturn(Arrays.asList(bucket1, bucket2, bucket3, bucket4));

    AssignmentsView assignmentDetailsForS4Demand = AssignmentsView.create();
    assignmentDetailsForS4Demand.setAssignmentId(ASSIGNMENT_ID);
    assignmentDetailsForS4Demand.setStartDate(LocalDate.of(2022, 01, 01));
    assignmentDetailsForS4Demand.setEndDate(LocalDate.of(2022, 01, 04));
    when(mockAssignmentRepository.getExistingAssignmentDetails(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Optional.of(assignmentDetailsForS4Demand));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 02));
    mockRequest.setEndDate(LocalDate.of(2022, 01, 03));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 01, 04).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day

    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 01, 03).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    when(mockAssignmentRepository.getResourceStaffedOnAssignment(ASSIGNMENT_ID)).thenReturn(RESOURCE_ID);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository).updateAssignmentBuckets(eq(ASSIGNMENT_ID),
        argThat(bucketsToInsert -> bucketsToInsert.size() == 2),
        argThat(bucketsToDelete -> bucketsToDelete.size() == 4));
  }

  @Test
  void existingHardBookedAssignmentUnchangedIfRequestExpanded() throws ODataException {

    int STAFFED_HOURS_FROM_S4 = 4;

    EngmntProjRsceDmnd resourceDemand = mock(EngmntProjRsceDmnd.class);
    when(resourceDemand.getResourceDemand()).thenReturn(DEMAND);
    when(resourceDemand.getWorkPackage()).thenReturn(WORK_PACKAGE);

    EngmntProjRsceSup engmntProjRsceSup = mock(EngmntProjRsceSup.class);
    when(engmntProjRsceSup.getWorkforcePersonUserID()).thenReturn(WFPID);
    when(engmntProjRsceSup.getResourceDemand()).thenReturn(DEMAND);
    when(engmntProjRsceSup.getWorkPackage()).thenReturn(WORK_PACKAGE);
    when(engmntProjRsceSup.getResourceSupply()).thenReturn(SUPPLY);

    EngmntProjRsceSupDistr engmntProjRsceSupDistr = mock(EngmntProjRsceSupDistr.class);
    when(engmntProjRsceSupDistr.getCalendarMonth()).thenReturn("01");
    when(engmntProjRsceSupDistr.getCalendarYear()).thenReturn("2022");
    when(engmntProjRsceSupDistr.getQuantity()).thenReturn(BigDecimal.valueOf(STAFFED_HOURS_FROM_S4));
    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = Collections.singletonList(engmntProjRsceSupDistr);

    when(engmntProjRsceSup.getResourceSupplyDistributionIfPresent())
        .thenReturn(Option.of(monthlySupplyDistributionList));

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = Collections.singletonList(engmntProjRsceSup);
    when(resourceDemand.getResourceSupplyOrFetch()).thenReturn(resourceSuppliesFromS4List);

    ResourceDetails resourceDetails = ResourceDetails.create();
    resourceDetails.setResourceId(RESOURCE_ID);
    when(mockAssignmentRepository.getResourceForWorkforcePersonUserID(WFPID)).thenReturn(Optional.of(resourceDetails));

    Assignments hardBookedAssignment = Assignments.create();
    hardBookedAssignment.setId(ASSIGNMENT_ID);
    hardBookedAssignment.setResourceId(RESOURCE_ID);
    hardBookedAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(mockAssignmentRepository.getAllAssignmentsForS4Demand(DEMAND, WORK_PACKAGE))
        .thenReturn(Collections.singletonList(hardBookedAssignment));

    AssignmentBucketsYearMonthAggregate bucketsYearMonthAggregate = AssignmentBucketsYearMonthAggregate.create();
    bucketsYearMonthAggregate.setAssignmentId(ASSIGNMENT_ID);
    bucketsYearMonthAggregate.setYearMonth("202201");
    bucketsYearMonthAggregate.setBookedCapacityInHours(STAFFED_HOURS_FROM_S4);
    when(mockAssignmentRepository.getExistingMonthlyAggregatedAssignments(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Collections.singletonList(bucketsYearMonthAggregate));

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setId("bucket1");
    bucket1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setId("bucket2");
    bucket2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));
    when(mockAssignmentRepository.getAssignmentBucketsForPeriod(any(), any(), any()))
        .thenReturn(Arrays.asList(bucket1, bucket2));

    AssignmentsView assignmentDetailsForS4Demand = AssignmentsView.create();
    assignmentDetailsForS4Demand.setAssignmentId(ASSIGNMENT_ID);
    assignmentDetailsForS4Demand.setStartDate(LocalDate.of(2022, 01, 01));
    assignmentDetailsForS4Demand.setEndDate(LocalDate.of(2022, 01, 02));
    when(mockAssignmentRepository.getExistingAssignmentDetails(DEMAND, WORK_PACKAGE, SUPPLY))
        .thenReturn(Optional.of(assignmentDetailsForS4Demand));

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setId(REQUEST_ID);
    mockRequest.setStartDate(LocalDate.of(2022, 01, 01));
    mockRequest.setEndDate(LocalDate.of(2022, 03, 31));
    mockRequest.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockRequest.setEndTime(LocalDate.of(2022, 04, 01).atStartOfDay().toInstant(ZoneOffset.UTC)); // End TIME is start of
                                                                                                 // next day

    Optional<ResourceRequests> resourceRequests = Optional.of(mockRequest);
    when(mockAssignmentRepository.getResourceRequestForDemand(DEMAND, WORK_PACKAGE)).thenReturn(resourceRequests);
    when(mockAssignmentRepository.getResourceRequestDetails(REQUEST_ID)).thenReturn(resourceRequests);

    when(mockAssignmentRepository.getAssignmentForResourceAndRequest(RESOURCE_ID, REQUEST_ID))
        .thenReturn(Optional.empty());

    CapacityView resourceCapacityDay1 = CapacityView.create();
    resourceCapacityDay1.setStartTime(LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC));
    CapacityView resourceCapacityDay2 = CapacityView.create();
    resourceCapacityDay2.setStartTime(LocalDate.of(2022, 01, 02).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<CapacityView> resourceCapacityList = Arrays.asList(resourceCapacityDay1, resourceCapacityDay2);
    when(mockAssignmentRepository.getResourceCapacities(RESOURCE_ID,
        LocalDate.of(2022, 01, 01).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2022, 03, 31).atStartOfDay().toInstant(ZoneOffset.UTC))).thenReturn(resourceCapacityList);

    when(mockAssignmentRepository.getResourceStaffedOnAssignment(ASSIGNMENT_ID)).thenReturn(RESOURCE_ID);

    cut.compareAndUpdateAssignmentsAsPerSupply(resourceDemand, mockRequest);

    verify(mockAssignmentRepository, times(0)).updateAssignmentBuckets(any(), any(), any());
  }

}
