package com.sap.c4p.rm.workforceavailabilityservice.validations;

import static com.sap.c4p.rm.utils.IsNullCheckUtils.isNullOrEmpty;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;

import static java.time.temporal.ChronoUnit.SECONDS;

import java.time.LocalDate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.gen.MessageKeys;
import com.sap.c4p.rm.processor.workforce.dao.WorkAssignmentDAO;
import com.sap.c4p.rm.processor.workforce.dao.WorkforcePersonDAO;
import com.sap.c4p.rm.utils.commonvalidations.CommonValidator;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;

import workforceavailabilityservice.WorkforceAvailability;
import workforceavailabilityservice.WorkforceAvailability_;


@Component
public class WorkforceAvailabilityServiceValidator {
	private static final Logger LOGGER = LoggerFactory
            .getLogger(WorkforceAvailabilityServiceValidator.class);
    private static final Marker WORKFORCE_AVAILABILITY_MARKER = LoggingMarker.WORKFORCE_AVAILABILITY_MARKER.getMarker();
    private static final String TIME_FORMAT = "HH:mm";
    private static final String INVALID_TIME_FORMAT = "Invalid time string (the format should be HH:mm): ";
    
	private final CommonValidator commonValidator;
	private final Messages messages;
	
    protected PersistenceService persistenceService;
    private final WorkforcePersonDAO workforcePersonDAO;
    private final WorkAssignmentDAO workAssignmentDAO;

	@Autowired
    public WorkforceAvailabilityServiceValidator(final CommonValidator commonValidator,
    		final Messages messages, PersistenceService persistenceService, WorkforcePersonDAO workforcePersonDAO, WorkAssignmentDAO workAssignmentDAO) {
        this.commonValidator = commonValidator;
		this.messages = messages;
		this.persistenceService = persistenceService;
		this.workforcePersonDAO = workforcePersonDAO;
		this.workAssignmentDAO = workAssignmentDAO;
    }
	
    /**
     * To check availability for cross site scripting
     *
     * @param availability: Represents an Availability of a Project Team Member
     */
	public void checkAvailabilityForXss(WorkforceAvailability availability) {
		if (!isNullOrEmpty(availability.getWorkAssignmentID())
                && !commonValidator.validateFreeTextforScripting(availability.getWorkAssignmentID())) {
            throwErrorMessageWorkAssignmentID(MessageKeys.INPUT_WORKASSIGNMENT_ID_IS_FORBIDDEN, "The work assignment ID has scripting tags");
        }
        if (!isNullOrEmpty(availability.getWorkforcePersonId())
        		&& !commonValidator.validateFreeTextforScripting(availability.getWorkforcePersonId())) {
        	throwErrorMessageWorkorcePersonId(MessageKeys.INPUT_WORKFORCEPERSON_ID_IS_FORBIDDEN, "The workforce person ID has scripting tags");
        }
        if (!isNullOrEmpty(availability.getNormalWorkingTime())
        		&& !commonValidator.validateFreeTextforScripting(availability.getNormalWorkingTime())) {
        	throwErrorMessageNormalWorkingTime(MessageKeys.INPUT_NORMAL_WORKING_TIME_IS_FORBIDDEN, "The normal working time has scripting tags");
        }
	}
	
    /**
     * To validate if normal working time has correct time format
     *
     * @param time: Represents normal working time
     */
    public void validateNormalWorkingTime(String time, LocalDate availabilityDate) {
    	if (time != null) {
    		if (time.equals("00:00")) {
    			String date = availabilityDate.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
    			throwErrorMessage(MessageKeys.INPUT_NORMAL_WORKING_TIME_IS_ZERO, "There is already a holiday on this day", date);
    		}
    		try {
        		DateTimeFormatter strictTimeFormatter = DateTimeFormatter.ofPattern(TIME_FORMAT)
        	            .withResolverStyle(ResolverStyle.STRICT);
        		LocalTime.parse(time, strictTimeFormatter);
    		} catch (DateTimeParseException | NullPointerException e) {
                throwErrorMessageInvalidNormalWorkingTime(MessageKeys.INPUT_NORMAL_WORKING_TIME_IS_INVALID,
                		INVALID_TIME_FORMAT + time);
    		}
    	}
    }
    
