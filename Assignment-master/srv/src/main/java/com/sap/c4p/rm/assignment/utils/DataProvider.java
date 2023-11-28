package com.sap.c4p.rm.assignment.utils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.sap.cds.Row;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.runtime.CdsRuntime;

import com.sap.resourcemanagement.assignment.AssignmentBuckets;
import com.sap.resourcemanagement.assignment.AssignmentBucketsForYearWeek;
import com.sap.resourcemanagement.assignment.AssignmentBucketsForYearWeek_;
import com.sap.resourcemanagement.assignment.AssignmentBuckets_;
import com.sap.resourcemanagement.assignment.AssignmentStatus;
import com.sap.resourcemanagement.assignment.AssignmentStatus_;
import com.sap.resourcemanagement.assignment.Assignments;
import com.sap.resourcemanagement.assignment.Assignments_;
import com.sap.resourcemanagement.assignment.ResourceAggregatedBookedCapacity_;
import com.sap.resourcemanagement.capacitygridassignment.AssignmentBucketsYearMonth;
import com.sap.resourcemanagement.capacitygridassignment.AssignmentBucketsYearMonth_;
import com.sap.resourcemanagement.capacitygridassignment.AssignmentBucketsYearWeek;
import com.sap.resourcemanagement.capacitygridassignment.AssignmentBucketsYearWeek_;
import com.sap.resourcemanagement.capacitygridassignment.ResourceRequestAssignmentAggregate;
import com.sap.resourcemanagement.capacitygridassignment.ResourceRequestAssignmentAggregate_;
import com.sap.resourcemanagement.config.ResourceOrganizationItemsView;
import com.sap.resourcemanagement.config.ResourceOrganizationItemsView_;
import com.sap.resourcemanagement.organization.DeliveryOrganizationCostCenters;
import com.sap.resourcemanagement.organization.DeliveryOrganizationCostCenters_;
import com.sap.resourcemanagement.resource.BookedCapacityAggregate;
import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Capacity_;
import com.sap.resourcemanagement.resource.Headers;
import com.sap.resourcemanagement.resource.Headers_;
import com.sap.resourcemanagement.resource.ResourceDetails;
import com.sap.resourcemanagement.resource.ResourceDetailsForTimeWindow;
import com.sap.resourcemanagement.resource.ResourceDetailsForTimeWindow_;
import com.sap.resourcemanagement.resource.ResourceDetails_;
import com.sap.resourcemanagement.resource.Types;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements;
import com.sap.resourcemanagement.resourcerequest.CapacityRequirements_;
import com.sap.resourcemanagement.resourcerequest.ResourceRequestDetails;
import com.sap.resourcemanagement.resourcerequest.ResourceRequestDetails_;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests_;
import com.sap.resourcemanagement.supply.AssignmentBucketsYearMonthAggregate;
import com.sap.resourcemanagement.supply.AssignmentBucketsYearMonthAggregate_;
import com.sap.resourcemanagement.system.data.timedimension.Data;
import com.sap.resourcemanagement.system.data.timedimension.Data_;
import com.sap.resourcemanagement.workforce.workassignment.ExtnWorkAssignmentFirstJobDetails;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignmentFirstJobDetails;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignmentFirstJobDetails_;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments_;
import com.sap.resourcemanagement.workforce.workforceperson.Emails;

import assignment.MonthlyAssignmentDistribution;
import assignment.MonthlyAssignmentDistribution_;
import assignment.WeeklyAssignmentDistribution;
import assignment.WeeklyAssignmentDistribution_;
import assignmentservice.AssignmentService_;

@Component
public class DataProvider {

  private static final int START_OF_WEEK = 1;
  private static final int END_OF_WEEK = 7;
  private PersistenceService persistenceService;
  private DraftService draftService;
  private CdsRuntime cdsRuntime;

  @Autowired
  public DataProvider(PersistenceService persistenceService,
      @Qualifier(AssignmentService_.CDS_NAME) DraftService draftService, CdsRuntime cdsRuntime) {
    this.persistenceService = persistenceService;
    this.draftService = draftService;
    this.cdsRuntime = cdsRuntime;
  }

