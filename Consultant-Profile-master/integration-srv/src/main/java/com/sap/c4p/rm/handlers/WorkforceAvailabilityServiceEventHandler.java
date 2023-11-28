package com.sap.c4p.rm.handlers;

import static com.sap.c4p.rm.utils.Constants.CREATE_OPERATION;
import static com.sap.c4p.rm.utils.Constants.UPDATE_OPERATION;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import com.sap.c4p.rm.auditlog.AuditLogUtil;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.gen.MessageKeys;
import com.sap.c4p.rm.utils.DateTimeUtils;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.c4p.rm.workforceavailabilityservice.validations.WorkforceAvailabilityServiceValidator;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnSelect;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.HandlerOrder;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.employee.workforceavailability.WorkforceAvailabilitySupplement;
import com.sap.resourcemanagement.employee.workforceavailability.WorkforceAvailabilityTimeInterval;
import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.Capacity_;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;

import workforceavailabilityservice.WorkforceAvailability;
import workforceavailabilityservice.WorkforceAvailability_;
import workforceavailabilityservice.WorkforceAvailabilityService_;

/**
 * EventHandler Implemented Class to define event handlers for CDS events of the
 * service "WorkforceAvailabilityService"
 * This service enables you to upload the availability information of a workforce
 */
@Component
@ServiceName(WorkforceAvailabilityService_.CDS_NAME)
public class WorkforceAvailabilityServiceEventHandler implements EventHandler {
	
	private static final Logger LOGGER = LoggerFactory
            .getLogger(WorkforceAvailabilityServiceEventHandler.class);
    private static final Marker WORKFORCE_AVAILABILITY_MARKER = LoggingMarker.WORKFORCE_AVAILABILITY_MARKER.getMarker();
    private static final String CREATE_CAPACITY = "createCapacity";
    private static final String UPDATE_CAPACITY = "updateCapacity";
    private static final String DATA_SUBJECT_TYPE = "WorkForcePerson";
    private static final String DATA_SUBJECT_ROLE = "Project Team Member";
	private static final String WORKFORCE_AVAILABILITY_OBJECT_TYPE = "WorkforceAvailability";
	private static final String AVAILABILITY_SERVICE_IDENTIFIER = "WorkforceAvailabilityService";

    @Autowired
    private WorkforceAvailabilityServiceValidator workforceAvailabilityServiceValidator;
    
    @Autowired
    protected PersistenceService persistenceService;
    
    @Autowired
	private Messages messages;
    
    @Autowired
    private AuditLogMessageFactory auditLogFactory;
    
    @Autowired
    private AuditLogUtil auditLogUtil;
    
	@Before(event = { CqnService.EVENT_CREATE }, entity = WorkforceAvailability_.CDS_NAME)
	@HandlerOrder(20000)
    public void beforeCreateAvailability(EventContext context,
            WorkforceAvailability availability) {
        LOGGER.debug("Starting beforeCreateWorkforceAvailabilityEventHandler");
        String tenant = context.getUserInfo().getTenant();
        if (tenant == null) {
        	throwErrorMessage(MessageKeys.UNKNOWN_ERROR, "The value of tenant is null");
        }
        if (availability.getId() == null) {
        	UUID uuid = UUID.randomUUID();
        	availability.setId(uuid.toString());
        }
        
        workforceAvailabilityServiceValidator.checkAvailabilityForXss(availability);
        workforceAvailabilityServiceValidator.validateWorkforcePersonActive(availability.getWorkforcePersonId());
		workforceAvailabilityServiceValidator.validateAvailabilityDate(
				availability.getWorkAssignmentID(),
				availability.getWorkforcePersonId(), tenant,
				availability.getAvailabilityDate()
				);
        workforceAvailabilityServiceValidator.validateNormalWorkingTime(availability.getNormalWorkingTime(), availability.getAvailabilityDate());
		int normalWorkingTimeInMinutes = DateTimeUtils.getInMinutes(availability.getNormalWorkingTime());
		int supplementContributionInMinutes = getSupplementContributionInMinutes(availability.getAvailabilitySupplements(),
				normalWorkingTimeInMinutes);
		int intervalContributionInMinutes = getIntervalContributionInMinutes(availability.getAvailabilityIntervals(),
				normalWorkingTimeInMinutes);
		workforceAvailabilityServiceValidator.validateAvailability(normalWorkingTimeInMinutes, supplementContributionInMinutes,
				intervalContributionInMinutes, availability.getAvailabilityDate(), availability.getNormalWorkingTime());
		
		String workAssignmentId = workforceAvailabilityServiceValidator.getWorkAssignmentGuid(availability.getWorkAssignmentID(), availability.getWorkforcePersonId(), tenant);
		LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, "Retrived work assignment GUID: " + workAssignmentId + " from the external ID.");
		Instant startTime = DateTimeUtils.convertDateToTimeFormat(availability.getAvailabilityDate());
		Instant endTime = DateTimeUtils.convertDateToTimeFormat(availability.getAvailabilityDate().plusDays(1));
		
