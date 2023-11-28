package com.sap.c4p.rm.consultantprofile.projectexperienceservice.validations;

import static com.sap.c4p.rm.consultantprofile.utils.NullUtils.isNullOrEmpty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.repositories.SkillConsumptionRepository;
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
import com.sap.resourcemanagement.employee.priorexperience.ExternalWorkExperience;
import com.sap.resourcemanagement.employee.priorexperience.ExternalWorkExperience_;
import com.sap.resourcemanagement.skill.SkillsConsumption;
import com.sap.resourcemanagement.skill.SkillsConsumption_;

import myprojectexperienceservice.MyProjectExperienceHeader_;
import myprojectexperienceservice.MyProjectExperienceService_;
import myresourcesservice.MyResourcesService_;
import myresourcesservice.ProjectExperienceHeader_;
import projectexperienceservice.ExternalWorkExperienceSkillAssignments;
import projectexperienceservice.ExternalWorkExperienceSkillAssignments_;
import projectexperienceservice.ProjectExperienceService_;

@Component
public class ProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator {

	private static final Logger LOGGER = LoggerFactory
            .getLogger(ProjectExperienceServiceExternalWorkExperienceValidator.class);
    private static final Marker EXTERNAL_WORK_EXPERIENCE_SKILL_ASSIGNMENTS_MARKER = LoggingMarker.EXTERNAL_WORK_EXPERIENCE_SKILL_ASSIGNMENTS_MARKER.getMarker();

	private final CommonValidator commonValidatorClass;
	private final Messages messagesClass;
    private final SkillConsumptionRepository skillConsumptionRepositoryClass;
	private final DraftService myProjectExperienceServiceClass;
    private final DraftService myResourcesServiceClass;
    private final CdsRuntime cdsRuntimeClass;
    
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
    public ProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator(final CommonValidator commonValidator,
    		final Messages messages, final SkillConsumptionRepository skillConsumptionRepository,
    		@Qualifier(MyProjectExperienceService_.CDS_NAME) final DraftService myProjectExperienceService,
            @Qualifier(MyResourcesService_.CDS_NAME) final DraftService myResourcesService,
            final CdsRuntime cdsRuntime) {
    	this.commonValidatorClass = commonValidator;
		this.messagesClass = messages;
		this.skillConsumptionRepositoryClass = skillConsumptionRepository;
        this.myProjectExperienceServiceClass = myProjectExperienceService;
        this.myResourcesServiceClass = myResourcesService;
        this.cdsRuntimeClass = cdsRuntime;
    }
    
    public void checkIfDraftExists(ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments) {
    	cdsRuntimeClass.requestContext().privilegedUser().run(context -> {
	    	if (isNullOrEmpty(externalWorkExperienceSkillAssignments.getProfileID())) {
	    		Result resultFromProjectExperience = projectExperienceService
	                    .run(Select.from(ExternalWorkExperienceSkillAssignments_.class).where(p -> p.ID().eq(externalWorkExperienceSkillAssignments.getId())));
	    		if (resultFromProjectExperience.rowCount() > 0) {
	    			externalWorkExperienceSkillAssignments.setProfileID((String) resultFromProjectExperience.single().get("profileID"));
	    		}
	    	}
	        if (!isNullOrEmpty(externalWorkExperienceSkillAssignments.getProfileID())) {
                Result resultFromMyProjectExperience = myProjectExperienceServiceClass
                        .run(Select.from(MyProjectExperienceHeader_.class).where(p -> (p.ID()
                                .eq(externalWorkExperienceSkillAssignments.getProfileID()).and(p.IsActiveEntity().eq(Boolean.FALSE)))));
                Result resultFromMyResources = myResourcesServiceClass.run(Select.from(ProjectExperienceHeader_.class).where(
                        p -> (p.ID().eq(externalWorkExperienceSkillAssignments.getProfileID()).and(p.IsActiveEntity().eq(Boolean.FALSE)))));
                if (resultFromMyProjectExperience.rowCount() > 0 || resultFromMyResources.rowCount() > 0) {
                    throw new ServiceException(ErrorStatuses.CONFLICT, MessageKeys.PROFILE_DRAFT_EXISTS_EXTERNAL_WORK_EXPERIENCE_SKILL_ASSIGNMENT);
                }
	        }
    	});
    }
    
