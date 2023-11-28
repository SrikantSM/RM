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
import com.sap.resourcemanagement.skill.SkillsConsumption;
import com.sap.resourcemanagement.skill.SkillsConsumption_;

import myprojectexperienceservice.MyProjectExperienceHeader_;
import myprojectexperienceservice.MyProjectExperienceService_;
import myresourcesservice.MyResourcesService_;
import myresourcesservice.ProjectExperienceHeader_;
import projectexperienceservice.ProjectExperienceService_;
import projectexperienceservice.SkillAssignments;
import projectexperienceservice.SkillAssignments_;

/**
 * Class to validate the skills are being Assigned to employee
 */
@Component
public class ProjectExperienceServiceSkillAssignmentsValidator {
    private static final Logger LOGGER = LoggerFactory
            .getLogger(ProjectExperienceServiceSkillAssignmentsValidator.class);
    private static final Marker SKILL_ASSIGNMENT_MARKER = LoggingMarker.SKILL_ASSIGNMENT_MARKER.getMarker();

    private final CommonValidator commonValidator;
    private final Messages messages;
    private final SkillConsumptionRepository skillConsumptionRepository;
    private final DraftService myProjectExperienceService;
    private final DraftService myResourcesService;
    private final CdsRuntime cdsRuntime;
    
    @Autowired
    @Qualifier(ProjectExperienceService_.CDS_NAME)
    private CqnService projectExperienceService;

    /**
     * initialize {@link ProjectExperienceServiceSkillAssignmentsValidator} instance
     * and accept the instance of {@link CommonValidator} to be used
     *
     * @param commonValidator will be used to invoke common validation methods
     */
    @Autowired
    public ProjectExperienceServiceSkillAssignmentsValidator(final CommonValidator commonValidator,
            final Messages messages, final SkillConsumptionRepository skillConsumptionRepository,
            @Qualifier(MyProjectExperienceService_.CDS_NAME) final DraftService myProjectExperienceService,
            @Qualifier(MyResourcesService_.CDS_NAME) final DraftService myResourcesService,
            final CdsRuntime cdsRuntime) {
        this.commonValidator = commonValidator;
        this.messages = messages;
        this.skillConsumptionRepository = skillConsumptionRepository;
        this.myProjectExperienceService = myProjectExperienceService;
        this.myResourcesService = myResourcesService;
        this.cdsRuntime = cdsRuntime;
    }

    public void checkIfDraftExists(SkillAssignments skillAssignment) {
    	cdsRuntime.requestContext().privilegedUser().run(context -> {
	    	if (isNullOrEmpty(skillAssignment.getProfileID())) {
	    		Result resultFromProjectExperience = projectExperienceService
	                    .run(Select.from(SkillAssignments_.class).where(p -> p.ID().eq(skillAssignment.getId())));
	    		if (resultFromProjectExperience.rowCount() > 0) {
	    			skillAssignment.setProfileID((String) resultFromProjectExperience.single().get("profileID"));
	    		}
	    	}
	        if (!isNullOrEmpty(skillAssignment.getProfileID())) {
                Result resultFromMyProjectExperience = myProjectExperienceService
                        .run(Select.from(MyProjectExperienceHeader_.class).where(p -> (p.ID()
                                .eq(skillAssignment.getProfileID()).and(p.IsActiveEntity().eq(Boolean.FALSE)))));
                Result resultFromMyResources = myResourcesService.run(Select.from(ProjectExperienceHeader_.class).where(
                        p -> (p.ID().eq(skillAssignment.getProfileID()).and(p.IsActiveEntity().eq(Boolean.FALSE)))));
                if (resultFromMyProjectExperience.rowCount() > 0 || resultFromMyResources.rowCount() > 0) {
                    throw new ServiceException(ErrorStatuses.CONFLICT, MessageKeys.PROFILE_DRAFT_EXISTS_SKILL_ASSIGNMENT);
                }
	        }
    	});
    }