  public List<Capacity> getResourceCapacities(final String resourceID) {

    CqnSelect sel = Select.from(Capacity_.class).columns(Capacity_::_all).where(b -> b.resource_id().eq(resourceID));

    return persistenceService.run(sel).listOf(Capacity.class);
  }

  public List<Capacity> getResourceCapacities(final String resourceID, final Instant startTime, final Instant endTime) {

    CqnSelect sel = Select.from(Capacity_.class).columns(Capacity_::_all)
        .where(b -> b.resource_id().eq(resourceID).and(b.startTime().ge(startTime), b.startTime().le(endTime)))
        .orderBy(Capacity.START_TIME);

    return persistenceService.run(sel).listOf(Capacity.class);
  }

  public Optional<ResourceRequests> getRequestData(final String requestID) {

    CqnSelect sel = Select.from(ResourceRequests_.class).columns(ResourceRequests_::_all)
        .where(b -> b.ID().eq(requestID));

    return persistenceService.run(sel).first(ResourceRequests.class);
  }

  public Optional<ResourceRequestDetails> getRequestDetails(final String requestID) {

    CqnSelect sel = Select.from(ResourceRequestDetails_.class).columns(ResourceRequestDetails_::_all)
        .where(b -> b.Id().eq(requestID));

    return persistenceService.run(sel).first(ResourceRequestDetails.class);
  }

  public Optional<AssignmentStatus> getAssignmentStatus(final Integer code) {

    CqnSelect sel = Select.from(AssignmentStatus_.class).columns(AssignmentStatus_::_all).where(b -> b.code().eq(code));

    return persistenceService.run(sel).first(AssignmentStatus.class);
  }

  public Optional<ResourceRequestAssignmentAggregate> getResourceRequestAssignmentAggregateData(
      final String requestID) {

    CqnSelect sel = Select.from(ResourceRequestAssignmentAggregate_.class)
        .columns(ResourceRequestAssignmentAggregate_::_all).where(b -> b.resourceRequest_ID().eq(requestID));

    return persistenceService.run(sel).first(ResourceRequestAssignmentAggregate.class);
  }

  public Optional<Headers> getResourceData(final String resourceID) {

    CqnSelect sel = Select.from(Headers_.class).columns(Headers_::_all).where(b -> b.ID().eq(resourceID));

    return persistenceService.run(sel).first(Headers.class);
  }

  public Optional<ExtnWorkAssignmentFirstJobDetails> getResourceValidity(Instant startDate, Instant endDate,
      final String resourceId, final String resourceOrg) {

    ResourceValidityUtility resourceValidityUtility = new ResourceValidityUtility();
    return resourceValidityUtility.getResourceValidityForTheGivenPeriodAndResourceOrg(startDate, endDate, resourceId,
        resourceOrg, persistenceService, cdsRuntime);

  }

  public List<CapacityRequirements> getRequestCapacityRequirements(final String resourceRequestId) {

    CqnSelect sel = Select.from(CapacityRequirements_.class).columns(CapacityRequirements_::_all)
        .where(b -> b.resourceRequest_ID().eq(resourceRequestId)).orderBy(b -> b.startTime().asc());

    return persistenceService.run(sel).listOf(CapacityRequirements.class);
  }

  public Optional<Types> getResourceBookingGranularityInMinutes(final String resourceID) {

    CqnSelect sel = Select.from(Headers_.class)
        .columns(b -> b.to(Headers.TYPE).get(Types.BOOKING_GRANULARITY_IN_MINUTES)).where(b -> b.ID().eq(resourceID));

    return persistenceService.run(sel).first(Types.class);
  }

  public Optional<Assignments> getAssignmentForResourceAndRequest(final String resourceID, final String requestID) {

    CqnSelect sel = Select.from(Assignments_.class).columns(Assignments_::_all)
        .where(b -> b.resourceRequest_ID().eq(requestID).and(b.resource_ID().eq(resourceID)));

    return persistenceService.run(sel).first(Assignments.class);
  }

  public Optional<Assignments> getAssignmentHeader(final String assignmentHeaderId) {

    CqnSelect sel = Select.from(Assignments_.class).columns(Assignments_::_all)
        .where(b -> b.ID().eq(assignmentHeaderId));

    return persistenceService.run(sel).first(Assignments.class);
  }