    /**
     * To validate if supplement contribution time has correct time format
     *
     * @param time: Represents contribution time of supplement
     */
    public void validateSupplementContributionTime(String time) {
    	if (time != null) {
    		try {
        		DateTimeFormatter strictTimeFormatter = DateTimeFormatter.ofPattern(TIME_FORMAT)
        	            .withResolverStyle(ResolverStyle.STRICT);
        		LocalTime.parse(time, strictTimeFormatter);
    		} catch (DateTimeParseException | NullPointerException e) {
                throwErrorMessageInvalidSupplementContributionTime(MessageKeys.INPUT_SUPPLEMENT_CONTRIBUTION_TIME_IS_INVALID,
                		INVALID_TIME_FORMAT + time);
    		}
    	}
    }
    
    /**
     * To validate if interval contribution time has correct time format
     *
     * @param time: Represents contribution time of interval
     */
    public void validateIntervalsContributionTime(String time) {
    	if (time != null) {
    		try {
        		DateTimeFormatter strictTimeFormatter = DateTimeFormatter.ofPattern(TIME_FORMAT)
        	            .withResolverStyle(ResolverStyle.STRICT);
        		LocalTime.parse(time, strictTimeFormatter);
    		} catch (DateTimeParseException | NullPointerException e) {
    			throwErrorMessageInvalidIntervalContributionTime(MessageKeys.INPUT_INTERVAL_CONTRIBUTION_TIME_IS_INVALID,
    					INVALID_TIME_FORMAT + time);
    		}
    	}
    }
    
    /**
     * To validate if the difference between interval start time and end time is equal to contribution time
     *
     * @param intervalStart: Represents interval start time
     * @param intervalEnd: Represents interval end time
     * @param contribution: Represents contribution time of interval
     */
    public void validateIntervalStartEndDifferenceEqualToContribution(LocalTime intervalStart, LocalTime intervalEnd, String contribution) {
    	if (intervalEnd!=null && intervalStart!=null && contribution!=null) {
    		long contributionInSeconds = (long) ((Integer.parseInt(contribution.split(":")[0]))*60 + Integer.parseInt(contribution.split(":")[1]))*60;
        	long difference = intervalStart.until(intervalEnd, SECONDS);
        	if (difference < 0) {
        		throwErrorMessageInterval(MessageKeys.INPUT_INTERVAL_START_CAN_NOT_GREATER_THAN_INTERVAL_END,
        				"Interval End cannot be smaller than interval start");
        	}
        	else if ( difference != contributionInSeconds) {
        		throwErrorMessageInterval(MessageKeys.INPUT_INTERVAL_START_END_DIFFERENCE_NOT_EQUAL_TO_CONTRIBUTION,
        				"Difference of interval start and end should be equal to contribution");
        	}
    	}
    }
    
    /**
     * To validate if the difference between interval start time and end time is equal to contribution time
     *
     * @param intervalStart: Represents interval start time
     * @param intervalEnd: Represents interval end time
     * @param contribution: Represents contribution time of interval
     */
    public void validateSupplementStartEndDifferenceEqualToContribution(LocalTime supplementIntervalStart, LocalTime supplementIntervalEnd, String supplementContribution) {
    	if (supplementIntervalEnd!=null && supplementIntervalStart!=null && supplementContribution!=null) {
    		long contributionInSeconds = (long) ((Integer.parseInt(supplementContribution.split(":")[0]))*60 + Integer.parseInt(supplementContribution.split(":")[1]))*60;
        	long difference = supplementIntervalStart.until(supplementIntervalEnd, SECONDS);
        	if (difference < 0) {
        		throwErrorMessageSupplements(MessageKeys.INPUT_INTERVAL_START_CAN_NOT_GREATER_THAN_INTERVAL_END, "Interval End cannot be smaller than interval start");
        	}
        	else if ( difference != contributionInSeconds) {
        		throwErrorMessageSupplements(MessageKeys.INPUT_INTERVAL_START_END_DIFFERENCE_NOT_EQUAL_TO_CONTRIBUTION, "Difference of interval start and end should be equal to contribution");
        	}
    	}
    }
    
