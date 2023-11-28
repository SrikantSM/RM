package com.sap.c4p.rm.projectintegrationadapter.repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.CdsLockTimeoutException;
import com.sap.cds.Result;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.projectintegrationadapter.auditlog.AuditChangeLog;
import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.enums.AssignmentEvents;

import com.sap.resourcemanagement.assignment.AssignmentBuckets;
import com.sap.resourcemanagement.assignment.AssignmentBuckets_;
import com.sap.resourcemanagement.assignment.Assignments;
import com.sap.resourcemanagement.assignment.AssignmentsView;
import com.sap.resourcemanagement.assignment.AssignmentsView_;
import com.sap.resourcemanagement.assignment.Assignments_;
import com.sap.resourcemanagement.assignment.ResourceAggregatedBookedCapacity_;
import com.sap.resourcemanagement.integration.SupplySync;
import com.sap.resourcemanagement.integration.SupplySyncDetails;
import com.sap.resourcemanagement.integration.SupplySyncDetails_;
import com.sap.resourcemanagement.integration.SupplySync_;
import com.sap.resourcemanagement.project.Demands;
import com.sap.resourcemanagement.resource.BookedCapacityAggregate;
import com.sap.resourcemanagement.resource.BookedCapacityAggregate_;
import com.sap.resourcemanagement.resource.CapacityView;
import com.sap.resourcemanagement.resource.CapacityView_;
import com.sap.resourcemanagement.resource.ResourceDetails;
import com.sap.resourcemanagement.resource.ResourceDetails_;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests_;
import com.sap.resourcemanagement.supply.AssignmentBucketsYearMonthAggregate;
import com.sap.resourcemanagement.supply.AssignmentBucketsYearMonthAggregate_;
import com.sap.resourcemanagement.supply.ResourceSupply;
import com.sap.resourcemanagement.supply.ResourceSupplyDetails;
import com.sap.resourcemanagement.supply.ResourceSupplyDetails_;
import com.sap.resourcemanagement.supply.ResourceSupply_;

@Component
public class AssignmentRepository {

  private static final int PUBLISHED = 1;
  private static final int OPEN = 0;
  private final PersistenceService persistenceService;
  private AuditChangeLog auditChangeLog;

  private static final String ASSIGNMENT_OBJECT = "Assignment";
  private static final String ASSIGNMENT_SERVICE_IDENTIFIER = "Job Scheduler Assignment";

  private static final Logger logger = LoggerFactory.getLogger(AssignmentRepository.class);
  private static final Marker SUPPLY_REPLICATION_MARKER = LoggingMarker.SUPPLY_REPLICATION_MARKER.getMarker();
  private static final int ZERO = 0;

  @Autowired
  public AssignmentRepository(PersistenceService persistenceService, AuditChangeLog auditChangeLog) {
    this.persistenceService = persistenceService;
    this.auditChangeLog = auditChangeLog;
  }

  public void insertAssignmentAndSupply(Assignments assignment, String resourceSupplyId) {

    CqnInsert insertAssignment = Insert.into(Assignments_.class).entry(assignment);
    persistenceService.run(insertAssignment);

    ResourceSupply resourceSupply = ResourceSupply.create();
    resourceSupply.setAssignmentId(assignment.getId());
    resourceSupply.setResourceSupplyId(resourceSupplyId);
    CqnInsert insertSupply = Insert.into(ResourceSupply_.class).entry(resourceSupply);
    persistenceService.run(insertSupply);

    Optional<AssignmentsView> assignmentDetails = getAssignment(assignment.getId());
    if (assignmentDetails.isPresent()) {
      updateResourceBookedCapacityForPeriod(assignmentDetails.get().getResourceId(),
          assignmentDetails.get().getStartTime(), assignmentDetails.get().getEndTime());
      updateAssignmentHeaderBookedCapacity(assignment.getId());
    }
    auditChangeLog.logDataModificationAuditMessage(ASSIGNMENT_OBJECT, ASSIGNMENT_SERVICE_IDENTIFIER,
        getAssignmentDetailsForAuditLogs(assignment.getId()), AssignmentEvents.ASSIGNMENT_CREATION);
  }