  public Optional<ResourceDetails> getResourceEmploymentDetails(final String resourceId) {

    CqnSelect sel = Select.from(ResourceDetails_.class).columns(ResourceDetails_::_all)
        .where(b -> b.resource_ID().eq(resourceId));

    return persistenceService.run(sel).first(ResourceDetails.class);
  }

  public List<DeliveryOrganizationCostCenters> getlistCostCenters(List<String> requestDeliveryOrgList) {

    if (requestDeliveryOrgList.isEmpty())
      return Collections.emptyList();

    CqnSelect sel = Select.from(DeliveryOrganizationCostCenters_.class).columns(DeliveryOrganizationCostCenters_::_all)
        .where(b -> b.deliveryOrganizationCode().in(requestDeliveryOrgList));

    return persistenceService.run(sel).listOf(DeliveryOrganizationCostCenters.class);
  }

  public List<ResourceOrganizationItemsView> getlistCostCentersForResourceOrgs(List<String> resourceOrgList) {

    if (resourceOrgList.isEmpty())
      return Collections.emptyList();

    CqnSelect sel = Select.from(ResourceOrganizationItemsView_.class).columns(ResourceOrganizationItemsView_::_all)
        .where(b -> b.ID().in(resourceOrgList));

    return persistenceService.run(sel).listOf(ResourceOrganizationItemsView.class);
  }

  public Optional<ResourceDetailsForTimeWindow> getMatchingTimeSlice(String resourceId) {

    CqnSelect sel = Select.from(ResourceDetailsForTimeWindow_.class).where(c -> c.resource_ID().eq(resourceId));

    return persistenceService.run(sel).first(ResourceDetailsForTimeWindow.class);
  }

  public List<AssignmentBuckets> getAssignmentBuckets(String assignmentHeaderId) {

    CqnSelect sel = Select.from(AssignmentBuckets_.class).columns(AssignmentBuckets_::_all)
        .where(b -> b.assignment_ID().eq(assignmentHeaderId));

    return persistenceService.run(sel).listOf(AssignmentBuckets.class);
  }

  public Optional<WorkAssignments> getWorkAssignmentDetails(String resourceId) {

    CqnSelect sel = Select.from(WorkAssignments_.class).columns(WorkAssignments_::_all)
        .where(b -> b.ID().eq(resourceId));

    return persistenceService.run(sel).first(WorkAssignments.class);
  }

  public List<AssignmentBucketsYearMonthAggregate> getMonthlyAggregatedAssignment(String assignmentId) {

    CqnSelect select = Select.from(AssignmentBucketsYearMonthAggregate_.class)
        .columns(AssignmentBucketsYearMonthAggregate_::_all).where(b -> b.assignment_ID().eq(assignmentId));

    return persistenceService.run(select).listOf(AssignmentBucketsYearMonthAggregate.class);
  }

  public List<AssignmentBucketsYearWeek> getWeeklyAssignmentDistribution(String assignmentId) {

    CqnSelect select = Select.from(AssignmentBucketsYearWeek_.class).columns(AssignmentBucketsYearWeek_::_all)
        .where(b -> b.assignment_ID().eq(assignmentId));

    return persistenceService.run(select).listOf(AssignmentBucketsYearWeek.class);
  }

  public List<AssignmentBucketsYearMonth> getMonthlyAssignmentDistribution(String assignmentId) {

    CqnSelect select = Select.from(AssignmentBucketsYearMonth_.class).columns(AssignmentBucketsYearMonth_::_all)
        .where(b -> b.assignment_ID().eq(assignmentId));

    return persistenceService.run(select).listOf(AssignmentBucketsYearMonth.class);
  }

  public List<WorkAssignmentFirstJobDetails> getCostCenterRecords(String resourceId) {

    CqnSelect sel = Select.from(WorkAssignmentFirstJobDetails_.class)
        .columns(c -> c.get(WorkAssignmentFirstJobDetails.COST_CENTER_EXTERNAL_ID),
            c -> c.get(WorkAssignmentFirstJobDetails.VALID_FROM), c -> c.get(WorkAssignmentFirstJobDetails.VALID_TO))
        .where(c -> c.parent().eq(resourceId));

    return persistenceService.run(sel).listOf(WorkAssignmentFirstJobDetails.class);
  }

