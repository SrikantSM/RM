package com.sap.c4p.rm.projectintegrationadapter.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.chrono.ChronoLocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataException;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceDmnd;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.enums.AssignmentStatus;
import com.sap.c4p.rm.projectintegrationadapter.repository.AssignmentRepository;

import com.sap.resourcemanagement.assignment.AssignmentBuckets;
import com.sap.resourcemanagement.assignment.Assignments;
import com.sap.resourcemanagement.assignment.AssignmentsView;
import com.sap.resourcemanagement.integration.SupplySyncDetails;
import com.sap.resourcemanagement.resource.CapacityView;
import com.sap.resourcemanagement.resource.ResourceDetails;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.supply.AssignmentBucketsYearMonthAggregate;

@Component
public class AssignmentService {

  private AssignmentRepository assignmentRepository;
  private static final int NUMBER_OF_MINUTES_IN_AN_HOUR = 60;

  private static final Logger logger = LoggerFactory.getLogger(AssignmentService.class);
  private static final Marker REP_CREATE_ASSIGNMENT_MARKER = LoggingMarker.REPLICATION_CREATE_ASSIGNMENT_MARKER
      .getMarker();
  private static final Marker REP_CHANGE_ASSIGNMENT_MARKER = LoggingMarker.REPLICATION_CHANGE_ASSIGNMENT_MARKER
      .getMarker();
  private static final Marker REP_DELETE_ASSIGNMENT_MARKER = LoggingMarker.REPLICATION_DELETE_ASSIGNMENT_MARKER
      .getMarker();

  @Autowired
  public AssignmentService(AssignmentRepository assignmentRepository) {
    this.assignmentRepository = assignmentRepository;
  }

  public List<SupplySyncDetails> getDemandsToQuerySupplyFor() {
    return assignmentRepository.getRMDemandIdsToQuerySupplyFor();
  }

  public void deleteDemandFromSupplySyncTable(SupplySyncDetails demand) {
    logger.info("Deleting demand {} work package {} from SupplySync DB table", demand.getResourceDemand(),
        demand.getWorkPackage());
    assignmentRepository.deleteDemandFromSupplySyncTable(demand);
  }

  public void deleteAssignmentsForResourceRequests(String resourceRequestId) {
    logger.info(REP_DELETE_ASSIGNMENT_MARKER, "Deleting all soft booked and hard booked assignments for request {}",
        resourceRequestId);
    assignmentRepository.deleteAssignmentsForResourceRequests(resourceRequestId);
  }

  public void createAssignment(List<EngmntProjRsceSup> resourceSuppliesFromS4List) {

    for (EngmntProjRsceSup resourceSupplies : resourceSuppliesFromS4List) {

      logger.info(REP_CREATE_ASSIGNMENT_MARKER,
          "Triggering assignment creation in RM for Supply = {}, ResourceDemand = {}, WorkPackage = {}",
          resourceSupplies.getResourceSupply(), resourceSupplies.getResourceDemand(),
          resourceSupplies.getWorkPackage());

      Optional<ResourceRequests> resourceRequestOptional = assignmentRepository
          .getResourceRequestForDemand(resourceSupplies.getResourceDemand(), resourceSupplies.getWorkPackage());
      if (!resourceRequestOptional.isPresent()) {
        logger.warn(REP_CREATE_ASSIGNMENT_MARKER,
            "Published and Open request not found in RM corresponding to WorkPackage {} and ResourceDemand {}."
                + " Supply could not be replicated.}",
            resourceSupplies.getWorkPackage(), resourceSupplies.getResourceDemand());
        continue;
      }

      Optional<ResourceDetails> resourceDetailsOptional = assignmentRepository
          .getResourceForWorkforcePersonUserID(resourceSupplies.getWorkforcePersonUserID());
      if (!resourceDetailsOptional.isPresent()) {
        logger.warn(REP_CREATE_ASSIGNMENT_MARKER, "Resource not found in RM corresponding to WorkforcePersonUserID {}",
            resourceSupplies.getWorkforcePersonUserID());
        continue;
      }

      String resourceSupplyId = resourceSupplies.getResourceSupply();
      if (resourceSupplyId == null || resourceSupplyId.isEmpty()) {
        logger.warn(REP_CREATE_ASSIGNMENT_MARKER, "Resource Supply ID not supplied by S4");
        continue;
      }

      String resourceRequestId = resourceRequestOptional.get().getId();
      String resourceId = resourceDetailsOptional.get().getResourceId();

      Optional<Assignments> existingAssignment = assignmentRepository.getAssignmentForResourceAndRequest(resourceId,
          resourceRequestId);
      if (existingAssignment.isPresent()) {
        if (existingAssignment.get().getAssignmentStatusCode().intValue() != AssignmentStatus.HARDBOOKED.getCode()) {
          logger.info(REP_CREATE_ASSIGNMENT_MARKER,
              "Non hard-booked assignment exists between resource {} and request {} in RM, deleting it and creating a hard booked assignment as per supply distribution",
              resourceId, resourceRequestId);
          assignmentRepository.deleteAssignment(existingAssignment.get().getId());
        } else {
          logger.info(REP_CREATE_ASSIGNMENT_MARKER,
              "Hard-booked assignment exists between resource {} and request {} in RM, skipping the re-creation during replication",
              resourceId, resourceRequestId);
          continue;
        }
      }

      logger.info(REP_CREATE_ASSIGNMENT_MARKER,
          "Creating hard booked assignment for requestId {}, resourceId {} and supply {}", resourceRequestId,
          resourceId, resourceSupplyId);
      createAssignmentAsPerDistribution(resourceRequestId, resourceId, resourceSupplyId,
          resourceSupplies.getResourceSupplyDistributionIfPresent().get());
    }
  }