    /**
     * To validate availability for different scenarios:
     * 
     * Scenario 1: Throws error if normal working time is non-zero and summation of contributions of availability intervals 
     * and summation of contributions of availability supplements both are zero.
     *  
     * Scenario 2 (Partial data entered): Throws error if normal working time is non-zero and sum of availability intervals contributions 
     * and availability supplements contributions is less than normal working time.
     * 
     * Scenario 3 (Time over booked for the day): Throws error if normal working time is non-zero and sum of availability intervals contributions 
     * and availability supplements contributions is more than normal working time.
     *
     * @param normalWorkingTimeInMinutes: Represents normal working time in minutes
     * @param supplementContributionInMinutes: Represents summation of supplement contribution time in minutes
     * @param intervalContributionInMinutes: Represents summation of interval contribution time in minutes
     */
    public void validateAvailability(int normalWorkingTimeInMinutes, int supplementContributionInMinutes, int intervalContributionInMinutes, LocalDate availabilityDate, String normalWorkingTime) {
    	if (!isNullOrEmpty(normalWorkingTimeInMinutes) && !isNullOrEmpty(supplementContributionInMinutes) && !isNullOrEmpty(intervalContributionInMinutes)) {
			if (normalWorkingTimeInMinutes > 0 && supplementContributionInMinutes==0 && intervalContributionInMinutes==0) {
				throwErrorMessage(MessageKeys.INPUT_AVAILABILITY_INTERVAL_AND_SUPPLEMENT_EMPTY, "Non Zero normal working time and both availability intervals and supplments is null");
			}
			String date = availabilityDate.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
			if (normalWorkingTimeInMinutes > (supplementContributionInMinutes + intervalContributionInMinutes)) {
			    throwErrorMessage(MessageKeys.PARTIAL_DATA_IS_ENTERED_FOR_THE_DAY, "partial / missing data for the day", date);
			} else if(normalWorkingTimeInMinutes < (supplementContributionInMinutes + intervalContributionInMinutes)) {
				throwErrorMessage(MessageKeys.OVERBOOKED_DATA_ENTERED_FOR_THE_DAY, "time over booked for the day", normalWorkingTime);
			}
    	}
    }

	public String getWorkAssignmentGuid(final String workAssignmentExternalId, final String workforcePersonID, final String tenant) {
		WorkAssignments workAssignments = this.workAssignmentDAO.getWorkAssignmentGuidStartDateAndEndDate(workAssignmentExternalId, workforcePersonID, tenant);
		String workAssignmentGuid = null;
        if (workAssignments != null) {
        	workAssignmentGuid = workAssignments.getId();
        } else {
        	throwErrorMessage(MessageKeys.INVALID_WORKASSIGNMENT_ID_OR_WORKFORCEPERSON_ID,
        			"work assignment id and workforce person combination doesn't match");
        }
        return workAssignmentGuid;
	}
	
