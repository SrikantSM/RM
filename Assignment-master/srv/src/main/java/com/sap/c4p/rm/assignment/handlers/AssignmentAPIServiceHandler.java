package com.sap.c4p.rm.assignment.handlers;

import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.getHeaderDates;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.getStartAndEndDateForCalendarMonth;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.hoursToMinutes;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.minutesToHours;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.setEditDraft;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.config.LoggingMarker;
import com.sap.c4p.rm.assignment.enums.AssignmentStatus;
import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.AssignmentDraftsUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;
import com.sap.c4p.rm.assignment.utils.EventContextKeysExtractor;
import com.sap.c4p.rm.assignment.utils.HttpStatus;
import com.sap.c4p.rm.assignment.validation.AssignmentDraftsValidator;
import com.sap.c4p.rm.assignment.validation.AssignmentValidator;

import com.sap.resourcemanagement.resource.Types;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;

import assignment.Assignment_;
import assignment.Assignments;
import assignment.Assignments_;
import assignment.DailyAssignmentDistribution;
import assignment.DailyAssignmentDistribution_;
import assignment.MonthlyAssignmentDistribution;
import assignment.MonthlyAssignmentDistribution_;
import assignment.WeeklyAssignmentDistribution;
import assignment.WeeklyAssignmentDistribution_;
import assignmentservice.AssignmentBuckets;
import assignmentservice.AssignmentService_;

@Component
@ServiceName(Assignment_.CDS_NAME)
public class AssignmentAPIServiceHandler implements EventHandler {

  private static final int START = 0;
  private static final int END = 1;

