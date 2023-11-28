package com.sap.c4p.rm.assignment.handlers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.utils.AssignmentDraftsUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;
import com.sap.c4p.rm.assignment.validation.AssignmentDraftsValidator;
import com.sap.c4p.rm.assignment.validation.AssignmentValidator;

import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.system.data.timedimension.Data;

import consultantassignmentservice.Assignments;
import consultantassignmentservice.WeeklyAssignmentDistribution;

public class ConsultantAssignmentServiceHandlerTest {

  private static final String ASSIGNMENT_ID = "AssignmentId";
  private static final String RESOURCE_ID = "ResourceId";
  private static final String REQUEST_ID = "RequestId";
  private AssignmentValidator mockValidator;
  private AssignmentDraftsValidator mockDraftsValidator;
  private AssignmentDraftsUtility mockDraftUtility;
  private DataProvider mockDataProvider;

  private ConsultantAssignmentServiceHandler classUnderTest;

  @BeforeEach
  public void setUp() {
    this.mockDraftsValidator = mock(AssignmentDraftsValidator.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockDraftUtility = mock(AssignmentDraftsUtility.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockValidator = mock(AssignmentValidator.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockDataProvider = mock(DataProvider.class, Mockito.RETURNS_DEEP_STUBS);

    this.classUnderTest = new ConsultantAssignmentServiceHandler(mockValidator, mockDraftsValidator, mockDraftUtility,
        mockDataProvider);
  }

  @Test
  public void serviceExceptionIfAssignmentDoesNotExists() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Some Consultant");
    Assignments mockAssignmentPayload = Assignments.create();
    mockAssignmentPayload.setId(ASSIGNMENT_ID);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.getMessages()).thenReturn(mockMessage);
    doThrow(ServiceException.class).when(mockMessage).throwIfError();

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateWeeklyAssignment(mockContext, mockAssignmentPayload));
  }

  @Test
  public void serviceExceptionIfAssignmentDoesNotBelongToConsultant() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Some Consultant");
    Assignments mockAssignmentPayload = Assignments.create();
    mockAssignmentPayload.setId(ASSIGNMENT_ID);

    Messages mockNoMessage = mock(Messages.class);
    Messages mockErrorMessage = mock(Messages.class);
    doThrow(ServiceException.class).when(mockErrorMessage).throwIfError();

