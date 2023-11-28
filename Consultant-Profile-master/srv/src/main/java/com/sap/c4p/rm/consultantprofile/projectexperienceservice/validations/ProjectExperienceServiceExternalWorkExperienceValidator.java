package com.sap.c4p.rm.consultantprofile.projectexperienceservice.validations;

import static com.sap.c4p.rm.consultantprofile.utils.NullUtils.isNullOrEmpty;

import java.time.chrono.ChronoLocalDate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;
import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.resourcemanagement.employee.Headers;
import com.sap.resourcemanagement.employee.Headers_;

import myprojectexperienceservice.MyProjectExperienceHeader_;
import myprojectexperienceservice.MyProjectExperienceService_;
import myresourcesservice.MyResourcesService_;
import myresourcesservice.ProjectExperienceHeader_;
import projectexperienceservice.ExternalWorkExperience;
import projectexperienceservice.ExternalWorkExperience_;
import projectexperienceservice.ProjectExperienceService_;

@Component
public class ProjectExperienceServiceExternalWorkExperienceValidator {

	private static final Logger LOGGER = LoggerFactory
            .getLogger(ProjectExperienceServiceExternalWorkExperienceValidator.class);
    private static final Marker EXTERNAL_WORK_EXPERIENCE_MARKER = LoggingMarker.EXTERNAL_WORK_EXPERIENCE_MARKER.getMarker();

	private final CommonValidator commonValidator;
	private final Messages messages;
    private final DraftService myProjectExperienceService;
    private final DraftService myResourcesService;
    private final CdsRuntime cdsRuntime;
    
    @Autowired
    @Qualifier(ProjectExperienceService_.CDS_NAME)
    private CqnService projectExperienceService;

    /**
     * initialize {@link ProjectExperienceServiceExternalWorkExperienceValidator} instance
     * and accept the instance of {@link CommonValidator} to be used
     *
     * @param commonValidator will be used to invoke common validation methods
     */
    @Autowired
    public ProjectExperienceServiceExternalWorkExperienceValidator(final CommonValidator commonValidator,
    		final Messages messages, @Qualifier(MyProjectExperienceService_.CDS_NAME) final DraftService myProjectExperienceService,
            @Qualifier(MyResourcesService_.CDS_NAME) final DraftService myResourcesService,
            final CdsRuntime cdsRuntime) {
        this.commonValidator = commonValidator;
		this.messages = messages;
		this.myProjectExperienceService = myProjectExperienceService;
        this.myResourcesService = myResourcesService;
        this.cdsRuntime = cdsRuntime;
    }
    
    public void checkIfDraftExists(ExternalWorkExperience externalWorkExperience) {
    	cdsRuntime.requestContext().privilegedUser().run(context -> {
	    	if (isNullOrEmpty(externalWorkExperience.getProfileID())) {
	    		Result resultFromProjectExperience = projectExperienceService
	                    .run(Select.from(ExternalWorkExperience_.class).where(p -> p.ID().eq(externalWorkExperience.getId())));
	    		if (resultFromProjectExperience.rowCount() > 0) {
	    			externalWorkExperience.setProfileID((String) resultFromProjectExperience.single().get("profileID"));
	    		}
	    	}
	        if (!isNullOrEmpty(externalWorkExperience.getProfileID())) {
                Result resultFromMyProjectExperience = myProjectExperienceService
                        .run(Select.from(MyProjectExperienceHeader_.class).where(p -> (p.ID()
                                .eq(externalWorkExperience.getProfileID()).and(p.IsActiveEntity().eq(Boolean.FALSE)))));
                Result resultFromMyResources = myResourcesService.run(Select.from(ProjectExperienceHeader_.class).where(
                        p -> (p.ID().eq(externalWorkExperience.getProfileID()).and(p.IsActiveEntity().eq(Boolean.FALSE)))));
                if (resultFromMyProjectExperience.rowCount() > 0 || resultFromMyResources.rowCount() > 0) {
                    throw new ServiceException(ErrorStatuses.CONFLICT, MessageKeys.PROFILE_DRAFT_EXISTS_EXTERNAL_WORK_EXPERIENCE);
                }
	        }
    	});
    }

