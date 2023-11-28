package com.sap.c4p.rm.assignment.utils;

import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.impl.runtime.RequestContextRunnerImpl;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

import com.sap.c4p.rm.assignment.enums.AssignmentStatus;
import com.sap.c4p.rm.assignment.enums.CapacityGridAssignmentAction;
import com.sap.c4p.rm.assignment.validation.AssignmentDraftsValidator;
import com.sap.c4p.rm.assignment.validation.AssignmentValidator;

import com.sap.resourcemanagement.resource.Types;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.workforce.workassignment.ExtnWorkAssignmentFirstJobDetails;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;
import capacityservice.AssignmentBucketsYearMonthAggregate;
import capacityservice.AssignmentsDetailsForCapacityGrid;

public class CapacityGridAssignmentsUtilityTest {

  private CapacityGridAssignmentsUtility classUnderTest;
  private static final String PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR = "ProcessingResourceOrganization";

  private static final int SIMULATE_DRAFTS_FOR_YEARMONTH = 0;
  private static final String ASSIGNMENT_ID = "assignment_id";
  private static final String RESOURCE_ID = "resource_id";
  private static final String RESOURCEREQUEST_ID = "resourcerequest_id";
  private static final String ASSIGNMENT_BUCKET_ID = "assignment_bucket_id";

  private DraftService mockDraftService;
  private DataProvider mockDataProvider;
  private AssignmentSimulationUtility mockAssignmentSimulationUtility;
  private AssignmentValidator mockValidator;
  private CdsRuntime mockCdsRuntime;

  private AssignmentDraftsValidator mockDraftValidator;
  private AssignmentDraftsUtility mockDraftUtility;