    /**
     * To validate availability date whether it falls between a work assignment start and end dates.
     *
     * @param workAssignmentExternalId: Represents work assignment external ID
     * @param workforcePersonID: Represents workforce person ID
     * @param tenant
     * @return returns work assignment ID
     */
	public void validateAvailabilityDate(final String workAssignmentExternalId, final String workforcePersonID, final String tenant, final LocalDate availabilityDate) {
		LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, "Checking if availability date falls between work assignment start and end dates.");
		WorkAssignments workAssignments = this.workAssignmentDAO.getWorkAssignmentGuidStartDateAndEndDate(workAssignmentExternalId, workforcePersonID, tenant);
		Boolean isValid = false;
        if (workAssignments != null) {
//        	Removed Job Detail date validation in order to maintain consistency along current functionality, will be uncommented when end of purpose BLI's will be implemented
        	LocalDate startDate = workAssignments.getStartDate();
        	LocalDate endDate = workAssignments.getEndDate();
        	if (startDate != null && endDate != null) {
        		startDate = startDate.minusDays(1);
        		endDate = endDate.plusDays(1);
        		if (startDate.isBefore(availabilityDate) && endDate.isAfter(availabilityDate)) {
        			isValid = true;
        		}
        	}
        	if (isValid.equals(Boolean.FALSE)) {
        		throwErrorMessageAvailabilityDate(MessageKeys.INPUT_AVAILABILITY_DATE_OUT_OF_RANGE, "No active work assignment found for the availability date.");
        	}
        	LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, "The availability date is valid.");
        } else {
        	throwErrorMessage(MessageKeys.INVALID_WORKASSIGNMENT_ID_OR_WORKFORCEPERSON_ID,
        			"work assignment id and workforce person combination doesn't match");
        }
	}
	
	public void validateWorkforcePersonActive(String workforcePersonID) {
		Boolean isBusinessPurposeCompleted = this.workforcePersonDAO.getIsBusinessPurposeCompletedForWorkforcePerson(workforcePersonID);
		if (isBusinessPurposeCompleted==null) {
			throwErrorMessageWorkforcePerson(MessageKeys.WORKFORCE_PERSON_ID_DOES_NOT_EXIST, "The entered workforce person ID does not exist.");
		}
		if (isBusinessPurposeCompleted) {
			throwErrorMessageWorkforcePerson(MessageKeys.WORKFORCE_PERSON_INACTIVE, "The workforce person is inactive", workforcePersonID);
		}
	}
    
	private void throwErrorMessageWorkAssignmentID(final String messageKey, final String loggerMsg) {
		messages.error(messageKey).target(null, WorkforceAvailability_.class,
				availabilityError -> availabilityError.workAssignmentID());
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
	
	private void throwErrorMessageWorkorcePersonId(final String messageKey, final String loggerMsg) {
		messages.error(messageKey).target(null, WorkforceAvailability_.class,
				availabilityError -> availabilityError.workforcePerson_ID());
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
	
	private void throwErrorMessageNormalWorkingTime(final String messageKey, final String loggerMsg) {
		messages.error(messageKey).target(null, WorkforceAvailability_.class,
				availabilityError -> availabilityError.normalWorkingTime());
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
	
	private void throwErrorMessageInvalidNormalWorkingTime(final String messageKey, final String loggerMsg) {
		messages.error(messageKey).target(null, WorkforceAvailability_.class,
				availabilityError -> availabilityError.normalWorkingTime());
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
	
	private void throwErrorMessageInvalidSupplementContributionTime(final String messageKey, final String loggerMsg) {
		messages.error(messageKey).target(null, WorkforceAvailability_.class,
				availabilityError -> availabilityError.availabilitySupplements());
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
	
	private void throwErrorMessageInvalidIntervalContributionTime(final String messageKey, final String loggerMsg) {
		messages.error(messageKey).target(null, WorkforceAvailability_.class,
				availabilityError -> availabilityError.availabilityIntervals());
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
	
	private void throwErrorMessageInterval(final String messageKey, final String loggerMsg) {
		messages.error(messageKey).target(null, WorkforceAvailability_.class,
				availabilityError -> availabilityError.availabilityIntervals());
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
	
	private void throwErrorMessageSupplements(final String messageKey, final String loggerMsg) {
		messages.error(messageKey).target(null, WorkforceAvailability_.class,
				availabilityError -> availabilityError.availabilitySupplements());
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
	
	private void throwErrorMessageAvailabilityDate(final String messageKey, final String loggerMsg) {
		messages.error(messageKey).target(null, WorkforceAvailability_.class,
				availabilityError -> availabilityError.availabilityDate());
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
	
	private void throwErrorMessageWorkforcePerson(final String messageKey, final String loggerMsg, String... errorParameter) {
		messages.error(messageKey, errorParameter).target(null, WorkforceAvailability_.class,
				availabilityError -> availabilityError.workforcePerson_ID());
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
	
	private void throwErrorMessage(final String messageKey, final String loggerMsg, String... errorParameter) {
		messages.error(messageKey, errorParameter);
	    LOGGER.info(WORKFORCE_AVAILABILITY_MARKER, loggerMsg);
	    messages.throwIfError();
    }
}
