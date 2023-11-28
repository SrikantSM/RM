package com.sap.c4p.rm.assignment.handlers;

import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.setEditDraft;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.changeset.ChangeSetContext;
import com.sap.cds.services.draft.DraftSaveEventContext;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.auditlog.AuditChangeLog;
import com.sap.c4p.rm.assignment.enums.AssignmentStatus;
import com.sap.c4p.rm.assignment.integration.AssignmentS4Integration;
import com.sap.c4p.rm.assignment.simulation.AssignmentSimulatorFactory;
import com.sap.c4p.rm.assignment.utils.AssignmentDependentEntityUpdateUtility;
import com.sap.c4p.rm.assignment.utils.AssignmentDraftsUtility;
import com.sap.c4p.rm.assignment.utils.AssignmentServiceHandlerUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;
import com.sap.c4p.rm.assignment.validation.Validator;
import com.sap.c4p.rm.assignment.validation.ValidatorFactory;

import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.supply.AssignmentBucketsYearMonthAggregate;

import assignmentservice.Assignments;
import assignmentservice.SimulateAsgBasedOnTotalHoursContext;
import assignmentservice.SimulateAssignmentAsRequestedContext;

public class AssignmentServiceHandlerTest {

  private static final String ACTIVE_ASSIGNMENT_ID = "ACTIVE_ASSIGNMENT_ID";
  private static final String DRAFT_ASSIGNMENT_ID = "DRAFT_ASSIGNMENT_ID";
  private static final String S4_REQUEST_ID = "S4_REQUEST_ID";
  private static final String NON_S4_REQUEST_ID = "NON_S4_REQUEST_ID";
  private static final String REQUEST_ID = null;

  private AssignmentServiceHandler classUnderTest;

  private AssignmentSimulatorFactory mockSimulatorFactory;
  private AssignmentServiceHandlerUtility mockServiceHandlerutility;
  private ValidatorFactory mockValidatorFactory;

  private DataProvider mockDataProvider;
  private AuditChangeLog mockAuditChangeLog;
  private AssignmentDependentEntityUpdateUtility mockAssignmentDependentEntityUpdateUtility;

  private AssignmentS4Integration mockAssignmentS4Integrator;
  private AssignmentDraftsUtility mockDraftUtility;

  @BeforeEach
  void setup() {
    this.mockSimulatorFactory = mock(AssignmentSimulatorFactory.class);
    this.mockServiceHandlerutility = mock(AssignmentServiceHandlerUtility.class);
    this.mockValidatorFactory = mock(ValidatorFactory.class);
    this.mockAuditChangeLog = mock(AuditChangeLog.class);
    this.mockAssignmentS4Integrator = mock(AssignmentS4Integration.class);
    this.mockDataProvider = mock(DataProvider.class);
    this.mockAssignmentDependentEntityUpdateUtility = mock(AssignmentDependentEntityUpdateUtility.class);
    this.mockDraftUtility = mock(AssignmentDraftsUtility.class);

    this.classUnderTest = new AssignmentServiceHandler(mockSimulatorFactory, mockServiceHandlerutility,
        mockValidatorFactory, mockAuditChangeLog, mockAssignmentS4Integrator, mockDataProvider,
        mockAssignmentDependentEntityUpdateUtility, mockDraftUtility);

    setEditDraft(DRAFT_ASSIGNMENT_ID);
  }

  @Test
  void totalHourSimulationSkippedOnValidationFailureAndExceptionRaised() {

    SimulateAsgBasedOnTotalHoursContext mockContext = mock(SimulateAsgBasedOnTotalHoursContext.class);

    Validator mockValidator = mock(Validator.class);
    when(mockValidatorFactory.getValidator(any())).thenReturn(mockValidator);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.validate(mockContext)).thenReturn(mockMessage);
    doThrow(ServiceException.class).when(mockMessage).throwIfError();

    assertThrows(ServiceException.class, () -> classUnderTest.simulateAsgBasedOnTotalHours(mockContext));