  @BeforeEach
  public void setUp() {
    this.mockDraftService = mock(DraftService.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockDataProvider = mock(DataProvider.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockAssignmentSimulationUtility = mock(AssignmentSimulationUtility.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockValidator = mock(AssignmentValidator.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockCdsRuntime = mock(CdsRuntime.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockDraftValidator = mock(AssignmentDraftsValidator.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockDraftUtility = mock(AssignmentDraftsUtility.class, Mockito.RETURNS_DEEP_STUBS);

    this.classUnderTest = new CapacityGridAssignmentsUtility(mockValidator, mockDraftValidator, mockDraftService,
        mockDataProvider, mockAssignmentSimulationUtility, mockCdsRuntime, mockDraftUtility);
  }

  @Test
  void returnsSameMonthlyValueAsPassedInUIPayload() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    Messages mockMessage = mock(Messages.class);

    AssignmentBucketsYearMonthAggregate mockAssignmentBucketsYearMonthAggregate = AssignmentBucketsYearMonthAggregate
        .create();
    mockAssignmentBucketsYearMonthAggregate.setAction(SIMULATE_DRAFTS_FOR_YEARMONTH);
    mockAssignmentBucketsYearMonthAggregate.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentBucketsYearMonthAggregate.setBookedCapacityInHours(42);
    mockAssignmentBucketsYearMonthAggregate.setStartDate(LocalDate.of(2021, 1, 1));
    mockAssignmentBucketsYearMonthAggregate.setEndDate(LocalDate.of(2021, 1, 31));
    mockAssignmentBucketsYearMonthAggregate.setTimePeriod("202101");

    Assignments mockAssignmentDraft = Assignments.create();
    mockAssignmentDraft.setId(ASSIGNMENT_ID);
    mockAssignmentDraft.setResourceId(RESOURCE_ID);
    mockAssignmentDraft.setResourceRequestId(RESOURCEREQUEST_ID);
    mockAssignmentDraft.setBookedCapacityInMinutes(120);

    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");
    when(mockContext.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(Collections.emptyList());
    when(mockContext.getMessages()).thenReturn(mockMessage);

    Result mockResult = mock(Result.class);
    when(mockDraftService.editDraft(any(CqnSelect.class), eq(false))).thenReturn(mockResult);
    when(mockResult.single(any())).thenReturn(mockAssignmentDraft);
    when(mockDraftService.run(any(CqnSelect.class)).first()).thenReturn(Optional.ofNullable(null));

    com.sap.resourcemanagement.assignment.AssignmentBuckets mockAssignmentBucket = com.sap.resourcemanagement.assignment.AssignmentBuckets
        .create();
    mockAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockAssignmentBucket.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentBucket.setStartTime(LocalDate.of(2020, 1, 1).atStartOfDay().toInstant(ZoneOffset.UTC));

    List<com.sap.resourcemanagement.assignment.AssignmentBuckets> mockBucketList = new ArrayList<>();
    mockBucketList.add(mockAssignmentBucket);

    RequestContextRunner mockContextRunner = mock(RequestContextRunner.class);
    when(mockCdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    when(mockDraftService.run(any(CqnSelect.class)).listOf(AssignmentBuckets.class))
        .thenReturn(Collections.emptyList());
    when(mockDataProvider.getAssignmentBuckets(ASSIGNMENT_ID)).thenReturn(mockBucketList);
    when(mockDataProvider.getResourceCapacities(any(), any(), any())).thenReturn(Collections.emptyList());
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.ofNullable(null));

    Map<String, Object> expectedResultMap = new HashMap<>();
    String timePeriod = mockAssignmentBucketsYearMonthAggregate.getTimePeriod();
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.ASSIGNMENT_ID,
        mockAssignmentBucketsYearMonthAggregate.getAssignmentId());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.START_DATE,
        mockAssignmentBucketsYearMonthAggregate.getStartDate().toString());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.END_DATE,
        mockAssignmentBucketsYearMonthAggregate.getEndDate().toString());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.TIME_PERIOD, timePeriod);
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.ACTION,
        mockAssignmentBucketsYearMonthAggregate.getAction());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.BOOKED_CAPACITY_IN_HOURS,
        mockAssignmentBucketsYearMonthAggregate.getBookedCapacityInHours());

    List<Map<String, Object>> expectedResultMapList = new ArrayList<>();
    expectedResultMapList.add(expectedResultMap);

    Assignments draftAssignment = Struct.create(Assignments.class);
    draftAssignment.setId(ASSIGNMENT_ID);
    draftAssignment.setResourceId(RESOURCE_ID);
    draftAssignment.setResourceRequestId(RESOURCEREQUEST_ID);
    draftAssignment.setHasActiveEntity(true);

    when(mockDataProvider.getAssignmentHeaderDraft(ASSIGNMENT_ID)).thenReturn(draftAssignment);

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(true);
    mockRequest.setProcessingResourceOrgId(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(any())).thenReturn(mockOptionalRequest);

    ExtnWorkAssignmentFirstJobDetails mockJobDetail = ExtnWorkAssignmentFirstJobDetails.create();
    mockJobDetail.setValidFrom(LocalDate.of(2021, 1, 1));
    mockJobDetail.setValidTo(LocalDate.of(2021, 1, 31));
    Optional<ExtnWorkAssignmentFirstJobDetails> extnWorkAssignment = Optional.of(mockJobDetail);
    when(mockDataProvider.getResourceValidity(any(), any(), any(), any())).thenReturn(extnWorkAssignment);

    List<Map<String, Object>> actualResultMapList = classUnderTest.updateAssignmentForMonth(mockContext,
        mockAssignmentBucketsYearMonthAggregate);

    assertIterableEquals(expectedResultMapList, actualResultMapList, "Result not same as payload");

  }

  @Test
  void oldAndNewDraftsGetUpdatedCorrectly() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    Messages mockMessage = mock(Messages.class);

    AssignmentBucketsYearMonthAggregate mockAssignmentBucketsYearMonthAggregate = AssignmentBucketsYearMonthAggregate
        .create();
    // For the month of Jan we want to update the booked capacity to 30h
    mockAssignmentBucketsYearMonthAggregate.setAction(SIMULATE_DRAFTS_FOR_YEARMONTH);
    mockAssignmentBucketsYearMonthAggregate.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentBucketsYearMonthAggregate.setBookedCapacityInHours(30);
    mockAssignmentBucketsYearMonthAggregate.setStartDate(LocalDate.of(2021, 1, 1));
    mockAssignmentBucketsYearMonthAggregate.setEndDate(LocalDate.of(2021, 1, 31));
    mockAssignmentBucketsYearMonthAggregate.setTimePeriod("202101");

