package com.sap.c4p.rm.assignment.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import com.sap.cds.Result;
import com.sap.cds.ResultBuilder;
import com.sap.cds.Struct;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Message;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

import com.sap.c4p.rm.assignment.utils.AssignmentDraftsUtility;
import com.sap.c4p.rm.assignment.utils.AssignmentSimulationUtility;
import com.sap.c4p.rm.assignment.utils.CapacityGridAssignmentsUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;
import com.sap.c4p.rm.assignment.utils.EventContextKeysExtractor;
import com.sap.c4p.rm.assignment.validation.AssignmentDraftsValidator;
import com.sap.c4p.rm.assignment.validation.AssignmentValidator;

import com.sap.resourcemanagement.assignment.AssignmentStatus;
import com.sap.resourcemanagement.capacitygrid.CapacityGridHeaderKPITemporal;
import com.sap.resourcemanagement.capacitygridassignment.ResourceRequestAssignmentAggregate;
import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.ResourceDetailsForTimeWindow;
import com.sap.resourcemanagement.resource.Types;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequestDetails;
import com.sap.resourcemanagement.workforce.workassignment.ExtnWorkAssignmentFirstJobDetails;

import assignmentservice.AssignmentBuckets;
import capacityservice.AssignmentBucketsPerDay;
import capacityservice.AssignmentBucketsYearMonthAggregate;
import capacityservice.AssignmentBucketsYearWeekAggregate;
import capacityservice.AssignmentsDetailsForCapacityGrid;

public class CapacityGridServiceHandlerTest {

  @Mock
  CapacityGridServiceHandler capacityGridServiceHandler;

  private static final String ACTIVE_ASSIGNMENT_ID = "ASSIGNMENT_ID";
  private static final String RESOURCE_ID = "RESOURCE_ID";
  private static final String REQUEST_ID = "REQUEST_ID";
  private static final String BUCKET_ID = "BUCKET_ID";
  private static final LocalDate assignmentStartDate = LocalDate.parse("2023-12-01");
  private static final LocalDate assignmentEndDate = LocalDate.parse("2023-12-10");
  private static final int REQUEST_PUBLISHED = 1;
  private static final String ASSIGNMENT_BUCKET_ID = "assignment_bucket_id";

  private PersistenceService mockPersistenceService;
  private CdsRuntime cdsRuntime;
  private DataProvider mockDataProvider;
  private AssignmentSimulationUtility mockAssignmentUtility;
  private DraftService mockDraftService;
  private AssignmentDraftsValidator mockDraftsValidator;
  private AssignmentValidator mockAssignmentValidator;
  private Messages mockMessages;
  private CqnService mockAssignmentService;
  private EventContextKeysExtractor mockEventContextKeysExtractor;
  private AssignmentDraftsUtility mockDraftUtility;

  @Mock
  private CapacityGridAssignmentsUtility mockGridUtility;
  private static final String PROCESSING_RESOURCE_ORGANIZATION = "ProcessingResourceOrganization";

  @Mock
  Result result;

