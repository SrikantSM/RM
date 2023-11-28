package com.sap.c4p.rm.assignment.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
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
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.enums.AssignmentStatus;

import com.sap.resourcemanagement.resource.Types;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;

public class AssignmentDraftsUtilityTest {

  private static final String ASSIGNMENT_ID = "AssignmentId";
  private static final String RESOURCE_ID = "ResourceId";
  private DraftService mockDraftService;
  private DataProvider mockDataProvider;
  private AssignmentSimulationUtility mockAssignmentSimulationUtility;

  private AssignmentDraftsUtility classUnderTest;

  @BeforeEach
  public void setUp() {
    this.mockDraftService = mock(DraftService.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockDataProvider = mock(DataProvider.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockAssignmentSimulationUtility = mock(AssignmentSimulationUtility.class, Mockito.RETURNS_DEEP_STUBS);

    this.classUnderTest = new AssignmentDraftsUtility(mockDraftService, mockDataProvider,
        mockAssignmentSimulationUtility);
  }

  @Test
  void activateEditDraftInvocationTriggersDraftActivation() {
    classUnderTest.activateEditDraft(ASSIGNMENT_ID);
    verify(mockDraftService).saveDraft(any(CqnSelect.class));
  }

  @Test
  void activateNewDraftInvocationTriggersDraftActivation() {
    classUnderTest.activateNewDraft(ASSIGNMENT_ID);
    verify(mockDraftService).saveDraft(any(CqnSelect.class));
  }

  @Test
  void createNewDraftInvocationTriggersDraftCreation() {
    classUnderTest.createNewDraft(Collections.singletonList(Assignments.create()));
    verify(mockDraftService).newDraft(any(CqnInsert.class));
  }

  @Test
  void updateAssignmentStatusInvocationTriggersDraftUpdate() {
    classUnderTest.updateAssignmentStatus(ASSIGNMENT_ID, AssignmentStatus.HARDBOOKED.getCode());
    verify(mockDraftService).patchDraft(any(CqnUpdate.class));
  }

  @Test
  void updateBookedCapacityInvocationTriggersDraftUpdate() {
    when(mockDataProvider.getAssignmentBucketsDraft(ASSIGNMENT_ID)).thenReturn(Collections.emptyList());
    classUnderTest.updateBookedCapacityInHeader(ASSIGNMENT_ID);
    verify(mockDraftService).patchDraft(any(CqnUpdate.class));
  }

  @Test
  void deleteExistingDraftInvocationTriggersDraftDeletion() {
    classUnderTest.deleteExistingDraft(ASSIGNMENT_ID);
    verify(mockDraftService).cancelDraft(any(CqnDelete.class));
  }

  @Test
  void cancelDraftInvocationTriggersDraftDeletion() {
    classUnderTest.cancelDraft(ASSIGNMENT_ID);
    verify(mockDraftService).cancelDraft(any(CqnDelete.class));
  }

  @Test
  void updateAssignmentBucketDraftInvocationTriggersDraftUpdate() {
    classUnderTest.updateAssignmentBucketDraft(ASSIGNMENT_ID, 42);
    verify(mockDraftService).patchDraft(any(CqnUpdate.class));
  }

  @Test
  void createNewBucketDraftInvocationTriggersDraftCreate() {
    classUnderTest.createNewBucketDraft(AssignmentBuckets.create());
    verify(mockDraftService).newDraft(any(CqnInsert.class));
  }

  @Test
  void updateAssignmentBucketDraftsInvocationCreatesNewIfExistingEmpty() {

    List<AssignmentBuckets> existingAssignmentBucketList = Collections.emptyList();
    List<AssignmentBuckets> newAssignmentBucketList = Collections.emptyList();

    classUnderTest.updateAssignmentBucketsDrafts(existingAssignmentBucketList, newAssignmentBucketList);
    verify(mockDraftService).newDraft(any(CqnInsert.class));
  }

  @Test
  void updateAssignmentBucketDraftsInvocationCreatesNewAndDeletesOld() {

    List<AssignmentBuckets> existingAssignmentBucketList = Collections.emptyList();
    List<AssignmentBuckets> newAssignmentBucketList = Collections.emptyList();

    AssignmentBuckets existingBucket = AssignmentBuckets.create();
    existingBucket.setId(ASSIGNMENT_ID);
    existingAssignmentBucketList = Collections.singletonList(existingBucket);

    classUnderTest.updateAssignmentBucketsDrafts(existingAssignmentBucketList, newAssignmentBucketList);
    verify(mockDraftService).cancelDraft(any(CqnDelete.class));
    verify(mockDraftService).newDraft(any(CqnInsert.class));
  }

  @Test
  void userGetsNewEditDraftIfNoDraftsExists() {

    Result mockResult = mock(Result.class);
    Result mockAssignmentDraftResult = mock(Result.class);
    when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult).thenReturn(mockAssignmentDraftResult);

    when(mockAssignmentDraftResult.single(any())).thenReturn(null);

    Row existingDraftAdminRow = mock(Row.class);
    Optional<Row> mockOptionalRow = Optional.of(existingDraftAdminRow);

    when(mockResult.first()).thenReturn(mockOptionalRow);

    when(existingDraftAdminRow.get(assignmentservice.Assignments.DRAFT_ADMINISTRATIVE_DATA)).thenReturn(null);

    Messages mockMessage = mock(Messages.class);
    classUnderTest.getEditDraftForUser(ASSIGNMENT_ID, "dummy", mockMessage, true, true);
    verify(mockDraftService, times(1)).run(any(CqnSelect.class));
    verify(mockDraftService, times(1)).editDraft(any(CqnSelect.class), eq(false));
  }

  @Test
  void userGetsNewEditDraftOnHeaderActionIfNoDraftsExists() {

    Result mockResult = mock(Result.class);
    Result mockAssignmentDraftResult = mock(Result.class);
    when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult).thenReturn(mockAssignmentDraftResult);
    when(mockAssignmentDraftResult.single(any())).thenReturn(null);

    Row existingDraftAdminRow = mock(Row.class);
    Optional<Row> mockOptionalRow = Optional.of(existingDraftAdminRow);
    when(mockResult.first()).thenReturn(mockOptionalRow);

    when(existingDraftAdminRow.get(assignmentservice.Assignments.DRAFT_ADMINISTRATIVE_DATA)).thenReturn(null);

    Messages mockMessage = mock(Messages.class);
    classUnderTest.getEditDraftForUser(ASSIGNMENT_ID, "dummy", mockMessage, true, true);
    verify(mockDraftService, times(1)).run(any(CqnSelect.class));
    verify(mockDraftService, times(1)).editDraft(any(CqnSelect.class), eq(false));
  }