  public List<assignmentservice.AssignmentBuckets> getAssignmentBucketsFromDraftService(String assignmentID) {

    CqnSelect sql = Select.from(assignmentservice.Assignments_.class)
        .columns(b -> b.to(assignmentservice.Assignments.ASSIGNMENT_BUCKETS).expand())
        .where(b -> b.ID().eq(assignmentID).and(b.IsActiveEntity().eq(Boolean.TRUE)));

    return draftService.run(sql).single(assignmentservice.Assignments.class).getAssignmentBuckets();
  }

  public assignmentservice.Assignments getAssignmentHeaderDraft(final String assignmentHeaderId) {

    CqnSelect sel = Select.from(assignmentservice.Assignments_.class).columns(assignmentservice.Assignments_::_all)
        .where(b -> b.ID().eq(assignmentHeaderId).and(b.IsActiveEntity().eq(Boolean.FALSE)));

    return draftService.run(sel).single(assignmentservice.Assignments.class);
  }

  public List<assignmentservice.AssignmentBuckets> getExistingAssignmentBucketsDrafts(String assignmentId,
      LocalDate startDate, LocalDate endDate) {

    Instant assignmentStartTime = startDate.atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant assignmentEndTime = endDate.atStartOfDay().toInstant(ZoneOffset.UTC);
    CqnSelect selectBucketInPeriod = Select.from(assignmentservice.AssignmentBuckets_.class)
        .where(b -> b.assignment_ID().eq(assignmentId)
            .and(b.startTime().between(assignmentStartTime, assignmentEndTime), b.IsActiveEntity().eq(false)));

    return draftService.run(selectBucketInPeriod).listOf(assignmentservice.AssignmentBuckets.class);
  }

  public List<assignmentservice.Assignments> getAssignmentHeaderDraftForResourceAndRequest(final String resourceID,
      final String requestID) {

    CqnSelect sel = Select.from(assignmentservice.Assignments_.class)
        .columns(assignmentservice.Assignments_::_all,
            b -> b.to(assignmentservice.Assignments.DRAFT_ADMINISTRATIVE_DATA).expand())
        .where(b -> b.resourceRequest_ID().eq(requestID).and(b.resource_ID().eq(resourceID)
            .and(b.HasActiveEntity().eq(Boolean.FALSE)).and(b.DraftAdministrativeData().InProcessByUser().isNot(""))));

    return draftService.run(sel).listOf(assignmentservice.Assignments.class);

  }

  public List<assignmentservice.AssignmentBuckets> getAssignmentBucketsDraft(final String assignmentHeaderId) {

    CqnSelect sel = Select.from(assignmentservice.AssignmentBuckets_.class)
        .columns(assignmentservice.AssignmentBuckets_::_all)
        .where(b -> b.assignment_ID().eq(assignmentHeaderId).and(b.IsActiveEntity().eq(Boolean.FALSE)));

    return draftService.run(sel).listOf(assignmentservice.AssignmentBuckets.class);
  }

  public assignmentservice.Assignments getAssignmentWithBuckets(String assignmentHeaderId) {

    CqnSelect selectHeader = Select.from(assignmentservice.Assignments_.class)
        .columns(assignmentservice.Assignments_::_all).where(b -> b.ID().eq(assignmentHeaderId));

    assignmentservice.Assignments assignment = persistenceService.run(selectHeader)
        .single(assignmentservice.Assignments.class);

    assignment.setAssignmentBuckets(getAssignmentServiceBuckets(assignmentHeaderId));

    return assignment;
  }

  public List<assignmentservice.AssignmentBuckets> getAssignmentServiceBuckets(String assignmentHeaderId) {

    CqnSelect selectBuckets = Select.from(assignmentservice.AssignmentBuckets_.class)
        .columns(assignmentservice.AssignmentBuckets_::_all).where(b -> b.assignment_ID().eq(assignmentHeaderId));

    return persistenceService.run(selectBuckets).listOf(assignmentservice.AssignmentBuckets.class);

  }

