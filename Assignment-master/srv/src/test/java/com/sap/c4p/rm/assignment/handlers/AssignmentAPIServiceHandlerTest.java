package com.sap.c4p.rm.assignment.handlers;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.enums.AssignmentStatus;
import com.sap.c4p.rm.assignment.utils.AssignmentDraftsUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;
import com.sap.c4p.rm.assignment.utils.EventContextKeysExtractor;
import com.sap.c4p.rm.assignment.validation.AssignmentDraftsValidator;
import com.sap.c4p.rm.assignment.validation.AssignmentValidator;

import com.sap.resourcemanagement.resource.Types;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

import assignment.Assignments;
import assignment.DailyAssignmentDistribution;
import assignment.MonthlyAssignmentDistribution;
import assignment.WeeklyAssignmentDistribution;
import assignmentservice.AssignmentBuckets;

public class AssignmentAPIServiceHandlerTest {
  private static final String ACTIVE_ASSIGNMENT_ID = "ASSIGNMENT_ID";
  private static final String RESOURCE_ID = "RESOURCE_ID";
  private static final String REQUEST_ID = "REQUEST_ID";
  private static final String BUCKET_ID = "BUCKET_ID";

  private AssignmentAPIServiceHandler classUnderTest;

  private CqnService mockAssignmentService;

  private AssignmentDraftsValidator mockDraftsValidator;
  private AssignmentValidator mockValidator;
  private DataProvider mockDataProvider;
  private AssignmentDraftsUtility mockDraftsUtility;

  private EventContextKeysExtractor mockEventContextKeysExtractor;

  @BeforeEach
  void setup() {

    this.mockAssignmentService = mock(CqnService.class);
    this.mockDraftsValidator = mock(AssignmentDraftsValidator.class);
    this.mockValidator = mock(AssignmentValidator.class);
    this.mockDataProvider = mock(DataProvider.class, RETURNS_DEEP_STUBS);
    this.mockEventContextKeysExtractor = mock(EventContextKeysExtractor.class);
    this.mockDraftsUtility = mock(AssignmentDraftsUtility.class, RETURNS_DEEP_STUBS);

    this.classUnderTest = new AssignmentAPIServiceHandler(mockAssignmentService, mockDraftsValidator, mockValidator,
        mockDataProvider, mockEventContextKeysExtractor, mockDraftsUtility);
  }

  @Test
  void warningShouldBeRaisedIfIrrelevantFieldsPopulated() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setDate(LocalDate.now());
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    assignment.Assignments dummyAssignment = assignment.Assignments.create();

    List<DailyAssignmentDistribution> dailyAssignmentDistributionResult = new ArrayList<>();

    dailyAssignmentDistributionResult.add(dummyDailyAssignmentDistribution);

    dummyAssignment.setRequestID(REQUEST_ID);

    dummyAssignment.setResourceID(RESOURCE_ID);

    dummyAssignment.setDailyAssignmentDistribution(dailyAssignmentDistributionResult);

    dummyAssignment.setEndDate(LocalDate.now());

    Messages mockMessages = mock(Messages.class);
    doThrow(ServiceException.class).when(mockMessages).warn("START_END_CAPACITY_IGNORED");
    when(mockContext.getMessages()).thenReturn(mockMessages);

    assertThrows(ServiceException.class, () -> classUnderTest.createAssignment(dummyAssignment, mockContext));

    dummyAssignment.setStartDate(LocalDate.now());