  @Test
  void userGetsNewEditDraftIfExplicityAskedFor() {

    Result mockResult = mock(Result.class);
    Result mockAssignmentDraftResult = mock(Result.class);
    when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult).thenReturn(mockAssignmentDraftResult);

    when(mockAssignmentDraftResult.single(any())).thenReturn(null);

    Row existingDraftAdminRow = mock(Row.class);
    Optional<Row> mockOptionalRow = Optional.of(existingDraftAdminRow);
    when(mockResult.first()).thenReturn(mockOptionalRow);

    Map<String, Object> existingDraftAdminDataObject = new HashMap<>();
    existingDraftAdminDataObject.put(assignmentservice.DraftAdministrativeData.IN_PROCESS_BY_USER, "Rahul");
    when(existingDraftAdminRow.get(assignmentservice.Assignments.DRAFT_ADMINISTRATIVE_DATA))
        .thenReturn(existingDraftAdminDataObject);

    Messages mockMessage = mock(Messages.class);
    classUnderTest.getEditDraftForUser(ASSIGNMENT_ID, "Rahul", mockMessage, true, true);
    verify(mockDraftService, times(1)).run(any(CqnSelect.class));
    verify(mockDraftService, times(1)).cancelDraft(any(CqnDelete.class));
    verify(mockDraftService, times(1)).editDraft(any(CqnSelect.class), eq(false));
  }

  @Test
  void userGetsExistingEditDraftBackIfNotExpired() {

    Result mockResult = mock(Result.class);
    Result mockAssignmentDraftResult = mock(Result.class);
    when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult).thenReturn(mockAssignmentDraftResult);

    Assignments existingAssignmentEditDraft = Assignments.create();
    existingAssignmentEditDraft.setId(ASSIGNMENT_ID);
    when(mockAssignmentDraftResult.single(any())).thenReturn(null);

    Row existingDraftAdminRow = mock(Row.class);
    Optional<Row> mockOptionalRow = Optional.of(existingDraftAdminRow);
    when(mockResult.first()).thenReturn(mockOptionalRow);

    Map<String, Object> existingDraftAdminDataObject = new HashMap<>();
    existingDraftAdminDataObject.put(assignmentservice.DraftAdministrativeData.IN_PROCESS_BY_USER, "Rahul");
    when(existingDraftAdminRow.get(assignmentservice.Assignments.DRAFT_ADMINISTRATIVE_DATA))
        .thenReturn(existingDraftAdminDataObject);

    Messages mockMessage = mock(Messages.class);
    classUnderTest.getEditDraftForUser(ASSIGNMENT_ID, "Rahul", mockMessage, false, true);
    verify(mockDraftService, times(2)).run(any(CqnSelect.class));
  }

  @Test
  void userGetsNewEditDraftIfExistingEditDraftLockExpired() {

    Result mockResult = mock(Result.class);
    Result mockAssignmentDraftResult = mock(Result.class);
    when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult).thenReturn(mockAssignmentDraftResult);
    when(mockAssignmentDraftResult.single(any())).thenReturn(null);

    Row existingDraftAdminRow = mock(Row.class);
    Optional<Row> mockOptionalRow = Optional.of(existingDraftAdminRow);
    when(mockResult.first()).thenReturn(mockOptionalRow);

    Map<String, Object> existingDraftAdminDataObject = new HashMap<>();
    existingDraftAdminDataObject.put(assignmentservice.DraftAdministrativeData.IN_PROCESS_BY_USER, "");
    when(existingDraftAdminRow.get(assignmentservice.Assignments.DRAFT_ADMINISTRATIVE_DATA))
        .thenReturn(existingDraftAdminDataObject);
    Messages mockMessage = mock(Messages.class);
    classUnderTest.getEditDraftForUser(ASSIGNMENT_ID, "dummy", mockMessage, true, true);
    verify(mockDraftService, times(1)).run(any(CqnSelect.class));
    verify(mockDraftService, times(1)).editDraft(any(CqnSelect.class), eq(false));
  }

  @Test
  void userGetsNewEditDraftIfExistingEditDraftHasNoOwner() {

    Result mockResult = mock(Result.class);
    Result mockAssignmentDraftResult = mock(Result.class);
    when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult).thenReturn(mockAssignmentDraftResult);

    when(mockAssignmentDraftResult.single(any())).thenReturn(null);

    Row existingDraftAdminRow = mock(Row.class);
    Optional<Row> mockOptionalRow = Optional.of(existingDraftAdminRow);
    when(mockResult.first()).thenReturn(mockOptionalRow);

    Map<String, Object> existingDraftAdminDataObject = new HashMap<>();
    Object nullString = mock(Object.class);
    when(nullString.toString()).thenReturn(null);
    existingDraftAdminDataObject.put(assignmentservice.DraftAdministrativeData.IN_PROCESS_BY_USER, nullString);
    when(existingDraftAdminRow.get(assignmentservice.Assignments.DRAFT_ADMINISTRATIVE_DATA))
        .thenReturn(existingDraftAdminDataObject);
    Messages mockMessage = mock(Messages.class);
    classUnderTest.getEditDraftForUser(ASSIGNMENT_ID, "dummy", mockMessage, true, true);
    verify(mockDraftService, times(1)).run(any(CqnSelect.class));
    verify(mockDraftService, times(1)).editDraft(any(CqnSelect.class), eq(false));
  }

  @Test
  void userGetsErrorIfEditDraftWithLockFromOtherUserExists() {

    Messages mockMessage = mock(Messages.class);

    Result mockResult = mock(Result.class);
    Result mockAssignmentDraftResult = mock(Result.class);
    when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult).thenReturn(mockAssignmentDraftResult);
    when(mockAssignmentDraftResult.single(any())).thenReturn(null);

    Row existingDraftAdminRow = mock(Row.class);
    Optional<Row> mockOptionalRow = Optional.of(existingDraftAdminRow);
    when(mockResult.first()).thenReturn(mockOptionalRow);

    Map<String, Object> existingDraftAdminDataObject = new HashMap<>();
    existingDraftAdminDataObject.put(assignmentservice.DraftAdministrativeData.IN_PROCESS_BY_USER, "DarthVader");
    when(existingDraftAdminRow.get(assignmentservice.Assignments.DRAFT_ADMINISTRATIVE_DATA))
        .thenReturn(existingDraftAdminDataObject);

    doThrow(ServiceException.class).when(mockMessage).throwIfError();
    assertThrows(ServiceException.class,
        () -> classUnderTest.getEditDraftForUser(ASSIGNMENT_ID, "dummy", mockMessage, true, true));
    verify(mockDraftService, times(1)).run(any(CqnSelect.class));
    verify(mockDraftService, times(0)).editDraft(any(CqnSelect.class), eq(false));
    verify(mockMessage, times(1)).error(any(), any());
  }

  @Test
  void simulatedBucketsListReturnedIfBookingGranularityMaintainedForResource() {

    LocalDate startDate = LocalDate.of(2023, 01, 01);
    LocalDate endDate = LocalDate.of(2023, 01, 05);

    Instant startInstant = startDate.atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant endInstant = endDate.atStartOfDay().toInstant(ZoneOffset.UTC);

    when(mockDataProvider.getResourceCapacities(RESOURCE_ID, startInstant, endInstant))
        .thenReturn(Collections.emptyList());

    Types bookingGranularityRecord = Types.create();
    bookingGranularityRecord.setBookingGranularityInMinutes(60);
    when(mockDataProvider.getResourceBookingGranularityInMinutes(RESOURCE_ID))
        .thenReturn(Optional.of(bookingGranularityRecord));

    AssignmentBuckets bucket = AssignmentBuckets.create();
    List<AssignmentBuckets> bucketsList = Collections.singletonList(bucket);

    when(mockAssignmentSimulationUtility.getDistributedAssignmentBuckets(60, 42, Collections.emptyList()))
        .thenReturn(bucketsList);

    bucket.setAssignmentId(ASSIGNMENT_ID);
    bucket.setIsActiveEntity(false);
    assertEquals(bucketsList,
        classUnderTest.getSimulatedAssignmentBucketsDrafts(ASSIGNMENT_ID, RESOURCE_ID, startDate, endDate, 42));
  }

}
