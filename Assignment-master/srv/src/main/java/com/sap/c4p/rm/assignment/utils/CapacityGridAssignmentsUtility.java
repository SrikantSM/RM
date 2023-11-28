package com.sap.c4p.rm.assignment.utils;

import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.addTarget;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.hoursToMinutes;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.raiseExceptionIfErrorWithTarget;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.setEditDraft;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Message.Severity;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

import com.sap.c4p.rm.assignment.enums.CapacityGridAssignmentAction;
import com.sap.c4p.rm.assignment.validation.AssignmentDraftsValidator;
import com.sap.c4p.rm.assignment.validation.AssignmentValidator;

import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Types;

import assignmentservice.AssignmentBuckets;
import assignmentservice.AssignmentService_;
import assignmentservice.Assignments;
import capacityservice.AssignmentBucketsPerDay;
import capacityservice.AssignmentBucketsYearMonthAggregate;
import capacityservice.AssignmentBucketsYearWeekAggregate;
import capacityservice.AssignmentsDetailsForCapacityGrid;

@Component
public class CapacityGridAssignmentsUtility {

  private static final String PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR = "ProcessingResourceOrganization";

  private DraftService draftService;
  private DataProvider dataProvider;
  private AssignmentSimulationUtility assignmentSimulationUtility;
  private AssignmentValidator validator;
  private CdsRuntime cdsRuntime;

  private AssignmentDraftsValidator draftValidator;
  private AssignmentDraftsUtility draftUtility;

  @Autowired
  public CapacityGridAssignmentsUtility(final AssignmentValidator validator,
      final AssignmentDraftsValidator draftValidator,
      @Qualifier(AssignmentService_.CDS_NAME) final DraftService draftService, final DataProvider dataProvider,
      final AssignmentSimulationUtility assignmentSimulationUtility, final CdsRuntime cdsRuntime,
      AssignmentDraftsUtility draftUtility) {
    this.draftService = draftService;
    this.dataProvider = dataProvider;
    this.assignmentSimulationUtility = assignmentSimulationUtility;
    this.validator = validator;
    this.cdsRuntime = cdsRuntime;
    this.draftValidator = draftValidator;
    this.draftUtility = draftUtility;
  }

  public List<Map<String, Object>> updateAssignmentForMonth(final CdsUpdateEventContext context,
      AssignmentBucketsYearMonthAggregate assignmentBucketsYearMonthToUpdate) {

    int newBookedCapacityInHours = assignmentBucketsYearMonthToUpdate.getBookedCapacityInHours();
    String assignmentId = assignmentBucketsYearMonthToUpdate.getAssignmentId();
    int action = assignmentBucketsYearMonthToUpdate.getAction();
    LocalDate startDate = assignmentBucketsYearMonthToUpdate.getStartDate();
    LocalDate endDate = assignmentBucketsYearMonthToUpdate.getEndDate();

    updateAssignmentBuckets(context, newBookedCapacityInHours, assignmentId, action, startDate, endDate);

    /*
     * UI needs the result same as what user entered. If user input is not valid we
     * would still show the invalid input along with the error messages
     */
    Map<String, Object> resultMap = new HashMap<>();
    String timePeriod = assignmentBucketsYearMonthToUpdate.getTimePeriod();
    resultMap.put(AssignmentBucketsYearMonthAggregate.ASSIGNMENT_ID, assignmentId);
    resultMap.put(AssignmentBucketsYearMonthAggregate.START_DATE,
        assignmentBucketsYearMonthToUpdate.getStartDate().toString());
    resultMap.put(AssignmentBucketsYearMonthAggregate.END_DATE,
        assignmentBucketsYearMonthToUpdate.getEndDate().toString());
    resultMap.put(AssignmentBucketsYearMonthAggregate.TIME_PERIOD, timePeriod);
    resultMap.put(AssignmentBucketsYearMonthAggregate.ACTION, assignmentBucketsYearMonthToUpdate.getAction());
    resultMap.put(AssignmentBucketsYearMonthAggregate.BOOKED_CAPACITY_IN_HOURS, newBookedCapacityInHours);

    List<Map<String, Object>> resultMapList = new ArrayList<>();
    resultMapList.add(resultMap);

    return resultMapList;
  }