  public List<BookedCapacityAggregate> getResourceBookedCapacityAggregate(String resourceId, Instant start,
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

  public Optional<AssignmentBuckets> getSingleAssignmentBucket(String bucketId) {

    CqnSelect select = Select.from(AssignmentBuckets_.class).columns(AssignmentBuckets_::_all)
        .where(b -> b.ID().eq(bucketId));

    return persistenceService.run(select).first(AssignmentBuckets.class);

  }

  public Optional<AssignmentBuckets> getSingleAssignmentBucketByAssignmentAndTime(String assignmentId, Instant start) {

    CqnSelect select = Select.from(AssignmentBuckets_.class).columns(AssignmentBuckets_::_all)
        .where(b -> b.assignment_ID().eq(assignmentId).and(b.startTime().eq(start)));

    return persistenceService.run(select).first(AssignmentBuckets.class);

  }

  public Data getTimeDimensionDataForCalendarWeekStart(String calendarWeek) {
    return persistenceService
        .run(Select.from(Data_.class).columns(Data.DATETIMESTAMP, Data.DATE_SQL)
            .where(b -> b.DAY_OF_WEEK().eq(String.valueOf(START_OF_WEEK)).and(b.CALWEEK().eq(calendarWeek))))
        .first(Data.class).get();
  }

  public Data getTimeDimensionDataForCalendarWeekEnd(String calendarWeek) {
    return persistenceService
        .run(Select.from(Data_.class).columns(Data.DATETIMESTAMP, Data.DATE_SQL)
            .where(b -> b.DAY_OF_WEEK().eq(String.valueOf(END_OF_WEEK)).and(b.CALWEEK().eq(calendarWeek))))
        .first(Data.class).get();
  }

  public Optional<String> getEmailAddressOfStaffedResource(String assignmentId) {
    CqnSelect select = Select.from(Assignments_.class)
        .columns(a -> a.resource().workAssignment().toProfileData().defaultEmail().address())
        .where(b -> b.ID().eq(assignmentId));

    Optional<Row> returnedRecord = persistenceService.run(select).first();
    if (returnedRecord.isPresent()) {
      return Optional.of(returnedRecord.get().get(Emails.ADDRESS).toString());
    }
    return Optional.ofNullable(null);
  }

  public List<AssignmentBucketsForYearWeek> getExistingAssignmentBucketsForYearWeeks(String assignmentId,
      List<String> yearWeeks) {

    if (yearWeeks.isEmpty())
      return Collections.emptyList();

    CqnSelect select = Select.from(AssignmentBucketsForYearWeek_.class).columns(AssignmentBucketsForYearWeek_::_all)
        .where(b -> b.assignment_ID().eq(assignmentId).and(b.yearWeek().in(yearWeeks)));

    return persistenceService.run(select).listOf(AssignmentBucketsForYearWeek.class);
  }

  public Optional<WeeklyAssignmentDistribution> getWeeklyDistribution(String assignmentId, String calendarWeek) {
    return persistenceService
        .run(Select.from(WeeklyAssignmentDistribution_.class)
            .columns(WeeklyAssignmentDistribution.ASSIGNMENT_ID, WeeklyAssignmentDistribution.WEEK_START_DATE,
                WeeklyAssignmentDistribution.WEEK_END_DATE)
            .where(b -> b.assignmentID().eq(assignmentId).and(b.calendarWeek().eq(calendarWeek))))
        .first(WeeklyAssignmentDistribution.class);
  }

  public Optional<MonthlyAssignmentDistribution> getMonthlyDistribution(String assignmentId, String calendarMonth) {
    return persistenceService
        .run(Select.from(MonthlyAssignmentDistribution_.class)
            .columns(MonthlyAssignmentDistribution.ASSIGNMENT_ID, MonthlyAssignmentDistribution.MONTH_START_DATE,
                MonthlyAssignmentDistribution.MONTH_END_DATE)
            .where(b -> b.assignmentID().eq(assignmentId).and(b.calendarMonth().eq(calendarMonth))))
        .first(MonthlyAssignmentDistribution.class);
  }

}