  public void insertAssignmentBuckets(List<AssignmentBuckets> bucketsToInsert) {

    if (bucketsToInsert.isEmpty())
      return;

    CqnInsert insert = Insert.into(AssignmentBuckets_.CDS_NAME).entries(bucketsToInsert);
    persistenceService.run(insert);

    Instant startTime = bucketsToInsert.stream().map(AssignmentBuckets::getStartTime).min((a, b) -> a.compareTo(b))
        .orElse(Instant.MIN);
    Instant endTime = bucketsToInsert.stream().map(AssignmentBuckets::getStartTime).max((a, b) -> a.compareTo(b))
        .orElse(Instant.MAX);

    Optional<AssignmentsView> assignmentDetails = getAssignment(bucketsToInsert.get(0).getAssignmentId());
    if (assignmentDetails.isPresent()) {
      updateResourceBookedCapacityForPeriod(assignmentDetails.get().getResourceId(), startTime, endTime);
      updateAssignmentHeaderBookedCapacity(assignmentDetails.get().getAssignmentId());
    }
  }

  public void deleteAssignment(String assignmentId) {

    logger.info("Deleting assignment {} and corresponding supply", assignmentId);

    // Read assignment details before deleting for use later
    Optional<AssignmentsView> assignmentDetails = getAssignment(assignmentId);

    CqnDelete deleteSupply = Delete.from(ResourceSupply_.CDS_NAME)
        .where(b -> b.get(ResourceSupply.ASSIGNMENT_ID).eq(assignmentId));
    persistenceService.run(deleteSupply);

    CqnDelete deleteAssignment = Delete.from(Assignments_.CDS_NAME).where(b -> b.get(Assignments.ID).eq(assignmentId));
    persistenceService.run(deleteAssignment);

    if (assignmentDetails.isPresent()) {
      updateResourceBookedCapacityForPeriod(assignmentDetails.get().getResourceId(),
          assignmentDetails.get().getStartTime(), assignmentDetails.get().getEndTime());
    }
    auditChangeLog.logDataModificationAuditMessage(ASSIGNMENT_OBJECT, ASSIGNMENT_SERVICE_IDENTIFIER,
        getAssignmentDetailsForAuditLogs(assignmentId), AssignmentEvents.ASSIGNMENT_DELETION);
  }

  public void deleteAssignmentBuckets(List<AssignmentBuckets> bucketsToDelete) {

    if (bucketsToDelete.isEmpty())
      return;

    Instant startTime = Instant.MAX;
    Instant endTime = Instant.MIN;
    List<String> bucketsToDeleteIdList = new ArrayList<>(bucketsToDelete.size());
    for (AssignmentBuckets bucket : bucketsToDelete) {
      bucketsToDeleteIdList.add(bucket.getId());
      startTime = startTime.isAfter(bucket.getStartTime()) ? bucket.getStartTime() : startTime;
      endTime = endTime.isBefore(bucket.getStartTime()) ? bucket.getStartTime() : endTime;
    }

    // Read assignment info before deleting the assignment
    Optional<AssignmentsView> assignmentDetails = getAssignment(bucketsToDelete.get(0).getAssignmentId());

    CqnDelete delete = Delete.from(AssignmentBuckets_.CDS_NAME)
        .where(b -> b.get(AssignmentBuckets.ID).in(bucketsToDeleteIdList));
    persistenceService.run(delete);

    if (assignmentDetails.isPresent()) {
      updateResourceBookedCapacityForPeriod(assignmentDetails.get().getResourceId(), startTime, endTime);
      updateAssignmentHeaderBookedCapacity(assignmentDetails.get().getAssignmentId());
    }
  }

  public void updateAssignmentBuckets(String assignmentId, List<AssignmentBuckets> bucketsToInsert,
      List<AssignmentBuckets> bucketsToDelete) {

    deleteAssignmentBuckets(bucketsToDelete);
    insertAssignmentBuckets(bucketsToInsert);

    auditChangeLog.logDataModificationAuditMessage(ASSIGNMENT_OBJECT, ASSIGNMENT_SERVICE_IDENTIFIER,
        getAssignmentDetailsForAuditLogs(assignmentId), AssignmentEvents.ASSIGNMENT_UPDATE);
  }