  public List<Map<String, Object>> updateAssignmentForTheDay(final CdsUpdateEventContext updateEventContext,
      AssignmentBucketsPerDay assignmentBucketsPerDayToUpdate) {

    int newBookedCapacityInHours = assignmentBucketsPerDayToUpdate.getBookedCapacityInHours();
    String assignmentId = assignmentBucketsPerDayToUpdate.getAssignmentId();
    int action = assignmentBucketsPerDayToUpdate.getAction();
    LocalDate startDate = assignmentBucketsPerDayToUpdate.getDate();
    LocalDate endDate = startDate;

    updateAssignmentBuckets(updateEventContext, newBookedCapacityInHours, assignmentId, action, startDate, endDate);

    /*
     * UI needs the result same as what user entered. If user input is not valid we
     * would still show the invalid input along with the error messages
     */
    Map<String, Object> resultMap = new HashMap<>();
    resultMap.put(AssignmentBucketsPerDay.ASSIGNMENT_ID, assignmentBucketsPerDayToUpdate.getAssignmentId());
    resultMap.put(AssignmentBucketsPerDay.TIME_PERIOD, assignmentBucketsPerDayToUpdate.getTimePeriod());
    resultMap.put(AssignmentBucketsPerDay.DATE, assignmentBucketsPerDayToUpdate.getDate().toString());
    resultMap.put(AssignmentBucketsPerDay.ACTION, assignmentBucketsPerDayToUpdate.getAction());
    resultMap.put(AssignmentBucketsPerDay.BOOKED_CAPACITY_IN_HOURS,
        assignmentBucketsPerDayToUpdate.getBookedCapacityInHours());

    List<Map<String, Object>> resultMapList = new ArrayList<>();
    resultMapList.add(resultMap);

    return resultMapList;
  }

  public List<Map<String, Object>> updateAssignmentForTheWeek(final CdsUpdateEventContext updateEventContext,
      AssignmentBucketsYearWeekAggregate assignmentBucketsYearWeekToUpdate) {

    int newBookedCapacityInHours = assignmentBucketsYearWeekToUpdate.getBookedCapacityInHours();
    String assignmentId = assignmentBucketsYearWeekToUpdate.getAssignmentId();
    int action = assignmentBucketsYearWeekToUpdate.getAction();
    LocalDate startDate = assignmentBucketsYearWeekToUpdate.getStartDate();
    LocalDate endDate = assignmentBucketsYearWeekToUpdate.getEndDate();

    updateAssignmentBuckets(updateEventContext, newBookedCapacityInHours, assignmentId, action, startDate, endDate);

    /*
     * UI needs the result same as what user entered. If user input is not valid we
     * would still show the invalid input along with the error messages
     */
    Map<String, Object> resultMap = new HashMap<>();
    resultMap.put(AssignmentBucketsYearWeekAggregate.ASSIGNMENT_ID,
        assignmentBucketsYearWeekToUpdate.getAssignmentId());
    resultMap.put(AssignmentBucketsYearWeekAggregate.TIME_PERIOD, assignmentBucketsYearWeekToUpdate.getTimePeriod());
    resultMap.put(AssignmentBucketsYearWeekAggregate.START_DATE,
        assignmentBucketsYearWeekToUpdate.getStartDate().toString());
    resultMap.put(AssignmentBucketsYearWeekAggregate.END_DATE,
        assignmentBucketsYearWeekToUpdate.getEndDate().toString());
    resultMap.put(AssignmentBucketsYearWeekAggregate.ACTION, assignmentBucketsYearWeekToUpdate.getAction());
    resultMap.put(AssignmentBucketsYearWeekAggregate.BOOKED_CAPACITY_IN_HOURS,
        assignmentBucketsYearWeekToUpdate.getBookedCapacityInHours());

    List<Map<String, Object>> resultMapList = new ArrayList<>();
    resultMapList.add(resultMap);

    return resultMapList;
  }