    /**
     * To check external work experience for cross site scripting
     *
     * @param externalWorkExperience: Represents an External Work Experience to Project Team Member
     */
    public void checkExternalWorkExperienceForXSS(ExternalWorkExperience externalWorkExperience) {
        if (!isNullOrEmpty(externalWorkExperience.getProfileID())
                && !commonValidator.validateFreeTextforScripting(externalWorkExperience.getProfileID())) {
            throwErrorMessageProfile(MessageKeys.INPUT_PROFILE_ID_IS_FORBIDDEN, "The profile ID has scripting tags");
        }
        if (!isNullOrEmpty(externalWorkExperience.getComments())
        		&& !commonValidator.validateFreeTextforScripting(externalWorkExperience.getComments())) {
        	throwErrorMessageComments(MessageKeys.INPUT_COMMENT_IS_FORBIDDEN, "The comment entered in the external work experience has scripting tags");
        }
        if (!isNullOrEmpty(externalWorkExperience.getCustomer())
        		&& !commonValidator.validateFreeTextforScripting(externalWorkExperience.getCustomer())) {
        	throwErrorMessageCustomer(MessageKeys.INPUT_CUSTOMER_IS_FORBIDDEN, "The customer entered in the external work experience has scripting tags");
        }
        if (!isNullOrEmpty(externalWorkExperience.getRole())
        		&& !commonValidator.validateFreeTextforScripting(externalWorkExperience.getRole())) {
        	throwErrorMessageRole(MessageKeys.INPUT_ROLE_IS_FORBIDDEN, "The role entered in the external work experience has scripting tags");
        }
        if (!isNullOrEmpty(externalWorkExperience.getCompany())
        		&& !commonValidator.validateFreeTextforScripting(externalWorkExperience.getCompany())) {
        	throwErrorMessageCompany(MessageKeys.INPUT_COMPANY_IS_FORBIDDEN, "The company entered in the external work experience has scripting tags");
        }
        if (!isNullOrEmpty(externalWorkExperience.getProject())
        		&& !commonValidator.validateFreeTextforScripting(externalWorkExperience.getProject())) {
        	throwErrorMessageProject(MessageKeys.INPUT_PROJECT_IS_FORBIDDEN, "The project entered in the external work experience has scripting tags");
        }
    }
    
    /**
     * To check if start date is not greater than end date
     *
     * @param externalWorkExperience: represents a external work experience
     */
    public void validateStartDate(ExternalWorkExperience externalWorkExperience) {
        if (!isNullOrEmpty(externalWorkExperience.getStartDate()) && !isNullOrEmpty(externalWorkExperience.getEndDate())
        		&& isStartDateGreater(externalWorkExperience.getStartDate(), externalWorkExperience.getEndDate())) {
        	throwErrorMessageStartDate(MessageKeys.STARTDATE_SHOULD_NOT_BE_GREATER_THAN_ENDDATE, "The start date entered in the external work experience is greater than the end date");
        }
    }

    /**
     * To check if profile in external work experience exists
     *
     * @param externalWorkExperience: represents a external work experience
     */
    public void checkForeignKeyValueForAssignedProfile(ExternalWorkExperience externalWorkExperience) {
        if (!isNullOrEmpty(externalWorkExperience.getProfileID()) && !commonValidator
                .checkInputValueExistingDB(Headers_.CDS_NAME, Headers.ID, externalWorkExperience.getProfileID())) {
            throwErrorMessageProfile(MessageKeys.PROFILE_ID_DOES_NOT_EXIST,
                    "The Profile ID is not valid");
        }
    }
    
    private boolean isStartDateGreater(ChronoLocalDate startDate, ChronoLocalDate endDate) {
        return startDate.compareTo(endDate) > 0;
    }
    
    private void throwErrorMessageProfile(final String messageKey, final String loggerMsg) {
        messages.error(messageKey).target(null, ExternalWorkExperience_.class,
                externalWorkExperience -> externalWorkExperience.profileID());
        LOGGER.info(EXTERNAL_WORK_EXPERIENCE_MARKER, loggerMsg);
        messages.throwIfError();
    }
    
    private void throwErrorMessageComments(final String messageKey, final String loggerMsg) {
        messages.error(messageKey).target(null, ExternalWorkExperience_.class,
                externalWorkExperience -> externalWorkExperience.comments());
        LOGGER.info(EXTERNAL_WORK_EXPERIENCE_MARKER, loggerMsg);
        messages.throwIfError();
    }
    
    private void throwErrorMessageCustomer(final String messageKey, final String loggerMsg) {
        messages.error(messageKey).target(null, ExternalWorkExperience_.class,
                externalWorkExperience -> externalWorkExperience.customer());
        LOGGER.info(EXTERNAL_WORK_EXPERIENCE_MARKER, loggerMsg);
        messages.throwIfError();
    }
    
    private void throwErrorMessageRole(final String messageKey, final String loggerMsg) {
        messages.error(messageKey).target(null, ExternalWorkExperience_.class,
                externalWorkExperience -> externalWorkExperience.role());
        LOGGER.info(EXTERNAL_WORK_EXPERIENCE_MARKER, loggerMsg);
        messages.throwIfError();
    }
    
    private void throwErrorMessageCompany(final String messageKey, final String loggerMsg) {
        messages.error(messageKey).target(null, ExternalWorkExperience_.class,
                externalWorkExperience -> externalWorkExperience.company());
        LOGGER.info(EXTERNAL_WORK_EXPERIENCE_MARKER, loggerMsg);
        messages.throwIfError();
    }
    
    private void throwErrorMessageProject(final String messageKey, final String loggerMsg) {
        messages.error(messageKey).target(null, ExternalWorkExperience_.class,
                externalWorkExperience -> externalWorkExperience.project());
        LOGGER.info(EXTERNAL_WORK_EXPERIENCE_MARKER, loggerMsg);
        messages.throwIfError();
    }
    
    private void throwErrorMessageStartDate(final String messageKey, final String loggerMsg) {
        messages.error(messageKey).target(null, ExternalWorkExperience_.class,
                externalWorkExperience -> externalWorkExperience.startDate());
        LOGGER.info(EXTERNAL_WORK_EXPERIENCE_MARKER, loggerMsg);
        messages.throwIfError();
    }
}