  private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentAPIServiceHandler.class);
  private static final Marker ASSIGNMENT_PUBLIC_API_MARKER = LoggingMarker.ASSIGNMENT_PUBLIC_API_MARKER.getMarker();

  private CqnService assignmentService;

  private AssignmentDraftsValidator draftsValidator;
  private AssignmentValidator validator;
  private DataProvider dataProvider;

  private EventContextKeysExtractor eventContextKeysExtractor;
  private AssignmentDraftsUtility draftUtility;

  @Autowired
  public AssignmentAPIServiceHandler(@Qualifier(AssignmentService_.CDS_NAME) final CqnService assignmentService,
      final AssignmentDraftsValidator draftsValidator, final AssignmentValidator validator,
      final DataProvider dataProvider, final EventContextKeysExtractor eventContextKeysExtractor,
      AssignmentDraftsUtility draftUtility) {
    this.assignmentService = assignmentService;
    this.draftsValidator = draftsValidator;
    this.validator = validator;
    this.dataProvider = dataProvider;
    this.eventContextKeysExtractor = eventContextKeysExtractor;
    this.draftUtility = draftUtility;
  }

  @On(event = { CqnService.EVENT_CREATE }, entity = Assignments_.CDS_NAME)
  public synchronized void createAssignment(final Assignments assignment, final CdsCreateEventContext context) {

    if (assignment.getStartDate() != null || assignment.getEndDate() != null
        || assignment.getBookedCapacity() != null) {
      context.getMessages().warn(MessageKeys.START_END_CAPACITY_IGNORED);
    }

    validator.validateNoAssignmentExists(assignment.getResourceID(), assignment.getRequestID());
    validator.getMessages().throwIfError();
    checkOnlyOneDistributionIsProvided(assignment);

    String requestId = assignment.getRequestID();
    String resourceId = assignment.getResourceID();
    boolean isSoftBooked = Boolean.TRUE.equals(assignment.getIsSoftBooked());

    assignmentservice.Assignments newAssignmentDraft = assignmentservice.Assignments.create();
    String assignmentId = UUID.randomUUID().toString();
    newAssignmentDraft.setId(assignmentId);
    newAssignmentDraft.setResourceRequestId(requestId);
    newAssignmentDraft.setResourceId(resourceId);
    newAssignmentDraft.setAssignmentStatusCode(
        isSoftBooked ? AssignmentStatus.SOFTBOOKED.getCode() : AssignmentStatus.HARDBOOKED.getCode());

    LocalDate[] requestDates = getRequestStartAndEndDates(requestId);
    int resourceBookingGranularityInMins = getResourceBookingGranularityInMinutes(resourceId);

    Map<String, Object> resultMap = new HashMap<>();

    if (isDailyDistributionProvidedInPayload(assignment)) {
      populateAssignmentDraftsAndResultMapForProvidedDailyDistribution(assignment, newAssignmentDraft, resultMap,
          requestDates, resourceBookingGranularityInMins);
    } else if (isWeeklyDistributionProvidedInPayload(assignment)) {
      populateAssignmentDraftsAndResultMapForProvidedWeeklyDistribution(assignment, newAssignmentDraft, resultMap,
          requestDates, resourceBookingGranularityInMins);
    } else if (isMonthlyDistributionProvidedInPayload(assignment)) {
      populateAssignmentDraftsAndResultMapForProvidedMonthlyDistribution(assignment, newAssignmentDraft, resultMap,
          requestDates, resourceBookingGranularityInMins);
    }

    Optional<assignmentservice.Assignments> assignmentDraftOptional = draftUtility
        .createNewDraft(Collections.singletonList(newAssignmentDraft));

    if (assignmentDraftOptional.isPresent()) {

      draftsValidator.validate(assignmentDraftOptional.get().getId()).throwIfError();
      draftUtility.activateNewDraft(assignmentId);

      resultMap.put(Assignments.ID, assignmentId);
      resultMap.put(Assignments.REQUEST_ID, requestId);
      resultMap.put(Assignments.RESOURCE_ID, resourceId);
      resultMap.put(Assignments.IS_SOFT_BOOKED, isSoftBooked);
      resultMap.put(Assignments.BOOKED_CAPACITY, minutesToHours(newAssignmentDraft.getBookedCapacityInMinutes()));

      Map<String, LocalDate> assignmentDates = getHeaderDates(newAssignmentDraft.getAssignmentBuckets());
      LocalDate assignmentStartDate = assignmentDates.get(Assignments.START_DATE);
      LocalDate assignmentEndDate = assignmentDates.get(Assignments.END_DATE);
      resultMap.put(Assignments.START_DATE, assignmentStartDate);
      resultMap.put(Assignments.END_DATE, assignmentEndDate);

      context.setResult(Collections.singletonList(resultMap));
      context.setCompleted();

    } else {
      LOGGER.warn(ASSIGNMENT_PUBLIC_API_MARKER, "Deep create of assignment draft failed for assignment {}",
          newAssignmentDraft);
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENT_NOT_CREATED);
    }
  }

  @On(event = { CqnService.EVENT_UPDATE }, entity = Assignments_.CDS_NAME)
  public synchronized void updateAssignment(Assignments assignment, final CdsUpdateEventContext context) {

    String assignmentID = assignment.getId();
    validator.validateAssignmentExists(assignmentID);

    assignmentservice.Assignments editDraft = getEditDraft(assignmentID, context.getUserInfo().getName(),
        context.getMessages());
    /*
     * We allow no distribution in pay load in case of update since the user may
     * want to just update the assignment status
     */
    checkAtmostOneDistributionIsProvided(assignment);

    LocalDate[] requestDates = getRequestStartAndEndDates(editDraft.getResourceRequestId());
    int resourceBookingGranularityInMins = getResourceBookingGranularityInMinutes(editDraft.getResourceId());

    /*
     * Similar to the update behavior in grid, we update only the time period that
     * the user has provided in the pay load and leave other time periods same as
     * before
     */
    List<AssignmentBuckets> existingAssignmentBucketDraftList = new ArrayList<>();
    List<AssignmentBuckets> newAssignmentBucketDraftList = new ArrayList<>();

    if (isDailyDistributionProvidedInPayload(assignment)) {

      populateExistingBucketsToDeleteAndNewBucketsToCreateFromDailyDistribution(assignment,
          existingAssignmentBucketDraftList, newAssignmentBucketDraftList, requestDates,
          resourceBookingGranularityInMins);

    } else if (isWeeklyDistributionProvidedInPayload(assignment)) {

      populateExistingBucketsToDeleteAndNewBucketsToCreateFromWeeklyDistribution(assignment,
          existingAssignmentBucketDraftList, newAssignmentBucketDraftList, requestDates,
          resourceBookingGranularityInMins, editDraft.getResourceId());

    } else if (isMonthlyDistributionProvidedInPayload(assignment)) {

      populateExistingBucketsToDeleteAndNewBucketsToCreateFromMonthlyDistribution(assignment,
          existingAssignmentBucketDraftList, newAssignmentBucketDraftList, requestDates,
          resourceBookingGranularityInMins, editDraft.getResourceId());

    }

    draftUtility.updateAssignmentBucketsDrafts(existingAssignmentBucketDraftList, newAssignmentBucketDraftList);

    if (assignment.getIsSoftBooked() != null) {
      int oldAssignmentStatus = editDraft.getAssignmentStatusCode().intValue();
      int newAssignmentStatus = assignment.getIsSoftBooked() ? AssignmentStatus.SOFTBOOKED.getCode()
          : AssignmentStatus.HARDBOOKED.getCode();

      if (oldAssignmentStatus == AssignmentStatus.HARDBOOKED.getCode()
          && newAssignmentStatus == AssignmentStatus.SOFTBOOKED.getCode()) {
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.BOOKING_STATUS_UNCHANGED);
      }
      draftUtility.updateAssignmentStatus(editDraft.getId(), AssignmentStatus.HARDBOOKED.getCode());
    }

    draftUtility.updateBookedCapacityInHeader(editDraft.getId());
    draftsValidator.validate(editDraft.getId()).throwIfError();

    setEditDraft(assignmentID);
    draftUtility.activateEditDraft(assignmentID);

    Map<String, Object> resultMap = new HashMap<>();
    context.setResult(Collections.singletonList(resultMap));
    context.setCompleted();
  }

  @On(event = CqnService.EVENT_DELETE, entity = Assignments_.CDS_NAME)
  public synchronized void deleteAssignment(final CdsDeleteEventContext context) {

    Map<String, Object> keys = eventContextKeysExtractor.getDeleteEventContextKeys(context);
    String assignmentIdUserInput = keys.get(Assignments.ID).toString();

    CdsDeleteEventContext deleteContext = CdsDeleteEventContext.create(assignmentservice.Assignments_.CDS_NAME);
    CqnDelete deleteAssignment = Delete.from(assignmentservice.Assignments_.CDS_NAME)
        .where(b -> b.get(assignmentservice.Assignments.ID).eq(assignmentIdUserInput));

    deleteContext.setCqn(deleteAssignment);
    deleteContext.setCqnValueSets(context.getCqnValueSets());

    // Would behave exactly as a delete triggered from request object page
    assignmentService.emit(deleteContext);

    // Setting a result is necessary else there is an exception in CAP
    Map<String, Object> resultMap = new HashMap<>();
    context.setResult(Collections.singletonList(resultMap));
    context.setCompleted();
  }

  @On(event = CqnService.EVENT_CREATE, entity = DailyAssignmentDistribution_.CDS_NAME)
  public synchronized void createDailyAssignment(final CdsCreateEventContext context,
      final DailyAssignmentDistribution dailyAssignmentDistribution) {

    String assignmentIdUserInput = dailyAssignmentDistribution.getAssignmentID();
    LocalDate dateUserInput = dailyAssignmentDistribution.getDate();
    int bookedCapacityUserInput = dailyAssignmentDistribution.getBookedCapacity().intValue();

    if (bookedCapacityUserInput <= 0) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.REQUESTED_DURATION_INVALID);
    }

    validator.validateAssignmentExists(assignmentIdUserInput);
    validator.getMessages().throwIfError();

    assignmentservice.Assignments editDraft = getEditDraft(assignmentIdUserInput, context.getUserInfo().getName(),
        context.getMessages());

    LocalDate[] requestDates = getRequestStartAndEndDates(editDraft.getResourceRequestId());
    LocalDate bucketDate = dailyAssignmentDistribution.getDate();
    checkBucketDateLiesWithinRequestPeriod(bucketDate, requestDates);

    int resourceBookingGranularityInMins = getResourceBookingGranularityInMinutes(editDraft.getResourceId());
    int bookedCapacityInMinsFromPayload = hoursToMinutes(bookedCapacityUserInput);
    checkResourceBookingGranularity(bookedCapacityInMinsFromPayload, resourceBookingGranularityInMins);

    AssignmentBuckets newBucket = AssignmentBuckets.create();
    newBucket.setAssignmentId(assignmentIdUserInput);
    newBucket.setStartTime(dateUserInput.atStartOfDay().toInstant(ZoneOffset.UTC));
    newBucket.setBookedCapacityInMinutes(hoursToMinutes(bookedCapacityUserInput));

    Instant startTime = dailyAssignmentDistribution.getDate().atStartOfDay().toInstant(ZoneOffset.UTC);

    Optional<com.sap.resourcemanagement.assignment.AssignmentBuckets> existingBucketOptional = dataProvider
        .getSingleAssignmentBucketByAssignmentAndTime(assignmentIdUserInput, startTime);

    if (existingBucketOptional.isPresent()) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.BUCKET_EXISTS_FOR_ASSIGNMENT_AT_THIS_TIME,
          dateUserInput);
    }

    Optional<AssignmentBuckets> bucketDraftOptional = draftUtility.createNewBucketDraft(newBucket);

    Map<String, Object> resultMap = new HashMap<>();
    if (bucketDraftOptional.isPresent()) {

      String createdBucketId = bucketDraftOptional.get().getId();

      resultMap.put(DailyAssignmentDistribution.ID, createdBucketId);
      resultMap.put(DailyAssignmentDistribution.ASSIGNMENT_ID, bucketDraftOptional.get().getAssignmentId());
      resultMap.put(DailyAssignmentDistribution.BOOKED_CAPACITY,
          minutesToHours(bucketDraftOptional.get().getBookedCapacityInMinutes()));

      Instant createdBucketStartTime = bucketDraftOptional.get().getStartTime();
      LocalDate createdBucketDate = createdBucketStartTime.atZone(ZoneOffset.UTC).toLocalDate();

      String calendarYearString = String.valueOf(createdBucketDate.getYear());

      resultMap.put(DailyAssignmentDistribution.DATE, createdBucketDate.toString());
      resultMap.put(DailyAssignmentDistribution.CALENDAR_MONTH,
          getCalendarMonth(calendarYearString, createdBucketDate));
      resultMap.put(DailyAssignmentDistribution.CALENDAR_WEEK, getCalendarWeek(calendarYearString, createdBucketDate));
      resultMap.put(DailyAssignmentDistribution.CALENDAR_YEAR, calendarYearString);
    } else {
      LOGGER.warn(ASSIGNMENT_PUBLIC_API_MARKER, "Daily bucket could not be created for {}", newBucket);
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENTBUCKET_NOT_CREATED,
          assignmentIdUserInput, dateUserInput);
    }

    draftUtility.updateBookedCapacityInHeader(assignmentIdUserInput);
    draftsValidator.validate(editDraft.getId()).throwIfError();

    setEditDraft(assignmentIdUserInput);
    draftUtility.activateEditDraft(assignmentIdUserInput);

    context.setResult(Collections.singletonList(resultMap));
    context.setCompleted();
  }

  @On(event = CqnService.EVENT_UPDATE, entity = DailyAssignmentDistribution_.CDS_NAME)
  public synchronized void updateDailyAssignment(final CdsUpdateEventContext context,
      final DailyAssignmentDistribution dailyAssignmentDistribution) {

    String dailyAssignmentDistributionIdUserInput = dailyAssignmentDistribution.getId();
    String assignmentIdUserInput = dailyAssignmentDistribution.getAssignmentID();
    int bookedCapacityUserInput = dailyAssignmentDistribution.getBookedCapacity().intValue();

    if (bookedCapacityUserInput <= 0) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.REQUESTED_DURATION_INVALID);
    }

    Optional<com.sap.resourcemanagement.assignment.AssignmentBuckets> existingBucketOptional = dataProvider
        .getSingleAssignmentBucket(dailyAssignmentDistributionIdUserInput);
    if (!existingBucketOptional.isPresent()) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENTBUCKET_NOT_FOUND,
          dailyAssignmentDistributionIdUserInput);
    }

    assignmentservice.Assignments editDraft = getEditDraft(assignmentIdUserInput, context.getUserInfo().getName(),
        context.getMessages());

    draftUtility.updateAssignmentBucketDraft(dailyAssignmentDistributionIdUserInput, bookedCapacityUserInput);
    draftUtility.updateBookedCapacityInHeader(assignmentIdUserInput);

    draftsValidator.validate(assignmentIdUserInput).throwIfError();

    setEditDraft(assignmentIdUserInput);
    draftUtility.activateEditDraft(editDraft.getId());

    Map<String, Object> resultMap = new HashMap<>();
    context.setResult(Collections.singletonList(resultMap));
    context.setCompleted();
  }

  @On(event = CqnService.EVENT_DELETE, entity = DailyAssignmentDistribution_.CDS_NAME)
  public synchronized void deleteDailyAssignment(final CdsDeleteEventContext context) {

    /*
     * Need to use CqnAnalyzer here as the dailyAssignmentDistribution object is
     * null in case of delete in @on handler
     */
    Map<String, Object> keys = eventContextKeysExtractor.getDeleteEventContextKeys(context);

    String dailyAssignmentDistributionIdUserInput = keys.get(DailyAssignmentDistribution.ID).toString();

    Optional<com.sap.resourcemanagement.assignment.AssignmentBuckets> bucketOptional = dataProvider
        .getSingleAssignmentBucket(dailyAssignmentDistributionIdUserInput);

    if (bucketOptional.isPresent()) {
      String assignmentId = bucketOptional.get().getAssignmentId();

      assignmentservice.Assignments editDraft = getEditDraft(assignmentId, context.getUserInfo().getName(),
          context.getMessages());

      draftUtility.cancelDraft(dailyAssignmentDistributionIdUserInput);
      draftUtility.updateBookedCapacityInHeader(assignmentId);

      draftsValidator.validate(editDraft.getId()).throwIfError();

      setEditDraft(assignmentId);
      draftUtility.activateEditDraft(assignmentId);
    }

    Map<String, Object> resultMap = new HashMap<>();
    context.setResult(Collections.singletonList(resultMap));
    context.setCompleted();
  }

  @On(event = CqnService.EVENT_CREATE, entity = WeeklyAssignmentDistribution_.CDS_NAME)
  public synchronized void createWeeklyDistributionForAssignment(final CdsCreateEventContext context,
      WeeklyAssignmentDistribution weeklyAssignmentDistributionPayload) {

    String assignmentId = weeklyAssignmentDistributionPayload.getAssignmentID();
    String calendarWeek = weeklyAssignmentDistributionPayload.getCalendarWeek();

    int bookedCapacityUserInput = weeklyAssignmentDistributionPayload.getBookedCapacity();
    if (bookedCapacityUserInput <= 0) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.REQUESTED_DURATION_INVALID);
    }

    validator.validateAssignmentExists(assignmentId);
    validator.getMessages().throwIfError();

    Optional<WeeklyAssignmentDistribution> existingWeeklyDistribution = dataProvider.getWeeklyDistribution(assignmentId,
        calendarWeek);
    if (existingWeeklyDistribution.isPresent()) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENT_EXISTS_FOR_WEEK, assignmentId,
          calendarWeek);
    }

    assignmentservice.Assignments editDraft = getEditDraft(assignmentId, context.getUserInfo().getName(),
        context.getMessages());

    validator.validateResourceBookingGranularity(editDraft.getResourceId(), hoursToMinutes(bookedCapacityUserInput));
    validator.getMessages().throwIfError();

    LocalDate[] weekDates = { dataProvider.getTimeDimensionDataForCalendarWeekStart(calendarWeek).getDateSql(),
        dataProvider.getTimeDimensionDataForCalendarWeekEnd(calendarWeek).getDateSql() };
    LocalDate[] requestDates = getRequestStartAndEndDates(editDraft.getResourceRequestId());

    checkDistributionPeriodIntersectsWithRequestPeriod(weekDates, requestDates);

    LocalDate[] assignmentWeekDates = getAssignmentDatesAdjustedByRequestDates(weekDates, requestDates);

    List<AssignmentBuckets> newAssignmentBucketsList = draftUtility.getSimulatedAssignmentBucketsDrafts(assignmentId,
        editDraft.getResourceId(), assignmentWeekDates[START], assignmentWeekDates[END], bookedCapacityUserInput);

    draftUtility.createNewBucketDrafts(newAssignmentBucketsList);
    draftUtility.updateBookedCapacityInHeader(assignmentId);

    draftsValidator.validate(editDraft.getId()).throwIfError();

    setEditDraft(assignmentId);
    draftUtility.activateEditDraft(assignmentId);

    Map<String, Object> resultMap = new HashMap<>();
    resultMap.put(WeeklyAssignmentDistribution.ASSIGNMENT_ID, assignmentId);
    resultMap.put(WeeklyAssignmentDistribution.CALENDAR_WEEK, calendarWeek);
    resultMap.put(WeeklyAssignmentDistribution.BOOKED_CAPACITY, bookedCapacityUserInput);
    resultMap.put(WeeklyAssignmentDistribution.WEEK_START_DATE, weekDates[START]);
    resultMap.put(WeeklyAssignmentDistribution.WEEK_END_DATE, weekDates[END]);

    context.setResult(Collections.singletonList(resultMap));
    context.setCompleted();
  }

  @On(event = CqnService.EVENT_UPDATE, entity = WeeklyAssignmentDistribution_.CDS_NAME)
  public synchronized void updateWeeklyDistributionForAssignment(final CdsUpdateEventContext context,
      WeeklyAssignmentDistribution weeklyAssignmentDistributionPayload) {

    String assignmentId = weeklyAssignmentDistributionPayload.getAssignmentID();
    String calendarWeek = weeklyAssignmentDistributionPayload.getCalendarWeek();

    /*
     * This query serves two purposes. First we expect that for update case there is
     * an existing assignment for that week, if not then we raise an exception.
     * Second, we already get the week start and end date as part of the record and
     * do not have to calculate it
     */
    Optional<WeeklyAssignmentDistribution> existingWeeklyDistribution = dataProvider.getWeeklyDistribution(assignmentId,
        calendarWeek);

    if (existingWeeklyDistribution.isPresent()) {

      assignmentservice.Assignments editDraft = getEditDraft(assignmentId, context.getUserInfo().getName(),
          context.getMessages());

      LocalDate[] weekDates = { existingWeeklyDistribution.get().getWeekStartDate(),
          existingWeeklyDistribution.get().getWeekEndDate() };
      LocalDate[] requestDates = getRequestStartAndEndDates(editDraft.getResourceRequestId());
      LocalDate[] assignmentWeekDates = getAssignmentDatesAdjustedByRequestDates(weekDates, requestDates);

      int bookedCapacityUserInput = weeklyAssignmentDistributionPayload.getBookedCapacity();
      if (bookedCapacityUserInput <= 0) {
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.REQUESTED_DURATION_INVALID);
      }

      int resourceBookingGranularityInMins = getResourceBookingGranularityInMinutes(editDraft.getResourceId());
      checkResourceBookingGranularity(hoursToMinutes(bookedCapacityUserInput), resourceBookingGranularityInMins);

      List<AssignmentBuckets> existingAssignmentBucketDraftList = draftUtility
          .getExistingAssignmentBucketsDrafts(assignmentId, weekDates[START], weekDates[END]);
      List<AssignmentBuckets> newAssignmentBucketDraftList = draftUtility.getSimulatedAssignmentBucketsDrafts(
          assignmentId, editDraft.getResourceId(), assignmentWeekDates[START], assignmentWeekDates[END],
          bookedCapacityUserInput);

      draftUtility.updateAssignmentBucketsDrafts(existingAssignmentBucketDraftList, newAssignmentBucketDraftList);
      draftUtility.updateBookedCapacityInHeader(assignmentId);

      draftsValidator.validate(editDraft.getId()).throwIfError();

      setEditDraft(assignmentId);
      draftUtility.activateEditDraft(assignmentId);

      Map<String, Object> resultMap = new HashMap<>();
      context.setResult(Collections.singletonList(resultMap));
      context.setCompleted();

    } else {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENT_NOT_FOUND_FOR_WEEK, assignmentId,
          calendarWeek);
    }

  }

  @On(event = CqnService.EVENT_DELETE, entity = WeeklyAssignmentDistribution_.CDS_NAME)
  public synchronized void deleteWeeklyDistributionForAssignment(final CdsDeleteEventContext context) {

    Map<String, Object> keys = eventContextKeysExtractor.getDeleteEventContextKeys(context);

    String assignmentId = keys.get(WeeklyAssignmentDistribution.ASSIGNMENT_ID).toString();
    String calendarWeek = keys.get(WeeklyAssignmentDistribution.CALENDAR_WEEK).toString();

    assignmentservice.Assignments editDraft = getEditDraft(assignmentId, context.getUserInfo().getName(),
        context.getMessages());

    Optional<WeeklyAssignmentDistribution> existingWeeklyDistribution = dataProvider
        .getWeeklyDistribution(editDraft.getId(), calendarWeek);

    if (existingWeeklyDistribution.isPresent()) {
      Instant bucketDeleteStartInstant = existingWeeklyDistribution.get().getWeekStartDate().atStartOfDay()
          .toInstant(ZoneOffset.UTC);
      Instant bucketDeleteEndInstant = existingWeeklyDistribution.get().getWeekEndDate().atStartOfDay()
          .toInstant(ZoneOffset.UTC);

      deleteBucketDrafts(editDraft.getId(), bucketDeleteStartInstant, bucketDeleteEndInstant);
    }
    Map<String, Object> resultMap = new HashMap<>();
    context.setResult(Collections.singletonList(resultMap));
    context.setCompleted();

  }

  @On(event = CqnService.EVENT_CREATE, entity = MonthlyAssignmentDistribution_.CDS_NAME)
  public synchronized void createMonthlyDistributionForAssignment(final CdsCreateEventContext context,
      MonthlyAssignmentDistribution monthlyAssignmentDistributionPayload) {

    String assignmentId = monthlyAssignmentDistributionPayload.getAssignmentID();
    String calendarMonth = monthlyAssignmentDistributionPayload.getCalendarMonth();

    validator.validateAssignmentExists(assignmentId);
    validator.getMessages().throwIfError();

    Optional<MonthlyAssignmentDistribution> existingMonthlyDistribution = dataProvider
        .getMonthlyDistribution(assignmentId, calendarMonth);
    if (existingMonthlyDistribution.isPresent()) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENT_EXISTS_FOR_MONTH, assignmentId,
          calendarMonth);
    }

    int bookedCapacityUserInput = monthlyAssignmentDistributionPayload.getBookedCapacity();
    if (bookedCapacityUserInput <= 0) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.REQUESTED_DURATION_INVALID);
    }

    assignmentservice.Assignments editDraft = getEditDraft(assignmentId, context.getUserInfo().getName(),
        context.getMessages());

    int resourceBookingGranularityInMins = getResourceBookingGranularityInMinutes(editDraft.getResourceId());
    checkResourceBookingGranularity(hoursToMinutes(bookedCapacityUserInput), resourceBookingGranularityInMins);

    LocalDate[] monthStartAndEnd = getStartAndEndDateForCalendarMonth(calendarMonth);
    LocalDate[] requestDates = getRequestStartAndEndDates(editDraft.getResourceRequestId());

    checkDistributionPeriodIntersectsWithRequestPeriod(monthStartAndEnd, requestDates);

    LocalDate[] assignmentMonthDates = getAssignmentDatesAdjustedByRequestDates(monthStartAndEnd, requestDates);

    List<AssignmentBuckets> newAssignmentBucketDraftList = draftUtility.getSimulatedAssignmentBucketsDrafts(
        assignmentId, editDraft.getResourceId(), assignmentMonthDates[START], assignmentMonthDates[END],
        bookedCapacityUserInput);

    draftUtility.createNewBucketDrafts(newAssignmentBucketDraftList);

    draftUtility.updateBookedCapacityInHeader(assignmentId);
    draftsValidator.validate(editDraft.getId()).throwIfError();

    setEditDraft(assignmentId);
    draftUtility.activateEditDraft(assignmentId);

    Map<String, Object> resultMap = new HashMap<>();
    resultMap.put(MonthlyAssignmentDistribution.ASSIGNMENT_ID, assignmentId);
    resultMap.put(MonthlyAssignmentDistribution.CALENDAR_MONTH, calendarMonth);
    resultMap.put(MonthlyAssignmentDistribution.BOOKED_CAPACITY, bookedCapacityUserInput);
    resultMap.put(MonthlyAssignmentDistribution.MONTH_START_DATE, monthStartAndEnd[START]);
    resultMap.put(MonthlyAssignmentDistribution.MONTH_END_DATE, monthStartAndEnd[END]);

    context.setResult(Collections.singletonList(resultMap));
    context.setCompleted();

  }

  @On(event = CqnService.EVENT_UPDATE, entity = MonthlyAssignmentDistribution_.CDS_NAME)
  public synchronized void updateMonthlyDistributionForAssignment(final CdsUpdateEventContext context,
      MonthlyAssignmentDistribution monthlyAssignmentDistributionPayload) {

    String assignmentId = monthlyAssignmentDistributionPayload.getAssignmentID();
    String calendarMonth = monthlyAssignmentDistributionPayload.getCalendarMonth();

    /*
     * This query serves two purposes. First we expect that for update case there is
     * an existing assignment for that month, if not then we raise an exception.
     * Second, we already get the month start and end date as part of the record and
     * do not have to calculate it
     */
    Optional<MonthlyAssignmentDistribution> existingMonthlyDistribution = dataProvider
        .getMonthlyDistribution(assignmentId, calendarMonth);

    if (existingMonthlyDistribution.isPresent()) {

      assignmentservice.Assignments editDraft = getEditDraft(assignmentId, context.getUserInfo().getName(),
          context.getMessages());

      int bookedCapacityUserInput = monthlyAssignmentDistributionPayload.getBookedCapacity();
      if (bookedCapacityUserInput <= 0) {
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.REQUESTED_DURATION_INVALID);
      }

      int resourceBookingGranularityInMins = getResourceBookingGranularityInMinutes(editDraft.getResourceId());
      checkResourceBookingGranularity(hoursToMinutes(bookedCapacityUserInput), resourceBookingGranularityInMins);

      LocalDate[] monthStartAndEnd = { existingMonthlyDistribution.get().getMonthStartDate(),
          existingMonthlyDistribution.get().getMonthEndDate() };
      LocalDate[] requestDates = getRequestStartAndEndDates(editDraft.getResourceRequestId());
      LocalDate[] assignmentDates = getAssignmentDatesAdjustedByRequestDates(monthStartAndEnd, requestDates);

      List<AssignmentBuckets> existingAssignmentBucketDraftList = draftUtility
          .getExistingAssignmentBucketsDrafts(assignmentId, monthStartAndEnd[START], monthStartAndEnd[END]);
      List<AssignmentBuckets> newAssignmentBucketDraftList = draftUtility.getSimulatedAssignmentBucketsDrafts(
          assignmentId, editDraft.getResourceId(), assignmentDates[START], assignmentDates[END],
          bookedCapacityUserInput);

      draftUtility.updateAssignmentBucketsDrafts(existingAssignmentBucketDraftList, newAssignmentBucketDraftList);
      draftUtility.updateBookedCapacityInHeader(assignmentId);
      draftsValidator.validate(editDraft.getId()).throwIfError();

      setEditDraft(assignmentId);
      draftUtility.activateEditDraft(assignmentId);

      Map<String, Object> resultMap = new HashMap<>();
      context.setResult(Collections.singletonList(resultMap));
      context.setCompleted();

    } else {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENT_NOT_FOUND_FOR_MONTH, assignmentId,
          calendarMonth);
    }

  }

  @On(event = CqnService.EVENT_DELETE, entity = MonthlyAssignmentDistribution_.CDS_NAME)
  public synchronized void deleteMonthlyDistributionForAssignment(final CdsDeleteEventContext context) {

    Map<String, Object> keys = eventContextKeysExtractor.getDeleteEventContextKeys(context);

    String assignmentId = keys.get(MonthlyAssignmentDistribution.ASSIGNMENT_ID).toString();
    String calendarMonth = keys.get(MonthlyAssignmentDistribution.CALENDAR_MONTH).toString();

    assignmentservice.Assignments editDraft = getEditDraft(assignmentId, context.getUserInfo().getName(),
        context.getMessages());

    Optional<MonthlyAssignmentDistribution> existingMonthlyDistribution = dataProvider
        .getMonthlyDistribution(editDraft.getId(), calendarMonth);

    if (existingMonthlyDistribution.isPresent()) {
      Instant bucketDeleteStartInstant = existingMonthlyDistribution.get().getMonthStartDate().atStartOfDay()
          .toInstant(ZoneOffset.UTC);
      Instant bucketDeleteEndInstant = existingMonthlyDistribution.get().getMonthEndDate().atStartOfDay()
          .toInstant(ZoneOffset.UTC);

      deleteBucketDrafts(editDraft.getId(), bucketDeleteStartInstant, bucketDeleteEndInstant);
    }

    Map<String, Object> resultMap = new HashMap<>();
    context.setResult(Collections.singletonList(resultMap));
    context.setCompleted();
  }

  private void deleteBucketDrafts(String assignmentId, Instant from, Instant to) {
    draftUtility.deleteBucketDrafts(assignmentId, from, to);
    draftUtility.updateBookedCapacityInHeader(assignmentId);
    draftsValidator.validate(assignmentId).throwIfError();

    setEditDraft(assignmentId);
    draftUtility.activateEditDraft(assignmentId);
  }

  private void populateAssignmentDraftsAndResultMapForProvidedDailyDistribution(Assignments assignment,
      assignmentservice.Assignments newAssignmentDraft, Map<String, Object> resultMap, LocalDate[] requestDates,
      int resourceBookingGranularityInMins) {

    int totalBookedCapacityInMinutes = 0;
    List<AssignmentBuckets> newAssignmentBucketDraftList = new ArrayList<>();
    List<DailyAssignmentDistribution> dailyAssignmentDistributionResultList = new ArrayList<>();
    for (DailyAssignmentDistribution dailyAssignmentDistributionRecord : assignment.getDailyAssignmentDistribution()) {

      int bookedCapacityInMinsFromPayload = hoursToMinutes(
          dailyAssignmentDistributionRecord.getBookedCapacity().intValue());

      if (bookedCapacityInMinsFromPayload < 0) {
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.REQUESTED_DURATION_INVALID);
      }
      if (bookedCapacityInMinsFromPayload == 0) {
        continue;
      }
      checkResourceBookingGranularity(bookedCapacityInMinsFromPayload, resourceBookingGranularityInMins);

      LocalDate bucketDate = dailyAssignmentDistributionRecord.getDate();
      checkBucketDateLiesWithinRequestPeriod(bucketDate, requestDates);

      AssignmentBuckets bucket = AssignmentBuckets.create();
      bucket.setId(UUID.randomUUID().toString());
      bucket.setAssignmentId(newAssignmentDraft.getId());
      bucket.setStartTime(bucketDate.atStartOfDay().toInstant(ZoneOffset.UTC));
      bucket.setBookedCapacityInMinutes(bookedCapacityInMinsFromPayload);
      newAssignmentBucketDraftList.add(bucket);

      totalBookedCapacityInMinutes += bookedCapacityInMinsFromPayload;

      DailyAssignmentDistribution dailyAssignmentDistributionResult = DailyAssignmentDistribution.create();
      dailyAssignmentDistributionResult.setId(bucket.getId());
      dailyAssignmentDistributionResult.setAssignmentID(bucket.getAssignmentId());
      dailyAssignmentDistributionResult.setBookedCapacity(dailyAssignmentDistributionRecord.getBookedCapacity());
      dailyAssignmentDistributionResult.setDate(dailyAssignmentDistributionRecord.getDate());
      dailyAssignmentDistributionResult.setCalendarMonth(Integer.toString(bucketDate.getMonthValue()));
      dailyAssignmentDistributionResult.setCalendarWeek(Integer.toString(bucketDate.get(WeekFields.ISO.weekOfYear())));
      dailyAssignmentDistributionResult.setCalendarYear(Integer.toString(bucketDate.getYear()));
      dailyAssignmentDistributionResultList.add(dailyAssignmentDistributionResult);
    }
    if (totalBookedCapacityInMinutes == 0) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NON_ZERO_DAILY_DISTRIBUTION);
    }
    resultMap.put(Assignments.DAILY_ASSIGNMENT_DISTRIBUTION, dailyAssignmentDistributionResultList);
    newAssignmentDraft.setAssignmentBuckets(newAssignmentBucketDraftList);
    newAssignmentDraft.setBookedCapacityInMinutes(totalBookedCapacityInMinutes);
  }

  private void populateAssignmentDraftsAndResultMapForProvidedWeeklyDistribution(Assignments assignment,
      assignmentservice.Assignments newAssignmentDraft, Map<String, Object> resultMap, LocalDate[] requestDates,
      int resourceBookingGranularityInMins) {

    int totalBookedCapacityInMinutes = 0;
    String assignmentId = newAssignmentDraft.getId();
    String resourceId = newAssignmentDraft.getResourceId();

    List<AssignmentBuckets> newAssignmentBucketDraftList = new ArrayList<>();
    List<WeeklyAssignmentDistribution> weeklyAssignmentDistributionResultList = new ArrayList<>();

    for (WeeklyAssignmentDistribution weeklyAssignmentDistributionRecord : assignment
        .getWeeklyAssignmentDistribution()) {

      int bookedCapacityInMinsFromPayload = hoursToMinutes(
          weeklyAssignmentDistributionRecord.getBookedCapacity().intValue());
      if (bookedCapacityInMinsFromPayload < 0) {
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.REQUESTED_DURATION_INVALID);
      }
      if (bookedCapacityInMinsFromPayload == 0) {
        continue;
      }
      checkResourceBookingGranularity(bookedCapacityInMinsFromPayload, resourceBookingGranularityInMins);

      String calendarWeek = weeklyAssignmentDistributionRecord.getCalendarWeek();
      LocalDate[] weekDates = { dataProvider.getTimeDimensionDataForCalendarWeekStart(calendarWeek).getDateSql(),
          dataProvider.getTimeDimensionDataForCalendarWeekEnd(calendarWeek).getDateSql() };
      checkDistributionPeriodIntersectsWithRequestPeriod(weekDates, requestDates);

      // Request start/end may fall in the middle of week -> adjust assignment dates
      LocalDate[] assignmentWeekDates = getAssignmentDatesAdjustedByRequestDates(weekDates, requestDates);

      newAssignmentBucketDraftList
          .addAll(draftUtility.getSimulatedAssignmentBucketsDrafts(assignmentId, resourceId, assignmentWeekDates[START],
              assignmentWeekDates[END], weeklyAssignmentDistributionRecord.getBookedCapacity()));

      totalBookedCapacityInMinutes += bookedCapacityInMinsFromPayload;

      WeeklyAssignmentDistribution weeklyAssignmentDistributionResult = WeeklyAssignmentDistribution.create();

      weeklyAssignmentDistributionResult.setAssignmentID(assignmentId);
      weeklyAssignmentDistributionResult.setBookedCapacity(weeklyAssignmentDistributionRecord.getBookedCapacity());
      weeklyAssignmentDistributionResult.setCalendarWeek(weeklyAssignmentDistributionRecord.getCalendarWeek());
      weeklyAssignmentDistributionResult.setWeekStartDate(weekDates[START]);
      weeklyAssignmentDistributionResult.setWeekEndDate(weekDates[END]);

      weeklyAssignmentDistributionResultList.add(weeklyAssignmentDistributionResult);
    }
    if (totalBookedCapacityInMinutes == 0) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NON_ZERO_WEEKLY_DISTRIBUTION);
    }
    resultMap.put(Assignments.WEEKLY_ASSIGNMENT_DISTRIBUTION, weeklyAssignmentDistributionResultList);
    newAssignmentDraft.setAssignmentBuckets(newAssignmentBucketDraftList);
    newAssignmentDraft.setBookedCapacityInMinutes(totalBookedCapacityInMinutes);
  }

  private void populateAssignmentDraftsAndResultMapForProvidedMonthlyDistribution(Assignments assignment,
      assignmentservice.Assignments newAssignmentDraft, Map<String, Object> resultMap, LocalDate[] requestDates,
      int resourceBookingGranularityInMins) {

    int totalBookedCapacityInMinutes = 0;
    String assignmentId = newAssignmentDraft.getId();
    String resourceId = newAssignmentDraft.getResourceId();
    List<AssignmentBuckets> newAssignmentBucketDraftList = new ArrayList<>();
    List<MonthlyAssignmentDistribution> monthlyAssignmentDistributionResultList = new ArrayList<>();

    for (MonthlyAssignmentDistribution monthlyAssignmentDistributionPayloadRecord : assignment
        .getMonthlyAssignmentDistribution()) {

      int bookedCapacityInMinsFromPayload = hoursToMinutes(
          monthlyAssignmentDistributionPayloadRecord.getBookedCapacity().intValue());
      if (bookedCapacityInMinsFromPayload < 0) {
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.REQUESTED_DURATION_INVALID);
      }
      if (bookedCapacityInMinsFromPayload == 0) {
        continue;
      }
      checkResourceBookingGranularity(bookedCapacityInMinsFromPayload, resourceBookingGranularityInMins);

      LocalDate[] monthStartAndEnd = getStartAndEndDateForCalendarMonth(
          monthlyAssignmentDistributionPayloadRecord.getCalendarMonth());

      checkDistributionPeriodIntersectsWithRequestPeriod(monthStartAndEnd, requestDates);

      // Request start/end may fall in the middle of month -> adjust assignment dates
      LocalDate[] assignmentMonthDates = getAssignmentDatesAdjustedByRequestDates(monthStartAndEnd, requestDates);

      newAssignmentBucketDraftList.addAll(
          draftUtility.getSimulatedAssignmentBucketsDrafts(assignmentId, resourceId, assignmentMonthDates[START],
              assignmentMonthDates[END], monthlyAssignmentDistributionPayloadRecord.getBookedCapacity()));

      totalBookedCapacityInMinutes += bookedCapacityInMinsFromPayload;

      MonthlyAssignmentDistribution monthlyAssignmentDistributionResult = MonthlyAssignmentDistribution.create();
      monthlyAssignmentDistributionResult.setAssignmentID(assignmentId);
      monthlyAssignmentDistributionResult
          .setBookedCapacity(monthlyAssignmentDistributionPayloadRecord.getBookedCapacity());
      monthlyAssignmentDistributionResult
          .setCalendarMonth(monthlyAssignmentDistributionPayloadRecord.getCalendarMonth());
      monthlyAssignmentDistributionResult.setMonthStartDate(monthStartAndEnd[START]);
      monthlyAssignmentDistributionResult.setMonthEndDate(monthStartAndEnd[END]);

      monthlyAssignmentDistributionResultList.add(monthlyAssignmentDistributionResult);
    }
    if (totalBookedCapacityInMinutes == 0) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NON_ZERO_MONTHLY_DISTRIBUTION);
    }
    resultMap.put(Assignments.MONTHLY_ASSIGNMENT_DISTRIBUTION, monthlyAssignmentDistributionResultList);
    newAssignmentDraft.setAssignmentBuckets(newAssignmentBucketDraftList);
    newAssignmentDraft.setBookedCapacityInMinutes(totalBookedCapacityInMinutes);
  }

  private void populateExistingBucketsToDeleteAndNewBucketsToCreateFromDailyDistribution(Assignments assignment,
      List<AssignmentBuckets> existingAssignmentBucketDraftList, List<AssignmentBuckets> newAssignmentBucketDraftList,
      LocalDate[] requestDates, int resourceBookingGranularityInMins) {

    // Creating a map for reading data later in an optimal way
    List<AssignmentBuckets> existingAssignmentBucketsDraft = dataProvider
        .getAssignmentBucketsFromDraftService(assignment.getId());
    Map<LocalDate, AssignmentBuckets> existingAssignmentBucketsMap = new HashMap<>(
        existingAssignmentBucketsDraft.size());
    for (AssignmentBuckets existingBucket : existingAssignmentBucketsDraft) {
      existingAssignmentBucketsMap.put(existingBucket.getStartTime().atZone(ZoneId.systemDefault()).toLocalDate(),
          existingBucket);
    }

    for (DailyAssignmentDistribution dailyAssignmentDistributionRecord : assignment.getDailyAssignmentDistribution()) {

      LocalDate bucketDate = dailyAssignmentDistributionRecord.getDate();
      checkBucketDateLiesWithinRequestPeriod(bucketDate, requestDates);

      int bookedCapacityInMinsFromPayload = hoursToMinutes(
          dailyAssignmentDistributionRecord.getBookedCapacity().intValue());
      checkResourceBookingGranularity(bookedCapacityInMinsFromPayload, resourceBookingGranularityInMins);

      if (existingAssignmentBucketsMap.containsKey(bucketDate)) {
        AssignmentBuckets bucketToBeDeleted = existingAssignmentBucketsMap
            .get(dailyAssignmentDistributionRecord.getDate());
        existingAssignmentBucketDraftList.add(bucketToBeDeleted);
      }

      AssignmentBuckets newBucketToBeInserted = AssignmentBuckets.create();
      newBucketToBeInserted.setAssignmentId(assignment.getId());
      newBucketToBeInserted.setStartTime(bucketDate.atStartOfDay().toInstant(ZoneOffset.UTC));
      newBucketToBeInserted.setBookedCapacityInMinutes(bookedCapacityInMinsFromPayload);

      newAssignmentBucketDraftList.add(newBucketToBeInserted);
    }
  }

  private void populateExistingBucketsToDeleteAndNewBucketsToCreateFromWeeklyDistribution(Assignments assignment,
      List<AssignmentBuckets> existingAssignmentBucketDraftList, List<AssignmentBuckets> newAssignmentBucketDraftList,
      LocalDate[] requestDates, int resourceBookingGranularityInMins, String resourceId) {
    for (WeeklyAssignmentDistribution weeklyDistributionRecord : assignment.getWeeklyAssignmentDistribution()) {

      int bookedCapacityInMinsFromPayload = hoursToMinutes(weeklyDistributionRecord.getBookedCapacity().intValue());
      checkResourceBookingGranularity(bookedCapacityInMinsFromPayload, resourceBookingGranularityInMins);

      String calendarWeek = weeklyDistributionRecord.getCalendarWeek();
      LocalDate[] weekDates = { dataProvider.getTimeDimensionDataForCalendarWeekStart(calendarWeek).getDateSql(),
          dataProvider.getTimeDimensionDataForCalendarWeekEnd(calendarWeek).getDateSql() };

      checkDistributionPeriodIntersectsWithRequestPeriod(weekDates, requestDates);

      // Request start/end may fall in the middle of week -> adjust assignment dates
      LocalDate[] assignmentWeekDates = getAssignmentDatesAdjustedByRequestDates(weekDates, requestDates);

      existingAssignmentBucketDraftList.addAll(draftUtility.getExistingAssignmentBucketsDrafts(assignment.getId(),
          assignmentWeekDates[START], assignmentWeekDates[END]));
      newAssignmentBucketDraftList
          .addAll(draftUtility.getSimulatedAssignmentBucketsDrafts(assignment.getId(), resourceId,
              assignmentWeekDates[START], assignmentWeekDates[END], weeklyDistributionRecord.getBookedCapacity()));
    }
  }

  private void populateExistingBucketsToDeleteAndNewBucketsToCreateFromMonthlyDistribution(Assignments assignment,
      List<AssignmentBuckets> existingAssignmentBucketDraftList, List<AssignmentBuckets> newAssignmentBucketDraftList,
      LocalDate[] requestDates, int resourceBookingGranularityInMins, String resourceId) {
    for (MonthlyAssignmentDistribution monthlyDistributionRecord : assignment.getMonthlyAssignmentDistribution()) {

      int bookedCapacityInMins = hoursToMinutes(monthlyDistributionRecord.getBookedCapacity().intValue());
      validator.validateDurationIsMultipleOfGranularity(bookedCapacityInMins, resourceBookingGranularityInMins);
      validator.getMessages().throwIfError();

      String calendarMonth = monthlyDistributionRecord.getCalendarMonth();
      LocalDate[] monthStartAndEnd = getStartAndEndDateForCalendarMonth(calendarMonth);

      checkDistributionPeriodIntersectsWithRequestPeriod(monthStartAndEnd, requestDates);

      // Request start/end may fall in the middle of month -> adjust assignment dates
      LocalDate[] assignmentMonthDates = getAssignmentDatesAdjustedByRequestDates(monthStartAndEnd, requestDates);

      existingAssignmentBucketDraftList.addAll(draftUtility.getExistingAssignmentBucketsDrafts(assignment.getId(),
          assignmentMonthDates[START], assignmentMonthDates[END]));
      newAssignmentBucketDraftList
          .addAll(draftUtility.getSimulatedAssignmentBucketsDrafts(assignment.getId(), resourceId,
              assignmentMonthDates[START], assignmentMonthDates[END], monthlyDistributionRecord.getBookedCapacity()));
    }
  }

  private assignmentservice.Assignments getEditDraft(String assignmentId, String user, Messages message) {
    assignmentservice.Assignments editDraft = draftUtility.getEditDraftForUser(assignmentId, user, message, true, true);
    message.throwIfError();
    if (editDraft == null) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENT_UNAVAILABLE_FOR_EDIT);
    }
    return editDraft;
  }

  private LocalDate[] getRequestStartAndEndDates(String requestId) {
    Optional<ResourceRequests> requestData = dataProvider.getRequestData(requestId);
    if (!requestData.isPresent()) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.REQUEST_NOT_FOUND);
    }
    return new LocalDate[] { requestData.get().getStartDate(), requestData.get().getEndDate() };
  }

  private int getResourceBookingGranularityInMinutes(String resourceId) {
    Optional<Types> resourceBookingGranularityOptional = dataProvider
        .getResourceBookingGranularityInMinutes(resourceId);
    if (!resourceBookingGranularityOptional.isPresent()) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.MISSING_RESOURCE_BOOKING_GRANULARITY);
    }
    return resourceBookingGranularityOptional.get().getBookingGranularityInMinutes();
  }

  private void checkResourceBookingGranularity(int bookedCapacityInMinsFromPayload,
      int resourceBookingGranularityInMins) {
    validator.validateDurationIsMultipleOfGranularity(bookedCapacityInMinsFromPayload,
        resourceBookingGranularityInMins);
    validator.getMessages().throwIfError();
  }

  private void checkDistributionPeriodIntersectsWithRequestPeriod(LocalDate[] distributionPeriod,
      LocalDate[] requestDates) {
    if (!(requestDates[START].compareTo(distributionPeriod[END]) < 1
        && requestDates[END].compareTo(distributionPeriod[START]) > -1)) {
      throw new ServiceException(HttpStatus.BAD_REQUEST,
          "One or more distribution period lies outside the request start {} and end {}", requestDates[START],
          requestDates[END]);
    }
  }

  private void checkBucketDateLiesWithinRequestPeriod(LocalDate bucketDate, LocalDate[] requestDates) {
    if (bucketDate.isBefore(requestDates[START])) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNED_START_BEFORE_REQUEST_START);
    }
    if (bucketDate.isAfter(requestDates[END])) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNED_END_AFTER_REQUEST_END);
    }
  }

  private LocalDate[] getAssignmentDatesAdjustedByRequestDates(LocalDate[] calendarDates, LocalDate[] requestDates) {
    LocalDate asgnStart = calendarDates[START];
    if (asgnStart.isBefore(requestDates[START])) {
      asgnStart = requestDates[START];
    }
    LocalDate asgnEnd = calendarDates[END];
    if (asgnEnd.isAfter(requestDates[END])) {
      asgnEnd = requestDates[END];
    }
    return new LocalDate[] { asgnStart, asgnEnd };
  }

  private void checkAtmostOneDistributionIsProvided(Assignments assignment) {
    if (getNumberOfDistributionTypesProvided(assignment) > 1) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, "More than one distribution found in payload");
    }
  }

  private void checkOnlyOneDistributionIsProvided(Assignments assignment) {
    if (getNumberOfDistributionTypesProvided(assignment) != 1) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, "Please provide one assignment distribution");
    }
  }

  private int getNumberOfDistributionTypesProvided(Assignments assignment) {

    return (isDailyDistributionProvidedInPayload(assignment) ? 1 : 0)
        + (isWeeklyDistributionProvidedInPayload(assignment) ? 1 : 0)
        + (isMonthlyDistributionProvidedInPayload(assignment) ? 1 : 0);
  }

  private boolean isDailyDistributionProvidedInPayload(Assignments assignment) {
    return !(assignment.getDailyAssignmentDistribution() == null
        || assignment.getDailyAssignmentDistribution().isEmpty());
  }

  private boolean isWeeklyDistributionProvidedInPayload(Assignments assignment) {
    return !(assignment.getWeeklyAssignmentDistribution() == null
        || assignment.getWeeklyAssignmentDistribution().isEmpty());
  }

  private boolean isMonthlyDistributionProvidedInPayload(Assignments assignment) {
    return !(assignment.getMonthlyAssignmentDistribution() == null
        || assignment.getMonthlyAssignmentDistribution().isEmpty());
  }

  private String getCalendarMonth(String calendarYear, LocalDate date) {

    // Returns 1, 2 ... 12
    int monthNumber = date.getMonthValue();
    // But we need 01, 02 ... 12
    String twoCharacterMonth = getTwoCharacterString(monthNumber);
    return calendarYear + twoCharacterMonth;
  }

  private String getCalendarWeek(String calendarYear, LocalDate date) {

    // returns 1, 2, ... 52
    int weekNumber = date.get(WeekFields.ISO.weekOfYear());
    // we need 01, 02, ... 52
    String twoCharacterWeek = getTwoCharacterString(weekNumber);
    return calendarYear + twoCharacterWeek;
  }

  private String getTwoCharacterString(int number) {
    return String.valueOf(100 + number).substring(1);
  }

}