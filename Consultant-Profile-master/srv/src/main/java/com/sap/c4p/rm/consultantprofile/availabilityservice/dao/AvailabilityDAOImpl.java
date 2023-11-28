package com.sap.c4p.rm.consultantprofile.availabilityservice.dao;

import static com.sap.cds.impl.builder.model.CqnParam.param;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.CQL;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityDownloadView;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityDownloadView_;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationError;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationError_;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary_;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationView;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationView_;
import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Capacity_;

@Component
public class AvailabilityDAOImpl implements IAvailabilityDAO {

    private static final Logger LOGGER = LoggerFactory.getLogger(AvailabilityDAOImpl.class);
    private static final Marker MARKER = LoggingMarker.AVAILABILITY_IMPORTER.getMarker();
    static final String STARTTIME = "startTime";
    static final String COUNT = "count";

    private final PersistenceService persistenceService;

    @Autowired
    public AvailabilityDAOImpl(PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public void saveOrUpdate(List<Capacity> capacities) {
        CqnInsert cqnInsert = Insert.into(Capacity_.class).entries(capacities);
        persistenceService.run(cqnInsert);
    }

    @Override
    public List<AvailabilityReplicationView> fetchWorkAssignmentsForEmployee(String workForcePersonExternalId) {
        CqnSelect queryAvailabilityDetails = Select.from(AvailabilityReplicationView_.CDS_NAME)
                .where(b -> b.get(AvailabilityReplicationView.WORK_FORCE_PERSON_EXTERNAL_ID)
                        .eq(workForcePersonExternalId)
                        .and(b.get(AvailabilityReplicationView.IS_BUSINESS_PURPOSE_COMPLETED).eq(false)));
        return persistenceService.run(queryAvailabilityDetails).listOf(AvailabilityReplicationView.class).stream()
                .collect(Collectors.toList());
    }

    @Override
    public List<AvailabilityReplicationView> fetchAvailabilitySummary(String costcenter) {
        CqnSelect queryAvailabilityDetails = Select.from(AvailabilityReplicationView_.CDS_NAME)
                .where(b -> b.get(AvailabilityReplicationView.S4_COST_CENTER_ID).eq(costcenter));
        return persistenceService.run(queryAvailabilityDetails).listOf(AvailabilityReplicationView.class).stream()
                .collect(Collectors.toList());
    }

    @Override
    public List<AvailabilityDownloadView> fetchWorkAssignmentsForEmployeeDownload(String workForcePersonExternalId) {
        CqnSelect queryAvailabilityDetails = Select.from(AvailabilityDownloadView_.CDS_NAME)
                .where(b -> b.get(AvailabilityDownloadView.WORK_FORCE_PERSON_EXTERNAL_ID).eq(workForcePersonExternalId)
                        .and(b.get(AvailabilityDownloadView.IS_BUSINESS_PURPOSE_COMPLETED).eq(false)));
        return persistenceService.run(queryAvailabilityDetails).listOf(AvailabilityDownloadView.class).stream()
                .collect(Collectors.toList());
    }

    @Override
    public List<AvailabilityDownloadView> fetchAvailabilitySummaryDownload(String costcenter) {
        CqnSelect queryAvailabilityDetails = Select.from(AvailabilityDownloadView_.CDS_NAME)
                .where(b -> b.get(AvailabilityDownloadView.S4_COST_CENTER_ID).eq(costcenter));
        return persistenceService.run(queryAvailabilityDetails).listOf(AvailabilityDownloadView.class).stream()
                .collect(Collectors.toList());
    }

    @Override
    public List<AvailabilityReplicationError> fetchAvailabilityErrors(String costcenter) {
        CqnSelect queryAvailabilityErrors = Select.from(AvailabilityReplicationError_.CDS_NAME)
                .where(b -> b.get("s4costCenterId").eq(costcenter));
        return persistenceService.run(queryAvailabilityErrors).listOf(AvailabilityReplicationError.class).stream()
                .collect(Collectors.toList());
    }

    @Override
    public void saveOrUpdateAvailabilityReplicationErrors(List<AvailabilityReplicationError> errors) {
        CqnInsert cqnInsert = Insert.into(AvailabilityReplicationError_.class).entries(errors);
        persistenceService.run(cqnInsert);
        AvailabilityDAOImpl.LOGGER.debug(MARKER, "saveOrUpdateAvailabilityReplicationErrors completed!!");
    }

    @Override
    public void updateAvailabilityReplicationSummary(List<AvailabilityReplicationSummary> assignments) {
        CqnUpdate cqnUpdate = Update.entity(AvailabilityReplicationSummary_.class).entries(assignments);
        persistenceService.run(cqnUpdate);
    }

    @Override
    public void deleteByResourceIdAndStartDate(String resourceId, String startDate) {
        CqnDelete cqnDelete = Delete.from(AvailabilityReplicationError_.class)
                .where(err -> err.resourceId().eq(resourceId).and(err.startDate().eq(startDate)));
        persistenceService.run(cqnDelete);
        AvailabilityDAOImpl.LOGGER.debug(MARKER,
                "WorkAssignment for combination of resourceId {} and startDate {} have been removed", resourceId,
                startDate);
    }

    @Override
    public void deleteByResourceId(String resourceId) {
        CqnDelete cqnDelete = Delete.from(AvailabilityReplicationError_.class)
                .where(err -> err.resourceId().eq(resourceId));
        persistenceService.run(cqnDelete);
        AvailabilityDAOImpl.LOGGER.debug(MARKER, "WorkAssignments of resourceId {} has been removed", resourceId);
    }

    @Override
    public void deleteAllCapacities(List<Capacity> capacities) {
        CqnDelete cqnDelete = Delete.from(Capacity_.class)
                .where(p -> p.resource_id().eq(param("resourceId")).and(p.startTime().eq(param(STARTTIME))));

        List<Map<String, Object>> paramList = new ArrayList<>();
        for (Capacity param : capacities) {
            Map<String, Object> p = new HashMap<>();
            p.put("resourceId", param.getResourceId());
            p.put(STARTTIME, param.getStartTime());
            paramList.add(p);
        }
        persistenceService.run(cqnDelete, paramList);
        AvailabilityDAOImpl.LOGGER.debug(MARKER, "All Resource Capacities deleted");
    }

    @Override
    public Integer fetchCapacityDataCount(final String resourceId, final String minDate, final String maxDate) {
        CqnSelect queryCapacityDataCount = Select.from(Capacity_.class)
                .columns(CQL.count().as(AvailabilityDAOImpl.COUNT))
                .where(b -> b.get("resource_id").eq(resourceId).and(b.get(STARTTIME).between(minDate, maxDate)));
        return Math.toIntExact(
                (Long) persistenceService.run(queryCapacityDataCount).single().get(AvailabilityDAOImpl.COUNT));
    }

    @Override
    public List<AvailabilityDownloadView> fetchWorkAssignmentsDatesForResource(String resourceId) {
        CqnSelect queryAvailabilityDetails = Select.from(AvailabilityDownloadView_.CDS_NAME)
                .where(b -> b.get(AvailabilityDownloadView.RESOURCE_ID).eq(resourceId));
        return persistenceService.run(queryAvailabilityDetails).listOf(AvailabilityDownloadView.class).stream()
                .collect(Collectors.toList());
    }

}