    Assignments mockAssignmentDraft = Assignments.create();
    mockAssignmentDraft.setId(ASSIGNMENT_ID);
    mockAssignmentDraft.setResourceId(RESOURCE_ID);
    mockAssignmentDraft.setResourceRequestId(RESOURCEREQUEST_ID);
    mockAssignmentDraft.setBookedCapacityInMinutes(6000); // existing assignment has total staffed hours 100

    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");
    when(mockContext.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(Arrays.asList(new String[] { "CCIN" }));
    when(mockContext.getMessages()).thenReturn(mockMessage);

    Result mockResult = mock(Result.class);
    when(mockDraftService.editDraft(any(CqnSelect.class), eq(false))).thenReturn(mockResult);
    when(mockResult.single(any())).thenReturn(mockAssignmentDraft);
    when(mockDraftService.run(any(CqnSelect.class)).first()).thenReturn(Optional.ofNullable(null));

    com.sap.resourcemanagement.assignment.AssignmentBuckets mockAssignmentBucket = com.sap.resourcemanagement.assignment.AssignmentBuckets
        .create();
    mockAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockAssignmentBucket.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentBucket.setStartTime(Instant.now());
    mockAssignmentBucket.setBookedCapacityInMinutes(600); // existing bucket for 10h

    List<com.sap.resourcemanagement.assignment.AssignmentBuckets> mockBucketList = new ArrayList<>();
    mockBucketList.add(mockAssignmentBucket);

    RequestContextRunner mockContextRunner = new RequestContextRunnerImpl(mockCdsRuntime);
    when(mockCdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    AssignmentBuckets mockExistingAssignmentBucket = AssignmentBuckets.create();
    mockExistingAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockExistingAssignmentBucket.setStartTime(LocalDate.of(2022, 1, 1).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockExistingAssignmentBucket.setBookedCapacityInMinutes(120); // existing bucket in Jan for 2h -> Hours to subtract
                                                                  // from header

    List<AssignmentBuckets> mockExistingAssignmentBucketList = new ArrayList<>();
    mockExistingAssignmentBucketList.add(mockExistingAssignmentBucket);

    when(mockDraftService.run(any(CqnSelect.class)).listOf(AssignmentBuckets.class))
        .thenReturn(mockExistingAssignmentBucketList);
    when(mockDataProvider.getAssignmentBuckets(ASSIGNMENT_ID)).thenReturn(mockBucketList);
    when(mockDataProvider.getResourceCapacities(any(), any(), any())).thenReturn(Collections.emptyList());

    Types mockType = Types.create();
    mockType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(mockType));

    AssignmentBuckets mockSimulatedAssignmentBucket = AssignmentBuckets.create();
    mockSimulatedAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockSimulatedAssignmentBucket.setStartTime(LocalDate.of(2022, 1, 1).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockSimulatedAssignmentBucket.setBookedCapacityInMinutes(1800); // new bucket in Jan for 30h -> Hours to add to
                                                                    // header

    List<AssignmentBuckets> mockSimulatedAssignmentBucketList = new ArrayList<>();
    mockSimulatedAssignmentBucketList.add(mockSimulatedAssignmentBucket);
    when(mockAssignmentSimulationUtility.getDistributedAssignmentBuckets(60, 30, Collections.emptyList()))
        .thenReturn(mockSimulatedAssignmentBucketList);

    Map<String, Object> expectedResultMap = new HashMap<>();
    String timePeriod = mockAssignmentBucketsYearMonthAggregate.getTimePeriod();
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.ASSIGNMENT_ID,
        mockAssignmentBucketsYearMonthAggregate.getAssignmentId());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.START_DATE,
        mockAssignmentBucketsYearMonthAggregate.getStartDate().toString());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.END_DATE,
        mockAssignmentBucketsYearMonthAggregate.getEndDate().toString());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.TIME_PERIOD, timePeriod);
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.ACTION,
        mockAssignmentBucketsYearMonthAggregate.getAction());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.BOOKED_CAPACITY_IN_HOURS,
        mockAssignmentBucketsYearMonthAggregate.getBookedCapacityInHours());

    List<Map<String, Object>> expectedResultMapList = new ArrayList<>();
    expectedResultMapList.add(expectedResultMap);

    Assignments draftAssignment = Struct.create(Assignments.class);
    draftAssignment.setId(ASSIGNMENT_ID);
    draftAssignment.setResourceId(RESOURCE_ID);
    draftAssignment.setResourceRequestId(RESOURCEREQUEST_ID);
    draftAssignment.setHasActiveEntity(true);

    when(mockDataProvider.getAssignmentHeaderDraft(ASSIGNMENT_ID)).thenReturn(draftAssignment);

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(true);
    mockRequest.setProcessingResourceOrgId(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(any())).thenReturn(mockOptionalRequest);

    ExtnWorkAssignmentFirstJobDetails mockJobDetail = ExtnWorkAssignmentFirstJobDetails.create();
    mockJobDetail.setValidFrom(LocalDate.of(2021, 1, 1));
    mockJobDetail.setValidTo(LocalDate.of(2021, 1, 31));
    Optional<ExtnWorkAssignmentFirstJobDetails> extnWorkAssignment = Optional.of(mockJobDetail);
    when(mockDataProvider.getResourceValidity(any(), any(), any(), any())).thenReturn(extnWorkAssignment);

    classUnderTest.updateAssignmentForMonth(mockContext, mockAssignmentBucketsYearMonthAggregate);

    verify(mockDraftUtility, times(1)).updateAssignmentBucketsDrafts(any(), any());
    verify(mockDraftUtility, times(1)).updateBookedCapacityInHeader(ASSIGNMENT_ID);

  }

  @Test
  void draftNotActivatedIfValidationFails() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    Messages mockMessage = mock(Messages.class);

    AssignmentsDetailsForCapacityGrid mockAssignmentsDetailsForCapacityGrid = AssignmentsDetailsForCapacityGrid
        .create();
    mockAssignmentsDetailsForCapacityGrid.setAction(CapacityGridAssignmentAction.ACTIVATE_DRAFT.getActionCode());
    mockAssignmentsDetailsForCapacityGrid.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentsDetailsForCapacityGrid.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    when(mockDraftValidator.validate(mockContext)).thenReturn(mockMessage);
    doThrow(ServiceException.class).when(mockMessage).throwIfError();

    assertThrows(ServiceException.class, () -> classUnderTest.executeActionsOnAssignmentDetailsHeader(mockContext,
        mockAssignmentsDetailsForCapacityGrid));
    verifyNoInteractions(mockDraftService);

  }

  @Test
  void draftActivatedIfValidationSuccessful() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    Messages mockMessage = mock(Messages.class);

    AssignmentsDetailsForCapacityGrid mockAssignmentsDetailsForCapacityGrid = AssignmentsDetailsForCapacityGrid
        .create();
    mockAssignmentsDetailsForCapacityGrid.setAction(CapacityGridAssignmentAction.ACTIVATE_DRAFT.getActionCode());
    mockAssignmentsDetailsForCapacityGrid.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentsDetailsForCapacityGrid.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    when(mockDraftValidator.validate(mockContext)).thenReturn(mockMessage);

    classUnderTest.executeActionsOnAssignmentDetailsHeader(mockContext, mockAssignmentsDetailsForCapacityGrid);

    verify(mockDraftService, times(1)).saveDraft(any(CqnSelect.class));
  }

  @Test
  void draftGetsDeletedIfAskedFor() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);

    AssignmentsDetailsForCapacityGrid mockAssignmentsDetailsForCapacityGrid = AssignmentsDetailsForCapacityGrid
        .create();
    mockAssignmentsDetailsForCapacityGrid.setAction(CapacityGridAssignmentAction.DELETE_EXISTING_DRAFT.getActionCode());
    mockAssignmentsDetailsForCapacityGrid.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentsDetailsForCapacityGrid.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    classUnderTest.executeActionsOnAssignmentDetailsHeader(mockContext, mockAssignmentsDetailsForCapacityGrid);

    verify(mockDraftUtility, times(1)).deleteExistingDraft(ASSIGNMENT_ID);
  }

  @Test
  void draftExpiryGetsExtendedOnCorrespondingAction() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");
    when(mockContext.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(Collections.emptyList());

    AssignmentsDetailsForCapacityGrid mockAssignmentsDetailsForCapacityGrid = AssignmentsDetailsForCapacityGrid
        .create();
    mockAssignmentsDetailsForCapacityGrid.setAction(CapacityGridAssignmentAction.EXTEND_DRAFT_EXPIRY.getActionCode());
    mockAssignmentsDetailsForCapacityGrid.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentsDetailsForCapacityGrid.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    Result mockResult = mock(Result.class);
    Result mockAssignmentDraftResult = mock(Result.class);
    when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult).thenReturn(mockAssignmentDraftResult);

    Assignments existingAssignmentEditDraft = Assignments.create();
    existingAssignmentEditDraft.setId(ASSIGNMENT_ID);
    existingAssignmentEditDraft.setResourceId(RESOURCE_ID);
    existingAssignmentEditDraft.setResourceRequestId(RESOURCEREQUEST_ID);
    when(mockAssignmentDraftResult.single(any())).thenReturn(existingAssignmentEditDraft);

    Row existingDraftAdminRow = mock(Row.class);
    Optional<Row> mockOptionalRow = Optional.of(existingDraftAdminRow);
    when(mockResult.first()).thenReturn(mockOptionalRow);

    Map<String, Object> existingDraftAdminDataObject = new HashMap<>();
    existingDraftAdminDataObject.put(assignmentservice.DraftAdministrativeData.IN_PROCESS_BY_USER, "Rahul");
    when(existingDraftAdminRow.get(assignmentservice.Assignments.DRAFT_ADMINISTRATIVE_DATA))
        .thenReturn(existingDraftAdminDataObject);

    classUnderTest.executeActionsOnAssignmentDetailsHeader(mockContext, mockAssignmentsDetailsForCapacityGrid);
    verify(mockDraftService, times(1)).patchDraft(any(CqnUpdate.class));

  }

  @Test
  void validationToStopHardToSoftBookedChangeExecutesOnHeaderAction() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");
    when(mockContext.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(Collections.emptyList());

    AssignmentsDetailsForCapacityGrid mockAssignmentsDetailsForCapacityGrid = AssignmentsDetailsForCapacityGrid
        .create();
    mockAssignmentsDetailsForCapacityGrid.setAction(CapacityGridAssignmentAction.UPDATE_DRAFT.getActionCode());
    mockAssignmentsDetailsForCapacityGrid.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentsDetailsForCapacityGrid.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    Result mockResult = mock(Result.class);
    Result mockAssignmentDraftResult = mock(Result.class);
    when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult).thenReturn(mockAssignmentDraftResult);

    Assignments existingAssignmentEditDraft = Assignments.create();
    existingAssignmentEditDraft.setId(ASSIGNMENT_ID);
    existingAssignmentEditDraft.setResourceId(RESOURCE_ID);
    existingAssignmentEditDraft.setResourceRequestId(RESOURCEREQUEST_ID);
    existingAssignmentEditDraft.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(mockAssignmentDraftResult.single(any())).thenReturn(existingAssignmentEditDraft);

    Row existingDraftAdminRow = mock(Row.class);
    Optional<Row> mockOptionalRow = Optional.of(existingDraftAdminRow);
    when(mockResult.first()).thenReturn(mockOptionalRow);

    Map<String, Object> existingDraftAdminDataObject = new HashMap<>();
    existingDraftAdminDataObject.put(assignmentservice.DraftAdministrativeData.IN_PROCESS_BY_USER, "Rahul");
    when(existingDraftAdminRow.get(assignmentservice.Assignments.DRAFT_ADMINISTRATIVE_DATA))
        .thenReturn(existingDraftAdminDataObject);

    classUnderTest.executeActionsOnAssignmentDetailsHeader(mockContext, mockAssignmentsDetailsForCapacityGrid);
    verify(mockValidator, times(1)).validateAssignmentStatusChange(ASSIGNMENT_ID,
        mockAssignmentsDetailsForCapacityGrid.getAssignmentStatusCode());
  }

  @Test
  void validationsForResourceAvailabilityAndBookingGranularityNotRunIfBookedHoursIsZero() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    Messages mockMessage = mock(Messages.class);

    AssignmentBucketsYearMonthAggregate mockAssignmentBucketsYearMonthAggregate = AssignmentBucketsYearMonthAggregate
        .create();
    mockAssignmentBucketsYearMonthAggregate.setAction(CapacityGridAssignmentAction.UPDATE_DRAFT.getActionCode());
    mockAssignmentBucketsYearMonthAggregate.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentBucketsYearMonthAggregate.setBookedCapacityInHours(0);
    mockAssignmentBucketsYearMonthAggregate.setStartDate(LocalDate.of(2021, 1, 1));
    mockAssignmentBucketsYearMonthAggregate.setEndDate(LocalDate.of(2021, 1, 31));
    mockAssignmentBucketsYearMonthAggregate.setTimePeriod("202101");

    Assignments mockAssignmentDraft = Assignments.create();
    mockAssignmentDraft.setId(ASSIGNMENT_ID);
    mockAssignmentDraft.setResourceId(RESOURCE_ID);
    mockAssignmentDraft.setResourceRequestId(RESOURCEREQUEST_ID);
    mockAssignmentDraft.setBookedCapacityInMinutes(60);

    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");
    when(mockContext.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(Arrays.asList(new String[] { "CCIN" }));
    when(mockContext.getMessages()).thenReturn(mockMessage);

    Result mockResult = mock(Result.class);
    when(mockDraftService.editDraft(any(CqnSelect.class), eq(false))).thenReturn(mockResult);
    when(mockResult.single(any())).thenReturn(mockAssignmentDraft);
    when(mockDraftService.run(any(CqnSelect.class)).first()).thenReturn(Optional.ofNullable(null));

    com.sap.resourcemanagement.assignment.AssignmentBuckets mockAssignmentBucket = com.sap.resourcemanagement.assignment.AssignmentBuckets
        .create();
    mockAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockAssignmentBucket.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentBucket.setStartTime(Instant.now());
    mockAssignmentBucket.setBookedCapacityInMinutes(60);

    List<com.sap.resourcemanagement.assignment.AssignmentBuckets> mockBucketList = new ArrayList<>();
    mockBucketList.add(mockAssignmentBucket);

    RequestContextRunner mockContextRunner = new RequestContextRunnerImpl(mockCdsRuntime);
    when(mockCdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    AssignmentBuckets mockExistingAssignmentBucket = AssignmentBuckets.create();
    mockExistingAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockExistingAssignmentBucket.setStartTime(LocalDate.of(2022, 1, 1).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockExistingAssignmentBucket.setBookedCapacityInMinutes(60);

    List<AssignmentBuckets> mockExistingAssignmentBucketList = new ArrayList<>();
    mockExistingAssignmentBucketList.add(mockExistingAssignmentBucket);

    when(mockDraftService.run(any(CqnSelect.class)).listOf(AssignmentBuckets.class))
        .thenReturn(mockExistingAssignmentBucketList);
    when(mockDataProvider.getAssignmentBuckets(ASSIGNMENT_ID)).thenReturn(mockBucketList);
    when(mockDataProvider.getResourceCapacities(any(), any(), any())).thenReturn(Collections.emptyList());

    Types mockType = Types.create();
    mockType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(mockType));

    AssignmentBuckets mockSimulatedAssignmentBucket = AssignmentBuckets.create();
    mockSimulatedAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockSimulatedAssignmentBucket.setStartTime(Instant.now());
    mockSimulatedAssignmentBucket.setBookedCapacityInMinutes(60);

    List<AssignmentBuckets> mockSimulatedAssignmentBucketList = new ArrayList<>();
    mockSimulatedAssignmentBucketList.add(mockSimulatedAssignmentBucket);
    when(mockAssignmentSimulationUtility.getDistributedAssignmentBuckets(60, 42, Collections.emptyList()))
        .thenReturn(mockSimulatedAssignmentBucketList);

    Map<String, Object> expectedResultMap = new HashMap<>();
    String timePeriod = mockAssignmentBucketsYearMonthAggregate.getTimePeriod();
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.ASSIGNMENT_ID,
        mockAssignmentBucketsYearMonthAggregate.getAssignmentId());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.START_DATE,
        mockAssignmentBucketsYearMonthAggregate.getStartDate().toString());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.END_DATE,
        mockAssignmentBucketsYearMonthAggregate.getEndDate().toString());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.TIME_PERIOD, timePeriod);
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.ACTION,
        mockAssignmentBucketsYearMonthAggregate.getAction());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.BOOKED_CAPACITY_IN_HOURS,
        mockAssignmentBucketsYearMonthAggregate.getBookedCapacityInHours());

    List<Map<String, Object>> expectedResultMapList = new ArrayList<>();
    expectedResultMapList.add(expectedResultMap);

    Assignments draftAssignment = Struct.create(Assignments.class);
    draftAssignment.setId(ASSIGNMENT_ID);
    draftAssignment.setResourceId(RESOURCE_ID);
    draftAssignment.setResourceRequestId(RESOURCEREQUEST_ID);
    draftAssignment.setHasActiveEntity(true);

    when(mockDataProvider.getAssignmentHeaderDraft(ASSIGNMENT_ID)).thenReturn(draftAssignment);

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(true);
    mockRequest.setProcessingResourceOrgId(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(any())).thenReturn(mockOptionalRequest);

    ExtnWorkAssignmentFirstJobDetails mockJobDetail = ExtnWorkAssignmentFirstJobDetails.create();
    mockJobDetail.setValidFrom(LocalDate.of(2021, 1, 1));
    mockJobDetail.setValidTo(LocalDate.of(2021, 1, 31));
    Optional<ExtnWorkAssignmentFirstJobDetails> extnWorkAssignment = Optional.of(mockJobDetail);
    when(mockDataProvider.getResourceValidity(any(), any(), any(), any())).thenReturn(extnWorkAssignment);

    classUnderTest.updateAssignmentForMonth(mockContext, mockAssignmentBucketsYearMonthAggregate);
    verify(mockValidator, times(0)).validateResourceAvailability(any(), any(), any());
    verify(mockValidator, times(0)).validateResourceBookingGranularity(any(), anyInt());
  }

  @Test
  void validationsForResourceAvailabilityAndBookingGranularityAreRunIfBookedHoursIsGreaterThanZero() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    Messages mockMessage = mock(Messages.class);

    AssignmentBucketsYearMonthAggregate mockAssignmentBucketsYearMonthAggregate = AssignmentBucketsYearMonthAggregate
        .create();
    mockAssignmentBucketsYearMonthAggregate.setAction(CapacityGridAssignmentAction.UPDATE_DRAFT.getActionCode());
    mockAssignmentBucketsYearMonthAggregate.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentBucketsYearMonthAggregate.setBookedCapacityInHours(1);
    mockAssignmentBucketsYearMonthAggregate.setStartDate(LocalDate.of(2021, 1, 1));
    mockAssignmentBucketsYearMonthAggregate.setEndDate(LocalDate.of(2021, 1, 31));
    mockAssignmentBucketsYearMonthAggregate.setTimePeriod("202101");

    Assignments mockAssignmentDraft = Assignments.create();
    mockAssignmentDraft.setId(ASSIGNMENT_ID);
    mockAssignmentDraft.setResourceId(RESOURCE_ID);
    mockAssignmentDraft.setResourceRequestId(RESOURCEREQUEST_ID);
    mockAssignmentDraft.setBookedCapacityInMinutes(60);

    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");
    when(mockContext.getUserInfo().getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR))
        .thenReturn(Arrays.asList(new String[] { "CCIN" }));
    when(mockContext.getMessages()).thenReturn(mockMessage);

    Result mockResult = mock(Result.class);
    when(mockDraftService.editDraft(any(CqnSelect.class), eq(false))).thenReturn(mockResult);
    when(mockResult.single(any())).thenReturn(mockAssignmentDraft);
    when(mockDraftService.run(any(CqnSelect.class)).first()).thenReturn(Optional.ofNullable(null));

    com.sap.resourcemanagement.assignment.AssignmentBuckets mockAssignmentBucket = com.sap.resourcemanagement.assignment.AssignmentBuckets
        .create();
    mockAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockAssignmentBucket.setAssignmentId(ASSIGNMENT_ID);
    mockAssignmentBucket.setStartTime(Instant.now());
    mockAssignmentBucket.setBookedCapacityInMinutes(60);

    List<com.sap.resourcemanagement.assignment.AssignmentBuckets> mockBucketList = new ArrayList<>();
    mockBucketList.add(mockAssignmentBucket);

    RequestContextRunner mockContextRunner = new RequestContextRunnerImpl(mockCdsRuntime);
    when(mockCdsRuntime.requestContext().modifyParameters(any()).modifyParameters(any())).thenReturn(mockContextRunner);

    AssignmentBuckets mockExistingAssignmentBucket = AssignmentBuckets.create();
    mockExistingAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockExistingAssignmentBucket.setStartTime(LocalDate.of(2022, 1, 1).atStartOfDay().toInstant(ZoneOffset.UTC));
    mockExistingAssignmentBucket.setBookedCapacityInMinutes(60);

    List<AssignmentBuckets> mockExistingAssignmentBucketList = new ArrayList<>();
    mockExistingAssignmentBucketList.add(mockExistingAssignmentBucket);

    when(mockDraftService.run(any(CqnSelect.class)).listOf(AssignmentBuckets.class))
        .thenReturn(mockExistingAssignmentBucketList);
    when(mockDataProvider.getAssignmentBuckets(ASSIGNMENT_ID)).thenReturn(mockBucketList);
    when(mockDataProvider.getResourceCapacities(any(), any(), any())).thenReturn(Collections.emptyList());

    Types mockType = Types.create();
    mockType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(mockType));

    AssignmentBuckets mockSimulatedAssignmentBucket = AssignmentBuckets.create();
    mockSimulatedAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockSimulatedAssignmentBucket.setStartTime(Instant.now());
    mockSimulatedAssignmentBucket.setBookedCapacityInMinutes(60);

    List<AssignmentBuckets> mockSimulatedAssignmentBucketList = new ArrayList<>();
    mockSimulatedAssignmentBucketList.add(mockSimulatedAssignmentBucket);
    when(mockAssignmentSimulationUtility.getDistributedAssignmentBuckets(60, 42, Collections.emptyList()))
        .thenReturn(mockSimulatedAssignmentBucketList);

    Map<String, Object> expectedResultMap = new HashMap<>();
    String timePeriod = mockAssignmentBucketsYearMonthAggregate.getTimePeriod();
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.ASSIGNMENT_ID,
        mockAssignmentBucketsYearMonthAggregate.getAssignmentId());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.START_DATE,
        mockAssignmentBucketsYearMonthAggregate.getStartDate().toString());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.END_DATE,
        mockAssignmentBucketsYearMonthAggregate.getEndDate().toString());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.TIME_PERIOD, timePeriod);
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.ACTION,
        mockAssignmentBucketsYearMonthAggregate.getAction());
    expectedResultMap.put(AssignmentBucketsYearMonthAggregate.BOOKED_CAPACITY_IN_HOURS,
        mockAssignmentBucketsYearMonthAggregate.getBookedCapacityInHours());

    List<Map<String, Object>> expectedResultMapList = new ArrayList<>();
    expectedResultMapList.add(expectedResultMap);

    Assignments draftAssignment = Struct.create(Assignments.class);
    draftAssignment.setId(ASSIGNMENT_ID);
    draftAssignment.setResourceId(RESOURCE_ID);
    draftAssignment.setResourceRequestId(RESOURCEREQUEST_ID);
    draftAssignment.setHasActiveEntity(true);

    when(mockDraftUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(draftAssignment);
    when(mockDataProvider.getAssignmentHeaderDraft(ASSIGNMENT_ID)).thenReturn(draftAssignment);

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(true);
    mockRequest.setProcessingResourceOrgId(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(any())).thenReturn(mockOptionalRequest);

    ExtnWorkAssignmentFirstJobDetails mockJobDetail = ExtnWorkAssignmentFirstJobDetails.create();
    mockJobDetail.setValidFrom(LocalDate.of(2021, 1, 1));
    mockJobDetail.setValidTo(LocalDate.of(2021, 1, 31));
    Optional<ExtnWorkAssignmentFirstJobDetails> extnWorkAssignment = Optional.of(mockJobDetail);
    when(mockDataProvider.getResourceValidity(any(), any(), any(), any())).thenReturn(extnWorkAssignment);

    classUnderTest.updateAssignmentForMonth(mockContext, mockAssignmentBucketsYearMonthAggregate);
    verify(mockValidator, times(1)).validateResourceAvailability(RESOURCE_ID,
        LocalDate.of(2021, 1, 1).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2021, 1, 31).atStartOfDay().toInstant(ZoneOffset.UTC));
    verify(mockValidator, times(1)).validateResourceBookingGranularity(RESOURCE_ID, 60);
  }

}
