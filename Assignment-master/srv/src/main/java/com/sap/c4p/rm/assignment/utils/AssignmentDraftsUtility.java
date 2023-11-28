package com.sap.c4p.rm.assignment.utils;

import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.hoursToMinutes;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.raiseExceptionIfErrorWithTarget;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.sap.cds.Row;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.gen.MessageKeys;

import com.sap.resourcemanagement.resource.Capacity;

import assignmentservice.AssignmentBuckets;
import assignmentservice.AssignmentBuckets_;
import assignmentservice.AssignmentService_;
import assignmentservice.Assignments;

@Component
public class AssignmentDraftsUtility {

  /*
   * [Refactor: revisit approach] For Human resource, the booking granularity
   * seems to be always 60 as hardcoded here:
   * "https://github.tools.sap/Cloud4RM/Resource-Management/blob/master/db/csv/com.sap.resourceManagement.resource-Types.csv".
   * Customer cannot change it for now. Instead of querying the DB for this value,
   * we use the hardcoded value here directly to optimize performance.
   */
  private static final int RESOURCE_BOOKING_GRANULARITY_IN_MINUTES = 60;

  private DraftService draftService;
  private DataProvider dataProvider;
  private AssignmentSimulationUtility assignmentSimulationUtility;

  @Autowired
  public AssignmentDraftsUtility(@Qualifier(AssignmentService_.CDS_NAME) final DraftService draftService,
      DataProvider dataProvider, AssignmentSimulationUtility assignmentSimulationUtility) {
    this.draftService = draftService;
    this.dataProvider = dataProvider;
    this.assignmentSimulationUtility = assignmentSimulationUtility;
  }

  public void activateEditDraft(String assignmentId) {
    CqnSelect selectDraftToActivate = Select.from(assignmentservice.Assignments_.CDS_NAME)
        .where(b -> b.get(assignmentservice.Assignments.ID).eq(assignmentId).and(
            b.get(assignmentservice.Assignments.IS_ACTIVE_ENTITY).eq(false),
            b.get(assignmentservice.Assignments.HAS_ACTIVE_ENTITY).eq(true)));

    draftService.saveDraft(selectDraftToActivate);
  }

  public void activateNewDraft(String assignmentId) {
    CqnSelect selectDraftToActivate = Select.from(assignmentservice.Assignments_.CDS_NAME)
        .where(b -> b.get(assignmentservice.Assignments.ID).eq(assignmentId).and(
            b.get(assignmentservice.Assignments.IS_ACTIVE_ENTITY).eq(false),
            b.get(assignmentservice.Assignments.HAS_ACTIVE_ENTITY).eq(false)));

    draftService.saveDraft(selectDraftToActivate);
  }

  // REFACTOR: Takes a list and returns one object?
  public Optional<Assignments> createNewDraft(List<Assignments> assignmentDraftList) {
    CqnInsert newAssignmentDraft = Insert.into(assignmentservice.Assignments_.class).entries(assignmentDraftList);
    return draftService.newDraft(newAssignmentDraft).first(assignmentservice.Assignments.class);
  }

  public void updateAssignmentStatus(String assignmentHeaderId, int assignmentStatusToBeUpdated) {

    Map<String, Object> updatedDraftEntity = new HashMap<>();
    updatedDraftEntity.put(assignmentservice.Assignments.ID, assignmentHeaderId);
    updatedDraftEntity.put(assignmentservice.Assignments.ASSIGNMENT_STATUS_CODE, assignmentStatusToBeUpdated);
    CqnUpdate update = Update.entity(assignmentservice.Assignments_.CDS_NAME)
        .entries(Collections.singletonList(updatedDraftEntity));
    draftService.patchDraft(update);
  }

  public void updateBookedCapacityInHeader(String assignmentHeaderId) {

    int totalBookedCapacityInMinutes = getTotalBookedCapacity(assignmentHeaderId);

    Map<String, Object> updatedDraftEntity = new HashMap<>();
    updatedDraftEntity.put(assignmentservice.Assignments.ID, assignmentHeaderId);
    updatedDraftEntity.put(assignmentservice.Assignments.BOOKED_CAPACITY_IN_MINUTES, totalBookedCapacityInMinutes);
    CqnUpdate update = Update.entity(assignmentservice.Assignments_.CDS_NAME)
        .entries(Collections.singletonList(updatedDraftEntity));
    draftService.patchDraft(update);
  }