  public void deleteAssignmentsForResourceRequests(String resourceRequestId) {

    CqnSelect selectAssignmentsToDelete = Select.from(Assignments_.CDS_NAME)
        .where(b -> b.get(Assignments.RESOURCE_REQUEST_ID).eq(resourceRequestId));
    List<Assignments> assignmentsToDeleteList = persistenceService.run(selectAssignmentsToDelete)
        .listOf(Assignments.class);

    if (assignmentsToDeleteList == null || assignmentsToDeleteList.isEmpty()) {
      logger.info(SUPPLY_REPLICATION_MARKER, "No assignments for deletion found for resource request {}",
          resourceRequestId);
      return;
    }
    deleteAssignments(assignmentsToDeleteList);
  }

  public void deleteAssignmentsForResourceSupply(List<ResourceSupplyDetails> resourceSupplyDetailsList) {
    resourceSupplyDetailsList.stream()
        .forEach(resourceSupplyDetails -> deleteAssignment(resourceSupplyDetails.getAssignmentId()));
  }

  public void deleteAssignments(List<Assignments> existingAssignmentInRMList) {
    existingAssignmentInRMList.stream().forEach(assignment -> deleteAssignment(assignment.getId()));
  }

  public void deleteDemandFromSupplySyncTable(SupplySyncDetails demand) {
    CqnDelete delete = Delete.from(SupplySync_.CDS_NAME).where(b -> b.get(SupplySync.DEMAND).eq(demand.getDemand()));
    persistenceService.run(delete);
  }

  private void updateResourceBookedCapacityForPeriod(String resourceId, Instant startTime, Instant endTime) {

    acquireLockOnBookedCapacityAggregateTableRecords(resourceId, startTime, endTime);

    logger.info("Invoking getResourceBookedCapacityAggregate for resourceId {} for period {} to {}", resourceId,
        startTime, endTime);
    List<BookedCapacityAggregate> bookedCapacityAggregateRecordList = getResourceBookedCapacityAggregate(resourceId,
        startTime, endTime);

    logger.info("Upserting {} records now", bookedCapacityAggregateRecordList.size());
    CqnUpsert upsert = Upsert.into(BookedCapacityAggregate_.CDS_NAME).entries(bookedCapacityAggregateRecordList);
    persistenceService.run(upsert);

    logger.info("Deleting records with ZERO bookedCapacity");
    CqnDelete delete = Delete.from(BookedCapacityAggregate_.class)
        .where(r -> r.resourceID().eq(resourceId).and(r.bookedCapacityInMinutes().le(ZERO)));
    persistenceService.run(delete);
  }

  private void acquireLockOnBookedCapacityAggregateTableRecords(String resourceId, Instant lockFrom, Instant lockTill) {
    CqnSelect selectRecordsToLock = Select.from(BookedCapacityAggregate_.class)
        .where(b -> b.resourceID().eq(resourceId).and(b.startTime().between(lockFrom, lockTill))).lock();
    try {
      persistenceService.run(selectRecordsToLock);
      logger.info("Successfully acquired lock for resourceId {} from {} to {}", resourceId, lockFrom, lockTill);
    } catch (CdsLockTimeoutException lockTimeOutException) {
      logger.warn(
          "Could not acquire lock on the table {} for resourceId {} between {} to {}. Caught CdsLockTimeoutException: {}",
          BookedCapacityAggregate_.CDS_NAME, resourceId, lockFrom, lockTill, lockTimeOutException);
      // Raising ServiceException to roll back transaction
      throw new ServiceException("Resource capacity has changed in the background. Please refresh the page and retry");
    }
  }

