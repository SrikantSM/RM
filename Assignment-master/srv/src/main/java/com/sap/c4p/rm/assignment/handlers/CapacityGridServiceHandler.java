package com.sap.c4p.rm.assignment.handlers;

import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.addTarget;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.getNumberStateForUtilizationValue;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.minutesToHours;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.raiseExceptionIfError;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.raiseExceptionIfErrorWithTarget;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnContainmentTest;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnPredicate;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnVisitor;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

import com.sap.c4p.rm.assignment.config.LoggingMarker;
import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.AssignmentDraftsUtility;
import com.sap.c4p.rm.assignment.utils.AssignmentSimulationUtility;
import com.sap.c4p.rm.assignment.utils.CapacityGridAssignmentsUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;
import com.sap.c4p.rm.assignment.utils.EventContextKeysExtractor;
import com.sap.c4p.rm.assignment.utils.HttpStatus;
import com.sap.c4p.rm.assignment.validation.AssignmentDraftsValidator;
import com.sap.c4p.rm.assignment.validation.AssignmentValidator;

import com.sap.resourcemanagement.capacitygrid.CapacityGridHeaderKPITemporal;
import com.sap.resourcemanagement.capacitygridassignment.ResourceRequestAssignmentAggregate;
import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.ResourceDetailsForTimeWindow;
import com.sap.resourcemanagement.resource.Types;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.ResourceRequestDetails;
import com.sap.resourcemanagement.workforce.workassignment.ExtnWorkAssignmentFirstJobDetails;

import assignmentservice.AssignmentBuckets;
import assignmentservice.AssignmentService_;
import assignmentservice.Assignments;
import capacityservice.AssignmentBucketsPerDay;
import capacityservice.AssignmentBucketsPerDay_;
import capacityservice.AssignmentBucketsYearMonthAggregate;
import capacityservice.AssignmentBucketsYearMonthAggregate_;
import capacityservice.AssignmentBucketsYearWeekAggregate;
import capacityservice.AssignmentBucketsYearWeekAggregate_;
import capacityservice.AssignmentsDetailsForCapacityGrid;
import capacityservice.AssignmentsDetailsForCapacityGrid_;
import capacityservice.AverageResourceUtilizationFor12WeeksTileResponse;
import capacityservice.CapacityGridHeaderKPITemporal_;
import capacityservice.CapacityService_;