  private void createAssignmentAsPerDistribution(String resourceRequestId, String resourceId, String resourceSupplyId,
      List<EngmntProjRsceSupDistr> supplyDistributionList) {

    if (supplyDistributionList.isEmpty()) {
      logger.warn(REP_CREATE_ASSIGNMENT_MARKER, "Supply distribution list is empty, assignment will not be created");
      return;
    }

    Optional<ResourceRequests> resourceRequest = assignmentRepository.getResourceRequestDetails(resourceRequestId);
    if (resourceRequest.isPresent()) {

      LocalDate requestStartDate = resourceRequest.get().getStartDate();
      LocalDate requestEndDate = resourceRequest.get().getEndDate();

      String newAssignmentHeaderId = UUID.randomUUID().toString();
      Assignments assignment = Assignments.create();
      assignment.setId(newAssignmentHeaderId);
      assignment.setResourceId(resourceId);
      assignment.setResourceRequestId(resourceRequestId);
      // Assignment CREATE during replication is always 'Hard-booked'
      assignment.setAssignmentStatusCode(AssignmentStatus.HARDBOOKED.getCode());

      List<AssignmentBuckets> assignmentBucketList = new ArrayList<>();
      int totalStaffedHours = 0;
      for (EngmntProjRsceSupDistr supplyDistributionRecord : supplyDistributionList) {
        String year = supplyDistributionRecord.getCalendarYear();
        String month = supplyDistributionRecord.getCalendarMonth();
        BigDecimal hoursToStaff = supplyDistributionRecord.getQuantity();
        totalStaffedHours += hoursToStaff.intValue();
        YearMonth currYearMonth = YearMonth.of(Integer.parseInt(year), Integer.parseInt(month));

        List<AssignmentBuckets> assignmentBucketsForCurrYearMonth = distributeAssignmentBucketsForYearMonth(resourceId,
            (LocalDate) getActualAssignmentStartDate(currYearMonth.atDay(1), requestStartDate),
            (LocalDate) getActualAssignmentEndDate(currYearMonth.atEndOfMonth(), requestEndDate),
            hoursToStaff.intValue(), newAssignmentHeaderId);
        assignmentBucketList.addAll(assignmentBucketsForCurrYearMonth);
      }

      if (assignmentBucketList.isEmpty()) {
        logger.info(REP_CREATE_ASSIGNMENT_MARKER,
            "No hard booked assignment created for request {} and resource {} as the total S4 staffed hours is Zero",
            resourceRequestId, resourceId);
        return;
      }

      assignment.setBookedCapacityInMinutes(totalStaffedHours * NUMBER_OF_MINUTES_IN_AN_HOUR);
      assignment.setAssignmentBuckets(assignmentBucketList);

      logger.info(REP_CREATE_ASSIGNMENT_MARKER, "Inserting Assignment {} with {} buckets and supply id {} in RM",
          newAssignmentHeaderId, assignmentBucketList.size(), resourceSupplyId);
      assignmentRepository.insertAssignmentAndSupply(assignment, resourceSupplyId);
    }
  }

