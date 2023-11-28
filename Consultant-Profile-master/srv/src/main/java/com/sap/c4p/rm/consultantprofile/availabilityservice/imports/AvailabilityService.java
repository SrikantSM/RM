package com.sap.c4p.rm.consultantprofile.availabilityservice.imports;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sap.c4p.rm.consultantprofile.availabilityservice.dao.IAvailabilityDAO;
import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.csvcolumns.CapacityCsvColumn;
import com.sap.c4p.rm.consultantprofile.exceptions.TransactionalException;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;
import com.sap.c4p.rm.consultantprofile.utils.Partition;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationError;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationStatus;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationView;
import com.sap.resourcemanagement.resource.Capacity;

@Component
public class AvailabilityService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AvailabilityService.class);
    private static final Marker MARKER = LoggingMarker.AVAILABILITY_IMPORTER.getMarker();
    private static final String SUCCESS = "Success";
    private static final String FAILED = "Failed";

    private final IAvailabilityDAO availabilityDao;
    private final CacheManager cacheManager;

    @Autowired
    public AvailabilityService(final IAvailabilityDAO availabilityDao, final CacheManager cacheManager) {
        this.availabilityDao = availabilityDao;
        this.cacheManager = cacheManager;
    }

    @Cacheable(cacheNames = "findByResourceIdCache", key = "{#resourceId}")
    public AvailabilityReplicationView getAvailabilityResourceId(
            final List<AvailabilityReplicationView> workAssignments, final String resourceId) {
        LOGGER.debug(MARKER, "getAvailabilityResourceId {} ", resourceId);

        return workAssignments.stream().filter(assignment -> assignment.getResourceId().equals(resourceId)).findAny()
                .orElse(null);
    }

    @Cacheable(cacheNames = "findByResourceIdAndS4CostcenterIdCache", key = "{#resourceId,#s4CostCenterId}")
    public AvailabilityReplicationView getWorkAssignmentById(final List<AvailabilityReplicationView> workAssignments,
            final String resourceId, final String s4CostCenterId) {
        LOGGER.debug(MARKER, "getWorkAssignmentById {} {} ", resourceId, s4CostCenterId);

        return workAssignments.stream().filter(assignment -> assignment.getResourceId().equals(resourceId)
                && assignment.getS4CostCenterId().equals(s4CostCenterId)).findAny().orElse(null);
    }

    @Scheduled(fixedRate = 60000)
    public void removeWorkAssignment() {
        Cache cache = cacheManager.getCache("findByResourceIdAndS4CostcenterIdCache");
        if (cache != null)
            cache.clear();
    }

    /**
     * Creates AvailabilityReplicationStatus object from the given properties
     *
     * @param csvRecord
     * @param status
     * @return AvailabilityReplicationStatus
     */
    public AvailabilityReplicationStatus updateAssignment(final CSVRecord csvRecord, String workforcePersonExternalId,
            String status) {
        AvailabilityReplicationStatus assignment = AvailabilityReplicationStatus.create();
        assignment.setWorkForcePersonExternalId(workforcePersonExternalId);
        assignment.setResourceId(csvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName()));
        assignment.setStartDate(csvRecord.get(CapacityCsvColumn.STARTDATE.getName()));
        assignment.setStatus(status);
        return assignment;
    }

    /**
     * Method use to update status and errors details for the availability upload
     * functionality.
     *
     * @param costCenter
     * @param capacities
     * @param assignments
     * @param failedAssignments
     * @throws TransactionalException
     */
    @Transactional
    public void saveOrUpdateAvailabilities(final String costCenter, final List<Capacity> capacities,
            final List<AvailabilityReplicationStatus> assignments,
            final List<AvailabilityReplicationError> failedAssignments) {
        try {
            saveOrUpdateCapacities(capacities);
            updatePreviousReplicationErrorsIfAny(costCenter, assignments);
            updateAvailabilitySummaryStatus(assignments);
            deletePreviousReplicationErrorsIfAny(failedAssignments);
            AvailabilityService.LOGGER.info(MARKER, "Processing of Final status Completed !!! ");
            availabilityDao.saveOrUpdateAvailabilityReplicationErrors(failedAssignments);
        } catch (Exception e) {
            LOGGER.error(MARKER,
                    "Transactional Rollback in saveOrUpdateAvailabilities, while saving availabilities !!! ");
            throw e;
        }
    }

    /**
     * Method use to update AvailabilitySummary details for the availability upload
     * functionality.
     *
     * @param assignments
     */
    private void updateAvailabilitySummaryStatus(final List<AvailabilityReplicationStatus> assignments) {
        LOGGER.info(MARKER, "Inside AvailabilityService, method updateAvailabilitySummaryStatus()");
        String resourceId;
        List<AvailabilityReplicationSummary> availabilitySummaries = new ArrayList<>();
        List<AvailabilityReplicationStatus> replicationStatus;

        if (!NullUtils.isNullOrEmpty(assignments)) {
            Map<String, List<AvailabilityReplicationStatus>> assignmentsByResourceId = groupByWorkAssignmentId(
                    assignments);
            LOGGER.debug(MARKER, "Total {} WorkAssignments.", assignmentsByResourceId.size());
            for (Map.Entry<String, List<AvailabilityReplicationStatus>> e : assignmentsByResourceId.entrySet()) {
                resourceId = e.getKey();
                LOGGER.info(MARKER, "AssignmentId : {}", resourceId);
                replicationStatus = e.getValue();
                if (!NullUtils.isNullOrEmpty(replicationStatus)) {
                    availabilitySummaries.add(updateStatus(resourceId, replicationStatus));
                }
            }
            availabilityDao.updateAvailabilityReplicationSummary(availabilitySummaries);
        }
    }

    /**
     * Method use to update AvailabilitySummary details for given resourceId.
     *
     * @param availabilityReplicationStatus
     * @return availabilitySummary
     */
    private AvailabilityReplicationSummary updateStatus(final String resourceId,
            final List<AvailabilityReplicationStatus> availabilityReplicationStatus) {
        int status = 2; // Partial
        AvailabilityReplicationSummary availabilitySummary = AvailabilityReplicationSummary.create();

        if (!NullUtils.isNullOrEmpty(availabilityReplicationStatus)) {
            long noOfRecordsProcessed = availabilityReplicationStatus.size();
            long noOfRecordsPassed = availabilityReplicationStatus.stream()
                    .filter(c -> c.getStatus().startsWith(SUCCESS)).count();
            long noOfRecordsFailed = availabilityReplicationStatus.stream()
                    .filter(c -> c.getStatus().startsWith(FAILED)).count();
            LOGGER.debug(MARKER,
                    "WorkAssignmentId : {}; Total noOfRecordsProcessed : {}; noOfRecordsPassed : {};"
                            + "  noOfRecordsFailed: {}.",
                    resourceId, noOfRecordsProcessed, noOfRecordsPassed, noOfRecordsFailed);

            if (noOfRecordsProcessed == noOfRecordsPassed)
                status = 1;

            if (noOfRecordsProcessed == noOfRecordsFailed)
                status = 3;

            availabilitySummary.setResourceId(resourceId);
            availabilitySummary.setNoOfRecordsProcessed((int) noOfRecordsProcessed);
            availabilitySummary.setNoOfRecordsPassed((int) noOfRecordsPassed);
            availabilitySummary.setNoOfRecordsFailed((int) noOfRecordsFailed);
            availabilitySummary.setAvailabilitySummaryStatusCode(status);
        }
        return availabilitySummary;
    }

    /**
     * Method use to delete previous errors details for resourceId.
     *
     * @param costCenter
     * @param assignments
     */
    private void updatePreviousReplicationErrorsIfAny(final String costCenter,
            final List<AvailabilityReplicationStatus> assignments) {
        LOGGER.info(MARKER, "Inside AvailabilityService, method updatePreviousReplicationErrorsIfAny()");
        List<AvailabilityReplicationError> replicationErrorsForCostcenter = availabilityDao
                .fetchAvailabilityErrors(costCenter);
        List<AvailabilityReplicationError> filteredReplicationErrors;

        if (!NullUtils.isNullOrEmpty(replicationErrorsForCostcenter)) {
            filteredReplicationErrors = filteredAvailabilityErrors(assignments, replicationErrorsForCostcenter);
            if (!filteredReplicationErrors.isEmpty()) {
                LOGGER.warn(MARKER,
                        "Filtering previous replication failures against current successful assignments Completed !!! {}",
                        filteredReplicationErrors.size());
                for (AvailabilityReplicationError error : filteredReplicationErrors) {
                    availabilityDao.deleteByResourceId(error.getResourceId());
                }
                LOGGER.warn(MARKER,
                        "Deleting of Previous replication failures against current successful assignments Completed !!! ");
            }
        }
    }

    /**
     * Method use to delete previous errors details for resourceId.
     *
     * @param failedAssignments
     */
    private void deletePreviousReplicationErrorsIfAny(final List<AvailabilityReplicationError> failedAssignments) {
        LOGGER.info(MARKER, "Inside AvailabilityService, method deletePreviousReplicationErrorsIfAny()");
        if (!failedAssignments.isEmpty()) {
            for (AvailabilityReplicationError error : failedAssignments) {
                availabilityDao.deleteByResourceId(error.getResourceId());
            }
            LOGGER.warn(MARKER,
                    "Deleting of Previous replication failures against current failed assignments Completed !!! ");
        }
    }

    /**
     * Method use to save Resource Capacities.
     *
     * @param capacities
     */
    private void saveOrUpdateCapacities(final List<Capacity> capacities) {
        if (!NullUtils.isNullOrEmpty(capacities)) {
            LOGGER.debug(MARKER, "Total {} capacities found.", capacities.size());
            availabilityDao.deleteAllCapacities(capacities);
            Partition<Capacity> batchRecords = Partition.ofSize(capacities, 1000);
            LOGGER.warn(MARKER, "Partitioning started !!!. Partitioned into {} capacities.", batchRecords.size());
            batchRecords.stream().forEach(resources -> {
                if (!resources.isEmpty()) {
                    availabilityDao.saveOrUpdate(resources);
                    LOGGER.warn(MARKER, "Persisted {} records.", resources.size());
                }
            });
        }
    }

    private Map<String, List<AvailabilityReplicationStatus>> groupByWorkAssignmentId(
            List<AvailabilityReplicationStatus> assignments) {
        return assignments.stream().collect(Collectors.groupingBy(AvailabilityReplicationStatus::getResourceId));
    }

    /**
     * Method use to filter previous errors details for combination of resourceId
     * and startDate.
     *
     * @param assignments
     * @param availabilityReplicationErrors
     * @return Collection<AvailabilityReplicationError>
     *         availabilityReplicationErrors
     */
    private List<AvailabilityReplicationError> filteredAvailabilityErrors(
            final List<AvailabilityReplicationStatus> assignments,
            final List<AvailabilityReplicationError> availabilityReplicationErrors) {
        List<AvailabilityReplicationStatus> processedAssignments = new ArrayList<>(assignments);
        return availabilityReplicationErrors.stream().filter(
                err -> processedAssignments.stream().anyMatch(k -> err.getResourceId().equals(k.getResourceId())))
                .collect(Collectors.toList());
    }

    /**
     * Method use to fetch availability summary master details for given cost
     * center.
     *
     * @param costcenter
     * @return Collection<AvailabilityReplicationSummary>
     */
    public List<AvailabilityReplicationView> fetchAvailabilitySummary(final String costcenter) {
        return availabilityDao.fetchAvailabilitySummary(costcenter);
    }
}