  @BeforeEach
  public void setUp() {
    this.cdsRuntime = mock(CdsRuntime.class, RETURNS_DEEP_STUBS);
    this.mockPersistenceService = mock(PersistenceService.class);
    this.mockGridUtility = mock(CapacityGridAssignmentsUtility.class);
    this.mockDataProvider = mock(DataProvider.class);
    this.mockAssignmentUtility = mock(AssignmentSimulationUtility.class);
    this.mockDraftService = mock(DraftService.class, RETURNS_DEEP_STUBS);
    this.mockDraftsValidator = mock(AssignmentDraftsValidator.class);
    this.mockAssignmentValidator = mock(AssignmentValidator.class);
    this.mockMessages = mock(Messages.class);
    this.mockAssignmentService = mock(CqnService.class);
    this.mockEventContextKeysExtractor = mock(EventContextKeysExtractor.class);
    this.mockDraftUtility = mock(AssignmentDraftsUtility.class);
    this.capacityGridServiceHandler = new CapacityGridServiceHandler(mockPersistenceService, cdsRuntime,
        mockGridUtility, mockDataProvider, mockAssignmentUtility, mockDraftService, mockDraftsValidator,
        mockAssignmentValidator, mockMessages, mockDraftUtility, mockAssignmentService, mockEventContextKeysExtractor);
  }

// Put this in the end later...
  @Test
  @DisplayName("Assignment creation from the grid")
  public void exceptionRaisedOnEmptyFields() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);

    AssignmentsDetailsForCapacityGrid mockAsgnDetails = AssignmentsDetailsForCapacityGrid.create();

    assertThrows(ServiceException.class,
        () -> capacityGridServiceHandler.createAssignment(mockContext, mockAsgnDetails));

    mockAsgnDetails.setResourceRequestId(REQUEST_ID);

    assertThrows(ServiceException.class,
        () -> capacityGridServiceHandler.createAssignment(mockContext, mockAsgnDetails));

    mockAsgnDetails.setResourceId(RESOURCE_ID);

    assertThrows(ServiceException.class,
        () -> capacityGridServiceHandler.createAssignment(mockContext, mockAsgnDetails));

    mockAsgnDetails.setAssignmentStartDate(assignmentStartDate);
    assertThrows(ServiceException.class,
        () -> capacityGridServiceHandler.createAssignment(mockContext, mockAsgnDetails));
  }

  @Test
  void checkSuccessfulCreationInCaseOfNoExceptions() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);

    AssignmentsDetailsForCapacityGrid mockAsgnDetails = AssignmentsDetailsForCapacityGrid.create();

    List<AssignmentsDetailsForCapacityGrid> AssignmentsDetailsForCapacityGridResult = new ArrayList<>();

    AssignmentsDetailsForCapacityGridResult.add(mockAsgnDetails);

    mockAsgnDetails.setResourceRequestId(REQUEST_ID);

    mockAsgnDetails.setResourceId(RESOURCE_ID);

    mockAsgnDetails.setAssignmentStatusCode(com.sap.c4p.rm.assignment.enums.AssignmentStatus.SOFTBOOKED.getCode());

    mockAsgnDetails.setAssignmentStartDate(assignmentStartDate);

    mockAsgnDetails.setAssignmentEndDate(assignmentEndDate);

    assignmentservice.Assignments mockAssignment = assignmentservice.Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceId(REQUEST_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(com.sap.c4p.rm.assignment.enums.AssignmentStatus.SOFTBOOKED.getCode());

    AssignmentBuckets mockAssignmentBucket = AssignmentBuckets.create();
    mockAssignmentBucket.setId(BUCKET_ID);
    mockAssignmentBucket.setAssignmentId(ACTIVE_ASSIGNMENT_ID);
    mockAssignmentBucket.setStartTime(Instant.now());
    mockAssignmentBucket.setBookedCapacityInMinutes(420);

    List<assignmentservice.AssignmentBuckets> assignmentBuckets = new ArrayList<>();
    assignmentBuckets.add(mockAssignmentBucket);

    mockAssignment.setAssignmentBuckets(assignmentBuckets);

    when(mockDataProvider.getAssignmentBucketsDraft(ACTIVE_ASSIGNMENT_ID)).thenReturn(Collections.emptyList());

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessages);

    Message mockInfoMessage = mock(Message.class);
    when(mockContext.getMessages().info(any(), any())).thenReturn(mockInfoMessage);

    when(mockDraftService.newDraft(any(CqnInsert.class)).first(assignmentservice.Assignments.class))
        .thenReturn(Optional.of(mockAssignment));

    // Prepare requests
    String resourceRequestID = REQUEST_ID;
    LocalDate startDate = LocalDate.of(2020, Month.OCTOBER, 1);
    LocalDate endDate = LocalDate.of(2020, Month.OCTOBER, 10);
    ResourceRequestDetails resourceRequest = ResourceRequestDetails.create();

    resourceRequest.setStartDate(startDate);
    resourceRequest.setEndDate(endDate);
    resourceRequest.setRequestStatusCode(REQUEST_PUBLISHED);
    resourceRequest.setRequestedCapacityInMinutes(120);

    resourceRequest.setProjectId("ProjId");
    resourceRequest.setProjectName("Project Name");

    resourceRequest.setProjectRoleId("RoleId");
    resourceRequest.setProjectRoleName("Role Name");

    Optional<ResourceRequestDetails> resourceRequests = Optional.of(resourceRequest);

    when(mockDataProvider.getRequestDetails(resourceRequestID)).thenReturn(resourceRequests);

    ResourceDetailsForTimeWindow resourceDetailsForTimeWindow = ResourceDetailsForTimeWindow.create();
    resourceDetailsForTimeWindow.setResourceOrgCode("ORG1");
    Optional<ResourceDetailsForTimeWindow> resourceDetailsForTimeWindows = Optional.of(resourceDetailsForTimeWindow);
    when(mockDataProvider.getMatchingTimeSlice(RESOURCE_ID)).thenReturn(resourceDetailsForTimeWindows);

    ResourceRequestAssignmentAggregate resourceRequestAssignmentAggregate = ResourceRequestAssignmentAggregate.create();
    resourceRequestAssignmentAggregate.setTotalRequestbookedCapacityInMinutes(60);
    Optional<ResourceRequestAssignmentAggregate> resourceRequestAssignmentAggregates = Optional
        .of(resourceRequestAssignmentAggregate);
    when(mockDataProvider.getResourceRequestAssignmentAggregateData(resourceRequestID))
        .thenReturn(resourceRequestAssignmentAggregates);

    AssignmentStatus assignmentStatusText = AssignmentStatus.create();
    assignmentStatusText.setCode(0);
    assignmentStatusText.setName("HardBooked");
    Optional<AssignmentStatus> assignmentStatus = Optional.of(assignmentStatusText);
    when(mockDataProvider.getAssignmentStatus(0)).thenReturn(assignmentStatus);

    assignmentStatusText.setCode(1);
    assignmentStatusText.setName("SoftBooked");
    Optional<AssignmentStatus> assignmentStatusSoftBooked = Optional.of(assignmentStatusText);
    when(mockDataProvider.getAssignmentStatus(1)).thenReturn(assignmentStatusSoftBooked);

    Messages mockMessage = mock(Messages.class);
    when(mockAssignmentValidator.getMessages()).thenReturn(mockMessage);

    // Prepare resource capacity
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

    when(mockDataProvider.getResourceCapacities(any(), any(), any())).thenReturn(resourceCapacityList);

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

    when(mockDataProvider.getRequestCapacityRequirements(any())).thenReturn(requestCapacityRequirementList);

    Optional<Types> resourceBookingGranularityInMinutes = Optional.of(resourceBookingGranularity);

    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID))
        .thenReturn(resourceBookingGranularityInMinutes);

    AssignmentBuckets mockSimulatedAssignmentBucket = AssignmentBuckets.create();
    mockSimulatedAssignmentBucket.setId(ASSIGNMENT_BUCKET_ID);
    mockSimulatedAssignmentBucket.setStartTime(Instant.now());
    mockSimulatedAssignmentBucket.setBookedCapacityInMinutes(60);

    List<AssignmentBuckets> mockSimulatedAssignmentBucketList = new ArrayList<>();
    mockSimulatedAssignmentBucketList.add(mockSimulatedAssignmentBucket);
    when(mockAssignmentUtility.getDistributedAssignmentBuckets(60, 1, Collections.emptyList()))
        .thenReturn(mockSimulatedAssignmentBucketList);

    Instant validFrom = Instant.parse("2019-01-04T11:25:30.00Z");
    Instant validTo = Instant.parse("2019-01-04T11:25:30.00Z");

    RequestContextRunner requestContextRunner = mock(RequestContextRunner.class);

    when(cdsRuntime.requestContext().modifyParameters(p -> p.setValidFrom(validFrom))
        .modifyParameters(p -> p.setValidTo(validTo))).thenReturn(requestContextRunner);

    Map<String, LocalDate> result = new HashMap<>();
    result.put(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_START_DATE, startDate);
    result.put(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_END_DATE, endDate);

    when(mockAssignmentUtility.getHeaderDatesFromBuckets(any())).thenReturn(result);

    List<AssignmentBucketsPerDay> assignmentBucketsPerDayResult = new ArrayList<>();
    AssignmentBucketsPerDay mockBucketsPerDay = AssignmentBucketsPerDay.create();
    mockBucketsPerDay.setAssignmentId(ACTIVE_ASSIGNMENT_ID);
    mockBucketsPerDay.setDate(startDate);
    assignmentBucketsPerDayResult.add(mockBucketsPerDay);

    when(mockAssignmentUtility.prepareAssignmentBucketsPerDayResult(any(), any(), any()))
        .thenReturn(assignmentBucketsPerDayResult);

    List<AssignmentBucketsYearWeekAggregate> assignmentBucketsYearWeekAggregateResult = new ArrayList<>();
    AssignmentBucketsYearWeekAggregate mockBucketsPerWeek = AssignmentBucketsYearWeekAggregate.create();
    mockBucketsPerWeek.setAssignmentId(ACTIVE_ASSIGNMENT_ID);
    mockBucketsPerWeek.setTimePeriod("TIMEPERIOD");
    assignmentBucketsYearWeekAggregateResult.add(mockBucketsPerWeek);

    when(mockAssignmentUtility.prepareAssignmentBucketsYearWeekResult(any(), any(), any()))
        .thenReturn(assignmentBucketsYearWeekAggregateResult);

    List<AssignmentBucketsYearMonthAggregate> assignmentBucketsYearMonthAggregateResult = new ArrayList<>();
    AssignmentBucketsYearMonthAggregate mockBucketsPerMonth = AssignmentBucketsYearMonthAggregate.create();
    mockBucketsPerMonth.setAssignmentId(ACTIVE_ASSIGNMENT_ID);
    mockBucketsPerMonth.setTimePeriod("TIMEPERIOD");
    assignmentBucketsYearMonthAggregateResult.add(mockBucketsPerMonth);

    when(mockAssignmentUtility.prepareAssignmentBucketsYearMonthResult(any(), any(), any()))
        .thenReturn(assignmentBucketsYearMonthAggregateResult);

    ExtnWorkAssignmentFirstJobDetails mockJobDetail = ExtnWorkAssignmentFirstJobDetails.create();
    mockJobDetail.setValidFrom(startDate);
    mockJobDetail.setValidTo(endDate);
    Optional<ExtnWorkAssignmentFirstJobDetails> extnWorkAssignment = Optional.of(mockJobDetail);
    when(mockDataProvider.getResourceValidity(any(), any(), any(), any())).thenReturn(extnWorkAssignment);

    capacityGridServiceHandler.createAssignment(mockContext, mockAsgnDetails);

    Map<String, String> assignmentDetails = new HashMap<>();

    assignmentDetails.put("assignmentID", mockAsgnDetails.getAssignmentId());
    assignmentDetails.put("requestID", REQUEST_ID);
    assignmentDetails.put("resourceID", RESOURCE_ID);

    verify(mockAssignmentValidator).validateExistingAssignment(mockContext.getEvent(), assignmentDetails);
    // verify(mockDraftService).patchDraft(any()); // From update booked capacity in
    // header
    verify(mockContext, times(2)).setResult(any());
    verify(mockContext, times(2)).setCompleted();

  }

  @Test
  void deleteTriggersAssignmentService() {
    Map<String, Object> dummyContextKeys = new HashMap<>();

    dummyContextKeys.put(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_ID, ACTIVE_ASSIGNMENT_ID);

    CdsDeleteEventContext dummyContext = mock(CdsDeleteEventContext.class);
    when(mockEventContextKeysExtractor.getDeleteEventContextKeys(dummyContext)).thenReturn(dummyContextKeys);

    assignmentservice.Assignments draftAssignment = Struct.create(assignmentservice.Assignments.class);
    draftAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    draftAssignment.setResourceId(RESOURCE_ID);
    draftAssignment.setResourceRequestId(REQUEST_ID);
    draftAssignment.setHasActiveEntity(false);

    when(mockDataProvider.getAssignmentHeaderDraft(ACTIVE_ASSIGNMENT_ID)).thenReturn(draftAssignment);

    capacityGridServiceHandler.deleteAssignment(dummyContext);

    verify(mockGridUtility, times(1)).deleteExistingEditDraft(ACTIVE_ASSIGNMENT_ID);
    verify(mockAssignmentService, times(0)).emit(any(CdsDeleteEventContext.class));
    verify(dummyContext, times(1)).setResult(any());
    verify(dummyContext, times(1)).setCompleted();

    draftAssignment.setHasActiveEntity(true);
    capacityGridServiceHandler.deleteAssignment(dummyContext);

    verify(mockAssignmentService, times(1)).emit(any(CdsDeleteEventContext.class));
    verify(dummyContext, times(2)).setResult(any());
    verify(dummyContext, times(2)).setCompleted();

  }

  @Test
  @DisplayName("Result map returned by utility is set as result in context")
  public void contextSetCorrectly() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    AssignmentBucketsYearMonthAggregate mockAsgnUpdate = mock(AssignmentBucketsYearMonthAggregate.class);
    List<Map<String, Object>> mockResultReturned = new ArrayList<>();

    when(mockGridUtility.updateAssignmentForMonth(mockContext, mockAsgnUpdate)).thenReturn(mockResultReturned);

    capacityGridServiceHandler.updateAssignmentForMonth(mockContext, mockAsgnUpdate);

    verify(mockContext).setResult(mockResultReturned);
    verify(mockContext).setCompleted();
  }

  @Test
  @DisplayName("Result map set by update handler is used by read handler")
  public void readHandlerSetsCorrectDataInContext() {

    CdsUpdateEventContext mockUpdateContext = mock(CdsUpdateEventContext.class);
    CdsReadEventContext mockReadContext = mock(CdsReadEventContext.class);
    AssignmentBucketsYearMonthAggregate mockAsgnUpdate = mock(AssignmentBucketsYearMonthAggregate.class);
    List<Map<String, Object>> mockResultReturnedOnUpdate = new ArrayList<>();

    when(mockGridUtility.updateAssignmentForMonth(mockUpdateContext, mockAsgnUpdate))
        .thenReturn(mockResultReturnedOnUpdate);

    capacityGridServiceHandler.updateAssignmentForMonth(mockUpdateContext, mockAsgnUpdate);
    capacityGridServiceHandler.readUpdatedAssignmentBucketsAggregate(mockReadContext);

    verify(mockReadContext).setResult(mockResultReturnedOnUpdate);
    verify(mockReadContext).setCompleted();
  }

  @Test
  @DisplayName("Result map returned by utility is set as result in context for daily view")
  public void contextSetCorrectlyDailyView() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    AssignmentBucketsPerDay mockAsgnUpdate = mock(AssignmentBucketsPerDay.class);
    List<Map<String, Object>> mockResultReturned = new ArrayList<>();

    when(mockGridUtility.updateAssignmentForTheDay(mockContext, mockAsgnUpdate)).thenReturn(mockResultReturned);

    capacityGridServiceHandler.updateAssignmentForTheDay(mockContext, mockAsgnUpdate);

    verify(mockContext).setResult(mockResultReturned);
    verify(mockContext).setCompleted();
  }

  @Test
  @DisplayName("Result map set by update handler is used by read handler")
  public void readHandlerSetsCorrectDataInContextDailyView() {

    CdsUpdateEventContext mockUpdateContext = mock(CdsUpdateEventContext.class);
    CdsReadEventContext mockReadContext = mock(CdsReadEventContext.class);
    AssignmentBucketsPerDay mockAsgnUpdate = mock(AssignmentBucketsPerDay.class);
    List<Map<String, Object>> mockResultReturnedOnUpdate = new ArrayList<>();

    when(mockGridUtility.updateAssignmentForTheDay(mockUpdateContext, mockAsgnUpdate))
        .thenReturn(mockResultReturnedOnUpdate);

    capacityGridServiceHandler.updateAssignmentForTheDay(mockUpdateContext, mockAsgnUpdate);
    capacityGridServiceHandler.readUpdatedAssignmentBucketsAggregate(mockReadContext);

    verify(mockReadContext).setResult(mockResultReturnedOnUpdate);
    verify(mockReadContext).setCompleted();
  }

  @Test
  @DisplayName("Result map returned by utility is set as result in context for weekly view")
  public void contextSetCorrectlyWeeklyView() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    AssignmentBucketsYearWeekAggregate mockAsgnUpdate = mock(AssignmentBucketsYearWeekAggregate.class);
    List<Map<String, Object>> mockResultReturned = new ArrayList<>();

    when(mockGridUtility.updateAssignmentForTheWeek(mockContext, mockAsgnUpdate)).thenReturn(mockResultReturned);

    capacityGridServiceHandler.updateAssignmentForTheWeek(mockContext, mockAsgnUpdate);

    verify(mockContext).setResult(mockResultReturned);
    verify(mockContext).setCompleted();
  }

  @Test
  @DisplayName("Result map returned by utility is set as result in context for Assignment details header")
  public void contextSetCorrectlyForHeaderActions() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    AssignmentsDetailsForCapacityGrid mockAssignmentsDetailsForCapacityGrid = mock(
        AssignmentsDetailsForCapacityGrid.class);
    List<Map<String, Object>> mockResultReturned = new ArrayList<>();

    when(mockGridUtility.executeActionsOnAssignmentDetailsHeader(mockContext, mockAssignmentsDetailsForCapacityGrid))
        .thenReturn(mockResultReturned);

    capacityGridServiceHandler.actionsOnAssignmentDetailsHeader(mockContext, mockAssignmentsDetailsForCapacityGrid);

    verify(mockContext).setResult(mockResultReturned);
    verify(mockContext).setCompleted();
  }

  @Test
  @DisplayName("Result map set by update handler is used by read handler for weekly view")
  public void readHandlerSetsCorrectDataInContextWeeklyView() {

    CdsUpdateEventContext mockUpdateContext = mock(CdsUpdateEventContext.class);
    CdsReadEventContext mockReadContext = mock(CdsReadEventContext.class);
    AssignmentBucketsYearWeekAggregate mockAsgnUpdate = mock(AssignmentBucketsYearWeekAggregate.class);
    List<Map<String, Object>> mockResultReturnedOnUpdate = new ArrayList<>();

    when(mockGridUtility.updateAssignmentForTheWeek(mockUpdateContext, mockAsgnUpdate))
        .thenReturn(mockResultReturnedOnUpdate);

    capacityGridServiceHandler.updateAssignmentForTheWeek(mockUpdateContext, mockAsgnUpdate);
    capacityGridServiceHandler.readUpdatedAssignmentBucketsAggregate(mockReadContext);

    verify(mockReadContext).setResult(mockResultReturnedOnUpdate);
    verify(mockReadContext).setCompleted();
  }

  @Test
  @DisplayName("test for capacity grid header kpi response")
  public void capacityGridHeaderKPIResponseTest() {
    final CdsReadEventContext mockContext = mock(CdsReadEventContext.class, RETURNS_DEEP_STUBS);

    CapacityGridHeaderKPITemporal capacityGridHeaderKPIRecord = Struct.create(CapacityGridHeaderKPITemporal.class);
    RequestContextRunner requestContextRunner = mock(RequestContextRunner.class);
    List<HashMap<String, Object>> capacityGridVHeaderKPIList = new ArrayList<HashMap<String, Object>>();
    Map<String, String> sessionParameters = new HashMap<String, String>();
    HashMap<String, Object> rowRecord1 = new HashMap<String, Object>();
    HashMap<String, Object> rowRecord2 = new HashMap<String, Object>();
    HashMap<String, Object> rowRecord3 = new HashMap<String, Object>();
    HashMap<String, Object> rowRecord4 = new HashMap<String, Object>();
    HashMap<String, Object> rowRecord5 = new HashMap<String, Object>();
    HashMap<String, Object> rowRecord6 = new HashMap<String, Object>();
    List<String> resOrgList;
    List<String> list = new ArrayList<>();
    list.add("Org_4_CCDE");
    list.add("Org_4_CCEN");
    resOrgList = list;

    // Lets say available hours are 500
    rowRecord1.put("bookedHours", 240);
    rowRecord1.put("availableHours", 260);
    rowRecord1.put("ID", "1234");
    rowRecord1.put("validFrom", "20220101");
    rowRecord2.put("bookedHours", 80);
    rowRecord2.put("availableHours", 420);
    rowRecord2.put("ID", "5678");
    rowRecord2.put("validFrom", "20220201");
    rowRecord3.put("bookedHours", 120);
    rowRecord3.put("availableHours", 380);
    rowRecord3.put("ID", "9012");
    rowRecord3.put("validFrom", "20220101");
    rowRecord4.put("bookedHours", 120);
    rowRecord4.put("availableHours", 380);
    rowRecord4.put("ID", "3456");
    rowRecord4.put("validFrom", "20220101");
    rowRecord5.put("ID", "7890");
    rowRecord6.put("ID", "1234");
    rowRecord6.put("validFrom", "20221101");
    rowRecord6.put("bookedHours", 80);
    rowRecord6.put("availableHours", 420);

    capacityGridVHeaderKPIList.add(rowRecord1);
    capacityGridVHeaderKPIList.add(rowRecord2);
    capacityGridVHeaderKPIList.add(rowRecord3);
    capacityGridVHeaderKPIList.add(rowRecord4);
    capacityGridVHeaderKPIList.add(rowRecord5);

    capacityGridHeaderKPIRecord.setFreeResourcesCount(4);
    capacityGridHeaderKPIRecord.setOverstaffedResourcesCount(0);
    capacityGridHeaderKPIRecord.setId("004808d7-9643-4f8d-8bc5-a9b49bbb0a7b");
    capacityGridHeaderKPIRecord.setResourceCount(5);

    Result capacityGridViewResult = ResultBuilder.selectedRows(capacityGridVHeaderKPIList).result();

    Instant validFrom = Instant.parse("2019-01-04T11:25:30.00Z");
    Instant validTo = Instant.parse("2019-01-04T11:25:30.00Z");

    when(mockContext.getResult()).thenReturn(capacityGridViewResult);
    when(mockContext.getUserInfo().getAttributeValues(PROCESSING_RESOURCE_ORGANIZATION)).thenReturn(resOrgList);
    when(cdsRuntime.requestContext().modifyParameters(p -> p.setValidFrom(validFrom))
        .modifyParameters(p -> p.setValidTo(validTo))).thenReturn(requestContextRunner);
    when(capacityGridServiceHandler.getCapacityHeaderKPIRecords(resOrgList)).thenReturn(capacityGridViewResult);
    capacityGridServiceHandler.capacityGridHeaderRecords = capacityGridViewResult;

    sessionParameters.put("sap-valid-from", "2021-05-01T12:00:00Z");
    sessionParameters.put("sap-valid-to", "2021-10-31T12:00:00Z");
    when(mockContext.getParameterInfo().getQueryParams()).thenReturn(sessionParameters);

    List<CapacityGridHeaderKPITemporal> actualCapacityGridHeaderKpiResponse = capacityGridServiceHandler
        .modifyCapacityGridHeaderKPIResponse(mockContext);
    assertEquals(capacityGridHeaderKPIRecord.getFreeResourcesCount(),
        actualCapacityGridHeaderKpiResponse.get(0).getFreeResourcesCount());
    assertEquals(capacityGridHeaderKPIRecord.getId(), actualCapacityGridHeaderKpiResponse.get(0).getId());
    assertEquals(capacityGridHeaderKPIRecord.getOverstaffedResourcesCount(),
        actualCapacityGridHeaderKpiResponse.get(0).getOverstaffedResourcesCount());
    assertEquals(capacityGridHeaderKPIRecord.getResourceCount(),
        actualCapacityGridHeaderKpiResponse.get(0).getResourceCount());

  }

  @Test
  @DisplayName("test for getCapacityHeaderKPIRecordsforAll method")
  public void getCapacityHeaderKPIRecordsforAllTest() {
    capacityGridServiceHandler.getCapacityHeaderKPIRecordsforAll();
  }

  @Test
  @DisplayName("test for prepare Response  method")
  public void prepareResponseTest() {
    Integer freeResourcesCount = 7;
    Integer overBookedResourceCount = 7;
    Integer resourcesCount = 14;
    Integer finalPercentageAvg = 28;
    CapacityGridHeaderKPITemporal responseRecord = capacityGridServiceHandler.prepareResponse(freeResourcesCount,
        overBookedResourceCount, resourcesCount, finalPercentageAvg);
    assertEquals(freeResourcesCount, responseRecord.getFreeResourcesCount());
    assertEquals(overBookedResourceCount, responseRecord.getOverstaffedResourcesCount());
    assertEquals(resourcesCount, responseRecord.getResourceCount());

  }

  @Test
  @DisplayName("test for retrieve Exact date method with incorrect date format")
  public void testAvgCalculation() {
    String sessionValidTo = "2021-05-01T12:00:00Z";
    Instant expectedResponse = Instant.parse("2021-05-01T12:00:00Z");
    Instant actualResponse = capacityGridServiceHandler.retrieveExactDate(sessionValidTo);
    assertEquals(actualResponse, expectedResponse);

  }

  @Test
  @DisplayName("test for getCapacityHeaderKPIRecord method")
  public void getCapacityHeaderKPIRecordTest() {
    List<String> list = new ArrayList<>();
    list.add("Org_4_CCDE");
    list.add("Org_4_CCEN");
    capacityGridServiceHandler.getCapacityHeaderKPIRecords(list);
  }

  @Test
  @DisplayName("test for getCapacityHeaderKPIRecord method with empty delivery org code ")
  public void getCapacityHeaderKPIEmptyDeliveryOrg() {
    List<String> list = new ArrayList<>();
    list.add("Org_4_CCDE");
    list.add("Org_4_CCEN");
    capacityGridServiceHandler.getCapacityHeaderKPIRecords(list);
  }

  @Test
  @DisplayName("test for getCapacityHeaderKPIRecord method with delivery org code ")
  public void getCapacityHeaderKPIWithDeliveryOrg() {
    List<String> list = new ArrayList<>();
    List<String> deliveryOrgList = new ArrayList<>();
    list.add("Org_4_CCDE");
    list.add("Org_4_CCEN");
    String deliveryOrg = "CC02";
    deliveryOrgList.add(deliveryOrg);
    capacityGridServiceHandler.deliveryOrgCodeList = deliveryOrgList;
    capacityGridServiceHandler.getCapacityHeaderKPIRecords(list);
  }

  @Test
  @DisplayName("test for derive filter parameters method")
  public void derivePredicatesTest() {
    final CdsReadEventContext mockContext = mock(CdsReadEventContext.class, RETURNS_DEEP_STUBS);
    CqnSelect select = Select.from("E")
        .where(c -> c.get("deliveryOrgCode").contains("1N01").or(c.get("deliveryOrgCode").contains("CCDE")));
    when(mockContext.getCqn()).thenReturn(select);
    capacityGridServiceHandler.derivePredicate(mockContext);
  }

  @Test
  @DisplayName("test for getCapacityHeaderKPIRecordsforAll method for empty delivery org code ")
  public void getCapacityHeaderKPIRecordsforEmptyDeliveryOrg() {
    capacityGridServiceHandler.getCapacityHeaderKPIRecordsforAll();
  }

  @Test
  @DisplayName("test for getCapacityHeaderKPIRecordsforAll method with delivery org code ")
  public void getCapacityHeaderKPIRecordswithDeliveryOrg() {
    List<String> deliveryOrgList = new ArrayList<>();
    String deliveryOrg = "CC03";
    deliveryOrgList.add(deliveryOrg);
    capacityGridServiceHandler.deliveryOrgCodeList = deliveryOrgList;
    capacityGridServiceHandler.getCapacityHeaderKPIRecordsforAll();
  }

  @Test
  @DisplayName("test for capacity grid header kpi response calculation with another set data")
  public void capacityGridHeaderKPICalculationTest() {
    final CdsReadEventContext mockContext = mock(CdsReadEventContext.class, RETURNS_DEEP_STUBS);

    CapacityGridHeaderKPITemporal capacityGridHeaderKPIRecord = Struct.create(CapacityGridHeaderKPITemporal.class);
    RequestContextRunner requestContextRunner = mock(RequestContextRunner.class);
    List<HashMap<String, Object>> capacityGridVHeaderKPIList = new ArrayList<HashMap<String, Object>>();
    Map<String, String> sessionParameters = new HashMap<String, String>();
    HashMap<String, Object> rowRecord1 = new HashMap<String, Object>();
    HashMap<String, Object> rowRecord2 = new HashMap<String, Object>();
    HashMap<String, Object> rowRecord3 = new HashMap<String, Object>();
    HashMap<String, Object> rowRecord4 = new HashMap<String, Object>();
    HashMap<String, Object> rowRecord5 = new HashMap<String, Object>();

    List<String> resOrgList;
    List<String> list = new ArrayList<>();
    list.add("Org_4_CCDE");
    list.add("Org_4_CCEN");
    resOrgList = list;

    // Lets say available hours are 500
    rowRecord1.put("bookedHours", 40);
    rowRecord1.put("availableHours", 460);
    rowRecord1.put("ID", "1234");

    rowRecord2.put("bookedHours", 80);
    rowRecord2.put("availableHours", 420);
    rowRecord2.put("ID", "5678");

    rowRecord3.put("bookedHours", 20);
    rowRecord3.put("availableHours", 480);
    rowRecord3.put("ID", "9012");

    rowRecord4.put("bookedHours", 120);
    rowRecord4.put("availableHours", 380);
    rowRecord4.put("ID", "3456");

    rowRecord5.put("ID", "7890");

    capacityGridVHeaderKPIList.add(rowRecord1);
    capacityGridVHeaderKPIList.add(rowRecord2);
    capacityGridVHeaderKPIList.add(rowRecord3);
    capacityGridVHeaderKPIList.add(rowRecord4);
    capacityGridVHeaderKPIList.add(rowRecord5);

    capacityGridHeaderKPIRecord.setFreeResourcesCount(5);
    capacityGridHeaderKPIRecord.setOverstaffedResourcesCount(0);
    capacityGridHeaderKPIRecord.setId("004808d7-9643-4f8d-8bc5-a9b49bbb0a7b");
    capacityGridHeaderKPIRecord.setResourceCount(5);

    Result capacityGridViewResult = ResultBuilder.selectedRows(capacityGridVHeaderKPIList).result();

    Instant validFrom = Instant.parse("2019-01-04T11:25:30.00Z");
    Instant validTo = Instant.parse("2019-01-04T11:25:30.00Z");

    when(mockContext.getResult()).thenReturn(capacityGridViewResult);
    when(mockContext.getUserInfo().getAttributeValues(PROCESSING_RESOURCE_ORGANIZATION)).thenReturn(resOrgList);
    when(cdsRuntime.requestContext().modifyParameters(p -> p.setValidFrom(validFrom))
        .modifyParameters(p -> p.setValidTo(validTo))).thenReturn(requestContextRunner);
    when(capacityGridServiceHandler.getCapacityHeaderKPIRecords(resOrgList)).thenReturn(capacityGridViewResult);
    capacityGridServiceHandler.capacityGridHeaderRecords = capacityGridViewResult;

    sessionParameters.put("sap-valid-from", "2021-05-01T12:00:00Z");
    sessionParameters.put("sap-valid-to", "2021-10-31T12:00:00Z");
    when(mockContext.getParameterInfo().getQueryParams()).thenReturn(sessionParameters);

    List<CapacityGridHeaderKPITemporal> actualCapacityGridHeaderKpiResponse = capacityGridServiceHandler
        .modifyCapacityGridHeaderKPIResponse(mockContext);
    assertEquals(capacityGridHeaderKPIRecord.getFreeResourcesCount(),
        actualCapacityGridHeaderKpiResponse.get(0).getFreeResourcesCount());
    assertEquals(capacityGridHeaderKPIRecord.getId(), actualCapacityGridHeaderKpiResponse.get(0).getId());
    assertEquals(capacityGridHeaderKPIRecord.getOverstaffedResourcesCount(),
        actualCapacityGridHeaderKpiResponse.get(0).getOverstaffedResourcesCount());
    assertEquals(capacityGridHeaderKPIRecord.getResourceCount(),
        actualCapacityGridHeaderKpiResponse.get(0).getResourceCount());

  }

}