    when(mockValidator.getMessages()).thenReturn(mockNoMessage).thenReturn(mockErrorMessage);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateWeeklyAssignment(mockContext, mockAssignmentPayload));
  }

  @Test
  public void serviceExceptionIfEditDraftCreationLeadsToError() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Some Consultant");

    WeeklyAssignmentDistribution mockWeeklyDistribution = WeeklyAssignmentDistribution.create();

    Assignments mockAssignmentPayload = Assignments.create();
    mockAssignmentPayload.setId(ASSIGNMENT_ID);
    mockAssignmentPayload.setWeeklyAssignmentDistribution(Collections.singletonList(mockWeeklyDistribution));

    Messages mockContextMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockContextMessage);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.getMessages()).thenReturn(mockMessage).thenReturn(mockMessage);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();

    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Consultant", mockContextMessage, true, true))
        .thenReturn(mockEditDraft);

    doThrow(ServiceException.class).when(mockContextMessage).throwIfError();

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateWeeklyAssignment(mockContext, mockAssignmentPayload));
  }

  @Test
  public void serviceExceptionIfEditDraftCouldNotBeCreated() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Some Consultant");

    WeeklyAssignmentDistribution mockWeeklyDistribution = WeeklyAssignmentDistribution.create();

    Assignments mockAssignmentPayload = Assignments.create();
    mockAssignmentPayload.setId(ASSIGNMENT_ID);
    mockAssignmentPayload.setWeeklyAssignmentDistribution(Collections.singletonList(mockWeeklyDistribution));

    Messages mockContextMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockContextMessage);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.getMessages()).thenReturn(mockMessage).thenReturn(mockMessage);

    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Consultant", mockContextMessage, true, true))
        .thenReturn(null);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateWeeklyAssignment(mockContext, mockAssignmentPayload));
  }

  @Test
  public void serviceExceptionIfCalendarWeekIsNull() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Some Consultant");

    WeeklyAssignmentDistribution mockWeeklyDistribution = WeeklyAssignmentDistribution.create();
    mockWeeklyDistribution.setCalendarWeek(null);
    mockWeeklyDistribution.setBookedCapacity(42);

    Assignments mockAssignmentPayload = Assignments.create();
    mockAssignmentPayload.setId(ASSIGNMENT_ID);
    mockAssignmentPayload.setWeeklyAssignmentDistribution(Collections.singletonList(mockWeeklyDistribution));

    Messages mockContextMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockContextMessage);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.getMessages()).thenReturn(mockMessage).thenReturn(mockMessage);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ASSIGNMENT_ID);
    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Consultant", mockContextMessage, true, true))
        .thenReturn(mockEditDraft);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateWeeklyAssignment(mockContext, mockAssignmentPayload));
  }

  @Test
  public void serviceExceptionIfCalendarWeekIsEmpty() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Some Consultant");

    WeeklyAssignmentDistribution mockWeeklyDistribution = WeeklyAssignmentDistribution.create();
    mockWeeklyDistribution.setCalendarWeek("");
    mockWeeklyDistribution.setBookedCapacity(42);

    Assignments mockAssignmentPayload = Assignments.create();
    mockAssignmentPayload.setId(ASSIGNMENT_ID);
    mockAssignmentPayload.setWeeklyAssignmentDistribution(Collections.singletonList(mockWeeklyDistribution));

    Messages mockContextMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockContextMessage);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.getMessages()).thenReturn(mockMessage).thenReturn(mockMessage);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ASSIGNMENT_ID);
    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Consultant", mockContextMessage, true, true))
        .thenReturn(mockEditDraft);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateWeeklyAssignment(mockContext, mockAssignmentPayload));
  }

  @Test
  public void serviceExceptionIfBookedCapacityIsNull() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Some Consultant");

    WeeklyAssignmentDistribution mockWeeklyDistribution = WeeklyAssignmentDistribution.create();
    mockWeeklyDistribution.setCalendarWeek("202301");
    mockWeeklyDistribution.setBookedCapacity(null);

    Assignments mockAssignmentPayload = Assignments.create();
    mockAssignmentPayload.setId(ASSIGNMENT_ID);
    mockAssignmentPayload.setWeeklyAssignmentDistribution(Collections.singletonList(mockWeeklyDistribution));

    Messages mockContextMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockContextMessage);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.getMessages()).thenReturn(mockMessage).thenReturn(mockMessage);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ASSIGNMENT_ID);
    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Consultant", mockContextMessage, true, true))
        .thenReturn(mockEditDraft);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateWeeklyAssignment(mockContext, mockAssignmentPayload));
  }

  @Test
  public void serviceExceptionIfBookedCapacityIsNegative() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Some Consultant");

    WeeklyAssignmentDistribution mockWeeklyDistribution = WeeklyAssignmentDistribution.create();
    mockWeeklyDistribution.setCalendarWeek("202301");
    mockWeeklyDistribution.setBookedCapacity(-1);

    Assignments mockAssignmentPayload = Assignments.create();
    mockAssignmentPayload.setId(ASSIGNMENT_ID);
    mockAssignmentPayload.setWeeklyAssignmentDistribution(Collections.singletonList(mockWeeklyDistribution));

    Messages mockContextMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockContextMessage);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.getMessages()).thenReturn(mockMessage).thenReturn(mockMessage);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ASSIGNMENT_ID);
    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Consultant", mockContextMessage, true, true))
        .thenReturn(mockEditDraft);

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateWeeklyAssignment(mockContext, mockAssignmentPayload));
  }

  @Test
  public void serviceExceptionIfDraftValidationFails() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Some Consultant");

    WeeklyAssignmentDistribution mockWeeklyDistribution = WeeklyAssignmentDistribution.create();
    mockWeeklyDistribution.setCalendarWeek("202301");
    mockWeeklyDistribution.setBookedCapacity(42);

    Assignments mockAssignmentPayload = Assignments.create();
    mockAssignmentPayload.setId(ASSIGNMENT_ID);
    mockAssignmentPayload.setWeeklyAssignmentDistribution(Collections.singletonList(mockWeeklyDistribution));

    Messages mockContextMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockContextMessage);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.getMessages()).thenReturn(mockMessage).thenReturn(mockMessage);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ASSIGNMENT_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);
    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Consultant", mockContextMessage, true, true))
        .thenReturn(mockEditDraft);

    Data mockTimeDimeWeekStart = Data.create();
    mockTimeDimeWeekStart.setDateSql(LocalDate.of(2023, 01, 01));
    Data mockTimeDimeWeekEnd = Data.create();
    mockTimeDimeWeekEnd.setDateSql(LocalDate.of(2023, 01, 07));
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekStart("202301")).thenReturn(mockTimeDimeWeekStart);
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekEnd("202301")).thenReturn(mockTimeDimeWeekEnd);

    Messages mockErrorMessage = mock(Messages.class);
    doThrow(ServiceException.class).when(mockErrorMessage).throwIfError();
    when(mockDraftsValidator.validate(ASSIGNMENT_ID)).thenReturn(mockErrorMessage);

    when(mockDraftUtility.getExistingAssignmentBucketsDrafts(ASSIGNMENT_ID, mockTimeDimeWeekStart.getDateSql(),
        mockTimeDimeWeekEnd.getDateSql())).thenReturn(Collections.emptyList());
    when(mockDraftUtility.getSimulatedAssignmentBucketsDrafts(ASSIGNMENT_ID, RESOURCE_ID,
        mockTimeDimeWeekStart.getDateSql(), mockTimeDimeWeekEnd.getDateSql(), 42)).thenReturn(Collections.emptyList());

    assertThrows(ServiceException.class,
        () -> classUnderTest.updateWeeklyAssignment(mockContext, mockAssignmentPayload));
  }

  @Test
  public void assignmentHeaderHoursUpdatedInCaseOfWeeklyDistributionUpdateIfNoErrors() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Some Consultant");

    WeeklyAssignmentDistribution mockWeeklyDistribution = WeeklyAssignmentDistribution.create();
    mockWeeklyDistribution.setCalendarWeek("202301");
    mockWeeklyDistribution.setBookedCapacity(42);

    Assignments mockAssignmentPayload = Assignments.create();
    mockAssignmentPayload.setId(ASSIGNMENT_ID);
    mockAssignmentPayload.setWeeklyAssignmentDistribution(Collections.singletonList(mockWeeklyDistribution));

    Messages mockContextMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockContextMessage);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.getMessages()).thenReturn(mockMessage).thenReturn(mockMessage);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ASSIGNMENT_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);
    mockEditDraft.setResourceRequestId(REQUEST_ID);
    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Consultant", mockContextMessage, true, true))
        .thenReturn(mockEditDraft);

    Data mockTimeDimeWeekStart = Data.create();
    mockTimeDimeWeekStart.setDateSql(LocalDate.of(2023, 01, 01));
    Data mockTimeDimeWeekEnd = Data.create();
    mockTimeDimeWeekEnd.setDateSql(LocalDate.of(2023, 01, 07));
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekStart("202301")).thenReturn(mockTimeDimeWeekStart);
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekEnd("202301")).thenReturn(mockTimeDimeWeekEnd);
    ResourceRequests request = ResourceRequests.create();
    request.setId(REQUEST_ID);
    request.setStartDate(LocalDate.of(2023, 01, 01));
    request.setEndDate(LocalDate.of(2023, 01, 07));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(request));

    when(mockDraftsValidator.validate(ASSIGNMENT_ID)).thenReturn(mockMessage);

    when(mockDraftUtility.getExistingAssignmentBucketsDrafts(ASSIGNMENT_ID, mockTimeDimeWeekStart.getDateSql(),
        mockTimeDimeWeekEnd.getDateSql())).thenReturn(Collections.emptyList());
    when(mockDraftUtility.getSimulatedAssignmentBucketsDrafts(ASSIGNMENT_ID, RESOURCE_ID,
        mockTimeDimeWeekStart.getDateSql(), mockTimeDimeWeekEnd.getDateSql(), 42)).thenReturn(Collections.emptyList());

    classUnderTest.updateWeeklyAssignment(mockContext, mockAssignmentPayload);

    verify(mockDraftUtility, times(1)).updateAssignmentBucketsDrafts(any(), any());
    verify(mockDraftUtility, times(1)).updateBookedCapacityInHeader(ASSIGNMENT_ID);
  }

  @Test
  public void draftActivatedInCaseOfWeeklyDistributionUpdateIfNoErrors() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Some Consultant");

    WeeklyAssignmentDistribution mockWeeklyDistribution = WeeklyAssignmentDistribution.create();
    mockWeeklyDistribution.setCalendarWeek("202301");
    mockWeeklyDistribution.setBookedCapacity(42);

    Assignments mockAssignmentPayload = Assignments.create();
    mockAssignmentPayload.setId(ASSIGNMENT_ID);
    mockAssignmentPayload.setWeeklyAssignmentDistribution(Collections.singletonList(mockWeeklyDistribution));

    Messages mockContextMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockContextMessage);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.getMessages()).thenReturn(mockMessage).thenReturn(mockMessage);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ASSIGNMENT_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);
    mockEditDraft.setResourceRequestId(REQUEST_ID);
    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Consultant", mockContextMessage, true, true))
        .thenReturn(mockEditDraft);

    Data mockTimeDimeWeekStart = Data.create();
    mockTimeDimeWeekStart.setDateSql(LocalDate.of(2023, 01, 01));
    Data mockTimeDimeWeekEnd = Data.create();
    mockTimeDimeWeekEnd.setDateSql(LocalDate.of(2023, 01, 07));
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekStart("202301")).thenReturn(mockTimeDimeWeekStart);
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekEnd("202301")).thenReturn(mockTimeDimeWeekEnd);
    ResourceRequests request = ResourceRequests.create();
    request.setId(REQUEST_ID);
    request.setStartDate(LocalDate.of(2023, 01, 01));
    request.setEndDate(LocalDate.of(2023, 01, 07));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(request));

    when(mockDraftsValidator.validate(ASSIGNMENT_ID)).thenReturn(mockMessage);

    when(mockDraftUtility.getExistingAssignmentBucketsDrafts(ASSIGNMENT_ID, mockTimeDimeWeekStart.getDateSql(),
        mockTimeDimeWeekEnd.getDateSql())).thenReturn(Collections.emptyList());
    when(mockDraftUtility.getSimulatedAssignmentBucketsDrafts(ASSIGNMENT_ID, RESOURCE_ID,
        mockTimeDimeWeekStart.getDateSql(), mockTimeDimeWeekEnd.getDateSql(), 42)).thenReturn(Collections.emptyList());

    classUnderTest.updateWeeklyAssignment(mockContext, mockAssignmentPayload);

    verify(mockDraftUtility, times(1)).activateEditDraft(ASSIGNMENT_ID);
  }

  @Test
  public void contextSetToCompleteInCaseOfWeeklyDistributionUpdateIfNoErrors() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("Some Consultant");

    WeeklyAssignmentDistribution mockWeeklyDistribution = WeeklyAssignmentDistribution.create();
    mockWeeklyDistribution.setCalendarWeek("202301");
    mockWeeklyDistribution.setBookedCapacity(42);

    Assignments mockAssignmentPayload = Assignments.create();
    mockAssignmentPayload.setId(ASSIGNMENT_ID);
    mockAssignmentPayload.setWeeklyAssignmentDistribution(Collections.singletonList(mockWeeklyDistribution));

    Messages mockContextMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockContextMessage);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.getMessages()).thenReturn(mockMessage).thenReturn(mockMessage);

    assignmentservice.Assignments mockEditDraft = assignmentservice.Assignments.create();
    mockEditDraft.setId(ASSIGNMENT_ID);
    mockEditDraft.setResourceId(RESOURCE_ID);
    mockEditDraft.setResourceRequestId(REQUEST_ID);
    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Consultant", mockContextMessage, true, true))
        .thenReturn(mockEditDraft);

    Data mockTimeDimeWeekStart = Data.create();
    mockTimeDimeWeekStart.setDateSql(LocalDate.of(2023, 01, 01));
    Data mockTimeDimeWeekEnd = Data.create();
    mockTimeDimeWeekEnd.setDateSql(LocalDate.of(2023, 01, 07));
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekStart("202301")).thenReturn(mockTimeDimeWeekStart);
    when(mockDataProvider.getTimeDimensionDataForCalendarWeekEnd("202301")).thenReturn(mockTimeDimeWeekEnd);
    ResourceRequests request = ResourceRequests.create();
    request.setId(REQUEST_ID);
    request.setStartDate(LocalDate.of(2023, 01, 01));
    request.setEndDate(LocalDate.of(2023, 01, 07));
    when(mockDataProvider.getRequestData(REQUEST_ID)).thenReturn(Optional.of(request));

    when(mockDraftsValidator.validate(ASSIGNMENT_ID)).thenReturn(mockMessage);

    when(mockDraftUtility.getExistingAssignmentBucketsDrafts(ASSIGNMENT_ID, mockTimeDimeWeekStart.getDateSql(),
        mockTimeDimeWeekEnd.getDateSql())).thenReturn(Collections.emptyList());
    when(mockDraftUtility.getSimulatedAssignmentBucketsDrafts(ASSIGNMENT_ID, RESOURCE_ID,
        mockTimeDimeWeekStart.getDateSql(), mockTimeDimeWeekEnd.getDateSql(), 42)).thenReturn(Collections.emptyList());

    classUnderTest.updateWeeklyAssignment(mockContext, mockAssignmentPayload);

    verify(mockContext, times(1)).setResult(any());
    verify(mockContext, times(1)).setCompleted();
  }

}