    public void checkExternalWorkExperienceSkillAssignmentsForXSS(ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments) {
        if (!isNullOrEmpty(externalWorkExperienceSkillAssignments.getProfileID())
                && !commonValidatorClass.validateFreeTextforScripting(externalWorkExperienceSkillAssignments.getProfileID())) {
            throwErrorMessageProfile(MessageKeys.INPUT_PROFILE_ID_IS_FORBIDDEN, "The profile ID has scripting tags");
        }
        if (!isNullOrEmpty(externalWorkExperienceSkillAssignments.getSkillID())
                && !commonValidatorClass.validateFreeTextforScripting(externalWorkExperienceSkillAssignments.getSkillID())) {
            throwErrorMessageSkill(MessageKeys.INPUT_SKILL_ID_IS_FORBIDDEN, "The skill ID has scripting tags");
        }
        if (!isNullOrEmpty(externalWorkExperienceSkillAssignments.getProficiencyLevelID())
                && !commonValidatorClass.validateFreeTextforScripting(externalWorkExperienceSkillAssignments.getProficiencyLevelID())) {
            throwErrorMessageProficiency(MessageKeys.INPUT_PROFICIENCY_LEVEL_ID_IS_FORBIDDEN,
                    "The proficiency level ID has scripting tags");
        }
        if (!isNullOrEmpty(externalWorkExperienceSkillAssignments.getExternalWorkExperienceID())
                && !commonValidatorClass.validateFreeTextforScripting(externalWorkExperienceSkillAssignments.getExternalWorkExperienceID())) {
        	throwErrorMessageExternalWorkExperienceID(MessageKeys.INPUT_PROFICIENCY_LEVEL_ID_IS_FORBIDDEN,
                    "The External Work Experience ID has scripting tags");
        }
    }

    /**
     * To check if profile in external work experience skill assignment exists
     *
     * @param externalWorkExperienceSkillAssignments: represents a external work experience skill assignment
     */
    public void checkForeignKeyValueForAssignedProfile(ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments) {
        if (!isNullOrEmpty(externalWorkExperienceSkillAssignments.getProfileID()) && !commonValidatorClass
                .checkInputValueExistingDB(Headers_.CDS_NAME, Headers.ID, externalWorkExperienceSkillAssignments.getProfileID())) {
            throwErrorMessageProfile(MessageKeys.PROFILE_ID_DOES_NOT_EXIST,
                    "The Profile ID is not valid");
        }
    }
    
    /**
     * To check if external work experience in external work experience skill assignment exists
     *
     * @param externalWorkExperienceSkillAssignments: represents a external work experience skill assignment
     */
    public void checkForeignKeyValueForAssignedExternalWorkExperience(ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments) {
        if (!isNullOrEmpty(externalWorkExperienceSkillAssignments.getExternalWorkExperienceID()) && !commonValidatorClass
                .checkInputValueExistingDB(ExternalWorkExperience_.CDS_NAME, ExternalWorkExperience.ID, externalWorkExperienceSkillAssignments.getExternalWorkExperienceID())) {
            throwErrorMessageExternalWorkExperience(MessageKeys.EXTERNAL_WORK_EXPERIENCE_ID_DOES_NOT_EXIST,
                    "The external work experience ID is not valid");
        }
    }

