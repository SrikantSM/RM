package com.sap.c4p.rm.assignment.handlers;

import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.isEditDraft;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.raiseExceptionIfErrorWithTarget;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftSaveEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.auditlog.AuditChangeLog;
import com.sap.c4p.rm.assignment.config.LoggingMarker;
import com.sap.c4p.rm.assignment.enums.AssignmentEvents;
import com.sap.c4p.rm.assignment.enums.AssignmentStatus;
import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.integration.AssignmentS4Integration;
import com.sap.c4p.rm.assignment.simulation.AssignmentSimulator;
import com.sap.c4p.rm.assignment.simulation.AssignmentSimulatorFactory;
import com.sap.c4p.rm.assignment.utils.AssignmentDependentEntityUpdateUtility;
import com.sap.c4p.rm.assignment.utils.AssignmentDraftsUtility;
import com.sap.c4p.rm.assignment.utils.AssignmentServiceHandlerUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;
import com.sap.c4p.rm.assignment.utils.HttpStatus;
import com.sap.c4p.rm.assignment.validation.Validator;
import com.sap.c4p.rm.assignment.validation.ValidatorFactory;

import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.supply.AssignmentBucketsYearMonthAggregate;

import assignmentservice.AssignmentBuckets;
import assignmentservice.AssignmentService_;
import assignmentservice.Assignments;
import assignmentservice.Assignments_;
import assignmentservice.SimulateAsgBasedOnTotalHoursContext;
import assignmentservice.SimulateAssignmentAsRequestedContext;

@Component
@ServiceName(AssignmentService_.CDS_NAME)
public class AssignmentServiceHandler implements EventHandler {

  private AssignmentSimulatorFactory simulatorFactory;
  private AssignmentServiceHandlerUtility serviceHandlerutility;
  private ValidatorFactory validatorFactory;

  private static final String ASSIGNMENT_OBJECT = "Assignment";