  private void updateAssignmentHeaderBookedCapacity(String assignmentId) {

    List<AssignmentBuckets> bucketList = getAssignmentBuckets(assignmentId);
    int totalBookedCapacityInMinutes = bucketList.stream().map(b -> b.getBookedCapacityInMinutes()).reduce(0,
        (a, b) -> a + b);

    CqnUpdate updateHeaderCommand = Update.entity(Assignments_.CDS_NAME)
        .data(Assignments.BOOKED_CAPACITY_IN_MINUTES, totalBookedCapacityInMinutes).byId(assignmentId);
    persistenceService.run(updateHeaderCommand);
  }

  /*
   * Database Commands (Create/Update/Delete) methods till here and Database query
   * (Read) methods from here onwards
   */
  public Optional<ResourceRequests> getResourceRequestForDemand(String demandExternalId, String workPackageId) {
    CqnSelect select = Select.from(ResourceRequests_.CDS_NAME).columns(ResourceRequests.ID)
        .where(b -> b.to(ResourceRequests.DEMAND).get(Demands.EXTERNAL_ID).eq(demandExternalId).and(
            b.get(ResourceRequests.WORKPACKAGE_ID).eq(workPackageId),
            b.get(ResourceRequests.RELEASE_STATUS_CODE).eq(PUBLISHED),
            b.get(ResourceRequests.REQUEST_STATUS_CODE).eq(OPEN)));
    return persistenceService.run(select).first(ResourceRequests.class);
  }

  public List<AssignmentBucketsYearMonthAggregate> getExistingMonthlyAggregatedAssignments(String demandExternalId,
      String workPackageId, String resourceSupplyId) {
    Optional<ResourceSupplyDetails> resourceSupplyDetailsForS4Demand = getResourceSupplyDetailsForS4Demand(
        demandExternalId, workPackageId, resourceSupplyId);
    if (resourceSupplyDetailsForS4Demand.isPresent()) {
      String correspondingAssignmentIdForSupply = resourceSupplyDetailsForS4Demand.get().getAssignmentId();
      CqnSelect selectMonthlyAggregatedAssignments = Select.from(AssignmentBucketsYearMonthAggregate_.CDS_NAME)
          .columns(AssignmentBucketsYearMonthAggregate.ASSIGNMENT_ID, AssignmentBucketsYearMonthAggregate.YEAR_MONTH,
              AssignmentBucketsYearMonthAggregate.BOOKED_CAPACITY_IN_HOURS)
          .where(b -> b.get(AssignmentBucketsYearMonthAggregate.ASSIGNMENT_ID).eq(correspondingAssignmentIdForSupply));
      return persistenceService.run(selectMonthlyAggregatedAssignments)
          .listOf(AssignmentBucketsYearMonthAggregate.class);
    }
    return Collections.emptyList();
  }

  public Optional<AssignmentsView> getExistingAssignmentDetails(String demandExternalId, String workPackageId,
      String resourceSupplyId) {
    Optional<ResourceSupplyDetails> resourceSupplyDetailsForS4Demand = getResourceSupplyDetailsForS4Demand(
        demandExternalId, workPackageId, resourceSupplyId);
    if (resourceSupplyDetailsForS4Demand.isPresent()) {
      String correspondingAssignmentIdForSupply = resourceSupplyDetailsForS4Demand.get().getAssignmentId();
      return getAssignment(correspondingAssignmentIdForSupply);
    }
    return Optional.empty();
  }

  public Optional<ResourceSupplyDetails> getResourceSupplyDetailsForS4Demand(String demandExternalId,
      String workPackageId, String resourceSupplyId) {
    CqnSelect select = Select.from(ResourceSupplyDetails_.CDS_NAME).columns(ResourceSupplyDetails.ASSIGNMENT_ID)
        .where(b -> b.get(ResourceSupplyDetails.RESOURCE_DEMAND).eq(demandExternalId).and(
            b.get(ResourceSupplyDetails.WORK_PACKAGE).eq(workPackageId),
            b.get(ResourceSupplyDetails.RESOURCE_SUPPLY).eq(resourceSupplyId)));
    return persistenceService.run(select).first(ResourceSupplyDetails.class);
  }