    /**
     * To check if skill in external work experience skill assignment exists
     *
     * @param externalWorkExperienceSkillAssignments: represents a external work experience skill assignment
     */
    public void checkForeignKeyValueForAssignedSkill(ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments) {
        if (!isNullOrEmpty(externalWorkExperienceSkillAssignments.getSkillID())
                && !commonValidatorClass.checkInputValueExistingDB(SkillsConsumption_.CDS_NAME, SkillsConsumption.ID,
                		externalWorkExperienceSkillAssignments.getSkillID())) {
            throwErrorMessageSkill(MessageKeys.SKILL_ID_DOES_NOT_EXIST,
                    "The skill entered under the skills is not in DB");
        }
    }

    /**
     * To check if proficiency level in external work experience skill assignment exists
     *
     * @param externalWorkExperienceSkillAssignments: represents a external work experience skill assignment
     */
    public void checkForeignKeyValueForAssignedProficiencyLevel(ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments) {
        if (!isNullOrEmpty(externalWorkExperienceSkillAssignments.getSkillID()) && !isNullOrEmpty(externalWorkExperienceSkillAssignments.getProficiencyLevelID())) {
            skillConsumptionRepositoryClass.findById(externalWorkExperienceSkillAssignments.getSkillID()).ifPresent(skill -> {
                if (skill.getProficiencySet().getProficiencyLevels().stream()
                        .noneMatch(level -> level.getId().equals(externalWorkExperienceSkillAssignments.getProficiencyLevelID()))) {
                    this.throwErrorMessageProficiency(MessageKeys.PROFICIENCY_LEVEL_ID_DOES_NOT_EXIST,
                            "Proficiency Level ID is not valid");
                }
            });
        }
    }

    private void throwErrorMessageProfile(final String messageKey, final String loggerMsg) {
        messagesClass.error(messageKey).target(null, ExternalWorkExperienceSkillAssignments_.class,
                externalWorkExperienceSkillAssignments -> externalWorkExperienceSkillAssignments.profileID());
        LOGGER.info(EXTERNAL_WORK_EXPERIENCE_SKILL_ASSIGNMENTS_MARKER, loggerMsg);
        messagesClass.throwIfError();
    }
    
    private void throwErrorMessageExternalWorkExperience(final String messageKey, final String loggerMsg) {
        messagesClass.error(messageKey).target(null, ExternalWorkExperienceSkillAssignments_.class,
                externalWorkExperienceSkillAssignments -> externalWorkExperienceSkillAssignments.externalWorkExperienceID());
        LOGGER.info(EXTERNAL_WORK_EXPERIENCE_SKILL_ASSIGNMENTS_MARKER, loggerMsg);
        messagesClass.throwIfError();
    }
    
    private void throwErrorMessageSkill(final String messageKey, final String loggerMsg) {
        messagesClass.error(messageKey).target(null, ExternalWorkExperienceSkillAssignments_.class,
                externalWorkExperienceSkillAssignments -> externalWorkExperienceSkillAssignments.skillID());
        LOGGER.info(EXTERNAL_WORK_EXPERIENCE_SKILL_ASSIGNMENTS_MARKER, loggerMsg);
        messagesClass.throwIfError();
    }

    private void throwErrorMessageProficiency(final String messageKey, final String loggerMsg) {
        messagesClass.error(messageKey).target(null, ExternalWorkExperienceSkillAssignments_.class,
                externalWorkExperienceSkillAssignments -> externalWorkExperienceSkillAssignments.proficiencyLevelID());
        LOGGER.info(EXTERNAL_WORK_EXPERIENCE_SKILL_ASSIGNMENTS_MARKER, loggerMsg);
        messagesClass.throwIfError();
    }
    
    private void throwErrorMessageExternalWorkExperienceID(final String messageKey, final String loggerMsg) {
        messagesClass.error(messageKey).target(null, ExternalWorkExperienceSkillAssignments_.class,
                externalWorkExperienceSkillAssignments -> externalWorkExperienceSkillAssignments.externalWorkExperienceID());
        LOGGER.info(EXTERNAL_WORK_EXPERIENCE_SKILL_ASSIGNMENTS_MARKER, loggerMsg);
        messagesClass.throwIfError();
    }
}
