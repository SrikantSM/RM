package com.sap.c4p.rm.assignment.handlers;

import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.setEditDraft;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.assignment.config.LoggingMarker;
import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.AssignmentDraftsUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;
import com.sap.c4p.rm.assignment.utils.HttpStatus;
import com.sap.c4p.rm.assignment.validation.AssignmentDraftsValidator;
import com.sap.c4p.rm.assignment.validation.AssignmentValidator;

import com.sap.resourcemanagement.assignment.AssignmentBucketsForYearWeek;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.system.data.timedimension.Data;

import assignmentservice.AssignmentBuckets;
import consultantassignmentservice.Assignments;
import consultantassignmentservice.Assignments_;
import consultantassignmentservice.ConsultantAssignmentService_;
import consultantassignmentservice.WeeklyAssignmentDistribution;

@Component
@ServiceName(ConsultantAssignmentService_.CDS_NAME)
public class ConsultantAssignmentServiceHandler implements EventHandler {

  private AssignmentValidator validator;
  private AssignmentDraftsValidator draftsValidator;
  private AssignmentDraftsUtility draftUtility;
  private DataProvider dataProvider;

  private static final Logger LOGGER = LoggerFactory.getLogger(ConsultantAssignmentServiceHandler.class);
  private static final Marker CONSULTANT_ASGN_UPDATE_MARKER = LoggingMarker.CONSULTANT_ASGN_UPDATE_MARKER.getMarker();

  @Autowired
  public ConsultantAssignmentServiceHandler(AssignmentValidator validator, AssignmentDraftsValidator draftsValidator,
      final AssignmentDraftsUtility draftUtility, DataProvider dataProvider) {
    this.validator = validator;
    this.draftsValidator = draftsValidator;
    this.draftUtility = draftUtility;
    this.dataProvider = dataProvider;
  }

  @On(event = CqnService.EVENT_UPDATE, entity = Assignments_.CDS_NAME)
  public synchronized void updateWeeklyAssignment(CdsUpdateEventContext context, Assignments assignmentPayload) {

    String assignmentID = assignmentPayload.getId();

    LOGGER.info(CONSULTANT_ASGN_UPDATE_MARKER, "Updating assignment {} for consultant {}", assignmentID,
        context.getUserInfo().getName());

    validator.validateAssignmentExists(assignmentID);
    validator.getMessages().throwIfError();

    validator.validateConsultantStaffedOnAssignment(assignmentID, context.getUserInfo());
    validator.getMessages().throwIfError();

    List<WeeklyAssignmentDistribution> weeklyAssignmentDistribution = assignmentPayload
        .getWeeklyAssignmentDistribution();

    assignmentservice.Assignments editDraft = draftUtility.getEditDraftForUser(assignmentID,
        context.getUserInfo().getName(), context.getMessages(), true, true);
    context.getMessages().throwIfError();

    if (editDraft == null) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENT_UNAVAILABLE_FOR_EDIT);
    }

    Optional<ResourceRequests> requestData = dataProvider.getRequestData(editDraft.getResourceRequestId());
    LocalDate requestStartDate;
    LocalDate requestEndDate;
    if (requestData.isPresent()) {
      requestStartDate = requestData.get().getStartDate();
      requestEndDate = requestData.get().getEndDate();
    } else {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.REQUEST_NOT_FOUND);
    }
    /*
     * Here we follow the PATCH semantics. We update only the time period that the
     * user has provided in the pay load and leave other time periods as before.
     */
    List<AssignmentBuckets> newAssignmentBucketDraftList = new ArrayList<>();
    List<String> calendarWeeksToUpdate = new ArrayList<>();

    for (WeeklyAssignmentDistribution weeklyDistributionRecord : weeklyAssignmentDistribution) {

      String calendarWeek = weeklyDistributionRecord.getCalendarWeek();
      if (calendarWeek == null || calendarWeek.isEmpty()) {
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CALENDAR_WEEK_MISSING_PAYLOAD);
      }

      Integer bookedCapacityInHours = weeklyDistributionRecord.getBookedCapacity();
      if (bookedCapacityInHours == null || bookedCapacityInHours.intValue() < 0) {
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.BOOKED_CAPACITY_INVALID_PAYLOAD);
      }

      Data timeDimensionDataWeekStart = dataProvider.getTimeDimensionDataForCalendarWeekStart(calendarWeek);
      Data timeDimensionDataWeekEnd = dataProvider.getTimeDimensionDataForCalendarWeekEnd(calendarWeek);

      LocalDate asgnWeekStartDate = timeDimensionDataWeekStart.getDateSql();
      if (asgnWeekStartDate.isBefore(requestStartDate)) {
        asgnWeekStartDate = requestStartDate;
      }
      LocalDate asgnWeekEndDate = timeDimensionDataWeekEnd.getDateSql();
      if (asgnWeekEndDate.isAfter(requestEndDate)) {
        asgnWeekEndDate = requestEndDate;
      }

      calendarWeeksToUpdate.add(calendarWeek);

      newAssignmentBucketDraftList.addAll(draftUtility.getSimulatedAssignmentBucketsDrafts(assignmentID,
          editDraft.getResourceId(), asgnWeekStartDate, asgnWeekEndDate, bookedCapacityInHours));
    }

    List<AssignmentBucketsForYearWeek> existingBucketsYearWeekToDelete = dataProvider
        .getExistingAssignmentBucketsForYearWeeks(assignmentID, calendarWeeksToUpdate);

    List<AssignmentBuckets> existingAssignmentBucketDraftListToDelete = new ArrayList<>();
    for (AssignmentBucketsForYearWeek bucketYearWeek : existingBucketsYearWeekToDelete) {
      AssignmentBuckets bucket = AssignmentBuckets.create();
      bucket.setId(bucketYearWeek.getId());
      existingAssignmentBucketDraftListToDelete.add(bucket);
    }

    draftUtility.updateAssignmentBucketsDrafts(existingAssignmentBucketDraftListToDelete, newAssignmentBucketDraftList);
    draftUtility.updateBookedCapacityInHeader(editDraft.getId());

    // run validations on the entire assignment draft object
    draftsValidator.validate(editDraft.getId()).throwIfError();

    setEditDraft(assignmentID);
    draftUtility.activateEditDraft(editDraft.getId());

    Map<String, Object> resultMap = new HashMap<>();
    resultMap.put(Assignments.ID, assignmentID);
    List<Map<String, Object>> resultMapList = new ArrayList<>();
    resultMapList.add(resultMap);

    context.setResult(resultMapList);
    context.setCompleted();
  }

}