    verifyNoInteractions(mockSimulatorFactory);
    verifyNoInteractions(mockServiceHandlerutility);
  }

  @Test
  void asRequestedSimulationSkippedOnValidationFailureAndExceptionRaised() {

    SimulateAssignmentAsRequestedContext mockContext = mock(SimulateAssignmentAsRequestedContext.class);

    Validator mockValidator = mock(Validator.class);
    when(mockValidatorFactory.getValidator(any())).thenReturn(mockValidator);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.validate(mockContext)).thenReturn(mockMessage);
    doThrow(ServiceException.class).when(mockMessage).throwIfError();

    assertThrows(ServiceException.class, () -> classUnderTest.simulateAssignmentAsRequested(mockContext));

    verifyNoInteractions(mockSimulatorFactory);
    verifyNoInteractions(mockServiceHandlerutility);
  }

  @Test
  void totalHourSimulationExecutedOnSuccesfulValidation() {

    SimulateAsgBasedOnTotalHoursContext mockContext = mock(SimulateAsgBasedOnTotalHoursContext.class);

    Validator mockValidator = mock(Validator.class);
    when(mockValidatorFactory.getValidator(any())).thenReturn(mockValidator);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.validate(mockContext)).thenReturn(mockMessage);

    classUnderTest.simulateAsgBasedOnTotalHours(mockContext);

    verify(mockSimulatorFactory).getAssignmentSimulator(any());
    verify(mockServiceHandlerutility).buildActionResult(any(), any());
  }

  @Test
  void asRequestedSimulationExecutedOnSuccesfulValidation() {

    SimulateAssignmentAsRequestedContext mockContext = mock(SimulateAssignmentAsRequestedContext.class);

    Validator mockValidator = mock(Validator.class);
    when(mockValidatorFactory.getValidator(any())).thenReturn(mockValidator);

    Messages mockMessage = mock(Messages.class);
    when(mockValidator.validate(mockContext)).thenReturn(mockMessage);
    when(mockContext.getMessages()).thenReturn(mockMessage);

    classUnderTest.simulateAssignmentAsRequested(mockContext);

    verify(mockSimulatorFactory).getAssignmentSimulator(any());
    verify(mockServiceHandlerutility).buildActionResult(any(), any());
  }

  @Test
  void assignmentDraftCreateRaisesExceptionOnValidationError() {

    EventContext mockContext = mock(EventContext.class);
    Assignments mockAssignment = Assignments.create();
    Messages mockMessage = mock(Messages.class);

    when(mockServiceHandlerutility.validateAuthorizationForRequestAndResource(any(), any())).thenReturn(mockMessage);
    doThrow(ServiceException.class).when(mockMessage).throwIfError();

    // There should be no exception raised at his juncture in assignment creation
    // scenarios.
    assertDoesNotThrow(
        () -> this.classUnderTest.assignmentDraftCreate(mockContext, Collections.singletonList(mockAssignment)));
  }

  @Test
  void assignmentDraftCreateSuccessfulOnNoError() {

    EventContext mockContext = mock(EventContext.class);
    Assignments mockAssignment = Assignments.create();
    Messages mockMessage = mock(Messages.class);

    when(mockServiceHandlerutility.validateAuthorizationForRequestAndResource(any(), any())).thenReturn(mockMessage);

    assertDoesNotThrow(
        () -> this.classUnderTest.assignmentDraftCreate(mockContext, Collections.singletonList(mockAssignment)));
  }

  @Test
  void redundantValidationNotExecutedForEditDraftUpdate() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(DRAFT_ASSIGNMENT_ID);

    this.classUnderTest.validateUpdateBeforeAction(mockContext, Collections.singletonList(mockAssignment));

    verifyNoInteractions(mockServiceHandlerutility);
    verify(mockDataProvider, times(1)).getMonthlyAggregatedAssignment(mockAssignment.getId());
  }

  @Test
  void validationExecutedForActiveAssignmentUpdate() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    Messages mockMessage = mock(Messages.class);
    when(mockServiceHandlerutility.validateAuthorizationForRequestAndResource(any(), any())).thenReturn(mockMessage);
    when(mockServiceHandlerutility.validateAssignmentStatusChange(ACTIVE_ASSIGNMENT_ID,
        AssignmentStatus.HARDBOOKED.getCode())).thenReturn(mockMessage);
    this.classUnderTest.validateUpdateBeforeAction(mockContext, Collections.singletonList(mockAssignment));

    verify(mockServiceHandlerutility, times(1)).validateAuthorizationForRequestAndResource(mockContext, mockAssignment);
    verify(mockServiceHandlerutility, times(1)).validateAssignmentStatusChange(ACTIVE_ASSIGNMENT_ID,
        AssignmentStatus.HARDBOOKED.getCode());
    verify(mockDataProvider, times(1)).getMonthlyAggregatedAssignment(mockAssignment.getId());
  }

  @Test
  void serviceExceptionRaisedOnvalidationFailureDuringActiveAssignmentUpdate() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);

    Messages mockMessage = mock(Messages.class);
    when(mockServiceHandlerutility.validateAuthorizationForRequestAndResource(any(), any())).thenReturn(mockMessage);
    doThrow(ServiceException.class).when(mockMessage).throwIfError();

    assertThrows(ServiceException.class,
        () -> this.classUnderTest.validateUpdateBeforeAction(mockContext, Collections.singletonList(mockAssignment)));

    verifyNoInteractions(mockDataProvider);
  }

  @Test
  void activeAssignmentUpdateThrowsExceptionIfZeroHoursMaintainedForAllMonths() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);

    when(mockDataProvider.getMonthlyAggregatedAssignment(mockAssignment.getId())).thenReturn(Collections.emptyList());

    assertThrows(ServiceException.class,
        () -> this.classUnderTest.validateUpdateAction(mockContext, Collections.singletonList(mockAssignment)));
  }

  @Test
  void s4IntegrationInvokedOnAssignmentUpdateForS4Request() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    List<AssignmentBucketsYearMonthAggregate> mockMonthlyAggregatedAssignmentAfterUpdate = Arrays
        .asList(new AssignmentBucketsYearMonthAggregate[] { AssignmentBucketsYearMonthAggregate.create() });
    when(mockDataProvider.getMonthlyAggregatedAssignment(mockAssignment.getId()))
        .thenReturn(mockMonthlyAggregatedAssignmentAfterUpdate);

    mockAssignment.setResourceRequestId(S4_REQUEST_ID);
    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(true);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(S4_REQUEST_ID)).thenReturn(mockOptionalRequest);

    Messages mockMessage = mock(Messages.class);

    when(mockServiceHandlerutility.validateAuthorizationForRequestAndResource(any(), any())).thenReturn(mockMessage);
    when(mockServiceHandlerutility.validateAssignmentStatusChange(ACTIVE_ASSIGNMENT_ID,
        AssignmentStatus.HARDBOOKED.getCode())).thenReturn(mockMessage);
    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    ChangeSetContext mockChangeSetContext = mock(ChangeSetContext.class);
    when(mockContext.getChangeSetContext()).thenReturn(mockChangeSetContext);

    // Since we use a reference of a private variable initialized in
    // validateUpdateBeforeAction, we have to call this before
    // calling the validateUpdateAction
    this.classUnderTest.validateUpdateBeforeAction(mockContext, Collections.singletonList(mockAssignment));

    this.classUnderTest.validateUpdateAction(mockContext, Collections.singletonList(mockAssignment));

    verify(mockChangeSetContext, times(1)).register(mockAssignmentS4Integrator);
    verify(mockAssignmentS4Integrator, times(1)).prepareAssignmentUpdateInS4(eq(mockAssignment.getId()), any(), any());
    verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(any(), any(), any(), any(), any());
    verify(mockAssignmentDependentEntityUpdateUtility).updateResourceBookedCapacity(any(), any());
  }

  @Test
  void s4IntegrationNotInvokedOnAssignmentUpdateForNonS4Request() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);

    List<AssignmentBucketsYearMonthAggregate> mockMonthlyAggregatedAssignmentAfterUpdate = Arrays
        .asList(new AssignmentBucketsYearMonthAggregate[] { AssignmentBucketsYearMonthAggregate.create() });
    when(mockDataProvider.getMonthlyAggregatedAssignment(mockAssignment.getId()))
        .thenReturn(mockMonthlyAggregatedAssignmentAfterUpdate);

    mockAssignment.setResourceRequestId(NON_S4_REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(false);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(NON_S4_REQUEST_ID)).thenReturn(mockOptionalRequest);

    ChangeSetContext mockChangeSetContext = mock(ChangeSetContext.class);
    when(mockContext.getChangeSetContext()).thenReturn(mockChangeSetContext);

    Messages mockMessage = mock(Messages.class);

    when(mockServiceHandlerutility.validateAuthorizationForRequestAndResource(any(), any())).thenReturn(mockMessage);
    when(mockServiceHandlerutility.validateAssignmentStatusChange(ACTIVE_ASSIGNMENT_ID,
        AssignmentStatus.HARDBOOKED.getCode())).thenReturn(mockMessage);
    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    // Since we use a reference of a private variable initialized in
    // validateUpdateBeforeAction, we have to call this before
    // calling the validateUpdateAction
    this.classUnderTest.validateUpdateBeforeAction(mockContext, Collections.singletonList(mockAssignment));

    this.classUnderTest.validateUpdateAction(mockContext, Collections.singletonList(mockAssignment));

    verifyNoInteractions(mockChangeSetContext);
    verifyNoInteractions(mockAssignmentS4Integrator);
    verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(any(), any(), any(), any(), any());
    verify(mockAssignmentDependentEntityUpdateUtility).updateResourceBookedCapacity(any(), any());
  }

  @Test
  void s4IntegrationNotInvokedOnSoftAssignmentUpdate() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());

    List<AssignmentBucketsYearMonthAggregate> mockMonthlyAggregatedAssignmentAfterUpdate = Arrays
        .asList(new AssignmentBucketsYearMonthAggregate[] { AssignmentBucketsYearMonthAggregate.create() });
    when(mockDataProvider.getMonthlyAggregatedAssignment(mockAssignment.getId()))
        .thenReturn(mockMonthlyAggregatedAssignmentAfterUpdate);

    ChangeSetContext mockChangeSetContext = mock(ChangeSetContext.class);
    when(mockContext.getChangeSetContext()).thenReturn(mockChangeSetContext);

    Messages mockMessage = mock(Messages.class);

    when(mockServiceHandlerutility.validateAuthorizationForRequestAndResource(any(), any())).thenReturn(mockMessage);
    when(mockServiceHandlerutility.validateAssignmentStatusChange(ACTIVE_ASSIGNMENT_ID,
        AssignmentStatus.SOFTBOOKED.getCode())).thenReturn(mockMessage);
    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    // Since we use a reference of a private variable initialized in
    // validateUpdateBeforeAction, we have to call this before
    // calling the validateUpdateAction
    this.classUnderTest.validateUpdateBeforeAction(mockContext, Collections.singletonList(mockAssignment));

    this.classUnderTest.validateUpdateAction(mockContext, Collections.singletonList(mockAssignment));

    verify(mockChangeSetContext, times(0)).register(mockAssignmentS4Integrator);
    verify(mockAssignmentS4Integrator, times(0)).prepareAssignmentUpdateInS4(eq(mockAssignment.getId()), any(), any());
    verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(any(), any(), any(), any(), any());
    verify(mockAssignmentDependentEntityUpdateUtility).updateResourceBookedCapacity(any(), any());
  }

  @Test
  void s4IntegrationNotInvokedOnProposedAssignmentUpdate() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());

    List<AssignmentBucketsYearMonthAggregate> mockMonthlyAggregatedAssignmentAfterUpdate = Arrays
        .asList(new AssignmentBucketsYearMonthAggregate[] { AssignmentBucketsYearMonthAggregate.create() });
    when(mockDataProvider.getMonthlyAggregatedAssignment(mockAssignment.getId()))
        .thenReturn(mockMonthlyAggregatedAssignmentAfterUpdate);

    ChangeSetContext mockChangeSetContext = mock(ChangeSetContext.class);
    when(mockContext.getChangeSetContext()).thenReturn(mockChangeSetContext);

    Messages mockMessage = mock(Messages.class);

    when(mockServiceHandlerutility.validateAuthorizationForRequestAndResource(any(), any())).thenReturn(mockMessage);
    when(mockServiceHandlerutility.validateAssignmentStatusChange(ACTIVE_ASSIGNMENT_ID,
        AssignmentStatus.PROPOSED.getCode())).thenReturn(mockMessage);
    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    // Since we use a reference of a private variable initialized in
    // validateUpdateBeforeAction, we have to call this before
    // calling the validateUpdateAction
    this.classUnderTest.validateUpdateBeforeAction(mockContext, Collections.singletonList(mockAssignment));

    this.classUnderTest.validateUpdateAction(mockContext, Collections.singletonList(mockAssignment));

    verify(mockChangeSetContext, times(0)).register(mockAssignmentS4Integrator);
    verifyNoInteractions(mockAssignmentS4Integrator);
    verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(any(), any(), any(), any(), any());
    verify(mockAssignmentDependentEntityUpdateUtility, times(0)).updateResourceBookedCapacity(any(), any());
  }

  @Test
  void s4IntegrationInvokedOnSoftToHardUpdate() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    Assignments mockAssignment = Assignments.create();
    Assignments mockOldAssignment = Assignments.create();

    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockOldAssignment.setId(ACTIVE_ASSIGNMENT_ID);

    // Let the assignment be softbooked to begin with
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());
    mockOldAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());

    List<AssignmentBucketsYearMonthAggregate> mockMonthlyAggregatedAssignmentAfterUpdate = Arrays
        .asList(new AssignmentBucketsYearMonthAggregate[] { AssignmentBucketsYearMonthAggregate.create() });
    when(mockDataProvider.getMonthlyAggregatedAssignment(mockAssignment.getId()))
        .thenReturn(mockMonthlyAggregatedAssignmentAfterUpdate);

    ChangeSetContext mockChangeSetContext = mock(ChangeSetContext.class);
    when(mockContext.getChangeSetContext()).thenReturn(mockChangeSetContext);

    Messages mockMessage = mock(Messages.class);

    when(mockServiceHandlerutility.validateAuthorizationForRequestAndResource(any(), any())).thenReturn(mockMessage);
    when(mockServiceHandlerutility.validateAssignmentStatusChange(ACTIVE_ASSIGNMENT_ID,
        AssignmentStatus.SOFTBOOKED.getCode())).thenReturn(mockMessage);
    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockOldAssignment);

    // Since we use a reference of a private variable initialized in
    // validateUpdateBeforeAction, we have to call this before
    // calling the validateUpdateAction
    this.classUnderTest.validateUpdateBeforeAction(mockContext, Collections.singletonList(mockAssignment));

    this.classUnderTest.validateUpdateAction(mockContext, Collections.singletonList(mockAssignment));

    verify(mockChangeSetContext, times(0)).register(mockAssignmentS4Integrator);
    verify(mockAssignmentS4Integrator, times(0)).prepareAssignmentUpdateInS4(eq(mockAssignment.getId()), any(), any());
    verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(any(), any(), any(), any(), any());
    verify(mockAssignmentDependentEntityUpdateUtility).updateResourceBookedCapacity(any(), any());

    // Change the assignment to hardbooked
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    mockAssignment.setResourceRequestId(S4_REQUEST_ID);
    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(true);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(S4_REQUEST_ID)).thenReturn(mockOptionalRequest);
    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    this.classUnderTest.validateUpdateAction(mockContext, Collections.singletonList(mockAssignment));
    // Since the assignment was updated to hardbooking, we expect a trigger to
    // create assignment in S4
    verify(mockAssignmentS4Integrator, times(1)).prepareAssignmentCreateInS4(any(), any());

  }

  @Test
  void s4IntegrationInvokedOnProposedToHardUpdate() {
    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    Assignments mockAssignment = Assignments.create();
    Assignments mockOldAssignment = Assignments.create();

    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockOldAssignment.setId(ACTIVE_ASSIGNMENT_ID);

    // Let the assignment be proposed to begin with
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    mockOldAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());

    List<AssignmentBucketsYearMonthAggregate> mockMonthlyAggregatedAssignmentAfterUpdate = Arrays
        .asList(new AssignmentBucketsYearMonthAggregate[] { AssignmentBucketsYearMonthAggregate.create() });
    when(mockDataProvider.getMonthlyAggregatedAssignment(mockAssignment.getId()))
        .thenReturn(mockMonthlyAggregatedAssignmentAfterUpdate);

    ChangeSetContext mockChangeSetContext = mock(ChangeSetContext.class);
    when(mockContext.getChangeSetContext()).thenReturn(mockChangeSetContext);

    Messages mockMessage = mock(Messages.class);

    when(mockServiceHandlerutility.validateAuthorizationForRequestAndResource(any(), any())).thenReturn(mockMessage);
    when(mockServiceHandlerutility.validateAssignmentStatusChange(ACTIVE_ASSIGNMENT_ID,
        AssignmentStatus.PROPOSED.getCode())).thenReturn(mockMessage);
    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockOldAssignment);

    // Since we use a reference of a private variable initialized in
    // validateUpdateBeforeAction, we have to call this before
    // calling the validateUpdateAction
    this.classUnderTest.validateUpdateBeforeAction(mockContext, Collections.singletonList(mockAssignment));

    this.classUnderTest.validateUpdateAction(mockContext, Collections.singletonList(mockAssignment));

    verify(mockChangeSetContext, times(0)).register(mockAssignmentS4Integrator);
    verify(mockAssignmentS4Integrator, times(0)).prepareAssignmentUpdateInS4(eq(mockAssignment.getId()), any(), any());
    verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(any(), any(), any(), any(), any());
    verify(mockAssignmentDependentEntityUpdateUtility, times(0)).updateResourceBookedCapacity(any(), any());

    // Change the assignment to hardbooked
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    mockAssignment.setResourceRequestId(S4_REQUEST_ID);
    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(true);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(S4_REQUEST_ID)).thenReturn(mockOptionalRequest);
    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    this.classUnderTest.validateUpdateAction(mockContext, Collections.singletonList(mockAssignment));
    // Since the assignment was updated to hardbooking, we expect a trigger to
    // create assignment in S4
    verify(mockAssignmentDependentEntityUpdateUtility).updateResourceBookedCapacity(any(), any());
    verify(mockAssignmentS4Integrator, times(1)).prepareAssignmentCreateInS4(any(), any());

  }

  @Test
  void draftActivateForEditDraftDoesNotInvokeCreateNewSupplyInS4() {

    DraftSaveEventContext mockContext = mock(DraftSaveEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(DRAFT_ASSIGNMENT_ID);
    mockAssignment.setHasActiveEntity(true);
    Result mockResult = mock(Result.class);
    when(mockContext.getResult()).thenReturn(mockResult);
    when(mockResult.single(Assignments.class)).thenReturn(mockAssignment);

    when(mockDataProvider.getAssignmentBucketsFromDraftService(any())).thenReturn(Collections.emptyList());

    this.classUnderTest.assignmentDraftSave(mockContext, Collections.singletonList(mockAssignment));

    verifyNoInteractions(mockAssignmentS4Integrator);
    verifyNoInteractions(mockAuditChangeLog);
    verifyNoInteractions(mockAssignmentDependentEntityUpdateUtility);
  }

  @Test
  void draftActivateForNewDraftInvokesCreateNewSupplyInS4ForS4Request() {

    DraftSaveEventContext mockContext = mock(DraftSaveEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(S4_REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    Result mockResult = mock(Result.class);
    when(mockContext.getResult()).thenReturn(mockResult);
    when(mockResult.single(Assignments.class)).thenReturn(mockAssignment);

    when(mockDataProvider.getAssignmentBucketsFromDraftService(any())).thenReturn(Collections.emptyList());

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(true);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(S4_REQUEST_ID)).thenReturn(mockOptionalRequest);

    ChangeSetContext mockChangeSetContext = mock(ChangeSetContext.class);
    when(mockContext.getChangeSetContext()).thenReturn(mockChangeSetContext);

    this.classUnderTest.assignmentDraftSave(mockContext, Collections.singletonList(mockAssignment));

    verify(mockAssignmentS4Integrator, times(1)).prepareAssignmentCreateInS4(any(), any());
    verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(any(), any(), any(), any(), any());
    verify(mockAssignmentDependentEntityUpdateUtility).updateResourceBookedCapacity(any(), any());

  }

  @Test
  void draftActivateForNewDraftDoesNotInvokeCreateNewSupplyInS4ForNonS4Request() {

    DraftSaveEventContext mockContext = mock(DraftSaveEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(NON_S4_REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    Result mockResult = mock(Result.class);
    when(mockContext.getResult()).thenReturn(mockResult);
    when(mockResult.single(Assignments.class)).thenReturn(mockAssignment);

    when(mockDataProvider.getAssignmentBucketsFromDraftService(any())).thenReturn(Collections.emptyList());

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(false);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(NON_S4_REQUEST_ID)).thenReturn(mockOptionalRequest);

    this.classUnderTest.assignmentDraftSave(mockContext, Collections.singletonList(mockAssignment));

    verifyNoInteractions(mockAssignmentS4Integrator);
    verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(any(), any(), any(), any(), any());
    verify(mockAssignmentDependentEntityUpdateUtility).updateResourceBookedCapacity(any(), any());

  }

  @Test
  void draftActivateForNewDraftDoesNotInvokeCreateNewSupplyInS4ForSoftBookedAssignment() {

    DraftSaveEventContext mockContext = mock(DraftSaveEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(S4_REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());
    Result mockResult = mock(Result.class);
    when(mockContext.getResult()).thenReturn(mockResult);
    when(mockResult.single(Assignments.class)).thenReturn(mockAssignment);

    when(mockDataProvider.getAssignmentBucketsFromDraftService(any())).thenReturn(Collections.emptyList());

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(true);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(S4_REQUEST_ID)).thenReturn(mockOptionalRequest);

    this.classUnderTest.assignmentDraftSave(mockContext, Collections.singletonList(mockAssignment));

    verifyNoInteractions(mockAssignmentS4Integrator);
    verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(any(), any(), any(), any(), any());
    verify(mockAssignmentDependentEntityUpdateUtility).updateResourceBookedCapacity(any(), any());

  }

  @Test
  void draftActivateForNewDraftDoesNotInvokeCreateNewSupplyInS4ForProposedAssignment() {

    DraftSaveEventContext mockContext = mock(DraftSaveEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(S4_REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    Result mockResult = mock(Result.class);
    when(mockContext.getResult()).thenReturn(mockResult);
    when(mockResult.single(Assignments.class)).thenReturn(mockAssignment);

    when(mockDataProvider.getAssignmentBucketsFromDraftService(any())).thenReturn(Collections.emptyList());

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(true);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(S4_REQUEST_ID)).thenReturn(mockOptionalRequest);

    this.classUnderTest.assignmentDraftSave(mockContext, Collections.singletonList(mockAssignment));

    verifyNoInteractions(mockAssignmentS4Integrator);
    verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(any(), any(), any(), any(), any());
  }

  @Test
  void draftActivateForNewDraftDoesNotAffectResourceBookedCapacityForProposedAssignment() {

    DraftSaveEventContext mockContext = mock(DraftSaveEventContext.class);
    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(S4_REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());
    Result mockResult = mock(Result.class);
    when(mockContext.getResult()).thenReturn(mockResult);
    when(mockResult.single(Assignments.class)).thenReturn(mockAssignment);

    when(mockDataProvider.getAssignmentBucketsFromDraftService(any())).thenReturn(Collections.emptyList());

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(true);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(S4_REQUEST_ID)).thenReturn(mockOptionalRequest);

    this.classUnderTest.assignmentDraftSave(mockContext, Collections.singletonList(mockAssignment));

    verifyNoInteractions(mockAssignmentDependentEntityUpdateUtility);
    verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(any(), any(), any(), any(), any());
  }

  @Test
  void assignmentDeleteInRMInvokesSupplyDeletionInS4ForS4Request() {
    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("User1");

    Map<String, Object> mockKeyMap = new HashMap<>();
    mockKeyMap.put(Assignments.ID, ACTIVE_ASSIGNMENT_ID);

    when(mockServiceHandlerutility.getKeys(mockContext)).thenReturn(mockKeyMap);

    Messages mockMessage = mock(Messages.class);
    when(mockServiceHandlerutility.validateResourceRequestStatuses(any())).thenReturn(mockMessage);

    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(S4_REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    ChangeSetContext mockChangeSetContext = mock(ChangeSetContext.class);
    when(mockContext.getChangeSetContext()).thenReturn(mockChangeSetContext);

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(true);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(S4_REQUEST_ID)).thenReturn(mockOptionalRequest);

    this.classUnderTest.actionsBeforeAssignmentDelete(mockContext);

    verify(mockAssignmentS4Integrator, times(1)).prepareAssignmentDeleteInS4(any(),any(),any());
  }

  @Test
  void softAssignmentDeleteInRMDoesNotInvokeSupplyDeletionInS4() {
    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("User1");

    Map<String, Object> mockKeyMap = new HashMap<>();
    mockKeyMap.put(Assignments.ID, ACTIVE_ASSIGNMENT_ID);

    when(mockServiceHandlerutility.getKeys(mockContext)).thenReturn(mockKeyMap);

    Messages mockMessage = mock(Messages.class);
    when(mockServiceHandlerutility.validateResourceRequestStatuses(any())).thenReturn(mockMessage);

    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());

    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    this.classUnderTest.actionsBeforeAssignmentDelete(mockContext);

    verifyNoInteractions(mockAssignmentS4Integrator);
  }

  @Test
  void proposedAssignmentDeleteInRMDoesNotInvokeSupplyDeletionInS4() {
    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("User1");
    Map<String, Object> mockKeyMap = new HashMap<>();
    mockKeyMap.put(Assignments.ID, ACTIVE_ASSIGNMENT_ID);

    when(mockServiceHandlerutility.getKeys(mockContext)).thenReturn(mockKeyMap);

    Messages mockMessage = mock(Messages.class);
    when(mockServiceHandlerutility.validateResourceRequestStatuses(any())).thenReturn(mockMessage);

    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());

    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    this.classUnderTest.actionsBeforeAssignmentDelete(mockContext);

    verifyNoInteractions(mockAssignmentS4Integrator);
  }

  @Test
  void proposedAssignmentDeleteInRMDoesNotAffectResourceBookedCapacity() {
    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("User1");

    Map<String, Object> mockKeyMap = new HashMap<>();
    mockKeyMap.put(Assignments.ID, ACTIVE_ASSIGNMENT_ID);

    when(mockServiceHandlerutility.getKeys(mockContext)).thenReturn(mockKeyMap);

    Messages mockMessage = mock(Messages.class);
    when(mockServiceHandlerutility.validateResourceRequestStatuses(any())).thenReturn(mockMessage);

    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.PROPOSED.getCode());

    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    this.classUnderTest.actionsBeforeAssignmentDelete(mockContext);
    this.classUnderTest.actionsAfterAssignmentDelete(mockContext);

    verifyNoInteractions(mockAssignmentDependentEntityUpdateUtility);
  }

  @Test
  void softBookedAssignmentDeleteInRMUpdatesResourceBookedCapacity() {
    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("User1");

    Map<String, Object> mockKeyMap = new HashMap<>();
    mockKeyMap.put(Assignments.ID, ACTIVE_ASSIGNMENT_ID);

    when(mockServiceHandlerutility.getKeys(mockContext)).thenReturn(mockKeyMap);

    Messages mockMessage = mock(Messages.class);
    when(mockServiceHandlerutility.validateResourceRequestStatuses(any())).thenReturn(mockMessage);

    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());

    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    this.classUnderTest.actionsBeforeAssignmentDelete(mockContext);
    this.classUnderTest.actionsAfterAssignmentDelete(mockContext);

    verify(mockAssignmentDependentEntityUpdateUtility).updateResourceBookedCapacity(any(), any());
  }

  @Test
  void hardBookedAssignmentDeleteInRMUpdatesResourceBookedCapacity() {
    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("User1");

    Map<String, Object> mockKeyMap = new HashMap<>();
    mockKeyMap.put(Assignments.ID, ACTIVE_ASSIGNMENT_ID);

    when(mockServiceHandlerutility.getKeys(mockContext)).thenReturn(mockKeyMap);

    Messages mockMessage = mock(Messages.class);
    when(mockServiceHandlerutility.validateResourceRequestStatuses(any())).thenReturn(mockMessage);

    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    this.classUnderTest.actionsBeforeAssignmentDelete(mockContext);
    this.classUnderTest.actionsAfterAssignmentDelete(mockContext);

    verify(mockAssignmentDependentEntityUpdateUtility).updateResourceBookedCapacity(any(), any());
  }

  @Test
  void assignmentDeleteInRMLocksTheAssignmentFirst() {
    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("User1");

    Map<String, Object> mockKeyMap = new HashMap<>();
    mockKeyMap.put(Assignments.ID, ACTIVE_ASSIGNMENT_ID);

    when(mockServiceHandlerutility.getKeys(mockContext)).thenReturn(mockKeyMap);

    Messages mockMessage = mock(Messages.class);
    when(mockServiceHandlerutility.validateResourceRequestStatuses(any())).thenReturn(mockMessage);
    when(mockContext.getMessages()).thenReturn(mockMessage);

    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    this.classUnderTest.actionsBeforeAssignmentDelete(mockContext);
    this.classUnderTest.actionsAfterAssignmentDelete(mockContext);

    verify(mockDraftUtility).getEditDraftForUser(ACTIVE_ASSIGNMENT_ID, "User1", mockMessage, true, true);
  }

  @Test
  void assignmentDeleteInRMDoesNotInvokesSupplyDeletionInS4ForNonS4Request() {
    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("User1");

    Map<String, Object> mockKeyMap = new HashMap<>();
    mockKeyMap.put(Assignments.ID, ACTIVE_ASSIGNMENT_ID);

    when(mockServiceHandlerutility.getKeys(mockContext)).thenReturn(mockKeyMap);

    Messages mockMessage = mock(Messages.class);
    when(mockServiceHandlerutility.validateResourceRequestStatuses(any())).thenReturn(mockMessage);

    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(NON_S4_REQUEST_ID);
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    ResourceRequests mockRequest = ResourceRequests.create();
    mockRequest.setIsS4Cloud(false);
    Optional<ResourceRequests> mockOptionalRequest = Optional.of(mockRequest);
    when(mockDataProvider.getRequestData(NON_S4_REQUEST_ID)).thenReturn(mockOptionalRequest);

    this.classUnderTest.actionsBeforeAssignmentDelete(mockContext);

    verifyNoInteractions(mockAssignmentS4Integrator);
  }

  @Test
  void assignmentDeleteInRMRaisesExceptionOnError() {
    CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class, RETURNS_DEEP_STUBS);
    when(mockContext.getUserInfo().getName()).thenReturn("User1");

    Map<String, Object> mockKeyMap = new HashMap<>();
    mockKeyMap.put(Assignments.ID, ACTIVE_ASSIGNMENT_ID);

    when(mockServiceHandlerutility.getKeys(mockContext)).thenReturn(mockKeyMap);

    Messages mockMessage = mock(Messages.class);
    when(mockServiceHandlerutility.validateResourceRequestStatuses(any())).thenReturn(mockMessage);
    doThrow(ServiceException.class).when(mockMessage).throwIfError();

    Assignments mockAssignment = Assignments.create();
    mockAssignment.setId(ACTIVE_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(REQUEST_ID);
    when(mockDataProvider.getAssignmentWithBuckets(ACTIVE_ASSIGNMENT_ID)).thenReturn(mockAssignment);

    assertThrows(ServiceException.class, () -> this.classUnderTest.actionsBeforeAssignmentDelete(mockContext));
  }

  @Test
  void assignmentPreparedForCreateInS4WhenStatusChangedToHardBookedFromGrid() {

    CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
    Assignments mockAssignment = Assignments.create();
    Assignments mockOldAssignment = Assignments.create();

    mockAssignment.setId(DRAFT_ASSIGNMENT_ID);
    mockAssignment.setResourceRequestId(S4_REQUEST_ID);
    mockOldAssignment.setId(DRAFT_ASSIGNMENT_ID);

    // Updated assignment is hard booked and old one is soft booked
    mockAssignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());
    mockOldAssignment.setAssignmentStatusCode(AssignmentStatus.SOFTBOOKED.getCode());

    ResourceRequests mockResourceRequest = ResourceRequests.create();
    mockResourceRequest.setIsS4Cloud(true);

    List<AssignmentBucketsYearMonthAggregate> mockMonthlyAggregatedAssignmentAfterUpdate = Arrays
        .asList(new AssignmentBucketsYearMonthAggregate[] { AssignmentBucketsYearMonthAggregate.create() });
    when(mockDataProvider.getMonthlyAggregatedAssignment(mockAssignment.getId()))
        .thenReturn(mockMonthlyAggregatedAssignmentAfterUpdate);
    when(mockDataProvider.getRequestData(S4_REQUEST_ID)).thenReturn(Optional.of(mockResourceRequest));

    ChangeSetContext mockChangeSetContext = mock(ChangeSetContext.class);
    when(mockContext.getChangeSetContext()).thenReturn(mockChangeSetContext);

    Messages mockMessage = mock(Messages.class);

    when(mockServiceHandlerutility.validateAuthorizationForRequestAndResource(any(), any())).thenReturn(mockMessage);
    when(mockDataProvider.getAssignmentWithBuckets(DRAFT_ASSIGNMENT_ID)).thenReturn(mockOldAssignment)
        .thenReturn(mockAssignment);

    // Since we use a reference of a private variable initialized in
    // validateUpdateBeforeAction, we have to call this before
    // calling the validateUpdateAction
    this.classUnderTest.validateUpdateBeforeAction(mockContext, Collections.singletonList(mockAssignment));

    this.classUnderTest.validateUpdateAction(mockContext, Collections.singletonList(mockAssignment));

    verify(mockChangeSetContext, times(1)).register(mockAssignmentS4Integrator);
    verify(mockAssignmentS4Integrator, times(0)).prepareAssignmentUpdateInS4(eq(mockAssignment.getId()), any(), any());
    verify(mockAssignmentS4Integrator, times(1)).prepareAssignmentCreateInS4(mockAssignment,
        mockMonthlyAggregatedAssignmentAfterUpdate);
    verify(mockAuditChangeLog, times(1)).logDataModificationAuditMessage(any(), any(), any(), any(), any());
    verify(mockAssignmentDependentEntityUpdateUtility).updateResourceBookedCapacity(any(), any());

  }

  @Test
  void serviceExceptionRaisedInAfterUpdateHandlerIfAssignmentCouldNotBeUpdatedByFRW() {
    assertThrows(ServiceException.class,
        () -> this.classUnderTest.validateUpdateAction(mock(CdsUpdateEventContext.class), Collections.emptyList()));
  }

}