  public void compareAndUpdateAssignmentsAsPerSupply(EngmntProjRsceDmnd resourceDemand,
      ResourceRequests resourceRequest) throws ODataException {

    deleteHardBookedAssignmentIfSupplyIsCompletelyDeleted(resourceDemand);

    if (resourceRequest == null) {
      logger.info(REP_CHANGE_ASSIGNMENT_MARKER, "Resource request is null, stopped further processing");
      return;
    }

    logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
        "Comparing Assignments and Supply for S4 demand {} and resourceRequest {}", resourceDemand.getResourceDemand(),
        resourceRequest.getId());

    LocalDate requestStartDate = resourceRequest.getStartDate();
    LocalDate requestEndDate = resourceRequest.getEndDate();

    List<Assignments> existingAssignmentsForS4Demand = assignmentRepository
        .getAllAssignmentsForS4Demand(resourceDemand.getResourceDemand(), resourceDemand.getWorkPackage());

    List<Assignments> existingNonHardBookedAssignmentsForS4Demand = existingAssignmentsForS4Demand.stream()
        .filter(asgn -> asgn.getAssignmentStatusCode().intValue() != AssignmentStatus.HARDBOOKED.getCode())
        .collect(Collectors.toList());

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = resourceDemand.getResourceSupplyOrFetch();