  public List<Map<String, Object>> executeActionsOnAssignmentDetailsHeader(CdsUpdateEventContext context,
      AssignmentsDetailsForCapacityGrid assignmentsDetailsForCapacityGrid) {

    int action = assignmentsDetailsForCapacityGrid.getAction();
    String assignmentId = assignmentsDetailsForCapacityGrid.getAssignmentId();

    if (action == CapacityGridAssignmentAction.ACTIVATE_DRAFT.getActionCode()) {
      Messages messages = draftValidator.validate(context);
      raiseExceptionIfErrorWithTarget(messages, assignmentId);

      if (!isANewAssignment(assignmentId)) {
        setEditDraft(assignmentId);
      }

      CqnSelect selectDraftToActivate = Select.from(assignmentservice.Assignments_.CDS_NAME)
          .where(b -> b.get(assignmentservice.Assignments.ID).eq(assignmentId)
              .and(b.get(assignmentservice.Assignments.IS_ACTIVE_ENTITY).eq(false)));// ,
      // Review: Condition changed here. Check carefully.

      draftService.saveDraft(selectDraftToActivate);
    } else if (action == CapacityGridAssignmentAction.DELETE_EXISTING_DRAFT.getActionCode()) {
      draftUtility.deleteExistingDraft(assignmentId);
    } else if (action == CapacityGridAssignmentAction.EXTEND_DRAFT_EXPIRY.getActionCode()) {
      String currentUser = context.getUserInfo().getName();
      Assignments editDraft = getEditDraftForUser(assignmentId, currentUser, context.getMessages(), action);
      if (editDraft != null) {
        // Do a dummy update to shift the draft expire time
        Map<String, Object> updatedDraftEntity = new HashMap<>();
        updatedDraftEntity.put(Assignments.ID, editDraft.getId());
        updatedDraftEntity.put(Assignments.ASSIGNMENT_STATUS_CODE, editDraft.getAssignmentStatusCode());
        CqnUpdate update = Update.entity(assignmentservice.Assignments_.CDS_NAME)
            .entries(Collections.singletonList(updatedDraftEntity));
        draftService.patchDraft(update);
      }
    } else { // action = UPDATE_DRAFT(0)/DELETE_EXISTING_DRAFT_AND_GET_FRESH_DRAFT(1)
      String currentUser = context.getUserInfo().getName();
      Assignments editDraft = getEditDraftForUser(assignmentId, currentUser, context.getMessages(), action);
      if (editDraft != null) {
        /*
         * For either update(0) or delete_and_get_fresh(1) case, UI may or may not send
         * the status Thus, we use the status if UI request specifies it else we use the
         * existing status
         */
        int assignmentStatusCode = assignmentsDetailsForCapacityGrid.getAssignmentStatusCode() == null
            ? editDraft.getAssignmentStatusCode()
            : assignmentsDetailsForCapacityGrid.getAssignmentStatusCode();
        validator.validateAssignmentStatusChange(assignmentId, assignmentStatusCode);

        // Editing of assignments only possible for open requests
        validator.validateResourceRequestStatuses(editDraft.getResourceRequestId());
        // With raising an exception it is seen that the draft is also deleted and
        // needn't be done explicitly
        validator.getMessages().stream().filter(message -> message.getSeverity() == Severity.ERROR).findFirst()
            .ifPresent(errorMessage -> raiseExceptionIfErrorWithTarget(validator.getMessages(), assignmentId));
        Map<String, Object> updatedDraftEntity = new HashMap<>();
        updatedDraftEntity.put(Assignments.ID, editDraft.getId());
        updatedDraftEntity.put(Assignments.ASSIGNMENT_STATUS_CODE, assignmentStatusCode);
        CqnUpdate update = Update.entity(assignmentservice.Assignments_.CDS_NAME)
            .entries(Collections.singletonList(updatedDraftEntity));
        draftService.patchDraft(update);
      }
    }

    Map<String, Object> resultMap = new HashMap<>();
    resultMap.put(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_ID, assignmentsDetailsForCapacityGrid.getAssignmentId());
    List<Map<String, Object>> resultMapList = new ArrayList<>();
    resultMapList.add(resultMap);
    return resultMapList;
  }

  private boolean isANewAssignment(String assignmentId) {
    // Returns if the assignment is freshly baked (create scenario) or an existing
    // one(update scenario)
    Assignments draftAssignment = dataProvider.getAssignmentHeaderDraft(assignmentId);

    return !draftAssignment.getHasActiveEntity();

  }