    /**
     * To check skill assignment for cross site scripting
     *
     * @param skillAssignment: Represents an assigned skill to Project Team Member
     */
    public void checkSkillAssignmentForXSS(SkillAssignments skillAssignment) {
        if (!isNullOrEmpty(skillAssignment.getProfileID())
                && !commonValidator.validateFreeTextforScripting(skillAssignment.getProfileID())) {
            throwErrorMessageProfile(MessageKeys.INPUT_PROFILE_ID_IS_FORBIDDEN, "The profile ID has scripting tags");
        }
        if (!isNullOrEmpty(skillAssignment.getSkillID())
                && !commonValidator.validateFreeTextforScripting(skillAssignment.getSkillID())) {
            throwErrorMessageSkill(MessageKeys.INPUT_SKILL_ID_IS_FORBIDDEN, "The skill ID has scripting tags");
        }
        if (!isNullOrEmpty(skillAssignment.getProficiencyLevelID())
                && !commonValidator.validateFreeTextforScripting(skillAssignment.getProficiencyLevelID())) {
            throwErrorMessageProficiency(MessageKeys.INPUT_PROFICIENCY_LEVEL_ID_IS_FORBIDDEN,
                    "The proficiency level ID has scripting tags");
        }

    }

    /**
     * To check if skill in skill assignment exists
     *
     * @param skillAssignment: represents a assigned to skill
     */
    public void checkForeignKeyValueForAssignedSkill(SkillAssignments skillAssignment) {
        if (!isNullOrEmpty(skillAssignment.getSkillID())
                && !commonValidator.checkInputValueExistingDB(SkillsConsumption_.CDS_NAME, SkillsConsumption.ID,
                        skillAssignment.getSkillID())) {
            throwErrorMessageSkill(MessageKeys.SKILL_ID_DOES_NOT_EXIST,
                    "The skill entered under the skills is not in DB");
        }
    }

    /**
     * To check if profile in skill assignment exists
     *
     * @param skillAssignment: represents a assigned to skill
     */
    public void checkForeignKeyValueForAssignedProfile(SkillAssignments skillAssignment) {
        if (!isNullOrEmpty(skillAssignment.getProfileID()) && !commonValidator
                .checkInputValueExistingDB(Headers_.CDS_NAME, Headers.ID, skillAssignment.getProfileID())) {
            throwErrorMessageProfile(MessageKeys.PROFILE_ID_DOES_NOT_EXIST,
                    "The skill entered under the skills is not in DB");
        }
    }

    /**
     * To check if proficiency level in skill assignment exists
     *
     * @param skillAssignment: represents a assigned to skill
     */
    public void checkForeignKeyValueForAssignedProficiencyLevel(SkillAssignments skillAssignment) {
        if (!isNullOrEmpty(skillAssignment.getSkillID()) && !isNullOrEmpty(skillAssignment.getProficiencyLevelID())) {
            skillConsumptionRepository.findById(skillAssignment.getSkillID()).ifPresent(skill -> {
                if (skill.getProficiencySet().getProficiencyLevels().stream()
                        .noneMatch(level -> level.getId().equals(skillAssignment.getProficiencyLevelID()))) {
                    this.throwErrorMessageProficiency(MessageKeys.PROFICIENCY_LEVEL_ID_DOES_NOT_EXIST,
                            "Proficiency Level ID is not valid");
                }
            });
        }
    }

    private void throwErrorMessageSkill(final String messageKey, final String loggerMsg) {
        messages.error(messageKey).target(null, SkillAssignments_.class,
                skillAssignments -> skillAssignments.skillID());
        LOGGER.info(SKILL_ASSIGNMENT_MARKER, loggerMsg);
        messages.throwIfError();
    }

    private void throwErrorMessageProfile(final String messageKey, final String loggerMsg) {
        messages.error(messageKey).target(null, SkillAssignments_.class,
                skillAssignments -> skillAssignments.profileID());
        LOGGER.info(SKILL_ASSIGNMENT_MARKER, loggerMsg);
        messages.throwIfError();
    }

    public void throwErrorMessageProficiency(final String messageKey, final String loggerMsg) {
        messages.error(messageKey).target(null, SkillAssignments_.class,
                skillAssignments -> skillAssignments.proficiencyLevelID());
        LOGGER.info(SKILL_ASSIGNMENT_MARKER, loggerMsg);
        messages.throwIfError();
    }
}