    if (resourceSuppliesFromS4List.isEmpty() && !existingNonHardBookedAssignmentsForS4Demand.isEmpty()) {
      logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
          "Supply does not exist in S4 for demand {}, work package {} but {} soft-booked/proposed/accepted assignments found in RM. Updating soft booked assignment dates if needed based on date updates in S4",
          resourceDemand.getResourceDemand(), resourceDemand.getWorkPackage(),
          existingNonHardBookedAssignmentsForS4Demand.size());
      updateNonHardBookedAssignmentBasedOnRequestDates(existingNonHardBookedAssignmentsForS4Demand, resourceRequest);
      return;
    }

    for (EngmntProjRsceSup resourceSupplies : resourceSuppliesFromS4List) {

      Optional<ResourceDetails> resourceDetails = assignmentRepository
          .getResourceForWorkforcePersonUserID(resourceSupplies.getWorkforcePersonUserID());
      if (!resourceDetails.isPresent()) {
        logger.warn(REP_CHANGE_ASSIGNMENT_MARKER, "ResourceId not found in RM for S4 workForcePersonUserID {}",
            resourceSupplies.getWorkforcePersonUserID());
        continue;
      }

      String resourceIdOfS4SupplyWorkForcePersonUser = resourceDetails.get().getResourceId();

      for (Assignments nonHardBookedAssignmentsForS4Demand : existingNonHardBookedAssignmentsForS4Demand) {

        if (nonHardBookedAssignmentsForS4Demand.getResourceId().equals(resourceIdOfS4SupplyWorkForcePersonUser)) {
          logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
              "Deleting soft-booked/proposed assignment {} found for demand {}, work package {}, workforcePerson {}. Corresponding hard booked assignment would be newly created",
              nonHardBookedAssignmentsForS4Demand.getId(), resourceSupplies.getResourceDemand(),
              resourceSupplies.getWorkPackage(), resourceSupplies.getWorkforcePersonUserID());
          assignmentRepository.deleteAssignment(nonHardBookedAssignmentsForS4Demand.getId());
        } else {
          logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
              "Soft-booked/Proposed assignment {} found for demand {}, work package {} but on different resource {}. Updating soft-booked/proposed assignment dates based on request dates",
              nonHardBookedAssignmentsForS4Demand.getId(), resourceSupplies.getResourceDemand(),
              resourceSupplies.getWorkPackage(), nonHardBookedAssignmentsForS4Demand.getResourceId());
          // The logic for adjustment based on request dates here is different because for
          // soft booked assignments we need not adhere to the S4 source of month-wise
          // staffed hours. We can simply delete buckets that lie outside the request
          // period
          updateNonHardBookedAssignmentBasedOnRequestDates(
              Collections.singletonList(nonHardBookedAssignmentsForS4Demand), resourceRequest);
        }
      }

      // Until now, we have deleted all soft-booked/proposed assignment for this
      // request-resource combination that match the
      // demand-workPackage-workforcePerson combination of supply from S4. We would
      // now create new hard booked assignment for such request-resource combination.
      // Also existing hard booked assignments will be adjusted based on the request
      // date changes if needed. Note that soft-booked/proposed assignments for the
      // request
      // have already been adjusted for date changes above
      updateHardBookedAssignments(resourceRequest, requestStartDate, requestEndDate, resourceSupplies);
    }
  }

  private void updateNonHardBookedAssignmentBasedOnRequestDates(
      List<Assignments> existingNonHardBookedAssignmentsForS4DemandList, ResourceRequests resourceRequest) {

    String resourceRequestId = resourceRequest.getId();
    Instant requestStartTime = resourceRequest.getStartTime();
    Instant requestEndTime = resourceRequest.getEndTime();

    for (Assignments existingNonHardBookedAssignmentsForS4Demand : existingNonHardBookedAssignmentsForS4DemandList) {

      String assignmentId = existingNonHardBookedAssignmentsForS4Demand.getId();

      int assignmentStatusCode = existingNonHardBookedAssignmentsForS4Demand.getAssignmentStatusCode();
      if (assignmentStatusCode == AssignmentStatus.REJECTED.getCode()) {
        logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
            "Rejected assignment {} found for request {}. Ignoring any adjustments to this assignment.", assignmentId,
            resourceRequestId);
        continue;
      }

      logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
          "Updating soft booked/proposed/accepted assignment {} for request {} with request start/end {} / {}",
          assignmentId, resourceRequestId, requestStartTime, requestEndTime);

      List<AssignmentBuckets> existingBuckets = assignmentRepository.getAssignmentBuckets(assignmentId);

      List<AssignmentBuckets> existingBucketsOutsideRequestPeriod = existingBuckets.stream().filter(
          bucket -> bucket.getStartTime().isBefore(requestStartTime) || !bucket.getStartTime().isBefore(requestEndTime))
          .collect(Collectors.toList());

      if (existingBucketsOutsideRequestPeriod.isEmpty()) {
        logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
            "Assignment {} lies completely within request {} period {} / {}. No changes needed for this assignment",
            assignmentId, resourceRequestId, requestStartTime, requestEndTime);
      } else if (existingBucketsOutsideRequestPeriod.size() == existingBuckets.size()) {
        logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
            "Assignment {} lies completely outside request {} period {} / {}. Deleting this assignment", assignmentId,
            resourceRequestId, requestStartTime, requestEndTime);
        assignmentRepository.deleteAssignment(assignmentId);
      } else {
        logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
            "{} buckets of Assignment {} lie outside request {} period {} / {}. Deleting these outlier buckets",
            existingBucketsOutsideRequestPeriod.size(), assignmentId, resourceRequestId, requestStartTime,
            requestEndTime);
        assignmentRepository.deleteAssignmentBuckets(existingBucketsOutsideRequestPeriod);
      }
    }
  }

  private void updateHardBookedAssignments(ResourceRequests resourceRequest, LocalDate requestStartDate,
      LocalDate requestEndDate, EngmntProjRsceSup resourceSupplies) {

    // Only hard booked assignment buckets would be returned as the base view
    // selects using S4 demand and supply fields
    List<AssignmentBucketsYearMonthAggregate> monthlyAggregatedAssignmentList = assignmentRepository
        .getExistingMonthlyAggregatedAssignments(resourceSupplies.getResourceDemand(),
            resourceSupplies.getWorkPackage(), resourceSupplies.getResourceSupply());

    if (monthlyAggregatedAssignmentList.isEmpty()) {
      logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
          "MonthlyAggregatedAssignment List is empty, all the suppliy entries will be used to create corresponding assignments in RM");
      this.createAssignment(Collections.singletonList(resourceSupplies));
      return;
    }

    // If we reach here, corresponding assignment must be present in RM
    Optional<AssignmentsView> assignmentDetailsForS4Demand = assignmentRepository.getExistingAssignmentDetails(
        resourceSupplies.getResourceDemand(), resourceSupplies.getWorkPackage(), resourceSupplies.getResourceSupply());

    LocalDate existingAssignmentStartDate = requestStartDate;
    LocalDate existingAssignmentEndDate = requestEndDate;
    if (assignmentDetailsForS4Demand.isPresent()) {
      logger.info(REP_CHANGE_ASSIGNMENT_MARKER, "Assignment details found for S4 demand");
      existingAssignmentStartDate = assignmentDetailsForS4Demand.get().getStartDate();
      existingAssignmentEndDate = assignmentDetailsForS4Demand.get().getEndDate();
    }

    logger.info(REP_CHANGE_ASSIGNMENT_MARKER, "Request (start, end) : ({}, {}), Assignment (start, end) : ({}, {})",
        requestStartDate, requestEndDate, existingAssignmentStartDate, existingAssignmentEndDate);

    Set<YearMonth> yearMonthToAccountForRequestTruncation = getYearMonthsToBeUpdatedToAccountForRequestTruncation(
        existingAssignmentStartDate, existingAssignmentEndDate, requestStartDate, requestEndDate);

    List<EngmntProjRsceSupDistr> monthlySupplyDistributionList = resourceSupplies
        .getResourceSupplyDistributionIfPresent().get();

    Map<YearMonth, Integer> existingMonthlyAssignmentDistributionMap = createMapFromMonthlyAssignmentDistributionList(
        monthlyAggregatedAssignmentList);

    Map<YearMonth, Integer> monthlyRecordsToInsert = new LinkedHashMap<>();
    Map<YearMonth, Integer> monthlyRecordsToDelete = new LinkedHashMap<>();
    populateMonthlyRecordsToInsertOrDelete(monthlySupplyDistributionList, existingMonthlyAssignmentDistributionMap,
        monthlyRecordsToInsert, monthlyRecordsToDelete, yearMonthToAccountForRequestTruncation);

    if (monthlyRecordsToInsert.isEmpty() && monthlyRecordsToDelete.isEmpty()) {
      logger.info(REP_CHANGE_ASSIGNMENT_MARKER, "No differences between Assignment and Supply. Nothing to update");
      return;
    }

    // Check needed for sonar issue when reading from an optional
    String assignmentId = assignmentDetailsForS4Demand.isPresent()
        ? assignmentDetailsForS4Demand.get().getAssignmentId()
        : monthlyAggregatedAssignmentList.get(0).getAssignmentId();

    List<AssignmentBuckets> bucketsToDelete = getExistingAssignmentBuckets(assignmentId,
        monthlyRecordsToDelete.keySet());
    List<AssignmentBuckets> bucketsToInsert = createNewBucketsToInsert(assignmentId, monthlyRecordsToInsert,
        resourceRequest);
    logger.info(REP_CHANGE_ASSIGNMENT_MARKER, "Updating assignment {} : Deleting {} buckets, Inserting {} buckets",
        assignmentId, bucketsToDelete.size(), bucketsToInsert.size());
    assignmentRepository.updateAssignmentBuckets(assignmentId, bucketsToInsert, bucketsToDelete);
  }

  private void populateMonthlyRecordsToInsertOrDelete(List<EngmntProjRsceSupDistr> monthlySupplyDistributionList,
      Map<YearMonth, Integer> existingMonthlyAssignmentDistributionMap, Map<YearMonth, Integer> monthlyRecordsToInsert,
      Map<YearMonth, Integer> monthlyRecordsToDelete, Set<YearMonth> yearMonthToAccountForRequestTruncation) {
    logger.info(REP_CHANGE_ASSIGNMENT_MARKER, "Size of supply distribution list read from S4: {}",
        monthlySupplyDistributionList.size());
    for (EngmntProjRsceSupDistr supplyDistributionRecord : monthlySupplyDistributionList) {
      String year = supplyDistributionRecord.getCalendarYear();
      String month = supplyDistributionRecord.getCalendarMonth();
      BigDecimal hoursToStaff = supplyDistributionRecord.getQuantity();
      Integer s4StaffedHours = hoursToStaff.intValue();
      YearMonth yearMonth = YearMonth.of(Integer.parseInt(year), Integer.parseInt(month));

      logger.info(REP_CHANGE_ASSIGNMENT_MARKER, "Comparing Supply details for yearmonth {}", yearMonth);

      if (!existingMonthlyAssignmentDistributionMap.containsKey(yearMonth)) {
        logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
            "Staffing exists for {} in S4 but not in RM. Create supply for {} hours", yearMonth, s4StaffedHours);
        monthlyRecordsToInsert.put(yearMonth, s4StaffedHours);
        continue;
      }
      if (!existingMonthlyAssignmentDistributionMap.get(yearMonth).equals(s4StaffedHours)) {
        logger.info(REP_CHANGE_ASSIGNMENT_MARKER, "Staffing hour mismatch found for {}", yearMonth);
        monthlyRecordsToDelete.put(yearMonth, s4StaffedHours);
        monthlyRecordsToInsert.put(yearMonth, s4StaffedHours);
      } else if (yearMonthToAccountForRequestTruncation.contains(yearMonth)) {
        logger.info(REP_CHANGE_ASSIGNMENT_MARKER, "Request dates were truncated for {}", yearMonth);
        monthlyRecordsToDelete.put(yearMonth, s4StaffedHours);
        monthlyRecordsToInsert.put(yearMonth, s4StaffedHours);
      }
      // Delete the records already compared with S4
      existingMonthlyAssignmentDistributionMap.remove(yearMonth);
    }
    logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
        "{} additional months with staffing found in RM which is missing in S4. Would delete staffing for these months in RM",
        existingMonthlyAssignmentDistributionMap.size());
    monthlyRecordsToDelete.putAll(existingMonthlyAssignmentDistributionMap);
  }

  private Set<YearMonth> getYearMonthsToBeUpdatedToAccountForRequestTruncation(LocalDate existingAssignmentStartDate,
      LocalDate existingAssignmentEndDate, LocalDate requestStartDate, LocalDate requestEndDate) {
    Set<YearMonth> yearMonthSet = new HashSet<>();
    if (existingAssignmentStartDate.isBefore(requestStartDate)) {
      logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
          "Assignment start before request start. Start yearmonth would be considered for update");
      yearMonthSet.add(YearMonth.from(existingAssignmentStartDate));
    }
    if (existingAssignmentEndDate.isAfter(requestEndDate)) {
      logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
          "Assignment end after request end. End yearmonth would be considered for update");
      yearMonthSet.add(YearMonth.from(existingAssignmentEndDate));
    }
    return yearMonthSet;
  }

  private void deleteHardBookedAssignmentIfSupplyIsCompletelyDeleted(EngmntProjRsceDmnd resourceDemand)
      throws ODataException {
    // Get existing assignments
    List<Assignments> existingAssignmentList = assignmentRepository
        .getAllAssignmentsForS4Demand(resourceDemand.getResourceDemand(), resourceDemand.getWorkPackage());

    List<EngmntProjRsceSup> resourceSuppliesFromS4List = resourceDemand.getResourceSupplyOrFetch();

    // Proceed for deletion if the existing assignments is greater than the incoming
    // assignments
    if (existingAssignmentList.size() > resourceSuppliesFromS4List.size() || resourceSuppliesFromS4List.isEmpty()) {

      logger.info(REP_CHANGE_ASSIGNMENT_MARKER, "No/Partial S4 supply information found for demand {}, work package {}",
          resourceDemand.getResourceDemand(), resourceDemand.getWorkPackage());

      List<Assignments> existingHardBookedAssignments = existingAssignmentList.stream()
          .filter(r -> r.getAssignmentStatusCode().intValue() == AssignmentStatus.HARDBOOKED.getCode())
          .collect(Collectors.toList());

      if (!existingHardBookedAssignments.isEmpty()) {

        logger.info(REP_CHANGE_ASSIGNMENT_MARKER,
            "Supply is deleted in S4 but {} hard booked assignments found for demand {}, work package {} in RM. Deleting Assignments for this demand.",
            existingHardBookedAssignments.size(), resourceDemand.getResourceDemand(), resourceDemand.getWorkPackage());

        if (!resourceSuppliesFromS4List.isEmpty()) {
          // In case of a partial deletion in S4, only the corresponding assignments are
          // to be removed from S4.
          // So remove the ones that are not to be deleted
          for (EngmntProjRsceSup resourceSupply : resourceSuppliesFromS4List) {

            for (int i = existingHardBookedAssignments.size() - 1; i >= 0; i--) {

              Assignments existingS4AssignmentInRM = existingHardBookedAssignments.get(i);

              Optional<ResourceDetails> resourceDetailsOptional = assignmentRepository
                  .getResourceForWorkforcePersonUserID(resourceSupply.getWorkforcePersonUserID());

              if (!resourceDetailsOptional.isPresent()) {

                logger.warn(REP_CREATE_ASSIGNMENT_MARKER,
                    "Resource not found in RM corresponding to WorkforcePersonUserID {}",
                    resourceSupply.getWorkforcePersonUserID());
                continue;
              }

              String resourceId = resourceDetailsOptional.get().getResourceId();

              if (existingS4AssignmentInRM.getResourceId() == resourceId) {
                // Remove this from the list so that it is not deleted.
                existingHardBookedAssignments.remove(i);
              }

            }
          }
        }
        assignmentRepository.deleteAssignments(existingHardBookedAssignments);
      }
    }
  }

  private List<AssignmentBuckets> createNewBucketsToInsert(String assignmentId,
      Map<YearMonth, Integer> monthlyRecordsToInsert, ResourceRequests resourceRequest) {

    List<AssignmentBuckets> allNewBuckets = new ArrayList<>();
    String resourceId = assignmentRepository.getResourceStaffedOnAssignment(assignmentId);
    for (Entry<YearMonth, Integer> currMonthRecord : monthlyRecordsToInsert.entrySet()) {
      LocalDate assignmentStartDate = (resourceRequest != null)
          ? (LocalDate) getActualAssignmentStartDate(currMonthRecord.getKey().atDay(1), resourceRequest.getStartDate())
          : currMonthRecord.getKey().atDay(1);
      LocalDate assignmentEndDate = (resourceRequest != null)
          ? (LocalDate) getActualAssignmentEndDate(currMonthRecord.getKey().atEndOfMonth(),
              resourceRequest.getEndDate())
          : currMonthRecord.getKey().atEndOfMonth();
      List<AssignmentBuckets> newBucketsForCurrentYearMonth = distributeAssignmentBucketsForYearMonth(resourceId,
          assignmentStartDate, assignmentEndDate, currMonthRecord.getValue(), assignmentId);
      allNewBuckets.addAll(newBucketsForCurrentYearMonth);
    }
    return allNewBuckets;
  }

  private List<AssignmentBuckets> getExistingAssignmentBuckets(String assignmentId, Set<YearMonth> yearMonthSet) {

    List<AssignmentBuckets> allBuckets = new ArrayList<>();
    for (YearMonth yearMonth : yearMonthSet) {
      List<AssignmentBuckets> bucketsInYearMonth = assignmentRepository.getAssignmentBucketsForPeriod(assignmentId,
          yearMonth.atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC),
          yearMonth.atEndOfMonth().atStartOfDay().toInstant(ZoneOffset.UTC));
      allBuckets.addAll(bucketsInYearMonth);
    }
    return allBuckets;
  }

  private Map<YearMonth, Integer> createMapFromMonthlyAssignmentDistributionList(
      List<AssignmentBucketsYearMonthAggregate> monthlyAggregatedAssignmentList) {

    Map<YearMonth, Integer> mapOfAssignmentDistribution = new LinkedHashMap<>(monthlyAggregatedAssignmentList.size());
    for (AssignmentBucketsYearMonthAggregate assignmentRecord : monthlyAggregatedAssignmentList) {
      String yearMonthString = assignmentRecord.getYearMonth();
      String yearString = yearMonthString.substring(0, 4);
      String monthString = yearMonthString.substring(4);
      YearMonth yearMonth = YearMonth.of(Integer.parseInt(yearString), Integer.parseInt(monthString));
      mapOfAssignmentDistribution.put(yearMonth, assignmentRecord.getBookedCapacityInHours());
    }
    return mapOfAssignmentDistribution;
  }

  private List<AssignmentBuckets> distributeAssignmentBucketsForYearMonth(String resourceId, LocalDate startDate,
      LocalDate endDate, int hoursToStaff, String assignmentHeaderId) {

    logger.debug(REP_CREATE_ASSIGNMENT_MARKER, "Adding assignment buckets for period, start date :{} and end date: {}",
        startDate, endDate);

    if (hoursToStaff <= 0) {
      logger.info(REP_CREATE_ASSIGNMENT_MARKER, "No hours to staff during period {} - {} for resource {}", startDate,
          endDate, resourceId);
      return Collections.emptyList();
    }

    Instant startTime = startDate.atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant endTime = endDate.atStartOfDay().toInstant(ZoneOffset.UTC);

    List<CapacityView> resourceCapacity = assignmentRepository.getResourceCapacities(resourceId, startTime, endTime);

    int numOfAvailDays = resourceCapacity.size();
    if (numOfAvailDays == 0) {
      throw new ServiceException(ErrorStatuses.PRECONDITION_FAILED,
          "Resource has no availability days from" + startTime + " to " + endTime);
    }

    logger.debug(REP_CREATE_ASSIGNMENT_MARKER,
        "Resource with ID {} is available for {} days and we need staff {} hours", resourceId, numOfAvailDays,
        hoursToStaff);

    int hoursAssignedEqually = hoursToStaff / numOfAvailDays;
    int hoursAssignedSequentially = hoursToStaff % numOfAvailDays;

    if (hoursAssignedEqually > 0) {
      logger.debug(REP_CREATE_ASSIGNMENT_MARKER, "Assignment buckets will be populated equally");
      return populateBucketsEqually(assignmentHeaderId, resourceCapacity, hoursAssignedEqually,
          hoursAssignedSequentially);

    } else if (hoursAssignedSequentially > 0) {
      logger.debug(REP_CREATE_ASSIGNMENT_MARKER, "Assignment buckets will be populated sequentially");
      return populateBucketsSequentially(assignmentHeaderId, resourceCapacity, hoursAssignedSequentially);
    }
    logger.debug(REP_CREATE_ASSIGNMENT_MARKER,
        "Completed processing method distributeAssignmentBucketsForYearMonth in AssignmentService class");
    return Collections.emptyList();
  }

  private List<AssignmentBuckets> populateBucketsEqually(String assignmentHeaderId, List<CapacityView> resourceCapacity,
      int hoursAssignedEqually, int hoursAssignedSequentially) {

    logger.debug(REP_CREATE_ASSIGNMENT_MARKER, "Entered method populateBucketsEqually, in AssignmentService class");

    List<AssignmentBuckets> assignmentBucketList = new ArrayList<>(resourceCapacity.size());
    for (CapacityView capacity : resourceCapacity) {
      AssignmentBuckets newBucket = AssignmentBuckets.create();
      newBucket.setBookedCapacityInMinutes(
          (hoursAssignedEqually + (hoursAssignedSequentially-- > 0 ? 1 : 0)) * NUMBER_OF_MINUTES_IN_AN_HOUR);
      newBucket.setAssignmentId(assignmentHeaderId);
      newBucket.setId(UUID.randomUUID().toString());
      newBucket.setStartTime(capacity.getStartTime());
      assignmentBucketList.add(newBucket);

      logger.debug(REP_CREATE_ASSIGNMENT_MARKER, "Assignment bucket is added to the list for date {}",
          capacity.getStartTime());
    }
    return assignmentBucketList;
  }

  private List<AssignmentBuckets> populateBucketsSequentially(String assignmentHeaderId,
      List<CapacityView> resourceCapacity, int hoursAssignedSequentially) {

    logger.debug(REP_CREATE_ASSIGNMENT_MARKER,
        "Entered method populateBucketsSequentially, in AssignmentService class");

    List<AssignmentBuckets> assignmentBucketList = new ArrayList<>();
    for (CapacityView capacity : resourceCapacity) {
      if (hoursAssignedSequentially <= 0)
        break;
      AssignmentBuckets newBucket = AssignmentBuckets.create();
      newBucket.setBookedCapacityInMinutes((hoursAssignedSequentially-- > 0 ? 1 : 0) * NUMBER_OF_MINUTES_IN_AN_HOUR);
      newBucket.setAssignmentId(assignmentHeaderId);
      newBucket.setId(UUID.randomUUID().toString());
      newBucket.setStartTime(capacity.getStartTime());
      assignmentBucketList.add(newBucket);

      logger.debug(REP_CREATE_ASSIGNMENT_MARKER, "Assignment bucket is added to the list for date {}",
          capacity.getStartTime());
    }
    return assignmentBucketList;
  }

  private ChronoLocalDate getActualAssignmentStartDate(ChronoLocalDate assignmentStartDate,
      ChronoLocalDate requestStartDate) {
    return assignmentStartDate.isBefore(requestStartDate) ? requestStartDate : assignmentStartDate;
  }

  private ChronoLocalDate getActualAssignmentEndDate(ChronoLocalDate assignmentEndDate,
      ChronoLocalDate requestEndDate) {
    return assignmentEndDate.isAfter(requestEndDate) ? requestEndDate : assignmentEndDate;
  }

}