  private void updateAssignmentBuckets(CdsUpdateEventContext updateEventContext, int newBookedCapacityInHours,
      String assignmentId, int action, LocalDate startDate, LocalDate endDate) {

    /*
     * Only action = UPDATE_DRAFT(0)/DELETE_EXISTING_DRAFT_AND_GET_FRESH_DRAFT(1) is
     * handled with the child entity here. Draft save, delete and validity extension
     * handled via parent entity
     */

    String currentUser = updateEventContext.getUserInfo().getName();
    Assignments editDraft = getEditDraftForUser(assignmentId, currentUser, updateEventContext.getMessages(), action);
    if (editDraft != null) {

      String resourceId = editDraft.getResourceId();
      String requestId = editDraft.getResourceRequestId();

      List<String> resOrgsUserIsAuthFor = updateEventContext.getUserInfo()
          .getAttributeValues(PROCESSING_RESORGS_USER_IS_AUTHORIZED_FOR);

      validateAssignments(assignmentId, startDate, endDate, newBookedCapacityInHours, resourceId, requestId,
          resOrgsUserIsAuthFor);

      List<AssignmentBuckets> existingAssignmentBucketDraftList = dataProvider
          .getExistingAssignmentBucketsDrafts(assignmentId, startDate, endDate);
      List<AssignmentBuckets> newAssignmentBucketDraftList = getSimulatedAssignmentBucketsDrafts(assignmentId,
          resourceId, startDate, endDate, newBookedCapacityInHours);

      draftUtility.updateAssignmentBucketsDrafts(existingAssignmentBucketDraftList, newAssignmentBucketDraftList);
      draftUtility.updateBookedCapacityInHeader(assignmentId);
    }
  }

  private List<AssignmentBuckets> getSimulatedAssignmentBucketsDrafts(String assignmentId, String resourceId,
      LocalDate startDate, LocalDate endDate, int hoursToStaff) {

    Instant assignmentStartTime = startDate.atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant assignmentEndTime = endDate.atStartOfDay().toInstant(ZoneOffset.UTC);

    List<Capacity> resourceCapacityList = dataProvider.getResourceCapacities(resourceId, assignmentStartTime,
        assignmentEndTime);

    Optional<Types> bookingGranularityRecord = dataProvider.getResourceBookingGranularityInMinutes(resourceId);

    if (bookingGranularityRecord.isPresent()) {
      List<AssignmentBuckets> assignmentBucketsList = assignmentSimulationUtility.getDistributedAssignmentBuckets(
          bookingGranularityRecord.get().getBookingGranularityInMinutes(), hoursToStaff, resourceCapacityList);
      assignmentBucketsList.forEach(bucket -> {
        bucket.setAssignmentId(assignmentId);
        bucket.setHasActiveEntity(true);
        bucket.setIsActiveEntity(false);
      });
      return assignmentBucketsList;
    }
    return Collections.emptyList();
  }