  private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentServiceHandler.class);

  private static final Marker CREATE_MARKER = LoggingMarker.CREATE_MARKER.getMarker();
  private static final Marker CHANGE_MARKER = LoggingMarker.CHANGE_MARKER.getMarker();
  private static final Marker DELETE_MARKER = LoggingMarker.DELETE_MARKER.getMarker();

  private DataProvider dataProvider;
  private AuditChangeLog auditChangeLog;

  private AssignmentS4Integration assignmentS4Integrator;

  private List<AssignmentBucketsYearMonthAggregate> monthlyAggregatedAssignmentBeforeUpdate;

  private Assignments deletedAssignmentWithBuckets;
  private Assignments oldAssignmentWithBuckets;
  private Assignments newAssignmentWithBuckets;

  private AssignmentDependentEntityUpdateUtility assignmentDependentEntityUpdateUtility;
  private AssignmentDraftsUtility draftUtility;

  @Autowired
  public AssignmentServiceHandler(AssignmentSimulatorFactory factory, AssignmentServiceHandlerUtility utility,
      ValidatorFactory validatorFactory, AuditChangeLog auditChangeLog, AssignmentS4Integration assignmentS4Integrator,
      DataProvider dataProvider, AssignmentDependentEntityUpdateUtility assignmentDependentEntityUpdateUtility,
      AssignmentDraftsUtility draftUtility) {
    this.simulatorFactory = factory;
    this.serviceHandlerutility = utility;
    this.validatorFactory = validatorFactory;
    this.auditChangeLog = auditChangeLog;
    this.assignmentS4Integrator = assignmentS4Integrator;
    this.dataProvider = dataProvider;
    this.assignmentDependentEntityUpdateUtility = assignmentDependentEntityUpdateUtility;
    this.draftUtility = draftUtility;
  }

  @Before(event = DraftService.EVENT_DRAFT_NEW, entity = Assignments_.CDS_NAME)
  public synchronized void assignmentDraftCreate(final EventContext context, List<Assignments> assignmentList) {
    serviceHandlerutility.validateAuthorizationForRequestAndResource(context, assignmentList.get(0));
  }

  @Before(event = CqnService.EVENT_UPDATE, entity = Assignments_.CDS_NAME)
  public synchronized void validateUpdateBeforeAction(final CdsUpdateEventContext context,
      List<Assignments> assignmentList) {

    if (!isEditDraft(assignmentList.get(0).getId())) {
      Messages messages = serviceHandlerutility.validateAuthorizationForRequestAndResource(context,
          assignmentList.get(0));
      raiseExceptionIfErrorWithTarget(messages, assignmentList.get(0).getId());

      messages = serviceHandlerutility.validateAssignmentStatusChange(assignmentList.get(0).getId(),
          assignmentList.get(0).getAssignmentStatusCode());
      raiseExceptionIfErrorWithTarget(messages, assignmentList.get(0).getId());
    }

    /*
     * Need to take a snapshot of aggregated monthly values before updating them so
     * that we can correctly determine whether create/update/delete has to be
     * invoked for the corresponding month in S4
     */
    monthlyAggregatedAssignmentBeforeUpdate = dataProvider
        .getMonthlyAggregatedAssignment(assignmentList.get(0).getId());

    // Also a snapshot of assignments with buckets
    oldAssignmentWithBuckets = dataProvider.getAssignmentWithBuckets(assignmentList.get(0).getId());
  }

  @After(event = CqnService.EVENT_UPDATE, entity = Assignments_.CDS_NAME)
  public synchronized void validateUpdateAction(final CdsUpdateEventContext context, List<Assignments> assignmentList) {

    if (assignmentList.isEmpty()) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENT_UNAVAILABLE_FOR_EDIT);
    }

    String assignmentId = assignmentList.get(0).getId();

    List<AssignmentBucketsYearMonthAggregate> monthlyAggregatedAssignmentAfterUpdate = dataProvider
        .getMonthlyAggregatedAssignment(assignmentId);

    if (monthlyAggregatedAssignmentAfterUpdate.isEmpty()) {
      LOGGER.info(CHANGE_MARKER, "Monthly aggregated assignment is empty");
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.DELETION_NOT_ALLOWED);
    }

    Integer updatedAssignmentStatusCode = assignmentList.get(0).getAssignmentStatusCode();
    Integer oldAssignmentStatusCode = oldAssignmentWithBuckets.getAssignmentStatusCode();

    /*
     * S4 integration -> S4 request && status updated to hardbooked
     * BookedCapacityAggregate update -> Status updated to softbooked or hardbooked
     * Proposed assignments -> No S4 integration, No BookedCapacityAggregate update
     */

    if (updatedAssignmentStatusCode.intValue() != AssignmentStatus.PROPOSED.getCode()) {

      newAssignmentWithBuckets = dataProvider.getAssignmentWithBuckets(assignmentId);

      if (isS4Request(assignmentList.get(0).getResourceRequestId())
          && updatedAssignmentStatusCode.intValue() == AssignmentStatus.HARDBOOKED.getCode()) {

        context.getChangeSetContext().register(assignmentS4Integrator);
        if (oldAssignmentStatusCode.intValue() != AssignmentStatus.HARDBOOKED.getCode()) {
          LOGGER.info(CHANGE_MARKER,
              "Assignment {} status changed from soft/propsoed to hardbooking, needs a fresh creation of supply in S4. Preparing assignment for create",
              assignmentId);
          assignmentS4Integrator.prepareAssignmentCreateInS4(newAssignmentWithBuckets,
              monthlyAggregatedAssignmentAfterUpdate);
        } else {
          // Old assignment was hard-booked too. Will simply update assignment in S4
          LOGGER.info(CHANGE_MARKER, "Preparing assignment {} for update in S4", assignmentId);
          assignmentS4Integrator.prepareAssignmentUpdateInS4(assignmentId, monthlyAggregatedAssignmentBeforeUpdate,
              monthlyAggregatedAssignmentAfterUpdate);
        }
      }
      assignmentDependentEntityUpdateUtility.updateResourceBookedCapacity(oldAssignmentWithBuckets,
          newAssignmentWithBuckets);
    }
    auditChangeLog.logDataModificationAuditMessage(context, ASSIGNMENT_OBJECT, AssignmentService_.CDS_NAME,
        assignmentList.get(0), AssignmentEvents.ASSIGNMENT_UPDATE);
  }

  @Before(event = CqnService.EVENT_DELETE, entity = Assignments_.CDS_NAME)
  public synchronized void actionsBeforeAssignmentDelete(final CdsDeleteEventContext context) {

    Map<String, Object> keys = serviceHandlerutility.getKeys(context);
    String deletedAssignmentID = keys.get(Assignments.ID).toString();

    /*
     * Lock the assignment first by creating an edit draft on it. Unless a lock is
     * acquired, a user will be able to delete an assignment even if it is locked by
     * some other user. draftUtility already throws an exception if lock could not
     * be acquired
     */
    LOGGER.debug(DELETE_MARKER, "Trying to acquire lock on assignment {} by creating an edit draft",
        deletedAssignmentID);
    draftUtility.getEditDraftForUser(deletedAssignmentID, context.getUserInfo().getName(), context.getMessages(), true,
        true);
    LOGGER.debug(DELETE_MARKER, "Successfully acquired lock on assignment {}", deletedAssignmentID);

    // Snapshot of deleted records as these won't be available in @After event
    deletedAssignmentWithBuckets = dataProvider.getAssignmentWithBuckets(deletedAssignmentID);
    Messages messages = serviceHandlerutility
        .validateResourceRequestStatuses(deletedAssignmentWithBuckets.getResourceRequestId());
    raiseExceptionIfErrorWithTarget(messages, deletedAssignmentID);

    // Check for assignment status
    int assignmentStatus = deletedAssignmentWithBuckets.getAssignmentStatusCode().intValue();
    if (assignmentStatus != AssignmentStatus.HARDBOOKED.getCode()) {
      LOGGER.info(DELETE_MARKER, "Not a hard booked assignment, S4 integration will be skipped");
      return;
    }

    if (isS4Request(deletedAssignmentWithBuckets.getResourceRequestId())) {
      LOGGER.info(DELETE_MARKER, "Request is still open, prepare deletion in S4");
      context.getChangeSetContext().register(assignmentS4Integrator);

      assignmentS4Integrator.prepareAssignmentDeleteInS4(deletedAssignmentID, deletedAssignmentWithBuckets.getResourceId(), deletedAssignmentWithBuckets) ;
    }
  }

  @After(event = CqnService.EVENT_DELETE, entity = Assignments_.CDS_NAME)
  public synchronized void actionsAfterAssignmentDelete(final CdsDeleteEventContext context) {

    if (deletedAssignmentWithBuckets.getAssignmentStatusCode().intValue() != AssignmentStatus.PROPOSED.getCode()) {
      // update the resource booked capacity
      oldAssignmentWithBuckets = deletedAssignmentWithBuckets;
      newAssignmentWithBuckets = Assignments.create(); // empty object

      assignmentDependentEntityUpdateUtility.updateResourceBookedCapacity(oldAssignmentWithBuckets,
          newAssignmentWithBuckets);
    }
    auditChangeLog.logDataModificationAuditMessage(context, ASSIGNMENT_OBJECT, AssignmentService_.CDS_NAME,
        deletedAssignmentWithBuckets, AssignmentEvents.ASSIGNMENT_DELETION);
  }

  @After(event = DraftService.EVENT_DRAFT_SAVE, entity = Assignments_.CDS_NAME)
  public synchronized void assignmentDraftSave(final DraftSaveEventContext context, List<Assignments> assignmentList) {

    List<AssignmentBuckets> draftBuckets = dataProvider
        .getAssignmentBucketsFromDraftService(assignmentList.get(0).getId());

    Assignments assignmentRecord = context.getResult().single(Assignments.class);
    assignmentRecord.setAssignmentBuckets(draftBuckets);

    // If this is a create new assignment scenario, then prepare for create
    // assignment
    if (!isEditDraft(assignmentList.get(0).getId())) {

      LOGGER.debug("Assignment {} has no active entity. Will be treated as create for integration.",
          assignmentList.get(0).getId());

      // Check for assignment status
      int assignmentStatus = assignmentList.get(0).getAssignmentStatusCode();

      if (isS4Request(assignmentList.get(0).getResourceRequestId())) {
        if (assignmentStatus == AssignmentStatus.HARDBOOKED.getCode()) {
          LOGGER.info(CREATE_MARKER, "Preparing assignment for create in S4");
          context.getChangeSetContext().register(assignmentS4Integrator);
          assignmentS4Integrator.prepareAssignmentCreateInS4(assignmentRecord,
              dataProvider.getMonthlyAggregatedAssignment(assignmentList.get(0).getId()));
        } else {
          LOGGER.info(CREATE_MARKER, "Assignment is not hardbooked, will not be integrated to S4");
        }
      }

      if (assignmentStatus != AssignmentStatus.PROPOSED.getCode()) {
        oldAssignmentWithBuckets = Assignments.create(); // empty object
        newAssignmentWithBuckets = dataProvider.getAssignmentWithBuckets(assignmentList.get(0).getId());
        assignmentDependentEntityUpdateUtility.updateResourceBookedCapacity(oldAssignmentWithBuckets,
            newAssignmentWithBuckets);
      }

      auditChangeLog.logDataModificationAuditMessage(context, ASSIGNMENT_OBJECT, AssignmentService_.CDS_NAME,
          assignmentRecord, AssignmentEvents.ASSIGNMENT_CREATION);
    }
  }

  @On(event = SimulateAsgBasedOnTotalHoursContext.CDS_NAME)
  public void simulateAsgBasedOnTotalHours(final SimulateAsgBasedOnTotalHoursContext context) {

    Validator validator = validatorFactory.getValidator(context.getEvent());
    Messages messages = validator.validate(context);

    messages.throwIfError();

    AssignmentSimulator assignmentSimulator = simulatorFactory.getAssignmentSimulator(context.getEvent());
    Assignments assignment = serviceHandlerutility.buildActionResult(context, assignmentSimulator);

    context.setResult(assignment);
    context.setCompleted();
  }

  @On(event = SimulateAssignmentAsRequestedContext.CDS_NAME)
  public void simulateAssignmentAsRequested(final SimulateAssignmentAsRequestedContext context) {

    Validator validator = validatorFactory.getValidator(context.getEvent());
    Messages messages = validator.validate(context);

    messages.throwIfError();

    AssignmentSimulator assignmentSimulator = simulatorFactory.getAssignmentSimulator(context.getEvent());
    Assignments assignment = serviceHandlerutility.buildActionResult(context, assignmentSimulator);

    context.getMessages().throwIfError();

    context.setResult(assignment);
    context.setCompleted();
  }

  private boolean isS4Request(String resourceRequestId) {
    Optional<ResourceRequests> resourceRequest = dataProvider.getRequestData(resourceRequestId);
    return resourceRequest.isPresent() && Boolean.TRUE.equals(resourceRequest.get().getIsS4Cloud());
  }

}