    assertThrows(ServiceException.class, () -> classUnderTest.createAssignment(dummyAssignment, mockContext));

  }

  @Test
  void checkSuccessfulCreationWithDailyDistributionInCaseOfNoErrors() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setDate(LocalDate.now());
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    assignment.Assignments dummyAssignment = assignment.Assignments.create();

    List<DailyAssignmentDistribution> dailyAssignmentDistributionResult = new ArrayList<>();

    dailyAssignmentDistributionResult.add(dummyDailyAssignmentDistribution);

    dummyAssignment.setRequestID(REQUEST_ID);

    dummyAssignment.setResourceID(RESOURCE_ID);

    dummyAssignment.setDailyAssignmentDistribution(dailyAssignmentDistributionResult);
    dummyAssignment.setIsSoftBooked(false);

    assignmentservice.Assignments mockAssignment = assignmentservice.Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceId(REQUEST_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());

    AssignmentBuckets mockAssignmentBucket = AssignmentBuckets.create();
    mockAssignmentBucket.setId(BUCKET_ID);
    mockAssignmentBucket.setAssignmentId(ACTIVE_ASSIGNMENT_ID);
    mockAssignmentBucket.setStartTime(Instant.now());
    mockAssignmentBucket.setBookedCapacityInMinutes(420);

    List<assignmentservice.AssignmentBuckets> assignmentBuckets = new ArrayList<>();
    assignmentBuckets.add(mockAssignmentBucket);

    mockAssignment.setAssignmentBuckets(assignmentBuckets);

    when(mockDraftsUtility.createNewDraft(any())).thenReturn(Optional.of(mockAssignment));

    when(mockDataProvider.getAssignmentBucketsDraft(ACTIVE_ASSIGNMENT_ID)).thenReturn(Collections.emptyList());

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockValidator.getMessages()).thenReturn(mockMessages);
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessages);

    ResourceRequests dummyRequest = ResourceRequests.create();
    dummyRequest.setId(REQUEST_ID);
    dummyRequest.setStartDate(LocalDate.now().minusDays(1));
    dummyRequest.setEndDate(LocalDate.now().plusDays(1));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(dummyRequest));

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));

    classUnderTest.createAssignment(dummyAssignment, mockContext);

    Map<String, String> assignmentDetails = new HashMap<>();

    assignmentDetails.put("assignmentID", dummyAssignment.getId());
    assignmentDetails.put("requestID", REQUEST_ID);
    assignmentDetails.put("resourceID", RESOURCE_ID);

    verify(mockValidator).validateNoAssignmentExists(RESOURCE_ID, REQUEST_ID);
    verify(mockDraftsUtility).createNewDraft(any());
    verify(mockDraftsUtility).activateNewDraft(any(String.class));
    verify(mockContext).setResult(any());
    verify(mockContext).setCompleted();

  }

  @Test
  void checkSuccessfulCreationWithWeeklyDistributionInCaseOfNoErros() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);

    WeeklyAssignmentDistribution weeklyAssignmentDistributionPayload = WeeklyAssignmentDistribution.create();
    weeklyAssignmentDistributionPayload.setCalendarWeek("202301");
    weeklyAssignmentDistributionPayload.setBookedCapacity(42);

    Assignments assignmentPayload = Assignments.create();
    assignmentPayload.setResourceID(RESOURCE_ID);
    assignmentPayload.setRequestID(REQUEST_ID);
    assignmentPayload.setWeeklyAssignmentDistribution(Collections.singletonList(weeklyAssignmentDistributionPayload));

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockValidator.getMessages()).thenReturn(mockMessages);
    when(mockDraftsValidator.validate(any(String.class))).thenReturn(mockMessages);

    ResourceRequests dummyRequest = ResourceRequests.create();
    dummyRequest.setId(REQUEST_ID);
    dummyRequest.setStartDate(LocalDate.of(2023, 1, 1));
    dummyRequest.setEndDate(LocalDate.of(2023, 2, 1));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(dummyRequest));

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));

    AssignmentBuckets mockAssignmentBucket = AssignmentBuckets.create();
    mockAssignmentBucket.setId(BUCKET_ID);
    mockAssignmentBucket.setStartTime(Instant.now());
    mockAssignmentBucket.setBookedCapacityInMinutes(420);

    when(mockDraftsUtility.getSimulatedAssignmentBucketsDrafts(any(String.class), any(String.class),
        any(LocalDate.class), any(LocalDate.class), any(Integer.class)))
            .thenReturn(Collections.singletonList(mockAssignmentBucket));

    when(mockDataProvider.getTimeDimensionDataForCalendarWeekStart("202301").getDateSql())
        .thenReturn(LocalDate.of(2023, 01, 2));
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekEnd("202301").getDateSql())
        .thenReturn(LocalDate.of(2023, 01, 9));

    assignmentservice.Assignments mockAssignment = assignmentservice.Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceId(REQUEST_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());

    List<assignmentservice.AssignmentBuckets> assignmentBuckets = new ArrayList<>();
    assignmentBuckets.add(mockAssignmentBucket);
    mockAssignment.setAssignmentBuckets(assignmentBuckets);

    when(mockDraftsUtility.createNewDraft(any())).thenReturn(Optional.of(mockAssignment));

    classUnderTest.createAssignment(assignmentPayload, mockContext);

    verify(mockValidator).validateNoAssignmentExists(RESOURCE_ID, REQUEST_ID);
    verify(mockDraftsUtility).createNewDraft(any());
    verify(mockDraftsUtility).activateNewDraft(any(String.class));
    verify(mockContext).setResult(any());
    verify(mockContext).setCompleted();
  }

  @Test
  void checkSuccessfulCreationWithMonthlyDistributionInCaseOfNoErros() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);

    MonthlyAssignmentDistribution monthlyAssignmentDistributionPayload = MonthlyAssignmentDistribution.create();
    monthlyAssignmentDistributionPayload.setCalendarMonth("202301");
    monthlyAssignmentDistributionPayload.setBookedCapacity(42);

    Assignments assignmentPayload = Assignments.create();
    assignmentPayload.setResourceID(RESOURCE_ID);
    assignmentPayload.setRequestID(REQUEST_ID);
    assignmentPayload.setMonthlyAssignmentDistribution(Collections.singletonList(monthlyAssignmentDistributionPayload));

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockValidator.getMessages()).thenReturn(mockMessages);
    when(mockDraftsValidator.validate(any(String.class))).thenReturn(mockMessages);

    ResourceRequests dummyRequest = ResourceRequests.create();
    dummyRequest.setId(REQUEST_ID);
    dummyRequest.setStartDate(LocalDate.of(2023, 1, 1));
    dummyRequest.setEndDate(LocalDate.of(2023, 2, 1));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(dummyRequest));

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));

    AssignmentBuckets mockAssignmentBucket = AssignmentBuckets.create();
    mockAssignmentBucket.setId(BUCKET_ID);
    mockAssignmentBucket.setStartTime(Instant.now());
    mockAssignmentBucket.setBookedCapacityInMinutes(420);

    when(mockDraftsUtility.getSimulatedAssignmentBucketsDrafts(any(String.class), any(String.class),
        any(LocalDate.class), any(LocalDate.class), any(Integer.class)))
            .thenReturn(Collections.singletonList(mockAssignmentBucket));

    when(mockDataProvider.getTimeDimensionDataForCalendarWeekStart("202301").getDateSql())
        .thenReturn(LocalDate.of(2023, 01, 2));
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekEnd("202301").getDateSql())
        .thenReturn(LocalDate.of(2023, 01, 9));

    assignmentservice.Assignments mockAssignment = assignmentservice.Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceId(REQUEST_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());

    List<assignmentservice.AssignmentBuckets> assignmentBuckets = new ArrayList<>();
    assignmentBuckets.add(mockAssignmentBucket);
    mockAssignment.setAssignmentBuckets(assignmentBuckets);

    when(mockDraftsUtility.createNewDraft(any())).thenReturn(Optional.of(mockAssignment));

    classUnderTest.createAssignment(assignmentPayload, mockContext);

    verify(mockValidator).validateNoAssignmentExists(RESOURCE_ID, REQUEST_ID);
    verify(mockDraftsUtility).createNewDraft(any());
    verify(mockDraftsUtility).activateNewDraft(any(String.class));
    verify(mockContext).setResult(any());
    verify(mockContext).setCompleted();
  }

  @Test
  void checkSuccessfulUpdateWithWeeklyDistributionInCaseOfNoErros() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    WeeklyAssignmentDistribution weeklyAssignmentDistributionPayload = WeeklyAssignmentDistribution.create();
    weeklyAssignmentDistributionPayload.setCalendarWeek("202301");
    weeklyAssignmentDistributionPayload.setBookedCapacity(42);

    Assignments assignmentPayload = Assignments.create();
    assignmentPayload.setId(ACTIVE_ASSIGNMENT_ID);
    assignmentPayload.setWeeklyAssignmentDistribution(Collections.singletonList(weeklyAssignmentDistributionPayload));

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockValidator.getMessages()).thenReturn(mockMessages);
    when(mockDraftsValidator.validate(any(String.class))).thenReturn(mockMessages);

    ResourceRequests dummyRequest = ResourceRequests.create();
    dummyRequest.setId(REQUEST_ID);
    dummyRequest.setStartDate(LocalDate.of(2023, 1, 1));
    dummyRequest.setEndDate(LocalDate.of(2023, 2, 1));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(dummyRequest));

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));

    AssignmentBuckets mockAssignmentBucket = AssignmentBuckets.create();
    mockAssignmentBucket.setId(BUCKET_ID);
    mockAssignmentBucket.setStartTime(Instant.now());
    mockAssignmentBucket.setBookedCapacityInMinutes(420);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    mockEditDraft.setResourceRequestId(REQUEST_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);
    mockEditDraft.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    when(mockDraftsUtility.getSimulatedAssignmentBucketsDrafts(any(String.class), any(String.class),
        any(LocalDate.class), any(LocalDate.class), any(Integer.class)))
            .thenReturn(Collections.singletonList(mockAssignmentBucket));
    when(mockDraftsUtility.getExistingAssignmentBucketsDrafts(any(String.class), any(LocalDate.class),
        any(LocalDate.class))).thenReturn(Collections.singletonList(mockAssignmentBucket));

    when(mockDataProvider.getTimeDimensionDataForCalendarWeekStart("202301").getDateSql())
        .thenReturn(LocalDate.of(2023, 01, 2));
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekEnd("202301").getDateSql())
        .thenReturn(LocalDate.of(2023, 01, 9));

    assignmentservice.Assignments mockAssignment = assignmentservice.Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceId(REQUEST_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());

    List<assignmentservice.AssignmentBuckets> assignmentBuckets = new ArrayList<>();
    assignmentBuckets.add(mockAssignmentBucket);
    mockAssignment.setAssignmentBuckets(assignmentBuckets);

    classUnderTest.updateAssignment(assignmentPayload, mockContext);

    verify(mockValidator).validateAssignmentExists(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).updateAssignmentBucketsDrafts(any(), any());
    verify(mockDraftsUtility).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
    verify(mockContext).setResult(any());
    verify(mockContext).setCompleted();
  }

  @Test
  void checkSuccessfulUpdateWithMonthlyDistributionInCaseOfNoErros() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    MonthlyAssignmentDistribution monthlyAssignmentDistributionPayload = MonthlyAssignmentDistribution.create();
    monthlyAssignmentDistributionPayload.setCalendarMonth("202301");
    monthlyAssignmentDistributionPayload.setBookedCapacity(42);

    Assignments assignmentPayload = Assignments.create();
    assignmentPayload.setId(ACTIVE_ASSIGNMENT_ID);
    assignmentPayload.setMonthlyAssignmentDistribution(Collections.singletonList(monthlyAssignmentDistributionPayload));

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockValidator.getMessages()).thenReturn(mockMessages);
    when(mockDraftsValidator.validate(any(String.class))).thenReturn(mockMessages);

    ResourceRequests dummyRequest = ResourceRequests.create();
    dummyRequest.setId(REQUEST_ID);
    dummyRequest.setStartDate(LocalDate.of(2023, 1, 1));
    dummyRequest.setEndDate(LocalDate.of(2023, 2, 1));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(dummyRequest));

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));

    AssignmentBuckets mockAssignmentBucket = AssignmentBuckets.create();
    mockAssignmentBucket.setId(BUCKET_ID);
    mockAssignmentBucket.setStartTime(Instant.now());
    mockAssignmentBucket.setBookedCapacityInMinutes(420);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    mockEditDraft.setResourceRequestId(REQUEST_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);
    mockEditDraft.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    when(mockDraftsUtility.getSimulatedAssignmentBucketsDrafts(any(String.class), any(String.class),
        any(LocalDate.class), any(LocalDate.class), any(Integer.class)))
            .thenReturn(Collections.singletonList(mockAssignmentBucket));
    when(mockDraftsUtility.getExistingAssignmentBucketsDrafts(any(String.class), any(LocalDate.class),
        any(LocalDate.class))).thenReturn(Collections.singletonList(mockAssignmentBucket));

    assignmentservice.Assignments mockAssignment = assignmentservice.Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceId(REQUEST_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());

    List<assignmentservice.AssignmentBuckets> assignmentBuckets = new ArrayList<>();
    assignmentBuckets.add(mockAssignmentBucket);
    mockAssignment.setAssignmentBuckets(assignmentBuckets);

    when(mockDraftsUtility.createNewDraft(any())).thenReturn(Optional.of(mockAssignment));

    classUnderTest.updateAssignment(assignmentPayload, mockContext);

    verify(mockValidator).validateAssignmentExists(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).updateAssignmentBucketsDrafts(any(), any());
    verify(mockDraftsUtility).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
    verify(mockContext).setResult(any());
    verify(mockContext).setCompleted();
  }

  @Test
  void exceptionRaisedIfUpdatedToSoftBooking() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setDate(LocalDate.now());
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    assignment.Assignments dummyAssignment = assignment.Assignments.create();

    List<DailyAssignmentDistribution> dailyAssignmentDistributionResult = new ArrayList<>();

    dailyAssignmentDistributionResult.add(dummyDailyAssignmentDistribution);

    dummyAssignment.setId(ACTIVE_ASSIGNMENT_ID);

    dummyAssignment.setDailyAssignmentDistribution(dailyAssignmentDistributionResult);

    dummyAssignment.setIsSoftBooked(true); // new assignment is set to softbooking

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    mockEditDraft.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode()); // old assignment was hardbooked

    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    when(mockContext.getUserInfo().getName()).thenReturn("Roger");

    assertThrows(ServiceException.class, () -> classUnderTest.updateAssignment(dummyAssignment, mockContext));

  }

  @Test
  void checkSuccessfulUpdateInCaseOfNoExceptions() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setDate(LocalDate.now());
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    assignment.Assignments dummyAssignment = assignment.Assignments.create();

    List<DailyAssignmentDistribution> dailyAssignmentDistributionResult = new ArrayList<>();

    dailyAssignmentDistributionResult.add(dummyDailyAssignmentDistribution);

    dummyAssignment.setId(ACTIVE_ASSIGNMENT_ID);

    dummyAssignment.setDailyAssignmentDistribution(dailyAssignmentDistributionResult);

    dummyAssignment.setIsSoftBooked(false); // new assignment is set to hardbooking

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    mockEditDraft.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode()); // old assignment was softbooked
    mockEditDraft.setResourceId(RESOURCE_ID);
    mockEditDraft.setResourceRequestId(REQUEST_ID);

    AssignmentBuckets mockAssignmentBucket = AssignmentBuckets.create();
    mockAssignmentBucket.setId(BUCKET_ID);
    mockAssignmentBucket.setAssignmentId(ACTIVE_ASSIGNMENT_ID);
    mockAssignmentBucket.setStartTime(Instant.now());
    mockAssignmentBucket.setBookedCapacityInMinutes(420);

    List<assignmentservice.AssignmentBuckets> assignmentBuckets = new ArrayList<>();
    assignmentBuckets.add(mockAssignmentBucket);

    mockEditDraft.setAssignmentBuckets(assignmentBuckets);

    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    ResourceRequests dummyRequest = ResourceRequests.create();
    dummyRequest.setId(REQUEST_ID);
    dummyRequest.setStartDate(LocalDate.now().minusDays(1));
    dummyRequest.setEndDate(LocalDate.now().plusDays(1));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(dummyRequest));

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));

    when(mockContext.getUserInfo().getName()).thenReturn("Roger");

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockDraftsValidator.validate(any(String.class))).thenReturn(mockMessages);
    when(mockValidator.getMessages()).thenReturn(mockMessages);

    classUnderTest.updateAssignment(dummyAssignment, mockContext);

    verify(mockValidator).validateAssignmentExists(ACTIVE_ASSIGNMENT_ID);

    verify(mockDraftsUtility).updateAssignmentStatus(ACTIVE_ASSIGNMENT_ID, 0);
    verify(mockDraftsUtility).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
    verify(mockContext).setResult(any());
    verify(mockContext).setCompleted();

  }

  @Test
  void apiDeleteAssignmentHandlerTriggersDeleteEventOfAssignmentService() {
    Map<String, Object> dummyContextKeys = new HashMap<>();
    dummyContextKeys.put(Assignments.ID, ACTIVE_ASSIGNMENT_ID);

    CdsDeleteEventContext dummyContext = mock(CdsDeleteEventContext.class);
    when(mockEventContextKeysExtractor.getDeleteEventContextKeys(dummyContext)).thenReturn(dummyContextKeys);

    classUnderTest.deleteAssignment(dummyContext);

    verify(mockAssignmentService, times(1)).emit(any(CdsDeleteEventContext.class));
    verify(dummyContext, times(1)).setResult(any());
    verify(dummyContext, times(1)).setCompleted();
  }

  @Test
  void serviceExceptionRaisedOnDailyAssignmentCreationIfValidationFails() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    dummyDailyAssignmentDistribution.setDate(LocalDate.now());
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    com.sap.resourcemanagement.assignment.Assignments dummyAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    dummyAssignment.setResourceId(RESOURCE_ID);

    when(mockDataProvider.getAssignmentHeader(ACTIVE_ASSIGNMENT_ID)).thenReturn(Optional.of(dummyAssignment));

    Messages mockMessages = mock(Messages.class);
    mockMessages.error("Dummy error populated by validator");
    doThrow(ServiceException.class).when(mockMessages).throwIfError();
    when(mockValidator.getMessages()).thenReturn(mockMessages);

    assertThrows(ServiceException.class,
        () -> classUnderTest.createDailyAssignment(mockContext, dummyDailyAssignmentDistribution));
  }

  @Test
  void serviceExceptionRaisedOnDailyAssignmentCreationIfZeroStaffedHours() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    dummyDailyAssignmentDistribution.setDate(LocalDate.now());
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(0));

    com.sap.resourcemanagement.assignment.Assignments dummyAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    dummyAssignment.setResourceId(RESOURCE_ID);

    when(mockDataProvider.getAssignmentHeader(ACTIVE_ASSIGNMENT_ID)).thenReturn(Optional.of(dummyAssignment));

    Messages mockMessages = mock(Messages.class);
    mockMessages.error("Dummy error populated by validator");
    doThrow(ServiceException.class).when(mockMessages).throwIfError();
    when(mockValidator.getMessages()).thenReturn(mockMessages);

    assertThrows(ServiceException.class,
        () -> classUnderTest.createDailyAssignment(mockContext, dummyDailyAssignmentDistribution));
  }

  @Test
  void serviceExceptionRaisedOnDailyAssignmentCreationIfMissingAssignmentHeader() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    dummyDailyAssignmentDistribution.setDate(LocalDate.now());
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    Messages mockMessages = mock(Messages.class);
    mockMessages.error("Dummy error populated by validator");
    doThrow(ServiceException.class).when(mockMessages).throwIfError();
    when(mockValidator.getMessages()).thenReturn(mockMessages);

    assertThrows(ServiceException.class,
        () -> classUnderTest.createDailyAssignment(mockContext, dummyDailyAssignmentDistribution));
    verify(mockValidator).validateAssignmentExists(ACTIVE_ASSIGNMENT_ID);
  }

  @Test
  void serviceExceptionRaisedIfEditDraftCouldNotBeCreated() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    dummyDailyAssignmentDistribution.setDate(LocalDate.now());
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    com.sap.resourcemanagement.assignment.Assignments dummyAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    dummyAssignment.setResourceId(RESOURCE_ID);

    when(mockDataProvider.getAssignmentHeader(ACTIVE_ASSIGNMENT_ID)).thenReturn(Optional.of(dummyAssignment));

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockValidator.getMessages()).thenReturn(mockMessages);

    Result mockResult = mock(Result.class);
    when(mockResult.first()).thenReturn(Optional.ofNullable(null));
    when(mockResult.single(any())).thenReturn(Optional.ofNullable(null));
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(null);

    assertThrows(ServiceException.class,
        () -> classUnderTest.createDailyAssignment(mockContext, dummyDailyAssignmentDistribution));
  }

  @Test
  void dailyAssignmentCreationSuccessfulIfAllValidationsPass() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    dummyDailyAssignmentDistribution.setDate(LocalDate.now());
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    com.sap.resourcemanagement.assignment.Assignments dummyAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    dummyAssignment.setResourceId(RESOURCE_ID);

    when(mockDataProvider.getAssignmentHeader(ACTIVE_ASSIGNMENT_ID)).thenReturn(Optional.of(dummyAssignment));

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    mockEditDraft.setResourceRequestId(REQUEST_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);

    ResourceRequests dummyRequest = ResourceRequests.create();
    dummyRequest.setId(REQUEST_ID);
    dummyRequest.setStartDate(LocalDate.now().minusDays(1));
    dummyRequest.setEndDate(LocalDate.now().plusDays(1));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(dummyRequest));

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessages);

    when(mockValidator.getMessages()).thenReturn(mockMessages);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    AssignmentBuckets mockAssignmentBucket = AssignmentBuckets.create();
    mockAssignmentBucket.setId(BUCKET_ID);
    mockAssignmentBucket.setAssignmentId(ACTIVE_ASSIGNMENT_ID);
    mockAssignmentBucket.setStartTime(Instant.now());
    mockAssignmentBucket.setBookedCapacityInMinutes(420);

    when(mockDraftsUtility.createNewBucketDraft(any())).thenReturn(Optional.of(mockAssignmentBucket));
    when(mockDataProvider.getAssignmentBucketsDraft(ACTIVE_ASSIGNMENT_ID)).thenReturn(Collections.emptyList());

    classUnderTest.createDailyAssignment(mockContext, dummyDailyAssignmentDistribution);

    verify(mockDraftsUtility).updateBookedCapacityInHeader(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
    verify(mockContext).setResult(any());
    verify(mockContext).setCompleted();
  }

  @Test
  void serviceExceptionThrownOnCreateAssignmentDistributionIfCompleteDraftValidationFails() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    dummyDailyAssignmentDistribution.setDate(LocalDate.now());
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    com.sap.resourcemanagement.assignment.Assignments dummyAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    dummyAssignment.setResourceId(RESOURCE_ID);

    when(mockDataProvider.getAssignmentHeader(ACTIVE_ASSIGNMENT_ID)).thenReturn(Optional.of(dummyAssignment));

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockValidator.getMessages()).thenReturn(mockMessages);

    Messages mockMessagesWithError = mock(Messages.class);
    doThrow(ServiceException.class).when(mockMessagesWithError).throwIfError();
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessagesWithError);

    Result mockResult = mock(Result.class);
    when(mockResult.first()).thenReturn(Optional.ofNullable(null));
    when(mockResult.single(any())).thenReturn(mockEditDraft);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    AssignmentBuckets mockAssignmentBucket = AssignmentBuckets.create();
    mockAssignmentBucket.setId(BUCKET_ID);
    mockAssignmentBucket.setAssignmentId(ACTIVE_ASSIGNMENT_ID);
    mockAssignmentBucket.setStartTime(Instant.now());
    mockAssignmentBucket.setBookedCapacityInMinutes(420);

    when(mockDataProvider.getAssignmentBucketsDraft(ACTIVE_ASSIGNMENT_ID)).thenReturn(Collections.emptyList());

    assertThrows(ServiceException.class,
        () -> classUnderTest.createDailyAssignment(mockContext, dummyDailyAssignmentDistribution));
  }

  @Test
  void serviceExceptionRaisedOnDailyAssignmentUpdateIfZeroStaffedHours() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setId(BUCKET_ID);
    dummyDailyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(0));

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateDailyAssignment(mockContext, dummyDailyAssignmentDistribution));
  }

  @Test
  void serviceExceptionRaisedOnDailyAssignmentUpdateIfMissingAssignmentBucket() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    dummyDailyAssignmentDistribution.setId(BUCKET_ID);
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    when(mockDataProvider.getSingleAssignmentBucket(BUCKET_ID)).thenReturn(Optional.ofNullable(null));

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateDailyAssignment(mockContext, dummyDailyAssignmentDistribution));
  }

  @Test
  void serviceExceptionRaisedOnDailyAssignmentUpdateIfValidationFails() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Roger");
    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    dummyDailyAssignmentDistribution.setId(BUCKET_ID);
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    when(mockDataProvider.getSingleAssignmentBucket(BUCKET_ID))
        .thenReturn(Optional.of(com.sap.resourcemanagement.assignment.AssignmentBuckets.create()));

    com.sap.resourcemanagement.assignment.Assignments dummyAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    dummyAssignment.setResourceId(RESOURCE_ID);

    when(mockDataProvider.getAssignmentHeader(ACTIVE_ASSIGNMENT_ID)).thenReturn(Optional.of(dummyAssignment));

    Messages mockMessages = mock(Messages.class);
    mockMessages.error("Dummy error populated by validator");
    doThrow(ServiceException.class).when(mockMessages).throwIfError();
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessages);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateDailyAssignment(mockContext, dummyDailyAssignmentDistribution));
  }

  @Test
  void serviceExceptionThrownOnUpdateAssignmentDistributionIfCompleteDraftValidationFails() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    dummyDailyAssignmentDistribution.setId(BUCKET_ID);
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    com.sap.resourcemanagement.assignment.Assignments dummyAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    dummyAssignment.setResourceId(RESOURCE_ID);

    when(mockDataProvider.getSingleAssignmentBucket(BUCKET_ID))
        .thenReturn(Optional.of(com.sap.resourcemanagement.assignment.AssignmentBuckets.create()));
    when(mockDataProvider.getAssignmentHeader(ACTIVE_ASSIGNMENT_ID)).thenReturn(Optional.of(dummyAssignment));

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockValidator.getMessages()).thenReturn(mockMessages);

    Messages mockMessagesWithError = mock(Messages.class);
    doThrow(ServiceException.class).when(mockMessagesWithError).throwIfError();
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessagesWithError);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    when(mockDataProvider.getAssignmentBucketsDraft(ACTIVE_ASSIGNMENT_ID)).thenReturn(Collections.emptyList());

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateDailyAssignment(mockContext, dummyDailyAssignmentDistribution));
  }

  @Test
  void dailyAssignmentUpdateSuccessfulIfAllValidationsPass() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    dummyDailyAssignmentDistribution.setId(BUCKET_ID);
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    com.sap.resourcemanagement.assignment.Assignments dummyAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    dummyAssignment.setResourceId(RESOURCE_ID);

    when(mockDataProvider.getAssignmentHeader(ACTIVE_ASSIGNMENT_ID)).thenReturn(Optional.of(dummyAssignment));
    com.sap.resourcemanagement.assignment.AssignmentBuckets dummyAssignmentBucket = com.sap.resourcemanagement.assignment.AssignmentBuckets
        .create();
    dummyAssignmentBucket.setAssignmentId(ACTIVE_ASSIGNMENT_ID);
    when(mockDataProvider.getSingleAssignmentBucket(BUCKET_ID)).thenReturn(Optional.of(dummyAssignmentBucket));

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessages);

    when(mockValidator.getMessages()).thenReturn(mockMessages);

    when(mockDataProvider.getAssignmentBucketsDraft(ACTIVE_ASSIGNMENT_ID)).thenReturn(Collections.emptyList());

    classUnderTest.updateDailyAssignment(mockContext, dummyDailyAssignmentDistribution);

    verify(mockDraftsUtility).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
    verify(mockContext).setResult(any());
    verify(mockContext).setCompleted();
  }

  @Test
  void serviceExceptionRaisedOnDailyDistributionUpdateIfEditDraftCouldNotBeCreated() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    DailyAssignmentDistribution dummyDailyAssignmentDistribution = DailyAssignmentDistribution.create();
    dummyDailyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    dummyDailyAssignmentDistribution.setId(BUCKET_ID);
    dummyDailyAssignmentDistribution.setBookedCapacity(BigDecimal.valueOf(7));

    com.sap.resourcemanagement.assignment.Assignments dummyAssignment = com.sap.resourcemanagement.assignment.Assignments
        .create();
    dummyAssignment.setResourceId(RESOURCE_ID);

    when(mockDataProvider.getAssignmentHeader(ACTIVE_ASSIGNMENT_ID)).thenReturn(Optional.of(dummyAssignment));
    when(mockDataProvider.getSingleAssignmentBucket(BUCKET_ID))
        .thenReturn(Optional.of(com.sap.resourcemanagement.assignment.AssignmentBuckets.create()));

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockValidator.getMessages()).thenReturn(mockMessages);

    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(null);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateDailyAssignment(mockContext, dummyDailyAssignmentDistribution));
  }

  @Test
  void serviceExceptionRaisedOnWeeklyDistributionUpdateIfEditDraftCouldNotBeCreated() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    WeeklyAssignmentDistribution weeklyAssignmentDistribution = WeeklyAssignmentDistribution.create();
    weeklyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    weeklyAssignmentDistribution.setCalendarWeek("202301");
    weeklyAssignmentDistribution.setBookedCapacity(4);

    when(mockDataProvider.getWeeklyDistribution(ACTIVE_ASSIGNMENT_ID, "202301"))
        .thenReturn(Optional.of(weeklyAssignmentDistribution));
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(null);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateWeeklyDistributionForAssignment(mockContext, weeklyAssignmentDistribution));
  }

  @Test
  void serviceExceptionRaisedOnMonthlyDistributionUpdateIfEditDraftCouldNotBeCreated() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    MonthlyAssignmentDistribution monthlyAssignmentDistribution = MonthlyAssignmentDistribution.create();
    monthlyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    monthlyAssignmentDistribution.setCalendarMonth("202301");
    monthlyAssignmentDistribution.setBookedCapacity(42);

    when(mockDataProvider.getMonthlyDistribution(ACTIVE_ASSIGNMENT_ID, "202301"))
        .thenReturn(Optional.of(monthlyAssignmentDistribution));
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(null);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateMonthlyDistributionForAssignment(mockContext, monthlyAssignmentDistribution));
  }

  @Test
  void serviceExceptionRaisedOnDailyDistributionDeleteIfEditDraftCouldNotBeCreated() {

    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    Map<String, Object> dummyContextKeys = new HashMap<>();
    dummyContextKeys.put(DailyAssignmentDistribution.ID, BUCKET_ID);

    when(mockEventContextKeysExtractor.getDeleteEventContextKeys(mockContext)).thenReturn(dummyContextKeys);

    AssignmentBuckets dummyBucket = AssignmentBuckets.create();
    dummyBucket.setAssignmentId(ACTIVE_ASSIGNMENT_ID);
    dummyBucket.setId(BUCKET_ID);

    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(null);
    when(mockDataProvider.getSingleAssignmentBucket(BUCKET_ID))
        .thenReturn(Optional.of(com.sap.resourcemanagement.assignment.AssignmentBuckets.create()));

    assertThrows(ServiceException.class, () -> classUnderTest.deleteDailyAssignment(mockContext));
  }

  @Test
  void serviceExceptionRaisedOnWeeklyDistributionDeleteIfEditDraftCouldNotBeCreated() {

    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    Map<String, Object> dummyContextKeys = new HashMap<>();
    dummyContextKeys.put(WeeklyAssignmentDistribution.ASSIGNMENT_ID, ACTIVE_ASSIGNMENT_ID);
    dummyContextKeys.put(WeeklyAssignmentDistribution.CALENDAR_WEEK, "202301");

    when(mockEventContextKeysExtractor.getDeleteEventContextKeys(mockContext)).thenReturn(dummyContextKeys);

    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(null);
    assertThrows(ServiceException.class, () -> classUnderTest.deleteWeeklyDistributionForAssignment(mockContext));
  }

  @Test
  void serviceExceptionRaisedOnMonthlyDistributionDeleteIfEditDraftCouldNotBeCreated() {

    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    Map<String, Object> dummyContextKeys = new HashMap<>();
    dummyContextKeys.put(MonthlyAssignmentDistribution.ASSIGNMENT_ID, ACTIVE_ASSIGNMENT_ID);
    dummyContextKeys.put(MonthlyAssignmentDistribution.CALENDAR_MONTH, "202301");

    when(mockEventContextKeysExtractor.getDeleteEventContextKeys(mockContext)).thenReturn(dummyContextKeys);

    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(null);
    assertThrows(ServiceException.class, () -> classUnderTest.deleteMonthlyDistributionForAssignment(mockContext));
  }

  @Test
  void deleteMethodReturnsSuccessfullyIfRecordNotFound() {
    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    Map<String, Object> dummyContextKeys = new HashMap<>();
    dummyContextKeys.put(DailyAssignmentDistribution.ID, BUCKET_ID);

    when(mockEventContextKeysExtractor.getDeleteEventContextKeys(mockContext)).thenReturn(dummyContextKeys);

    assertDoesNotThrow(() -> classUnderTest.deleteDailyAssignment(mockContext));

    verifyNoInteractions(mockDraftsUtility);
  }

  @Test
  void dailyBucketGetsDeletedIfPresent() {
    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    Map<String, Object> dummyContextKeys = new HashMap<>();
    dummyContextKeys.put(DailyAssignmentDistribution.ID, BUCKET_ID);

    when(mockEventContextKeysExtractor.getDeleteEventContextKeys(mockContext)).thenReturn(dummyContextKeys);

    AssignmentBuckets dummyBucket = AssignmentBuckets.create();
    dummyBucket.setAssignmentId(ACTIVE_ASSIGNMENT_ID);
    dummyBucket.setId(BUCKET_ID);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);

    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);
    when(mockDataProvider.getSingleAssignmentBucket(BUCKET_ID))
        .thenReturn(Optional.of(com.sap.resourcemanagement.assignment.AssignmentBuckets.create()));

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessages);

    classUnderTest.deleteDailyAssignment(mockContext);

    verify(mockDraftsUtility).cancelDraft(BUCKET_ID);
    verify(mockContext).setResult(any());
    verify(mockContext).setCompleted();
  }

  @Test
  public void weeklyDistributionDeletedSuccessfullyIfAllValidationsPass() {

    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    Map<String, Object> dummyContextKeys = new HashMap<>();
    dummyContextKeys.put(WeeklyAssignmentDistribution.ASSIGNMENT_ID, ACTIVE_ASSIGNMENT_ID);
    dummyContextKeys.put(WeeklyAssignmentDistribution.CALENDAR_WEEK, "202301");
    when(mockEventContextKeysExtractor.getDeleteEventContextKeys(mockContext)).thenReturn(dummyContextKeys);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    WeeklyAssignmentDistribution weeklyAssignmentDistribution = WeeklyAssignmentDistribution.create();
    weeklyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    weeklyAssignmentDistribution.setCalendarWeek("202301");
    weeklyAssignmentDistribution.setBookedCapacity(4);
    weeklyAssignmentDistribution.setWeekStartDate(LocalDate.of(2023, 01, 2));
    weeklyAssignmentDistribution.setWeekEndDate(LocalDate.of(2023, 01, 9));
    when(mockDataProvider.getWeeklyDistribution(ACTIVE_ASSIGNMENT_ID, "202301"))
        .thenReturn(Optional.of(weeklyAssignmentDistribution));

    Messages dummyMessage = mock(Messages.class);
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(dummyMessage);

    classUnderTest.deleteWeeklyDistributionForAssignment(mockContext);

    verify(mockDraftsValidator).validate(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).deleteBucketDrafts(ACTIVE_ASSIGNMENT_ID,
        LocalDate.of(2023, 01, 2).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2023, 01, 9).atStartOfDay().toInstant(ZoneOffset.UTC));
    verify(mockDraftsUtility).updateBookedCapacityInHeader(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
  }

  @Test
  public void serviceExceptionOnWeeklyDistributionDeletedIfValidationsFail() {

    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    Map<String, Object> dummyContextKeys = new HashMap<>();
    dummyContextKeys.put(WeeklyAssignmentDistribution.ASSIGNMENT_ID, ACTIVE_ASSIGNMENT_ID);
    dummyContextKeys.put(WeeklyAssignmentDistribution.CALENDAR_WEEK, "202301");
    when(mockEventContextKeysExtractor.getDeleteEventContextKeys(mockContext)).thenReturn(dummyContextKeys);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    WeeklyAssignmentDistribution weeklyAssignmentDistribution = WeeklyAssignmentDistribution.create();
    weeklyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    weeklyAssignmentDistribution.setCalendarWeek("202301");
    weeklyAssignmentDistribution.setBookedCapacity(4);
    weeklyAssignmentDistribution.setWeekStartDate(LocalDate.of(2023, 01, 2));
    weeklyAssignmentDistribution.setWeekEndDate(LocalDate.of(2023, 01, 9));
    when(mockDataProvider.getWeeklyDistribution(ACTIVE_ASSIGNMENT_ID, "202301"))
        .thenReturn(Optional.of(weeklyAssignmentDistribution));

    Messages mockMessagesWithError = mock(Messages.class);
    doThrow(ServiceException.class).when(mockMessagesWithError).throwIfError();
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessagesWithError);

    assertThrows(ServiceException.class, () -> classUnderTest.deleteWeeklyDistributionForAssignment(mockContext));

    verify(mockDraftsUtility, times(0)).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
  }

  @Test
  public void monthlyDistributionDeletedSuccessfullyIfAllValidationsPass() {

    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    Map<String, Object> dummyContextKeys = new HashMap<>();
    dummyContextKeys.put(MonthlyAssignmentDistribution.ASSIGNMENT_ID, ACTIVE_ASSIGNMENT_ID);
    dummyContextKeys.put(MonthlyAssignmentDistribution.CALENDAR_MONTH, "202301");
    when(mockEventContextKeysExtractor.getDeleteEventContextKeys(mockContext)).thenReturn(dummyContextKeys);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    MonthlyAssignmentDistribution monthlyAssignmentDistribution = MonthlyAssignmentDistribution.create();
    monthlyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    monthlyAssignmentDistribution.setCalendarMonth("202301");
    monthlyAssignmentDistribution.setBookedCapacity(4);
    monthlyAssignmentDistribution.setMonthStartDate(LocalDate.of(2023, 01, 1));
    monthlyAssignmentDistribution.setMonthEndDate(LocalDate.of(2023, 01, 31));
    when(mockDataProvider.getMonthlyDistribution(ACTIVE_ASSIGNMENT_ID, "202301"))
        .thenReturn(Optional.of(monthlyAssignmentDistribution));

    Messages dummyMessage = mock(Messages.class);
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(dummyMessage);

    classUnderTest.deleteMonthlyDistributionForAssignment(mockContext);

    verify(mockDraftsValidator).validate(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).deleteBucketDrafts(ACTIVE_ASSIGNMENT_ID,
        LocalDate.of(2023, 01, 1).atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.of(2023, 01, 31).atStartOfDay().toInstant(ZoneOffset.UTC));
    verify(mockDraftsUtility).updateBookedCapacityInHeader(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
  }

  @Test
  public void serviceExceptionOnMonthlyDistributionDeletedIfValidationsFail() {

    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    Map<String, Object> dummyContextKeys = new HashMap<>();
    dummyContextKeys.put(MonthlyAssignmentDistribution.ASSIGNMENT_ID, ACTIVE_ASSIGNMENT_ID);
    dummyContextKeys.put(MonthlyAssignmentDistribution.CALENDAR_MONTH, "202301");
    when(mockEventContextKeysExtractor.getDeleteEventContextKeys(mockContext)).thenReturn(dummyContextKeys);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));

    MonthlyAssignmentDistribution monthlyAssignmentDistribution = MonthlyAssignmentDistribution.create();
    monthlyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    monthlyAssignmentDistribution.setCalendarMonth("202301");
    monthlyAssignmentDistribution.setBookedCapacity(4);
    monthlyAssignmentDistribution.setMonthStartDate(LocalDate.of(2023, 01, 1));
    monthlyAssignmentDistribution.setMonthEndDate(LocalDate.of(2023, 01, 31));
    when(mockDataProvider.getMonthlyDistribution(ACTIVE_ASSIGNMENT_ID, "202301"))
        .thenReturn(Optional.of(monthlyAssignmentDistribution));

    Messages mockMessagesWithError = mock(Messages.class);
    doThrow(ServiceException.class).when(mockMessagesWithError).throwIfError();
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessagesWithError);

    assertThrows(ServiceException.class, () -> classUnderTest.deleteMonthlyDistributionForAssignment(mockContext));

    verify(mockDraftsUtility, times(0)).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
  }

  @Test
  public void monthlyDistributionUpdatedSuccessfullyIfAllValidationsPass() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    MonthlyAssignmentDistribution monthlyAssignmentDistributionPayload = MonthlyAssignmentDistribution.create();
    monthlyAssignmentDistributionPayload.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    monthlyAssignmentDistributionPayload.setCalendarMonth("202301");
    monthlyAssignmentDistributionPayload.setBookedCapacity(4);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);
    mockEditDraft.setResourceRequestId(REQUEST_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));

    MonthlyAssignmentDistribution monthlyAssignmentDistribution = MonthlyAssignmentDistribution.create();
    monthlyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    monthlyAssignmentDistribution.setCalendarMonth("202301");
    monthlyAssignmentDistribution.setBookedCapacity(5);
    monthlyAssignmentDistribution.setMonthStartDate(LocalDate.of(2023, 01, 1));
    monthlyAssignmentDistribution.setMonthEndDate(LocalDate.of(2023, 01, 31));
    when(mockDataProvider.getMonthlyDistribution(ACTIVE_ASSIGNMENT_ID, "202301"))
        .thenReturn(Optional.of(monthlyAssignmentDistribution));

    ResourceRequests dummyRequest = ResourceRequests.create();
    dummyRequest.setId(REQUEST_ID);
    dummyRequest.setStartDate(LocalDate.now().minusDays(1));
    dummyRequest.setEndDate(LocalDate.now().plusDays(1));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(dummyRequest));

    Messages dummyMessage = mock(Messages.class);
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(dummyMessage);

    when(mockValidator.getMessages()).thenReturn(dummyMessage);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    classUnderTest.updateMonthlyDistributionForAssignment(mockContext, monthlyAssignmentDistributionPayload);

    verify(mockDraftsValidator).validate(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).updateAssignmentBucketsDrafts(any(), any());
    verify(mockDraftsUtility).updateBookedCapacityInHeader(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
  }

  @Test
  public void serviceExceptionOnMonthlyDistributionUpdateIfValidationsFail() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    MonthlyAssignmentDistribution monthlyAssignmentDistributionPayload = MonthlyAssignmentDistribution.create();
    monthlyAssignmentDistributionPayload.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    monthlyAssignmentDistributionPayload.setCalendarMonth("202301");
    monthlyAssignmentDistributionPayload.setBookedCapacity(4);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    MonthlyAssignmentDistribution monthlyAssignmentDistribution = MonthlyAssignmentDistribution.create();
    monthlyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    monthlyAssignmentDistribution.setCalendarMonth("202301");
    monthlyAssignmentDistribution.setBookedCapacity(4);
    monthlyAssignmentDistribution.setMonthStartDate(LocalDate.of(2023, 01, 1));
    monthlyAssignmentDistribution.setMonthEndDate(LocalDate.of(2023, 01, 31));
    when(mockDataProvider.getMonthlyDistribution(ACTIVE_ASSIGNMENT_ID, "202301"))
        .thenReturn(Optional.of(monthlyAssignmentDistribution));

    Messages mockMessagesWithError = mock(Messages.class);
    doThrow(ServiceException.class).when(mockMessagesWithError).throwIfError();
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessagesWithError);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateMonthlyDistributionForAssignment(mockContext, monthlyAssignmentDistributionPayload));

    verify(mockDraftsUtility, times(0)).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
  }

  @Test
  public void weeklyDistributionUpdatedSuccessfullyIfAllValidationsPass() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    WeeklyAssignmentDistribution weeklyAssignmentDistributionPayload = WeeklyAssignmentDistribution.create();
    weeklyAssignmentDistributionPayload.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    weeklyAssignmentDistributionPayload.setCalendarWeek("202301");
    weeklyAssignmentDistributionPayload.setBookedCapacity(4);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);
    mockEditDraft.setResourceRequestId(REQUEST_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));

    WeeklyAssignmentDistribution weeklyAssignmentDistribution = WeeklyAssignmentDistribution.create();
    weeklyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    weeklyAssignmentDistribution.setCalendarWeek("202301");
    weeklyAssignmentDistribution.setBookedCapacity(5);
    weeklyAssignmentDistribution.setWeekStartDate(LocalDate.of(2023, 01, 1));
    weeklyAssignmentDistribution.setWeekEndDate(LocalDate.of(2023, 01, 7));
    when(mockDataProvider.getWeeklyDistribution(ACTIVE_ASSIGNMENT_ID, "202301"))
        .thenReturn(Optional.of(weeklyAssignmentDistribution));

    ResourceRequests dummyRequest = ResourceRequests.create();
    dummyRequest.setId(REQUEST_ID);
    dummyRequest.setStartDate(LocalDate.now().minusDays(1));
    dummyRequest.setEndDate(LocalDate.now().plusDays(1));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(dummyRequest));

    Messages dummyMessage = mock(Messages.class);
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(dummyMessage);

    when(mockValidator.getMessages()).thenReturn(dummyMessage);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    classUnderTest.updateWeeklyDistributionForAssignment(mockContext, weeklyAssignmentDistributionPayload);

    verify(mockDraftsValidator).validate(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).updateAssignmentBucketsDrafts(any(), any());
    verify(mockDraftsUtility).updateBookedCapacityInHeader(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
  }

  @Test
  public void serviceExceptionOnWeeklyDistributionUpdateIfValidationsFail() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    WeeklyAssignmentDistribution weeklyAssignmentDistributionPayload = WeeklyAssignmentDistribution.create();
    weeklyAssignmentDistributionPayload.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    weeklyAssignmentDistributionPayload.setCalendarWeek("202301");
    weeklyAssignmentDistributionPayload.setBookedCapacity(4);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    WeeklyAssignmentDistribution weeklyAssignmentDistribution = WeeklyAssignmentDistribution.create();
    weeklyAssignmentDistribution.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    weeklyAssignmentDistribution.setCalendarWeek("202301");
    weeklyAssignmentDistribution.setBookedCapacity(4);
    weeklyAssignmentDistribution.setWeekStartDate(LocalDate.of(2023, 01, 1));
    weeklyAssignmentDistribution.setWeekEndDate(LocalDate.of(2023, 01, 7));
    when(mockDataProvider.getWeeklyDistribution(ACTIVE_ASSIGNMENT_ID, "202301"))
        .thenReturn(Optional.of(weeklyAssignmentDistribution));

    Messages mockMessagesWithError = mock(Messages.class);
    doThrow(ServiceException.class).when(mockMessagesWithError).throwIfError();
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessagesWithError);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateWeeklyDistributionForAssignment(mockContext, weeklyAssignmentDistributionPayload));

    verify(mockDraftsUtility, times(0)).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
  }

  @Test
  public void monthlyDistributionCreatedSuccessfullyIfAllValidationsPass() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    MonthlyAssignmentDistribution monthlyAssignmentDistributionPayload = MonthlyAssignmentDistribution.create();
    monthlyAssignmentDistributionPayload.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    monthlyAssignmentDistributionPayload.setCalendarMonth("202301");
    monthlyAssignmentDistributionPayload.setBookedCapacity(4);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);
    mockEditDraft.setResourceRequestId(REQUEST_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));

    when(mockDataProvider.getMonthlyDistribution(ACTIVE_ASSIGNMENT_ID, "202301")).thenReturn(Optional.ofNullable(null));

    ResourceRequests dummyRequest = ResourceRequests.create();
    dummyRequest.setId(REQUEST_ID);
    dummyRequest.setStartDate(LocalDate.of(2023, 1, 1));
    dummyRequest.setEndDate(LocalDate.of(2023, 2, 1));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(dummyRequest));

    Messages dummyMessage = mock(Messages.class);
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(dummyMessage);

    when(mockValidator.getMessages()).thenReturn(dummyMessage);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    classUnderTest.createMonthlyDistributionForAssignment(mockContext, monthlyAssignmentDistributionPayload);

    verify(mockDraftsValidator).validate(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).createNewBucketDrafts(any());
    verify(mockDraftsUtility).updateBookedCapacityInHeader(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
  }

  @Test
  public void serviceExceptionOnMonthlyDistributionCreateIfValidationsFail() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    MonthlyAssignmentDistribution monthlyAssignmentDistributionPayload = MonthlyAssignmentDistribution.create();
    monthlyAssignmentDistributionPayload.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    monthlyAssignmentDistributionPayload.setCalendarMonth("202301");
    monthlyAssignmentDistributionPayload.setBookedCapacity(4);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    when(mockDataProvider.getMonthlyDistribution(ACTIVE_ASSIGNMENT_ID, "202301")).thenReturn(Optional.ofNullable(null));

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockValidator.getMessages()).thenReturn(mockMessages);

    Messages mockMessagesWithError = mock(Messages.class);
    doThrow(ServiceException.class).when(mockMessagesWithError).throwIfError();
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessagesWithError);

    assertThrows(ServiceException.class,
        () -> classUnderTest.createMonthlyDistributionForAssignment(mockContext, monthlyAssignmentDistributionPayload));

    verify(mockDraftsUtility, times(0)).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
  }

  @Test
  public void weeklyDistributionCreatedSuccessfullyIfAllValidationsPass() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    WeeklyAssignmentDistribution weeklyAssignmentDistributionPayload = WeeklyAssignmentDistribution.create();
    weeklyAssignmentDistributionPayload.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    weeklyAssignmentDistributionPayload.setCalendarWeek("202301");
    weeklyAssignmentDistributionPayload.setBookedCapacity(4);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);
    mockEditDraft.setResourceRequestId(REQUEST_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));
    when(mockDataProvider.getWeeklyDistribution(ACTIVE_ASSIGNMENT_ID, "202301")).thenReturn(Optional.ofNullable(null));

    when(mockDataProvider.getTimeDimensionDataForCalendarWeekStart("202301").getDateSql())
        .thenReturn(LocalDate.of(2023, 01, 2));
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekEnd("202301").getDateSql())
        .thenReturn(LocalDate.of(2023, 01, 9));

    ResourceRequests dummyRequest = ResourceRequests.create();
    dummyRequest.setId(REQUEST_ID);
    dummyRequest.setStartDate(LocalDate.of(2023, 01, 1));
    dummyRequest.setEndDate(LocalDate.of(2023, 01, 10));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(dummyRequest));

    Messages dummyMessage = mock(Messages.class);
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(dummyMessage);
    when(mockValidator.getMessages()).thenReturn(dummyMessage);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    classUnderTest.createWeeklyDistributionForAssignment(mockContext, weeklyAssignmentDistributionPayload);

    verify(mockDraftsValidator).validate(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).createNewBucketDrafts(any());
    verify(mockDraftsUtility).updateBookedCapacityInHeader(ACTIVE_ASSIGNMENT_ID);
    verify(mockDraftsUtility).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
  }

  @Test
  public void serviceExceptionOnWeeklyDistributionCreateIfValidationsFail() {

    CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Rahul");

    WeeklyAssignmentDistribution weeklyAssignmentDistributionPayload = WeeklyAssignmentDistribution.create();
    weeklyAssignmentDistributionPayload.setAssignmentID(ACTIVE_ASSIGNMENT_ID);
    weeklyAssignmentDistributionPayload.setCalendarWeek("202301");
    weeklyAssignmentDistributionPayload.setBookedCapacity(4);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ACTIVE_ASSIGNMENT_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);
    mockEditDraft.setResourceRequestId(REQUEST_ID);
    when(mockDraftsUtility.getEditDraftForUser(any(), any(), any(), any(Boolean.class), any(Boolean.class)))
        .thenReturn(mockEditDraft);

    Types dummyType = Types.create();
    dummyType.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID)).thenReturn(Optional.of(dummyType));
    when(mockDataProvider.getWeeklyDistribution(ACTIVE_ASSIGNMENT_ID, "202301")).thenReturn(Optional.ofNullable(null));

    when(mockDataProvider.getTimeDimensionDataForCalendarWeekStart("202301").getDateSql())
        .thenReturn(LocalDate.of(2023, 01, 2));
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekEnd("202301").getDateSql())
        .thenReturn(LocalDate.of(2023, 01, 9));

    ResourceRequests dummyRequest = ResourceRequests.create();
    dummyRequest.setId(REQUEST_ID);
    dummyRequest.setStartDate(LocalDate.of(2023, 01, 1));
    dummyRequest.setEndDate(LocalDate.of(2023, 01, 10));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(dummyRequest));

    Messages mockMessages = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockValidator.getMessages()).thenReturn(mockMessages);

    Messages mockMessagesWithError = mock(Messages.class);
    doThrow(ServiceException.class).when(mockMessagesWithError).throwIfError();
    when(mockDraftsValidator.validate(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockMessagesWithError);

    assertThrows(ServiceException.class,
        () -> classUnderTest.createWeeklyDistributionForAssignment(mockContext, weeklyAssignmentDistributionPayload));

    verify(mockDraftsUtility, times(0)).activateEditDraft(ACTIVE_ASSIGNMENT_ID);
  }

}