  private void validateAssignments(String assignmentId, LocalDate startDate, LocalDate endDate,
      int newBookedCapacityInHours, String resourceId, String requestId, List<String> resOrgsUserIsAuthFor) {

    Instant assignmentStartTime = startDate.atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant assignmentEndTime = endDate.atStartOfDay().toInstant(ZoneOffset.UTC);

    if (newBookedCapacityInHours > 0) {
      validator.validateResourceValidity(startDate.atStartOfDay().toInstant(ZoneOffset.UTC),
          endDate.atStartOfDay().toInstant(ZoneOffset.UTC), resourceId,
          dataProvider.getRequestData(requestId).get().getProcessingResourceOrgId());
      validator.validateResourceAvailability(resourceId, assignmentStartTime, assignmentEndTime);
      validator.validateResourceBookingGranularity(resourceId, hoursToMinutes(newBookedCapacityInHours));
    }
    if (!resOrgsUserIsAuthFor.isEmpty()) {
      validator.validateAuthorizationForRequest(requestId, resOrgsUserIsAuthFor);
    }

    addTarget(validator.getMessages(), assignmentId);

    // Below validations have to be executed for the entire assignment period
    List<com.sap.resourcemanagement.assignment.AssignmentBuckets> sortedExistingBuckets;
    List<assignmentservice.AssignmentBuckets> sortedDraftBuckets;

    Instant existingBucketsStartInstant = assignmentStartTime;
    Instant existingBucketsEndInstant = assignmentEndTime;

    if (isANewAssignment(assignmentId)) { // This is a case of assignment creation from the grid

      sortedDraftBuckets = dataProvider.getAssignmentBucketsDraft(assignmentId).stream()
          .sorted((o1, o2) -> o1.getStartTime().compareTo(o2.getStartTime())).collect(Collectors.toList());
      // It may happen that no buckets were returned as there was no distribution done
      // (all cells 0)

      if (!sortedDraftBuckets.isEmpty()) {
        existingBucketsStartInstant = sortedDraftBuckets.get(0).getStartTime();
        existingBucketsEndInstant = sortedDraftBuckets.get(sortedDraftBuckets.size() - 1).getStartTime();
      }
    } else { // This is the case of assignment edit from the grid
      sortedExistingBuckets = dataProvider.getAssignmentBuckets(assignmentId).stream()
          .sorted((o1, o2) -> o1.getStartTime().compareTo(o2.getStartTime())).collect(Collectors.toList());
      existingBucketsStartInstant = sortedExistingBuckets.get(0).getStartTime();
      existingBucketsEndInstant = sortedExistingBuckets.get(sortedExistingBuckets.size() - 1).getStartTime();
    }

    Instant validFrom = existingBucketsStartInstant.isAfter(assignmentStartTime) ? assignmentStartTime
        : existingBucketsStartInstant;
    Instant validTo = existingBucketsEndInstant.isBefore(assignmentEndTime) ? assignmentEndTime
        : existingBucketsEndInstant;

    RequestContextRunner requestContextRunner = cdsRuntime.requestContext()
        .modifyParameters(p -> p.setValidFrom(validFrom)).modifyParameters(p -> p.setValidTo(validTo));

    // Validations that depend on temporal aspects inside the adapted requestContext
    requestContextRunner.run(req -> {
      validator.validateAuthorizationForResource(resourceId, resOrgsUserIsAuthFor);
      if (newBookedCapacityInHours > 0) {
        validator.validateMultiTimeSliceResource(resourceId);
      }
    });

    validator.validateActiveResource(resourceId, validTo.atZone(ZoneId.systemDefault()).toLocalDate(),
        validFrom.atZone(ZoneId.systemDefault()).toLocalDate());

    addTarget(validator.getMessages(), assignmentId);

  }

  private Assignments getEditDraftForUser(String assignmentId, String currentUser, Messages messageContainer,
      int action) {

    final boolean isActiveEntity = assignmentHasActiveEntity(assignmentId, action);

    return draftUtility.getEditDraftForUser(assignmentId, currentUser, messageContainer,
        action == CapacityGridAssignmentAction.DELETE_EXISTING_DRAFT_AND_GET_FRESH_DRAFT.getActionCode(),
        isActiveEntity);
  }

  private boolean assignmentHasActiveEntity(String assignmentId, int action) {

    boolean hasActiveEntity = true;

    if (action != CapacityGridAssignmentAction.DELETE_EXISTING_DRAFT_AND_GET_FRESH_DRAFT.getActionCode()) {
      // Check if this is expensive. Other alternative is to ask UI to send new
      // action, but that is dirty
      try {
        Assignments draftAssignment = dataProvider.getAssignmentHeaderDraft(assignmentId);

        hasActiveEntity = draftAssignment.getHasActiveEntity();

      } catch (Exception e) {
        // No draft exists, this could be the first time the draft is getting created
      }
    }
    return hasActiveEntity;

  }

  public void deleteExistingEditDraft(String draftAssignmentId) {
    CqnDelete deleteExistingDraft = Delete.from(assignmentservice.Assignments_.CDS_NAME)
        .where(b -> b.get(assignmentservice.Assignments.ID).eq(draftAssignmentId)
            .and(b.get(assignmentservice.Assignments.IS_ACTIVE_ENTITY).eq(false)));
    draftService.cancelDraft(deleteExistingDraft);
  }

}
