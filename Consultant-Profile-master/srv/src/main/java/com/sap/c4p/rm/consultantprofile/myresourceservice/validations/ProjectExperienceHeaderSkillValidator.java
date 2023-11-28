package com.sap.c4p.rm.consultantprofile.myresourceservice.validations;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.repositories.SkillConsumptionRepository;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import com.sap.resourcemanagement.skill.SkillsConsumption;
import com.sap.resourcemanagement.skill.SkillsConsumption_;

import myresourcesservice.ProjectExperienceHeader_;
import myresourcesservice.Skills;

/**
 * Class to validate the skills are being Assigned to
 * {@link myresourceservice.ProjectExperienceHeader}
 */
@Component
public class ProjectExperienceHeaderSkillValidator {
    private static final Logger LOGGER = LoggerFactory.getLogger(ProjectExperienceHeaderSkillValidator.class);
    private static final Marker SKILL_ASSIGNMENT_MARKER = LoggingMarker.SKILL_ASSIGNMENT_MARKER.getMarker();

    private final CommonValidator commonValidator;
    private final Messages messages;
    private final SkillConsumptionRepository skillConsumptionRepository;

    /**
     * initialize {@link ProjectExperienceHeaderSkillValidator} instance and accept
     * the instance of {@link CommonValidator} to be used
     *
     * @param commonValidator will be used to invoke common validation methods
     */
    @Autowired
    public ProjectExperienceHeaderSkillValidator(final CommonValidator commonValidator, final Messages messages,
            final SkillConsumptionRepository skillConsumptionRepository) {
        this.commonValidator = commonValidator;
        this.messages = messages;
        this.skillConsumptionRepository = skillConsumptionRepository;
    }

    private void checkProficiencyLevel(Skills skillAssignmentRequest) {
        if (skillAssignmentRequest.getProficiencyLevelId() == null) {
            this.prepareErrorMessageProficiency(skillAssignmentRequest, MessageKeys.PROFICIENCY_LEVEL_NULL);
            return;
        }

        skillConsumptionRepository.findById(skillAssignmentRequest.getSkillId()).ifPresent(skill -> {
            if (skill.getProficiencySet().getProficiencyLevels().stream()
                    .noneMatch(level -> level.getId().equals(skillAssignmentRequest.getProficiencyLevelId()))) {
                this.prepareErrorMessageProficiency(skillAssignmentRequest, MessageKeys.PROFICIENCY_LEVEL_IS_INVALID);
            }
        });
    }

    /**
     * method to validate {@link Skills}
     *
     * @param skills: represents the list of assigned skills
     */
    void validateProjectExperienceHeaderSkills(List<Skills> skills) {
        try {
            for (Skills skill : skills) {
                if (!checkNullForAssignedSkills(skill)) {
                    checkRoleAssignedForXSS(skill);
                    checkForeignKeyForAssignedSkill(skill);
                    checkProficiencyLevel(skill);
                }
            }
            checkDuplicateForSkillAssignment(skills);
        } catch (ServiceException serviceException) {
            throw new ServiceException(serviceException);
        }
    }

    /**
     * method to check if given input value exists in related DB artifact
     *
     * @param skill: represents a assigned to skill
     */
    private boolean checkNullForAssignedSkills(Skills skill) {
        if (NullUtils.isNullOrEmpty(skill.getSkillId()) || skill.getSkillId().matches("^\\s*$")) {
            prepareErrorMessageSkill(skill, MessageKeys.INPUT_SKILL_CAN_NOT_EMPTY,
                    "The skill entered under the skills is null or empty");
            return true;
        }
        return false;
    }

    /**
     * method to check if Duplicate is being assigned to
     * {@link myresourceservice.ProjectExperienceHeader}
     *
     * @param skill: represents a assigned to skill
     */
    private void checkForeignKeyForAssignedSkill(Skills skill) {
        if (!commonValidator.checkInputValueExistingDB(SkillsConsumption_.CDS_NAME, SkillsConsumption.ID,
                skill.getSkillId())) {
            prepareErrorMessageSkill(skill, MessageKeys.SKILL_DOES_NOT_EXISTS,
                    "The skill entered under the skills is not in DB");
        }
    }

    /**
     * method to check if Duplicate is being assigned to
     * {@link myresourceservice.ProjectExperienceHeader}
     *
     * @param skills: represents the list of assigned skills
     */
    private void checkDuplicateForSkillAssignment(List<Skills> skills) {
        Set<String> uniqueAssignedSkills = new HashSet<>();
        List<String> duplicateSkills = new ArrayList<>();
        List<String> skillId = new ArrayList<>();
        skills.forEach(skill -> {
            if (!uniqueAssignedSkills.add(skill.getSkillId())) {
                skillId.add(skill.getId());
                duplicateSkills.add(skill.getSkillId());
            }
        });
        checkDuplicateForSkillID(duplicateSkills, skillId);
    }

    private void checkDuplicateForSkillID(List<String> duplicateSkills, List<String> skillId) {
        if (!(NullUtils.isNullOrEmpty(duplicateSkills))) {
            prepareErrorMessageSkill(skillId.get(0), MessageKeys.DUPLICATE_SKILL_CAN_NOT_BE_ASSIGNED,
                    "The skill entered has already been added under the skills");
        }
    }

    /**
     * method to check if given input value of skill as ID is valid
     *
     * @param skill: Represents {@link Skills} payload
     */
    public boolean checkInputFieldSize(Skills skill) {
        final String skillID = skill.getSkillId();
        if (commonValidator.checkInputGuidFieldLength(skillID)) {
            this.prepareErrorMessageSkill(skill, MessageKeys.SKILL_DOES_NOT_EXISTS);
            return false;
        }
        return true;
    }

    /**
     * method to check input skills for cross site scripting
     *
     * @param skill: Represents an assigned skill to {MyProject}
     */
    private void checkRoleAssignedForXSS(Skills skill) {
        if (!commonValidator.validateFreeTextforScripting(skill.getSkillId())) {
            prepareErrorMessageSkill(skill, MessageKeys.INPUT_SKILL_IS_INVALID,
                    "The skill entered under the skills has scripting tags");
        }
    }

    private void prepareErrorMessageSkill(final String skillId, final String messageKey, final String loggerMsg) {
        messages.error(messageKey).target("in", ProjectExperienceHeader_.class, projExp -> projExp
                .skills(header -> header.ID().eq(skillId).and(header.IsActiveEntity().eq(Boolean.FALSE))).skill_ID());
        LOGGER.info(SKILL_ASSIGNMENT_MARKER, loggerMsg);
    }

    public void prepareErrorMessageProficiency(final Skills skill, final String messageKey) {
        messages.error(messageKey).target("in", ProjectExperienceHeader_.class,
                projExp -> projExp
                        .skills(header -> header.ID().eq(skill.getId()).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                        .proficiencyLevel_ID());
        LOGGER.info(SKILL_ASSIGNMENT_MARKER, messageKey);
    }

    public void prepareErrorMessageSkill(final Skills skill, final String messageKey) {
        prepareErrorMessageSkill(skill.getId(), messageKey, messageKey);
    }

    private void prepareErrorMessageSkill(final Skills skill, final String messageKey, final String loggerMsg) {
        prepareErrorMessageSkill(skill.getId(), messageKey, loggerMsg);
    }

}