  public List<AssignmentBuckets> getAssignmentBucketsForPeriod(String assignmentId, Instant startTime,
      Instant endTime) {
    CqnSelect select = Select.from(AssignmentBuckets_.class).columns(AssignmentBuckets_::_all)
        .where(b -> b.assignment_ID().eq(assignmentId).and(b.startTime().ge(startTime), b.startTime().le(endTime)));
    return persistenceService.run(select).listOf(AssignmentBuckets.class);
  }

  public List<AssignmentBuckets> getAssignmentBuckets(String assignmentId) {
    CqnSelect select = Select.from(AssignmentBuckets_.class).columns(AssignmentBuckets_::_all)
        .where(b -> b.assignment_ID().eq(assignmentId));
    return persistenceService.run(select).listOf(AssignmentBuckets.class);
  }

  public List<CapacityView> getResourceCapacities(final String resourceID, final Instant startTime,
      final Instant endTime) {
    CqnSelect sel = Select.from(CapacityView_.class).columns(CapacityView_::_all).where(b -> b.resource_id()
        .eq(resourceID).and(b.startTime().ge(startTime), b.startTime().le(endTime), b.workingTimeInMinutes().gt(0)));
    List<CapacityView> resourceCapacityList = persistenceService.run(sel).listOf(CapacityView.class);
    if (resourceCapacityList.isEmpty()) {
      logger.warn(SUPPLY_REPLICATION_MARKER, "Resource {} has no capacity from period {} to {}", resourceID, startTime,
          endTime);
    }
    return resourceCapacityList;
  }

  public String getResourceStaffedOnAssignment(String assignmentId) {
    CqnSelect select = Select.from(Assignments_.CDS_NAME).columns(Assignments.RESOURCE_ID)
        .where(b -> b.get(Assignments.ID).eq(assignmentId));
    return persistenceService.run(select).single(Assignments.class).getResourceId();
  }

  public List<SupplySyncDetails> getRMDemandIdsToQuerySupplyFor() {
    CqnSelect selectDemandId = Select.from(SupplySyncDetails_.CDS_NAME).columns(SupplySyncDetails.DEMAND,
        SupplySyncDetails.RESOURCE_DEMAND, SupplySyncDetails.WORK_PACKAGE);
    return persistenceService.run(selectDemandId).listOf(SupplySyncDetails.class);
  }

  public Optional<ResourceDetails> getResourceForWorkforcePersonUserID(final String workForcePersonUserId) {
    CqnSelect selectResource = Select.from(ResourceDetails_.CDS_NAME).columns(ResourceDetails.RESOURCE_ID)
        .where(b -> b.get(ResourceDetails.WORK_ASSIGNMENT_ID).eq(workForcePersonUserId));
    return persistenceService.run(selectResource).first(ResourceDetails.class);
  }

  public Optional<String> getResourceRequestIdForS4Demand(String demandExternalId, String workPackageId) {
    CqnSelect selectResourceRequest = Select.from(ResourceRequests_.class).columns(ResourceRequests.ID)
        .where(b -> b.to(ResourceRequests.DEMAND).get(Demands.EXTERNAL_ID).eq(demandExternalId)
            .and(b.workpackage_ID().eq(workPackageId)));
    Optional<ResourceRequests> resourceRequestResult = persistenceService.run(selectResourceRequest)
        .first(ResourceRequests.class);
    if (resourceRequestResult.isPresent()) {
      return Optional.of(resourceRequestResult.get().getId());
    }
    return Optional.empty();
  }

  public List<Assignments> getAllAssignmentsForS4Demand(String demandExternalId, String workPackageId) {
    Optional<String> resourceRequestId = getResourceRequestIdForS4Demand(demandExternalId, workPackageId);
    if (resourceRequestId.isPresent()) {
      CqnSelect selectAssignments = Select.from(Assignments_.class).columns(Assignments_::_all)
          .where(b -> b.resourceRequest_ID().eq(resourceRequestId.get()));
      return persistenceService.run(selectAssignments).listOf(Assignments.class);
    }
    return Collections.emptyList();
  }

