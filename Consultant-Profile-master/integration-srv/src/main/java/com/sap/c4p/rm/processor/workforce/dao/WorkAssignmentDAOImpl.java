package com.sap.c4p.rm.processor.workforce.dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments_;

import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.workforceavailabilityservice.validations.WorkforceAvailabilityServiceValidator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;

@Component
public class WorkAssignmentDAOImpl implements WorkAssignmentDAO {

    private final PersistenceService persistenceService;
    private final CacheManager cacheManager;
    private static final Logger LOGGER = LoggerFactory
            .getLogger(WorkforceAvailabilityServiceValidator.class);
    private static final Marker WORKFORCE_AVAILABILITY_MARKER = LoggingMarker.WORKFORCE_AVAILABILITY_MARKER.getMarker();
    private static final int CACHE_CLEAN_INTERVAL = 7 * 24 * 60 * 60 * 1000; // One week in Milliseconds

    @Autowired
    public WorkAssignmentDAOImpl(final PersistenceService persistenceService, CacheManager cacheManager) {
        this.persistenceService = persistenceService;
		this.cacheManager = cacheManager;
    }

    @Override
    public Optional<WorkAssignments> getWorkAssignmentKeyId(final String workAssignmentId) {
        CqnSelect selectQuery = Select.from(WorkAssignments_.CDS_NAME)
                .where(b -> b.get(WorkAssignments.WORK_ASSIGNMENT_ID).eq(workAssignmentId));
        return this.persistenceService.run(selectQuery).first(WorkAssignments.class);
    }

    /**
     * To validate foreign key checks for work assignment external id and workforce person ID and queries DB for work assignment ID
     *
     * @param workAssignmentExternalId: Represents work assignment external ID
     * @param workforcePersonID: Represents workforce person ID
     * @param tenant
     * @return returns work assignment ID
     */
    @Override
    @Cacheable(cacheNames = "findByWorkAssignmentExternalIdAndWorkforcePersonIDCache", key = "{#workAssignmentExternalId,#workforcePersonID,#tenant}", unless="#result == null")
	public WorkAssignments getWorkAssignmentGuidStartDateAndEndDate(final String workAssignmentExternalId, final String workforcePersonID, final String tenant) {
		LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, "inside cached method");
//		Removed Job Detail date validation in order to maintain consistency along current functionality, will be uncommented when end of purpose BLI's will be implemented
		CqnSelect selectQuery = Select.from(WorkAssignments_.CDS_NAME)
        		.columns(c -> c.get(WorkAssignments.ID),
        				c -> c.get(WorkAssignments.START_DATE),
        				c -> c.get(WorkAssignments.END_DATE))
                .where(b -> b.get(WorkAssignments.EXTERNAL_ID).eq(workAssignmentExternalId)
                		.and(b.get(WorkAssignments.PARENT).eq(workforcePersonID)));
		Optional<WorkAssignments> workAssignmentGuidOptional = persistenceService.run(selectQuery).first(WorkAssignments.class);
		if (workAssignmentGuidOptional.isPresent()){
			return workAssignmentGuidOptional.get();
		}
		return null;
    }
    
    /**
     * the cached access_token will be cleaned at the regular interval of
     * {@value #CACHE_CLEAN_INTERVAL}.
     */
    @Scheduled(fixedRate = CACHE_CLEAN_INTERVAL)
    public void removeWorkAssignment() {
        Cache cache = cacheManager.getCache("findByWorkAssignmentExternalIdAndWorkforcePersonIDCache");
        if (cache != null)
            cache.clear();
    }

}