  public int getTotalBookedCapacity(String assignmentHeaderId) {
    List<AssignmentBuckets> updatedBucketList = dataProvider.getAssignmentBucketsDraft(assignmentHeaderId);
    return updatedBucketList.stream().map(r -> r.getBookedCapacityInMinutes()).reduce(0, (a, b) -> a + b);
  }

  public Assignments getEditDraftForUser(String assignmentId, String user, Messages messageContainer,
      boolean newSession, boolean isActiveEntity) {

    // check for any existing edit drafts on this assignment
    // https://github.tools.sap/cap/issues/issues/8607#issuecomment-555488
    CqnSelect selectExistingDraftAdminRecordForAssignment = Select.from(assignmentservice.Assignments_.CDS_NAME)
        .columns(b -> b.to(assignmentservice.Assignments.DRAFT_ADMINISTRATIVE_DATA).expand())
        .where(b -> b.get(assignmentservice.Assignments.ID).eq(assignmentId)
            .and(b.get(assignmentservice.Assignments.IS_ACTIVE_ENTITY).eq(isActiveEntity)));

    Optional<Row> existingDraftAdminRow = draftService.run(selectExistingDraftAdminRecordForAssignment).first();
    if (existingDraftAdminRow.isPresent()) {

      Object existingDraftAdminDataObject = existingDraftAdminRow.get()
          .get(assignmentservice.Assignments.DRAFT_ADMINISTRATIVE_DATA);

      if (existingDraftAdminDataObject == null) {
        // No existing draft for this assignment -> return a new edit draft
        return createNewEditDraft(assignmentId);
      } else {
        // Draft exists for this assignment
        @SuppressWarnings("unchecked")
        Map<String, Object> existingDraftAdminDataMap = (Map<String, Object>) existingDraftAdminDataObject;

        String existingDraftLockOwner = existingDraftAdminDataMap
            .get(assignmentservice.DraftAdministrativeData.IN_PROCESS_BY_USER).toString();

        if (existingDraftLockOwner == null || existingDraftLockOwner.isEmpty()) {
          /*
           * draft exists but does not have any owner as the lock expired. delete the
           * existing draft and return a new edit draft preserveChange = false inside the
           * createNewEditDraft method ensures deletion of old draft and returns a fresh
           * new one
           */
          return createNewEditDraft(assignmentId);
        } else if (existingDraftLockOwner.compareTo(user) != 0) {
          /* draft exists, but actively locked by some other user */
          messageContainer.error(MessageKeys.ASSIGNMENT_LOCKED_BY_OTHER_USER, existingDraftLockOwner);
          raiseExceptionIfErrorWithTarget(messageContainer, assignmentId);
        } else {
          /*
           * draft exists and lock owned by same user. if it is new UI login from grid, or
           * an API (public API, consultantAssignmentService, requesterAssignmentService)
           * invocation then we ignore any existing drafts by user. We return a fresh new
           * one.
           */
          if (newSession) {
            deleteExistingDraft(assignmentId);
            return createNewEditDraft(assignmentId);
          }
          /*
           * draft exists, owned by same user and making subsequent edits from capacity
           * grid
           */
          return getExistingEditDraft(assignmentId);
        }
      }
    }
    // draft does not exist
    return createNewEditDraft(assignmentId);
  }

  private Assignments getExistingEditDraft(String draftAssignmentId) {
    CqnSelect selectExistingAssignmentEditDraft = Select.from(assignmentservice.Assignments_.CDS_NAME)
        .where(b -> b.get(assignmentservice.Assignments.ID).eq(draftAssignmentId)
            .and(b.get(assignmentservice.Assignments.IS_ACTIVE_ENTITY).eq(false)));
    return draftService.run(selectExistingAssignmentEditDraft).single(assignmentservice.Assignments.class);
  }

  private Assignments createNewEditDraft(String assignmentId) {
    CqnSelect selectAssignment = Select.from(assignmentservice.Assignments_.CDS_NAME)
        .where(b -> b.get(assignmentservice.Assignments.ID).eq(assignmentId)
            .and(b.get(assignmentservice.Assignments.IS_ACTIVE_ENTITY).eq(Boolean.TRUE)));

    return draftService.editDraft(selectAssignment, false).single(assignmentservice.Assignments.class);
  }

  public void deleteExistingDraft(String draftId) {
    CqnDelete deleteDraft = Delete.from(assignmentservice.Assignments_.CDS_NAME)
        .where(b -> b.get(assignmentservice.Assignments.ID).eq(draftId)
            .and(b.get(assignmentservice.Assignments.IS_ACTIVE_ENTITY).eq(false)));

    draftService.cancelDraft(deleteDraft);
  }