		// Audit logging creation of workforce availability
		auditLogUtil.setIsRequestFromCAP(true);
		HashMap<String, String> entity = this.prepareEntityForAuditLog(availability);
		AuditedDataSubject dataSubject = this.getAuditedDataSubject(availability.getWorkforcePersonId());
		auditLogUtil.prepareDataModificationAuditMessage(context, WORKFORCE_AVAILABILITY_OBJECT_TYPE,
				AVAILABILITY_SERVICE_IDENTIFIER, CREATE_OPERATION, entity, null, dataSubject);
		
		Capacity capacity = Capacity.create();
		capacity.setResourceId(workAssignmentId);
		capacity.setStartTime(startTime);
		capacity.setEndTime(endTime);
		capacity.setPlannedNonWorkingTimeInMinutes(supplementContributionInMinutes);
		capacity.setWorkingTimeInMinutes(intervalContributionInMinutes);
		context.put(CREATE_CAPACITY, capacity);
	}
	
	@After(event = { CqnService.EVENT_CREATE }, entity = WorkforceAvailability_.CDS_NAME)
    public void afterCreateAvailability(EventContext context, WorkforceAvailability availability) {
		try {
		    	Capacity capacity;
		    	if ((capacity = (Capacity) context.get(CREATE_CAPACITY)) != null) {
		        	Map<String, Object> capacityRow = new HashMap<>();
		    		capacityRow.put(Capacity.RESOURCE_ID, capacity.getResourceId());
		    		capacityRow.put(Capacity.START_TIME, capacity.getStartTime());
		    		capacityRow.put(Capacity.END_TIME, capacity.getEndTime());
		    		capacityRow.put(Capacity.PLANNED_NON_WORKING_TIME_IN_MINUTES, capacity.getPlannedNonWorkingTimeInMinutes());
		    		capacityRow.put(Capacity.WORKING_TIME_IN_MINUTES, capacity.getWorkingTimeInMinutes());
		    		persistenceService.run(Upsert.into(Capacity_.CDS_NAME).entry(capacityRow));
		    	}
		    } catch (Exception e) {
		    	throwErrorMessage(MessageKeys.ERROR_WHILE_CREATING_CAPACITY, "Error occured while creating capacity");
		}
	}
	
	@Before(event = { CqnService.EVENT_UPDATE }, entity = WorkforceAvailability_.CDS_NAME)
	@HandlerOrder(20000)
	public void beforeUpdateAvailability(EventContext context, WorkforceAvailability availability) {
    	LOGGER.debug("Starting beforeUpdateWorkforceAvailability");
    	String tenant = context.getUserInfo().getTenant();
        if (tenant == null) {
        	throwErrorMessage(MessageKeys.UNKNOWN_ERROR, "The value of tenant is null");
        }
    	CqnSelect selectAvailabilityQuery = Select.from(WorkforceAvailability_.CDS_NAME)
                .where(b -> b.get(WorkforceAvailability.WORK_ASSIGNMENT_ID).eq(availability.getWorkAssignmentID())
                		.and(b.get(WorkforceAvailability.AVAILABILITY_DATE).eq(availability.getAvailabilityDate())));
    	Optional<WorkforceAvailability> existingAvailabilityOptional = persistenceService.run(selectAvailabilityQuery).first(WorkforceAvailability.class);
    	if (existingAvailabilityOptional.isPresent()) {
    		LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, "Found an existing availability, updating the same");
    		workforceAvailabilityServiceValidator.checkAvailabilityForXss(availability);

    		WorkforceAvailability existingAvailability = existingAvailabilityOptional.get();
    		Capacity capacity = Capacity.create();
    		    		
    		// set resource ID if updated
    		String workAssignmentId = availability.getWorkAssignmentID();
    		String workforcePersonID = existingAvailability.getWorkforcePersonId();
    		if (availability.getWorkforcePersonId() != null && workforcePersonID != availability.getWorkforcePersonId()) {
    			workforcePersonID = availability.getWorkforcePersonId();
    			workforceAvailabilityServiceValidator.validateWorkforcePersonActive(workforcePersonID);
    		}
    		String assignmentGuid = workforceAvailabilityServiceValidator.getWorkAssignmentGuid(workAssignmentId, workforcePersonID, tenant);
    		LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, "Retrived work assignment GUID: " + assignmentGuid + " from the external ID.");
			capacity.setResourceId(assignmentGuid);

			// set start time
    		LocalDate startDate = availability.getAvailabilityDate();
    		capacity.setStartTime(DateTimeUtils.convertDateToTimeFormat(startDate));
    		
    		// set working time in minutes and planned not working ours in minutes if updated
    		Collection<WorkforceAvailabilityTimeInterval> availabilityIntervals = existingAvailability.getAvailabilityIntervals();
    		Collection<WorkforceAvailabilitySupplement> availabilitySupplements = existingAvailability.getAvailabilitySupplements();
    		Collection<WorkforceAvailabilityTimeInterval> currentAvailabilityIntervals = availability.getAvailabilityIntervals();
    		Collection<WorkforceAvailabilitySupplement> currentAvailabilitySupplements = availability.getAvailabilitySupplements();
    		if (currentAvailabilityIntervals == null) currentAvailabilityIntervals = availabilityIntervals;
    		if (currentAvailabilitySupplements == null) currentAvailabilitySupplements = availabilitySupplements;
    		
    		String normalWorkingTime = existingAvailability.getNormalWorkingTime();
    		String currentNormalWorkingTime = availability.getNormalWorkingTime();
    		int normalWorkingTimeInMinutes;
    		if (currentNormalWorkingTime != null && !normalWorkingTime.equals(currentNormalWorkingTime)) {
    			workforceAvailabilityServiceValidator.validateNormalWorkingTime(currentNormalWorkingTime, startDate);
    			normalWorkingTime = currentNormalWorkingTime;
    		}
    		normalWorkingTimeInMinutes = DateTimeUtils.getInMinutes(normalWorkingTime);
    		
    		if (!(checkIfProvidedAndExistingAvailabilityIntervalsAreEqual(availabilityIntervals, currentAvailabilityIntervals) && 
    				checkIfProvidedAndExistingAvailabilitySupplementsAreEqual(availabilitySupplements, currentAvailabilitySupplements) &&
    					normalWorkingTimeInMinutes==DateTimeUtils.getInMinutes(existingAvailability.getNormalWorkingTime()))) {
	    			int supplementContributionInMinutes = getSupplementContributionInMinutes(currentAvailabilitySupplements, normalWorkingTimeInMinutes);
	        		int intervalContributionInMinutes = getIntervalContributionInMinutes(currentAvailabilityIntervals, normalWorkingTimeInMinutes);
	        		workforceAvailabilityServiceValidator.validateAvailability(normalWorkingTimeInMinutes, supplementContributionInMinutes,
	        				intervalContributionInMinutes, availability.getAvailabilityDate(), normalWorkingTime);
	            	capacity.setWorkingTimeInMinutes(getIntervalContributionInMinutes(currentAvailabilityIntervals, normalWorkingTimeInMinutes));
	            	capacity.setPlannedNonWorkingTimeInMinutes(getSupplementContributionInMinutes(currentAvailabilitySupplements, normalWorkingTimeInMinutes));
    		}
    		
    		// During update scenario if id is not provided in payload then id should remain the same. 
    		// This method will prevent it from becoming null.
    		setAvailabilityIdIfNull(availability, existingAvailability.getId());
    		
    		// Audit logging updation of workforce availability
    		auditLogUtil.setIsRequestFromCAP(true);
    		AuditedDataSubject dataSubject;
            HashMap<String, String> entity = this.prepareEntityForAuditLog(availability);
            HashMap<String, String> oldEntity = this.prepareEntityForAuditLog(existingAvailability);
            oldEntity.keySet().removeIf(key -> (!entity.containsKey(key)));
            dataSubject = this.getAuditedDataSubject(existingAvailability.getWorkforcePersonId());
            auditLogUtil.prepareDataModificationAuditMessage(context, WORKFORCE_AVAILABILITY_OBJECT_TYPE,
    				AVAILABILITY_SERVICE_IDENTIFIER, UPDATE_OPERATION, entity, oldEntity, dataSubject);
    		
        	context.put(UPDATE_CAPACITY, capacity);
    	}
    }
	
	@After(event = { CqnService.EVENT_UPDATE }, entity = WorkforceAvailability_.CDS_NAME)
    public void afterUpdateAvailability(EventContext context,
    		WorkforceAvailability availability) {
		LOGGER.debug("Starting afterUpdateWorkforceAvailability");
		Capacity capacity;
		if ((capacity = (Capacity) context.get(UPDATE_CAPACITY)) != null) {
			try {
		        persistenceService.run(Update.entity(Capacity_.CDS_NAME).data(capacity));
			} catch (Exception e) {
				throwErrorMessage(MessageKeys.ERROR_WHILE_UPDATING_CAPACITY, "Error occured while updating capacity");
			}
		}
	}
	
	private void setAvailabilityIdIfNull(WorkforceAvailability availability, String existingId) {
		if (availability.getId() == null) {
			availability.setId(existingId);
		}
	}

    /**
     * Sums contribution while iterating over all availability intervals
     *
     * @param availabilityIntervals: Represents an availability intervals of an availability
     * @return Sum of all availability interval contribution in minutes
     */
	private int getIntervalContributionInMinutes (Collection<WorkforceAvailabilityTimeInterval> availabilityIntervals,
			int normalWorkingTime) {
		int intervalContributionInMinutes = 0;
		if (!IsNullCheckUtils.isNullOrEmpty(availabilityIntervals)) {
			for (WorkforceAvailabilityTimeInterval availabilityInterval : availabilityIntervals) {
				workforceAvailabilityServiceValidator.validateIntervalsContributionTime(availabilityInterval.getContribution());
				workforceAvailabilityServiceValidator.validateIntervalStartEndDifferenceEqualToContribution(availabilityInterval.getIntervalStart(),
						availabilityInterval.getIntervalEnd(),
						availabilityInterval.getContribution());
				intervalContributionInMinutes = intervalContributionInMinutes + DateTimeUtils.getInMinutes(availabilityInterval.getContribution());
			}
			if (intervalContributionInMinutes > normalWorkingTime) {
				intervalContributionInMinutes = normalWorkingTime;
			}
		}
		return intervalContributionInMinutes;
	}

    /**
     * Sums contribution while iterating over all availability supplements
     *
     * @param availabilitySupplements: Represents an availability supplements of an availability
     * @return Sum of all availability supplement contribution in minutes
     */
	private int getSupplementContributionInMinutes (Collection<WorkforceAvailabilitySupplement> availabilitySupplements,
			int normalWorkingTime) {
		int supplementContributionInMinutes = 0;
		if (!IsNullCheckUtils.isNullOrEmpty(availabilitySupplements)) {
			for (WorkforceAvailabilitySupplement availabilitySupplement : availabilitySupplements) {
				workforceAvailabilityServiceValidator.validateSupplementContributionTime(availabilitySupplement.getContribution());
				workforceAvailabilityServiceValidator.validateSupplementStartEndDifferenceEqualToContribution(availabilitySupplement.getIntervalStart(),
						availabilitySupplement.getIntervalEnd(),
						availabilitySupplement.getContribution());
				supplementContributionInMinutes = supplementContributionInMinutes + DateTimeUtils.getInMinutes(availabilitySupplement.getContribution());
			}
			if (supplementContributionInMinutes > normalWorkingTime) {
				throwErrorMessageSupplementGreaterThanNormalWorkingTime(MessageKeys.INPUT_SUPPLEMENT_CONTRIBUTION_GREATER_THAN_NORMAL_WORKING_TIME,
						"supplement cannot be more than normal working time");
			}
		}
		return supplementContributionInMinutes;
	}
	
    /**
     * Checks whether the availability intervals provided in payload are equal to existing availability intervals present in DB. 
     * It saves some processing if availability Intervals, availability supplements and normal working time are same in payload and DB.
     *
     * @param availabilityIntervals: Represents an availability intervals present in DB.
     * @param currentAvailabilityIntervals: Represents an availability intervals present in payload.
     * @return true if both are equal else false
     */
	private Boolean checkIfProvidedAndExistingAvailabilityIntervalsAreEqual(Collection<WorkforceAvailabilityTimeInterval> availabilityIntervals, Collection<WorkforceAvailabilityTimeInterval> currentAvailabilityIntervals) {
		LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, "Checking if provided availability intervals are equal to existing availability intervals.");
		if (availabilityIntervals.size()!=currentAvailabilityIntervals.size()) {
			return false;
		}
		for (WorkforceAvailabilityTimeInterval availabilityInterval: availabilityIntervals) {
			if (!currentAvailabilityIntervals.contains(availabilityInterval)) {
				return false;
			}
		}
		
		for (WorkforceAvailabilityTimeInterval currentAvailabilityInterval: currentAvailabilityIntervals) {
			if (!availabilityIntervals.contains(currentAvailabilityInterval)) {
				return false;
			}
		}
		LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, "Provided availability intervals are equal to existing availability intervals during update.");
		return true;
	}
	
	/**
     * Checks whether the availability supplements provided in payload are equal to existing availability supplements present in DB. 
     * It saves some processing if availability Intervals, availability supplements and normal working time are same in payload and DB.
     *
     * @param availabilitySupplements: Represents an availability supplements present in DB.
     * @param currentAvailabilitySupplements: Represents an availability supplements present in payload.
     * @return true if both are equal else false
     */
	private Boolean checkIfProvidedAndExistingAvailabilitySupplementsAreEqual(Collection<WorkforceAvailabilitySupplement> availabilitySupplements, Collection<WorkforceAvailabilitySupplement> currentAvailabilitySupplements) {
		LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, "Checking if provided availability supplements are equal to existing availability supplements.");
		if (availabilitySupplements.size()!=currentAvailabilitySupplements.size()) {
			return false;
		}
		for (WorkforceAvailabilitySupplement availabilitySupplement: availabilitySupplements) {
			if (!currentAvailabilitySupplements.contains(availabilitySupplement)) {
				return false;
			}
		}
		for (WorkforceAvailabilitySupplement currentAvailabilitySupplement: currentAvailabilitySupplements) {
			if (!availabilitySupplements.contains(currentAvailabilitySupplement)) {
				return false;
			}
		}
		LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, "Provided availability supplements are equal to existing availability supplements during update.");
		return true;
	}
	
	private HashMap<String, String> prepareEntityForAuditLog(WorkforceAvailability availability) {
		HashMap<String, String> entity = new HashMap<>();
        if (!IsNullCheckUtils.isNullOrEmpty(availability.getWorkAssignmentID())) {
            entity.put(WorkforceAvailability.WORK_ASSIGNMENT_ID, availability.getWorkAssignmentID());
        }
        if (!IsNullCheckUtils.isNullOrEmpty(availability.getAvailabilityDate())) {
        	String availabilityDate = availability.getAvailabilityDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            entity.put(WorkforceAvailability.AVAILABILITY_DATE, availabilityDate);
        }
        if (!IsNullCheckUtils.isNullOrEmpty(availability.getWorkforcePersonId())) {
            entity.put(WorkforceAvailability.WORKFORCE_PERSON_ID, availability.getWorkforcePersonId());
        }
        if (!IsNullCheckUtils.isNullOrEmpty(availability.getNormalWorkingTime())) {
            entity.put(WorkforceAvailability.NORMAL_WORKING_TIME, availability.getNormalWorkingTime());
        }
        if (!IsNullCheckUtils.isNullOrEmpty(availability.getAvailabilityIntervals())) {
            entity.put(WorkforceAvailability.AVAILABILITY_INTERVALS, convertAvailabilityIntervalsToString(availability.getAvailabilityIntervals()));
        }
        if (!IsNullCheckUtils.isNullOrEmpty(availability.getAvailabilitySupplements())) {
            entity.put(WorkforceAvailability.AVAILABILITY_SUPPLEMENTS, convertAvailabilitySupplementsToString(availability.getAvailabilitySupplements()));
        }
        return entity;
	}
	
    protected AuditedDataSubject getAuditedDataSubject(String workforcePersonID) {
        AuditedDataSubject dataSubject = auditLogFactory.createAuditedDataSubject();
        dataSubject.addIdentifier("ID", workforcePersonID);
        dataSubject.setType(DATA_SUBJECT_TYPE);
        dataSubject.setRole(DATA_SUBJECT_ROLE);
        return dataSubject;
    }
    
    private String convertAvailabilityIntervalsToString(Collection<WorkforceAvailabilityTimeInterval> intervals) {
        StringBuilder intervalString = new StringBuilder();
        for (WorkforceAvailabilityTimeInterval interval : intervals)
        	intervalString.append(interval.toJson());
        return intervalString.toString();
    }
    
    private String convertAvailabilitySupplementsToString(Collection<WorkforceAvailabilitySupplement> supplements) {
        StringBuilder supplementString = new StringBuilder();
        for (WorkforceAvailabilitySupplement supplement : supplements)
        	supplementString.append(supplement.toJson());
        return supplementString.toString();
    }
	
	private void throwErrorMessageSupplementGreaterThanNormalWorkingTime(final String messageKey, final String loggerMsg) {
		messages.error(messageKey).target(null, WorkforceAvailability_.class,
				availabilityError -> availabilityError.availabilitySupplements());
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
	
	private void throwErrorMessage(final String messageKey, final String loggerMsg) {
		messages.error(messageKey);
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
}