@Component
@ServiceName(CapacityService_.CDS_NAME)
public class CapacityGridServiceHandler implements EventHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(CapacityGridServiceHandler.class);
  private static final Marker CAPACITY_GRID_MARKER = LoggingMarker.CAPACITY_GRID_MARKER.getMarker();
  private static final String ID = "004808d7-9643-4f8d-8bc5-a9b49bbb0a7b";
  private static final String PROCESSING_RESOURCE_ORGANIZATION = "ProcessingResourceOrganization";
  private static final Marker SIMULATION_MARKER = LoggingMarker.SIMULATION_MARKER.getMarker();
  private PersistenceService persistenceService;
  private CdsRuntime cdsRuntime;
  Result capacityGridHeaderRecords;
  Instant validFrom;
  Instant validTo;
  List<String> deliveryOrgCodeList = null;
  List<CapacityRequirements> requestCapacityRequirementList;
  List<Capacity> resourceCapacityList;

  List<Map<String, Object>> resultMapList;
  private CapacityGridAssignmentsUtility capacityGridAssignmentsUtility;
  private DataProvider dataProvider;
  private Messages messages;
  private AssignmentValidator validator;
  private AssignmentSimulationUtility utility;
  private DraftService draftService;
  private AssignmentDraftsValidator draftsValidator;
  private AssignmentDraftsUtility draftUtility;
  private CqnService assignmentService;
  private EventContextKeysExtractor eventContextKeysExtractor;

  @Autowired
  public CapacityGridServiceHandler(final PersistenceService persistenceService, CdsRuntime cdsRuntime,
      CapacityGridAssignmentsUtility capacityGridAssignmentsUtility, DataProvider dataProvider,
      AssignmentSimulationUtility utility, @Qualifier(AssignmentService_.CDS_NAME) final DraftService draftService,
      AssignmentDraftsValidator draftsValidator, final AssignmentValidator validator, Messages messages,
      AssignmentDraftsUtility draftUtility, @Qualifier(AssignmentService_.CDS_NAME) final CqnService assignmentService,
      final EventContextKeysExtractor eventContextKeysExtractor) {
    this.persistenceService = persistenceService;
    this.cdsRuntime = cdsRuntime;
    this.capacityGridAssignmentsUtility = capacityGridAssignmentsUtility;
    this.dataProvider = dataProvider;
    this.utility = utility;
    this.draftService = draftService;
    this.draftsValidator = draftsValidator;
    this.validator = validator;
    this.messages = messages;
    this.draftUtility = draftUtility;
    this.assignmentService = assignmentService;
    this.eventContextKeysExtractor = eventContextKeysExtractor;
  }

  @On(event = CqnService.EVENT_UPDATE, entity = AssignmentsDetailsForCapacityGrid_.CDS_NAME)
  public synchronized void actionsOnAssignmentDetailsHeader(final CdsUpdateEventContext context,
      AssignmentsDetailsForCapacityGrid assignmentsDetailsForCapacityGrid) {

    resultMapList = capacityGridAssignmentsUtility.executeActionsOnAssignmentDetailsHeader(context,
        assignmentsDetailsForCapacityGrid);

    context.setResult(resultMapList);
    context.setCompleted();
  }

  @On(event = CqnService.EVENT_DELETE, entity = AssignmentsDetailsForCapacityGrid_.CDS_NAME)
  public synchronized void deleteAssignment(final CdsDeleteEventContext context) {

    Map<String, Object> keys = eventContextKeysExtractor.getDeleteEventContextKeys(context);

    String assignmentId = keys.get(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_ID).toString();
    assignmentservice.Assignments draftAssignment;

    try {
      draftAssignment = dataProvider.getAssignmentHeaderDraft(assignmentId);
    } catch (Exception e) {
      // Cannot allow deletion (for now) unless the assignment is in edit mode first
      // (which means there shall be a draft)
      messages.error(MessageKeys.ACTION_NOT_SUPPORTED);
      messages.throwIfError();
      return;
    }

    if (draftAssignment != null && draftAssignment.getHasActiveEntity()) {

      CdsDeleteEventContext deleteContext = CdsDeleteEventContext.create(assignmentservice.Assignments_.CDS_NAME);

      CqnDelete deleteAssignment = Delete.from(assignmentservice.Assignments_.CDS_NAME)
          .where(b -> b.get(assignmentservice.Assignments.ID).eq(assignmentId));

      deleteContext.setCqn(deleteAssignment);

      deleteContext.setCqnValueSets(context.getCqnValueSets());

      assignmentService.emit(deleteContext);

    } else {

      capacityGridAssignmentsUtility.deleteExistingEditDraft(assignmentId);

    }

    Map<String, Object> resultMap = new HashMap<>();
    resultMapList = new ArrayList<>();

    resultMapList.add(resultMap);
    context.setResult(resultMapList);

    context.setCompleted();
  }

  @On(event = CqnService.EVENT_UPDATE, entity = AssignmentBucketsYearMonthAggregate_.CDS_NAME)
  public synchronized void updateAssignmentForMonth(final CdsUpdateEventContext context,
      AssignmentBucketsYearMonthAggregate assignmentBucketsYearMonthToUpdate) {

    resultMapList = capacityGridAssignmentsUtility.updateAssignmentForMonth(context,
        assignmentBucketsYearMonthToUpdate);

    context.setResult(resultMapList);
    context.setCompleted();
  }

  @On(event = CqnService.EVENT_UPDATE, entity = AssignmentBucketsPerDay_.CDS_NAME)
  public synchronized void updateAssignmentForTheDay(final CdsUpdateEventContext context,
      AssignmentBucketsPerDay assignmentBucketsPerDay) {

    resultMapList = capacityGridAssignmentsUtility.updateAssignmentForTheDay(context, assignmentBucketsPerDay);

    context.setResult(resultMapList);
    context.setCompleted();
  }

  @On(event = CqnService.EVENT_UPDATE, entity = AssignmentBucketsYearWeekAggregate_.CDS_NAME)
  public synchronized void updateAssignmentForTheWeek(final CdsUpdateEventContext context,
      AssignmentBucketsYearWeekAggregate assignmentBucketsPerWeek) {

    resultMapList = capacityGridAssignmentsUtility.updateAssignmentForTheWeek(context, assignmentBucketsPerWeek);

    context.setResult(resultMapList);
    context.setCompleted();
  }

  /*
   * The result returned by PATCH is not what is communicated to UI.
   * 
   * @After the PATCH event READ is triggered and the result of READ is
   * communicated to UI
   */

  @On(event = CqnService.EVENT_READ, entity = { AssignmentBucketsYearMonthAggregate_.CDS_NAME,
      AssignmentBucketsPerDay_.CDS_NAME, AssignmentBucketsYearWeekAggregate_.CDS_NAME })
  public synchronized void readUpdatedAssignmentBucketsAggregate(final CdsReadEventContext context) {
    context.setResult(resultMapList);
    context.setCompleted();
  }

  @On(event = CqnService.EVENT_READ, entity = capacityservice.AverageResourceUtilizationFor12WeeksTileResponse_.CDS_NAME)
  public synchronized void readResourceUtilizationTileResponse(CdsReadEventContext context) {

    /*
     * Current date may fall in any date within the week. We need to find the start
     * date of the current week. Monday is the week start in ISO calendar, Sunday is
     * the week end.
     */
    LocalDate startDateOfCurrentISOWeek = LocalDate.now().with(DayOfWeek.MONDAY);
    LocalDate endDateOf12thISOWeek = startDateOfCurrentISOWeek.plusWeeks(11).with(DayOfWeek.SUNDAY);

    validFrom = startDateOfCurrentISOWeek.atStartOfDay().toInstant(ZoneOffset.UTC);
    validTo = endDateOf12thISOWeek.atStartOfDay().toInstant(ZoneOffset.UTC);

    CapacityGridHeaderKPITemporal capacityGridHeaderKPITemporal = getCapacityGridHeaderKPITemporalResponse(context);

    int totalAvgUtilPercentage = capacityGridHeaderKPITemporal.getTotalAvgUtilPercentage().intValue();

    AverageResourceUtilizationFor12WeeksTileResponse response = AverageResourceUtilizationFor12WeeksTileResponse
        .create();
    response.setId(ID);
    response.setNumber(totalAvgUtilPercentage);
    response.setNumberFactor("%");
    response.setNumberState(getNumberStateForUtilizationValue(totalAvgUtilPercentage));
    context.setResult(Arrays.asList(response));
    context.setCompleted();
  }

  @On(event = { CqnService.EVENT_READ }, entity = capacityservice.CapacityGridHeaderKPITemporal_.CDS_NAME)
  public synchronized List<CapacityGridHeaderKPITemporal> modifyCapacityGridHeaderKPIResponse(
      final CdsReadEventContext context) {
    LOGGER.debug(CAPACITY_GRID_MARKER,
        "Entered method modifyCapacityGridHeaderKPIResponse of class CapacityGridServiceHandler");
    List<CapacityGridHeaderKPITemporal> capacityGridFSResult = new ArrayList<>();
    List<String> resOrgsUserIsAuthFor = context.getUserInfo().getAttributeValues(PROCESSING_RESOURCE_ORGANIZATION);
    LOGGER.debug(CAPACITY_GRID_MARKER, "Res orgs user is auth for :{}", resOrgsUserIsAuthFor);

    this.convertIntoSessionDateFormat(context);
    this.derivePredicate(context);

    CapacityGridHeaderKPITemporal capacityGridResponseData = getCapacityGridHeaderKPITemporalResponse(context);
    capacityGridFSResult.add(capacityGridResponseData);
    context.setResult(capacityGridFSResult);
    deliveryOrgCodeList = null;
    context.setCompleted();
    LOGGER.info(CAPACITY_GRID_MARKER, "Successfully completed capacity grid header KPI calculation");
    return capacityGridFSResult;
  }

  private CapacityGridHeaderKPITemporal getCapacityGridHeaderKPITemporalResponse(CdsReadEventContext context) {
    List<String> resOrgsUserIsAuthFor = context.getUserInfo().getAttributeValues(PROCESSING_RESOURCE_ORGANIZATION);
    LOGGER.debug(CAPACITY_GRID_MARKER, "Res orgs user is auth for :{}", resOrgsUserIsAuthFor);
    int totalbookedHoursValue = 0;
    int freeResourcesCount = 0;
    int overBookedResourceCount = 0;
    int resourcesCount = 0;
    int totalAvailableHours = 0;
    int roundedPercentage = 0;
    RequestContextRunner requestContextRunner = cdsRuntime.requestContext()
        .modifyParameters(p -> p.setValidFrom(validFrom)).modifyParameters(p -> p.setValidTo(validTo));
    if (resOrgsUserIsAuthFor.isEmpty()) {
      requestContextRunner.run(req -> {
        this.getCapacityHeaderKPIRecordsforAll();
      });
    } else {
      requestContextRunner.run(req -> {
        this.getCapacityHeaderKPIRecords(resOrgsUserIsAuthFor);

      });

    }

    List<Row> capacityGridHeaderKPIList = capacityGridHeaderRecords.list();

    List<String> resourceIDList = new ArrayList<>();

    for (Row row : capacityGridHeaderKPIList) {

      String resourceID = (String) row.get("ID");

      if (!resourceIDList.contains(resourceID)) {
        resourceIDList.add(resourceID);
      } else {
        continue;
      }

      Integer bookedHours = (Integer) row.get("bookedHours");
      Integer availablehours = (Integer) row.get("availableHours");
      if (bookedHours != null) {
        totalbookedHoursValue = totalbookedHoursValue + bookedHours;
        totalAvailableHours = totalAvailableHours + availablehours;
        double utilizationPercentage = 100.0 * bookedHours / availablehours;
        int finalUtilizationPercentage = (int) Math.round(utilizationPercentage);
        if (finalUtilizationPercentage < 80) {
          freeResourcesCount = freeResourcesCount + 1;
        } else if (finalUtilizationPercentage > 110) {
          overBookedResourceCount = overBookedResourceCount + 1;
        }
      } else {
        freeResourcesCount = freeResourcesCount + 1;

      }
    }

    resourcesCount = resourceIDList.size();

    if (totalAvailableHours != 0) {
      double avgUtilCalculation = 100.0 * totalbookedHoursValue / totalAvailableHours;
      roundedPercentage = (int) Math.round(avgUtilCalculation);
    }

    return prepareResponse(freeResourcesCount, overBookedResourceCount, resourcesCount, roundedPercentage);
  }

  public Result getCapacityHeaderKPIRecords(List<String> resOrgsUserIsAuthFor) {
    LOGGER.info(CAPACITY_GRID_MARKER, "Entered getCapacityHeaderKPIRecords method in capacitygrid handler");
    CqnSelect query;
    if (deliveryOrgCodeList == null) {
      LOGGER.debug(CAPACITY_GRID_MARKER, "DeliveryOrgCode list is null for the respective user");
      query = Select.from(CapacityGridHeaderKPITemporal_.CDS_NAME)
          .columns(CapacityGridHeaderKPITemporal.ID, CapacityGridHeaderKPITemporal.VALID_FROM,
              CapacityGridHeaderKPITemporal.BOOKED_HOURS, CapacityGridHeaderKPITemporal.AVAILABLE_HOURS)
          .orderBy(cg -> cg.get(CapacityGridHeaderKPITemporal.ID).asc(),
              cg -> cg.get(CapacityGridHeaderKPITemporal.VALID_FROM).asc())
          .where(cg -> cg.get(CapacityGridHeaderKPITemporal.RESOURCE_ORGANIZATION_ID).in(resOrgsUserIsAuthFor));
    } else {
      LOGGER.debug(CAPACITY_GRID_MARKER, "DeliveryOrgCode list is maintained for the respective user");
      query = Select.from(CapacityGridHeaderKPITemporal_.class)
          .columns(CapacityGridHeaderKPITemporal.ID, CapacityGridHeaderKPITemporal.VALID_FROM,
              CapacityGridHeaderKPITemporal.BOOKED_HOURS, CapacityGridHeaderKPITemporal.AVAILABLE_HOURS)
          .orderBy(cg -> cg.get(CapacityGridHeaderKPITemporal.ID).asc(),
              cg -> cg.get(CapacityGridHeaderKPITemporal.VALID_FROM).asc())
          .where(cg -> cg.resourceOrganizationId().in(resOrgsUserIsAuthFor));
    }
    capacityGridHeaderRecords = persistenceService.run(query);
    return capacityGridHeaderRecords;

  }

  public Result getCapacityHeaderKPIRecordsforAll() {
    CqnSelect query;
    if (deliveryOrgCodeList == null) {
      LOGGER.debug(CAPACITY_GRID_MARKER, "Fetch the header kpi records for restricted user");
      query = Select.from(CapacityGridHeaderKPITemporal_.CDS_NAME)
          .columns(CapacityGridHeaderKPITemporal.ID, CapacityGridHeaderKPITemporal.VALID_FROM,
              CapacityGridHeaderKPITemporal.BOOKED_HOURS, CapacityGridHeaderKPITemporal.AVAILABLE_HOURS)
          .orderBy(cg -> cg.get(CapacityGridHeaderKPITemporal.ID).asc(),
              cg -> cg.get(CapacityGridHeaderKPITemporal.VALID_FROM).asc());
    } else {
      LOGGER.debug(CAPACITY_GRID_MARKER, "Retrieving the records for restricted user with deliveryOrgCode list");

      query = Select.from(CapacityGridHeaderKPITemporal_.CDS_NAME)
          .columns(CapacityGridHeaderKPITemporal.ID, CapacityGridHeaderKPITemporal.VALID_FROM,
              CapacityGridHeaderKPITemporal.BOOKED_HOURS, CapacityGridHeaderKPITemporal.AVAILABLE_HOURS)
          .orderBy(cg -> cg.get(CapacityGridHeaderKPITemporal.ID).asc(),
              cg -> cg.get(CapacityGridHeaderKPITemporal.VALID_FROM).asc());
    }
    capacityGridHeaderRecords = persistenceService.run(query);
    return capacityGridHeaderRecords;
  }

  public Instant retrieveExactDate(String validity) {
    LOGGER.debug(CAPACITY_GRID_MARKER, "Retrieving the exact date from session context varaible");
    Instant validDate = null;
    validDate = Instant.parse(validity);
    return validDate;
  }

  public void convertIntoSessionDateFormat(CdsReadEventContext context) {
    LOGGER.debug(CAPACITY_GRID_MARKER, "Deriving the session context varaible in convertIntoSessionDateFormat method");
    Map<String, String> sessionParameters = context.getParameterInfo().getQueryParams();
    String sapValidFrom = sessionParameters.get("sap-valid-from");
    String sapValidTo = sessionParameters.get("sap-valid-to");
    validFrom = this.retrieveExactDate(sapValidFrom);
    validTo = this.retrieveExactDate(sapValidTo);
  }

  public CapacityGridHeaderKPITemporal prepareResponse(Integer freeResourcesCount, Integer overBookedResourceCount,
      Integer resourcesCount, Integer finalPercentageAvg) {
    LOGGER.debug(CAPACITY_GRID_MARKER, "Preparing the header KPI response in prepare response method");
    CapacityGridHeaderKPITemporal capacityGridHeaderKPI = CapacityGridHeaderKPITemporal.create();
    capacityGridHeaderKPI.setFreeResourcesCount(freeResourcesCount);
    capacityGridHeaderKPI.setOverstaffedResourcesCount(overBookedResourceCount);
    capacityGridHeaderKPI.setId(ID);
    capacityGridHeaderKPI.setResourceCount(resourcesCount);
    capacityGridHeaderKPI.setTotalAvgUtilPercentage(finalPercentageAvg);
    LOGGER.debug(CAPACITY_GRID_MARKER, "Successfully prepared header kpi response");
    return capacityGridHeaderKPI;
  }

  public void derivePredicate(CdsReadEventContext context) {
    LOGGER.debug(CAPACITY_GRID_MARKER, "Deriving Delivery Org Code list in derive predicate method");
    Map<String, List<String>> map = new HashMap<>();
    CqnSelect select = context.getCqn();
    Optional<CqnPredicate> optionalSelect = select.where();
    if (optionalSelect.isPresent()) {
      optionalSelect.get().accept(new CqnVisitor() {
        @Override
        public void visit(CqnContainmentTest test) {
          String displayName = test.args().get(0).asRef().displayName();
          if (!map.containsKey(displayName)) {
            List<String> list = new ArrayList<>();
            list.add(test.args().get(1).asLiteral().value().toString());
            map.put(displayName, list);
          } else {
            List<String> list = map.get(displayName);
            list.add(test.args().get(1).asLiteral().value().toString());
          }
        }
      });

    }
    deliveryOrgCodeList = map.get("deliveryOrgCode");
  }

  // Create assignment from grid
  @On(event = CqnService.EVENT_CREATE, entity = AssignmentsDetailsForCapacityGrid_.CDS_NAME)
  public synchronized void createAssignment(final CdsCreateEventContext context,
      AssignmentsDetailsForCapacityGrid assignmentsDetailsForCapacityGrid) {

    // Get the basic header details of the assignment
    String requestID = assignmentsDetailsForCapacityGrid.getResourceRequestId();
    String resourceID = assignmentsDetailsForCapacityGrid.getResourceId();
    int assignmentStatusCode;
    LocalDate startDate = assignmentsDetailsForCapacityGrid.getAssignmentStartDate();
    LocalDate endDate = assignmentsDetailsForCapacityGrid.getAssignmentEndDate();

    String referenceAssignment = assignmentsDetailsForCapacityGrid.getReferenceAssignment();

    checkRequestCompleteness(requestID, resourceID, startDate, endDate);

    // Validation - Check that this combination of the resource and request is a
    // unique one and doesn't already exist in case of insert
    Map<String, String> assignmentDetails = new HashMap<>();
    assignmentDetails.put("assignmentID", assignmentsDetailsForCapacityGrid.getAssignmentId());
    assignmentDetails.put("requestID", requestID);
    assignmentDetails.put("resourceID", resourceID);

    validator.validateExistingAssignment(context.getEvent(), assignmentDetails);
    raiseExceptionIfErrorWithTarget(validator.getMessages(), referenceAssignment);

    validator.validateReferenceAssignment(referenceAssignment);
    raiseExceptionIfErrorWithTarget(validator.getMessages(), referenceAssignment);

    // Time to create the assignment draft
    Optional<assignmentservice.Assignments> assignmentDraftOptional;

    // Create a new draft please in case of insert
    assignmentservice.Assignments newAssignment = assignmentservice.Assignments.create();
    newAssignment.setResourceRequestId(requestID);
    newAssignment.setResourceId(resourceID);

    assignmentStatusCode = utility.getAssignmentStatusCode(assignmentsDetailsForCapacityGrid.getAssignmentStatusCode(),
        referenceAssignment);

    newAssignment.setAssignmentStatusCode(assignmentStatusCode);

    // Get the distribution...
    Optional<ResourceRequestDetails> requestDetails = dataProvider.getRequestDetails(requestID);

    List<AssignmentBuckets> assignmentBuckets = getAssignmentDistribution(context, requestDetails, resourceID,
        referenceAssignment);

    addTarget(messages, referenceAssignment);

    if (assignmentBuckets.isEmpty()) {
      raiseExceptionIfError(messages);
    }

    // Put the distribution details into the draft
    newAssignment.setAssignmentBuckets(assignmentBuckets);

    CqnInsert newAssignmentDraft = Insert.into(assignmentservice.Assignments_.class)
        .entries(Collections.singletonList(newAssignment));

    // Create a new draft. This will also trigger the draft validations.
    assignmentDraftOptional = draftService.newDraft(newAssignmentDraft).first(assignmentservice.Assignments.class);

    // Run validations on the entire assignment draft object
    // But in cases where an empty assignment (i.e. without any distribution) is
    // copied,
    // there is no bucket start and end on which the validations can be performed.
    // In such cases, we shall skip the validation on the entire draft.

    if (!assignmentBuckets.isEmpty()) {
      LOGGER.debug(SIMULATION_MARKER,
          "Assignment draft being created sans distribution (can happen if copying a draft assignment where the distribution was made as zero)");
      raiseExceptionIfErrorWithTarget(draftsValidator.validate(assignmentDraftOptional.get().getId()),
          referenceAssignment);
    }

    // Prepare result
    Map<String, Object> resultMap = prepareResultMap(assignmentDraftOptional, requestDetails, resourceID, startDate,
        endDate, assignmentBuckets, context, assignmentStatusCode);

    // Add the target for any messages that were raised in the process.
    addTarget(messages, assignmentDraftOptional.get().getId());

    // return the new distribution record created in response to user
    resultMapList = new ArrayList<>();

    resultMapList.add(resultMap);

    context.setResult(resultMapList);

    context.setCompleted();

  }

  private Map<String, Object> prepareResultMap(Optional<Assignments> assignmentDraftOptional,
      Optional<ResourceRequestDetails> requestDetails, String resourceID, LocalDate startDate, LocalDate endDate,
      List<AssignmentBuckets> assignmentBuckets, CdsCreateEventContext context, int assignmentStatusCode) {

    Map<String, Object> resultMap = new HashMap<>();

    if (assignmentDraftOptional.isPresent()) {

      resultMap.put(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_ID, assignmentDraftOptional.get().getId());
      resultMap.put(AssignmentsDetailsForCapacityGrid.RESOURCE_REQUEST_ID,
          assignmentDraftOptional.get().getResourceRequestId());
      resultMap.put(AssignmentsDetailsForCapacityGrid.REQUEST_DISPLAY_ID, requestDetails.get().getDisplayId());
      resultMap.put(AssignmentsDetailsForCapacityGrid.RESOURCE_ID, assignmentDraftOptional.get().getResourceId());

      resultMap.put(AssignmentsDetailsForCapacityGrid.REQUEST_START_DATE, requestDetails.get().getStartDate());
      resultMap.put(AssignmentsDetailsForCapacityGrid.REQUEST_END_DATE, requestDetails.get().getEndDate());

      Optional<ResourceDetailsForTimeWindow> resourceAssignmentPeriodDetails = dataProvider
          .getMatchingTimeSlice(resourceID);
      if (resourceAssignmentPeriodDetails.get().getResourceOrgCode() != null) {
        resultMap.put(AssignmentsDetailsForCapacityGrid.RESOURCE_ORG_CODE,
            resourceAssignmentPeriodDetails.get().getResourceOrgCode());
      }
      resultMap.put(AssignmentsDetailsForCapacityGrid.REQUEST_NAME, requestDetails.get().getName());
      resultMap.put(AssignmentsDetailsForCapacityGrid.PROJECT_ID, requestDetails.get().getProjectId());
      resultMap.put(AssignmentsDetailsForCapacityGrid.PROJECT_NAME, requestDetails.get().getProjectName());
      resultMap.put(AssignmentsDetailsForCapacityGrid.CUSTOMER_ID, requestDetails.get().getCustomerId());
      resultMap.put(AssignmentsDetailsForCapacityGrid.CUSTOMER_NAME, requestDetails.get().getCustomerName());
      resultMap.put(AssignmentsDetailsForCapacityGrid.PROJECT_ROLE_NAME, requestDetails.get().getProjectRoleName());
      resultMap.put(AssignmentsDetailsForCapacityGrid.REFERENCE_OBJECT_ID, requestDetails.get().getReferenceObjectId());
      resultMap.put(AssignmentsDetailsForCapacityGrid.REFERENCE_OBJECT_NAME, requestDetails.get().getReferenceObjectName());
      resultMap.put(AssignmentsDetailsForCapacityGrid.REFERENCE_OBJECT_TYPE_CODE, requestDetails.get().getReferenceObjectType());
      resultMap.put(AssignmentsDetailsForCapacityGrid.REFERENCE_OBJECT_TYPE_NAME, requestDetails.get().getReferenceObjectTypeName());
      resultMap.put(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_STATUS_CODE, assignmentStatusCode);
      resultMap.put(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_STATUS_TEXT,
          dataProvider.getAssignmentStatus(assignmentStatusCode).get().getName());
      resultMap.put(AssignmentsDetailsForCapacityGrid.IS_ASSIGNMENT_EDITABLE, true);

      Map<String, LocalDate> headerDates = getHeaderDates(assignmentBuckets);

      resultMap.put(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_START_DATE,
          headerDates.get(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_START_DATE));
      resultMap.put(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_END_DATE,
          headerDates.get(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_END_DATE));

      // Raise a message if the distribution is outside the planning horizon
      if (headerDates.get(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_START_DATE).isBefore(startDate)) {
        context.getMessages()
            .info(MessageKeys.ASSIGNMENT_STARTS_OUTSIDE_HORIZON,
                headerDates.get(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_START_DATE))
            .target(assignmentDraftOptional.get().getId());
      }
      if (headerDates.get(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_END_DATE).isAfter(endDate)) {
        context.getMessages()
            .info(MessageKeys.ASSIGNMENT_ENDS_OUTSIDE_HORIZON,
                headerDates.get(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_END_DATE))
            .target(assignmentDraftOptional.get().getId());
      }

      // And now for the distributions...
      assignmentBuckets = assignmentDraftOptional.get().getAssignmentBuckets();

      // Fill the missing gaps
      assignmentBuckets = utility.fillTheMissingBucketsOnCreate(assignmentDraftOptional.get().getId(),
          assignmentBuckets, requestDetails.get().getStartDate().atStartOfDay().toInstant(ZoneOffset.UTC),
          requestDetails.get().getEndDate().atStartOfDay().toInstant(ZoneOffset.UTC), resourceID);

      List<AssignmentBuckets> sortedAssignmentBuckets = getSortedBuckets(assignmentBuckets);

      mapDailyDistributionResult(sortedAssignmentBuckets, resultMap, startDate, endDate);
      mapWeeklyDistributionResult(sortedAssignmentBuckets, resultMap, startDate, endDate);
      mapMonthlyDistributionResult(sortedAssignmentBuckets, resultMap, startDate, endDate);
    }

    draftUtility.updateBookedCapacityInHeader(assignmentDraftOptional.get().getId());

    int currentAssignmentAggregation = 0;

    Optional<ResourceRequestAssignmentAggregate> resourceRequestAssignmentAggregate = dataProvider
        .getResourceRequestAssignmentAggregateData(requestDetails.get().getId());

    if (resourceRequestAssignmentAggregate.isPresent()) {
      currentAssignmentAggregation = minutesToHours(
          resourceRequestAssignmentAggregate.get().getTotalRequestbookedCapacityInMinutes());
    }

    int assignmentDurationInHours = minutesToHours(
        draftUtility.getTotalBookedCapacity(assignmentDraftOptional.get().getId()));
    int totalRequestbookedCapacityInHours = currentAssignmentAggregation + assignmentDurationInHours;

    resultMap.put(AssignmentsDetailsForCapacityGrid.REQUESTED_CAPACITY_IN_HOURS,
        minutesToHours(requestDetails.get().getRequestedCapacityInMinutes()));

    resultMap.put(AssignmentsDetailsForCapacityGrid.TOTAL_REQUEST_BOOKED_CAPACITY_IN_HOURS,
        totalRequestbookedCapacityInHours);

    resultMap.put(AssignmentsDetailsForCapacityGrid.ASSIGNMENT_DURATION_IN_HOURS,
        minutesToHours(draftUtility.getTotalBookedCapacity(assignmentDraftOptional.get().getId())));

    resultMap.put(AssignmentsDetailsForCapacityGrid.REMAINING_REQUESTED_CAPACITY_IN_HOURS,
        minutesToHours(requestDetails.get().getRequestedCapacityInMinutes()) - totalRequestbookedCapacityInHours);

    return resultMap;

  }

  private List<AssignmentBuckets> getSortedBuckets(List<AssignmentBuckets> unSortedBuckets) {

    return unSortedBuckets.stream().sorted((o1, o2) -> o1.getStartTime().compareTo(o2.getStartTime()))
        .collect(Collectors.toList());

  }

  private List<AssignmentBuckets> getAssignmentDistribution(CdsCreateEventContext context,
      Optional<ResourceRequestDetails> requestDetails, String resourceID, String referenceAssignment) {

    List<AssignmentBuckets> assignmentBuckets = new ArrayList<>();

    if (referenceAssignment != null) {

      return utility.getDistributionFromReferenceAssignment(referenceAssignment);

    }

    // Get the assignment distribution range
    Map.Entry<Instant, Instant> distributionRange = getAssignmentDistributionPeriodComparingResourceValidity(context,
        requestDetails, resourceID);

    // Get the resource capacity
    if (requestDetails.isPresent()) {
      resourceCapacityList = dataProvider.getResourceCapacities(resourceID, distributionRange.getKey(),
          distributionRange.getValue());
    }

    // Get request's capacity requirements
    requestCapacityRequirementList = dataProvider.getRequestCapacityRequirements(requestDetails.get().getId());

    // Get resourceBookingGranularity
    Optional<Types> resourceBookingGranularityInMinutes = dataProvider
        .getResourceBookingGranularityInMinutes(resourceID);

    for (CapacityRequirements capacityRequirementEntry : requestCapacityRequirementList) {
      List<AssignmentBuckets> assignmentDistributionList = null;

      int hoursToStaff = minutesToHours(capacityRequirementEntry.getRequestedCapacityInMinutes());

      Instant capacityRequirementStart = capacityRequirementEntry.getStartTime();
      Instant capacityRequirementEnd = capacityRequirementEntry.getEndTime();

      List<Capacity> filteredCapacityList = utility.getFilteredCapacityList(resourceCapacityList,
          capacityRequirementStart, capacityRequirementEnd);

      if (filteredCapacityList.isEmpty()) {
        // In the AsRequested case, if we cannot fulfill any capacity requirement, we
        // cannot fulfill all capacity requirement, thus we return with an empty list.
        messages.warn(MessageKeys.ASSIGNMENT_NOT_POSSIBLE_DURING_THE_PERIOD, capacityRequirementStart,
            capacityRequirementEnd);

      } else {

        if (resourceBookingGranularityInMinutes.isPresent()) {
          assignmentDistributionList = utility.getDistributedAssignmentBuckets(
              resourceBookingGranularityInMinutes.get().getBookingGranularityInMinutes(), hoursToStaff,
              filteredCapacityList);
        }

        assignmentBuckets.addAll(assignmentDistributionList);

      }

    }

    if (assignmentBuckets.isEmpty()) {
      /*** Necessary to send an empty list? */
      context.setResult(resultMapList);

      context.setCompleted();
    }

    return assignmentBuckets;

  }

  private Entry<Instant, Instant> getAssignmentDistributionPeriodComparingResourceValidity(
      CdsCreateEventContext context, Optional<ResourceRequestDetails> requestDetails, String resourceID) {

    // We will still consider the request start and end for distribution even
    // though the planning horizon my not match
    Instant requestStart = requestDetails.get().getStartDate().atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant requestEnd = requestDetails.get().getEndDate().atStartOfDay().toInstant(ZoneOffset.UTC);

    // However, if the resource validity is short of the request dates / moves to a
    // different cost center,
    // in such cases, only the valid period is to be considered.
    Optional<ExtnWorkAssignmentFirstJobDetails> resourceValidity = dataProvider.getResourceValidity(requestStart,
        requestEnd, resourceID, requestDetails.get().getProcessingResourceOrgId());

    if (resourceValidity.isPresent()) {

      validFrom = resourceValidity.get().getValidFrom().atStartOfDay().toInstant(ZoneOffset.UTC).isAfter(requestStart)
          ? resourceValidity.get().getValidFrom().atStartOfDay().toInstant(ZoneOffset.UTC)
          : requestStart;
      validTo = resourceValidity.get().getValidTo().atStartOfDay().toInstant(ZoneOffset.UTC).isBefore(requestEnd)
          ? resourceValidity.get().getValidTo().atStartOfDay().toInstant(ZoneOffset.UTC)
          : requestEnd;

      if (validFrom != requestStart || validTo != requestEnd) {

        context.getMessages().warn(MessageKeys.ASSIGNMENT_ADAPTED_TO_RESOURCE_VALIDITY);

      }

      return new AbstractMap.SimpleEntry<>(validFrom, validTo);

    } else {

      // Cannot find resource validity? Then assignment cannot be created afterall.
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.INACTIVE_RESOURCE_FOUND);

    }

  }

  private void checkRequestCompleteness(String requestID, String resourceID, LocalDate startDate, LocalDate endDate) {

    // check that the request, resource, start and end dates and isSoftBooked fields
    // are provided
    if (requestID == null || resourceID == null || startDate == null || endDate == null || requestID.isEmpty()
        || resourceID.isEmpty()) {
      // Sufficient information unavailable for assignment creation
      LOGGER.debug(SIMULATION_MARKER,
          "Insuffecient information passed from UI, requestID: {}, resourceID:{}, startDate:{}, endDate:{} ", requestID,
          resourceID, startDate, endDate);
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.INCOMPLETE_DATA_TO_CREATE_ASSIGNMENT_FROM_GRID);

    }
  }

  private void mapDailyDistributionResult(List<AssignmentBuckets> assignmentBuckets, Map<String, Object> resultMap,
      LocalDate gridStartDate, LocalDate gridEndDate) {

    resultMap.put(AssignmentsDetailsForCapacityGrid.DAILY_ASSIGNMENTS,
        utility.prepareAssignmentBucketsPerDayResult(assignmentBuckets, gridStartDate, gridEndDate));

  }

  private void mapWeeklyDistributionResult(List<AssignmentBuckets> assignmentBuckets, Map<String, Object> resultMap,
      LocalDate gridStartDate, LocalDate gridEndDate) {

    resultMap.put(AssignmentsDetailsForCapacityGrid.WEEKLY_AGGREGATED_ASSIGNMENTS,
        utility.prepareAssignmentBucketsYearWeekResult(assignmentBuckets, gridStartDate, gridEndDate));

  }

  private void mapMonthlyDistributionResult(List<AssignmentBuckets> assignmentBuckets, Map<String, Object> resultMap,
      LocalDate gridStartDate, LocalDate gridEndDate) {

    resultMap.put(AssignmentsDetailsForCapacityGrid.MONTHLY_AGGREGATED_ASSIGNMENTS,
        utility.prepareAssignmentBucketsYearMonthResult(assignmentBuckets, gridStartDate, gridEndDate));
  }

  private Map<String, LocalDate> getHeaderDates(List<AssignmentBuckets> assignmentBuckets) {

    return utility.getHeaderDatesFromBuckets(assignmentBuckets);

  }

}