  public Optional<Assignments> getAssignmentForResourceAndRequest(final String resourceID, final String requestID) {
    CqnSelect sel = Select.from(Assignments_.class).columns(Assignments_::_all)
        .where(b -> b.resourceRequest_ID().eq(requestID).and(b.resource_ID().eq(resourceID)));
    return persistenceService.run(sel).first(Assignments.class);
  }

  public Optional<ResourceRequests> getResourceRequestDetails(final String resourceRequestID) {
    CqnSelect sel = Select.from(ResourceRequests_.class).columns(ResourceRequests_::_all)
        .where(b -> b.ID().eq(resourceRequestID));
    return persistenceService.run(sel).first(ResourceRequests.class);
  }

  public List<ResourceSupplyDetails> getExistingAssignmentsForS4Demand(String demandExternalId, String workPackageId) {
    CqnSelect select = Select.from(ResourceSupplyDetails_.CDS_NAME).columns(ResourceSupplyDetails.ASSIGNMENT_ID)
        .where(b -> b.get(ResourceSupplyDetails.RESOURCE_DEMAND).eq(demandExternalId)
            .and(b.get(ResourceSupplyDetails.WORK_PACKAGE).eq(workPackageId)));
    return persistenceService.run(select).listOf(ResourceSupplyDetails.class);
  }

  public Optional<AssignmentsView> getAssignmentAggregateDetails(String assignmentId) {
    CqnSelect selectAssignmentDetails = Select.from(AssignmentsView_.class).columns(AssignmentsView_::_all)
        .where(b -> b.assignment_ID().eq(assignmentId));
    return persistenceService.run(selectAssignmentDetails).first(AssignmentsView.class);
  }

  public List<AssignmentBucketsYearMonthAggregate> getExistingMonthlyAggregatedAssignments(String assignmentId) {
    CqnSelect selectMonthlyAggregatedAssignments = Select.from(AssignmentBucketsYearMonthAggregate_.CDS_NAME)
        .columns(AssignmentBucketsYearMonthAggregate.ASSIGNMENT_ID, AssignmentBucketsYearMonthAggregate.YEAR_MONTH,
            AssignmentBucketsYearMonthAggregate.BOOKED_CAPACITY_IN_HOURS)
        .where(b -> b.get(AssignmentBucketsYearMonthAggregate.ASSIGNMENT_ID).eq(assignmentId));
    return persistenceService.run(selectMonthlyAggregatedAssignments).listOf(AssignmentBucketsYearMonthAggregate.class);
  }

  private List<BookedCapacityAggregate> getResourceBookedCapacityAggregate(String resourceId, Instant start,
      Instant end) {
    CqnSelect selectBookedCapacityAggregate = Select.from(ResourceAggregatedBookedCapacity_.class)
        .columns(r -> r.resource_id().as(BookedCapacityAggregate.RESOURCE_ID),
            r -> r.startTime().as(BookedCapacityAggregate.START_TIME),
            r -> r.totalResourceBookedCapacityInMinutes().as(BookedCapacityAggregate.BOOKED_CAPACITY_IN_MINUTES),
            r -> r.totalResourceSoftBookedCapacityInMinutes()
                .as(BookedCapacityAggregate.SOFT_BOOKED_CAPACITY_IN_MINUTES))
        .where(r -> r.resource_id().eq(resourceId).and(r.startTime().between(start, end)));
    return persistenceService.run(selectBookedCapacityAggregate).listOf(BookedCapacityAggregate.class);
  }

  private Optional<AssignmentsView> getAssignment(String assignmentId) {
    CqnSelect selectAssignmentDetails = Select.from(AssignmentsView_.class).columns(AssignmentsView_::_all)
        .where(b -> b.get(AssignmentsView.ASSIGNMENT_ID).eq(assignmentId));
    return persistenceService.run(selectAssignmentDetails).first(AssignmentsView.class);
  }

  private Result getAssignmentDetailsForAuditLogs(String assignmentId) {
    CqnSelect sel = Select.from(AssignmentsView_.class).columns(AssignmentsView_::_all)
        .where(b -> b.assignment_ID().eq(assignmentId));
    return persistenceService.run(sel);
  }

}