  public void cancelDraft(String assignmentBucketId) {
    draftService.cancelDraft(Delete.from(AssignmentBuckets_.class).where(
        b -> b.ID().in(Collections.singletonList(assignmentBucketId)).and(b.IsActiveEntity().eq(Boolean.FALSE))));
  }

  public void updateAssignmentBucketDraft(String assignmentBucketId, int staffedHours) {
    Map<String, Object> updatedDraftEntity = new HashMap<>();
    updatedDraftEntity.put(AssignmentBuckets.ID, assignmentBucketId);
    updatedDraftEntity.put(AssignmentBuckets.BOOKED_CAPACITY_IN_MINUTES, hoursToMinutes(staffedHours));
    CqnUpdate update = Update.entity(assignmentservice.AssignmentBuckets_.CDS_NAME)
        .entries(Collections.singletonList(updatedDraftEntity));
    draftService.patchDraft(update);

  }

  public Optional<AssignmentBuckets> createNewBucketDraft(AssignmentBuckets newBucket) {

    CqnInsert insertNewBucketDrafts = Insert.into(AssignmentBuckets_.class)
        .entries(Collections.singletonList(newBucket));
    return draftService.newDraft(insertNewBucketDrafts).first(AssignmentBuckets.class);

  }

  public void createNewBucketDrafts(List<AssignmentBuckets> newBucketDraftList) {

    CqnInsert insertNewBucketDrafts = Insert.into(AssignmentBuckets_.class).entries(newBucketDraftList);
    draftService.newDraft(insertNewBucketDrafts);

  }

  public void deleteBucketDrafts(String assignmentHeaderId, Instant from, Instant to) {
    draftService.cancelDraft(Delete.from(AssignmentBuckets_.class)
        .where(b -> b.assignment_ID().in(Collections.singletonList(assignmentHeaderId))
            .and(b.startTime().between(from, to)).and(b.IsActiveEntity().eq(Boolean.FALSE))));
  }

  public void updateAssignmentBucketsDrafts(List<AssignmentBuckets> existingAssignmentBucketDraftList,
      List<AssignmentBuckets> newAssignmentBucketDraftList) {

    if (!existingAssignmentBucketDraftList.isEmpty()) {
      List<String> draftBucketIdToDeleteList = existingAssignmentBucketDraftList.stream().map(AssignmentBuckets::getId)
          .collect(Collectors.toList());
      draftService.cancelDraft(Delete.from(AssignmentBuckets_.class)
          .where(b -> b.ID().in(draftBucketIdToDeleteList).and(b.IsActiveEntity().eq(Boolean.FALSE))));
    }
    CqnInsert insertNewBucketDrafts = Insert.into(AssignmentBuckets_.class).entries(newAssignmentBucketDraftList);
    draftService.newDraft(insertNewBucketDrafts);
  }

  public List<AssignmentBuckets> getExistingAssignmentBucketsDrafts(String assignmentId, LocalDate startDate,
      LocalDate endDate) {

    Instant assignmentStartTime = startDate.atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant assignmentEndTime = endDate.atStartOfDay().toInstant(ZoneOffset.UTC);
    CqnSelect selectBucketInPeriod = Select.from(AssignmentBuckets_.class).where(b -> b.assignment_ID().eq(assignmentId)
        .and(b.startTime().between(assignmentStartTime, assignmentEndTime), b.IsActiveEntity().eq(false)));

    return draftService.run(selectBucketInPeriod).listOf(AssignmentBuckets.class);
  }

  public List<AssignmentBuckets> getSimulatedAssignmentBucketsDrafts(String assignmentId, String resourceId,
      LocalDate startDate, LocalDate endDate, int hoursToStaff) {

    Instant assignmentStartTime = startDate.atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant assignmentEndTime = endDate.atStartOfDay().toInstant(ZoneOffset.UTC);

    List<Capacity> resourceCapacityList = dataProvider.getResourceCapacities(resourceId, assignmentStartTime,
        assignmentEndTime);

    List<AssignmentBuckets> assignmentBucketsList = assignmentSimulationUtility
        .getDistributedAssignmentBuckets(RESOURCE_BOOKING_GRANULARITY_IN_MINUTES, hoursToStaff, resourceCapacityList);
    assignmentBucketsList.forEach(bucket -> {
      bucket.setAssignmentId(assignmentId);
      bucket.setIsActiveEntity(false);
    });
    return assignmentBucketsList;
  }

}
