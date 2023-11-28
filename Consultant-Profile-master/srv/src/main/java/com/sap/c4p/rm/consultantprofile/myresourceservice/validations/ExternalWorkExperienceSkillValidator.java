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
import com.sap.c4p.rm.consultantprofile.repositories.ProficiencyLevelConsumptionRepository;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;
import com.sap.c4p.rm.consultantprofile.utils.commonutility.CommonUtility;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import com.sap.resourcemanagement.skill.SkillsConsumption;
import com.sap.resourcemanagement.skill.SkillsConsumption_;

import myresourcesservice.ExternalWorkExperienceSkills;
import myresourcesservice.ProjectExperienceHeader_;
import myresourcesservice.SkillMasterList;
import myresourcesservice.SkillMasterList_;

/**
 * Class to validate the list of {@link SkillMasterList} are being assigned to
 * {@link myresourceservice.ProjectExperienceHeader}
 */
@Component
public class ExternalWorkExperienceSkillValidator {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExternalWorkExperienceSkillValidator.class);
    private static final Marker EXT_WORK_EXP_SKILL_MARKER = LoggingMarker.EXT_WORK_EXP_SKILL_MARKER.getMarker();

    private final CommonValidator commonValidator;
    private final CommonUtility commonUtility;
    private final Messages messages;
    private final ProficiencyLevelConsumptionRepository proficiencyLevelConsumptionRepository;

    /**
     * initialize {@link ProjectExperienceHeaderSkillValidator} instance and accept
     * the instance of {@link CommonValidator} and {@link CommonUtility} to be used
     *
     * @param commonValidator will be used to invoke common validation methods
     * @param commonUtility   will be used to invoke common utility methods
     */
    @Autowired
    public ExternalWorkExperienceSkillValidator(final CommonValidator commonValidator,
            final CommonUtility commonUtility, final Messages messages,
            final ProficiencyLevelConsumptionRepository proficiencyLevelConsumptionRepository) {
        this.commonValidator = commonValidator;
        this.commonUtility = commonUtility;
        this.messages = messages;
        this.proficiencyLevelConsumptionRepository = proficiencyLevelConsumptionRepository;
    }

    private void checkProficiencyLevel(String externalWorkExperienceId,
            ExternalWorkExperienceSkills skillAssignmentRequest) {
        if (skillAssignmentRequest.getProficiencyLevelId() == null) {
            messages.error(MessageKeys.PROFICIENCY_LEVEL_NULL).target("in", ProjectExperienceHeader_.class,
                    header -> header.externalWorkExperience(
                            ext -> ext.ID().eq(externalWorkExperienceId).and(ext.IsActiveEntity().eq(Boolean.FALSE)))
                            .externalWorkExperienceSkills(sk -> sk.ID().eq(skillAssignmentRequest.getId())
                                    .and(sk.IsActiveEntity().eq(Boolean.FALSE)))
                            .proficiencyLevel_ID());
            LOGGER.info(EXT_WORK_EXP_SKILL_MARKER, "The proficiency level id in the skill assignment is null");
            return;
        }

        if (!this.proficiencyLevelConsumptionRepository.findById(skillAssignmentRequest.getProficiencyLevelId())
                .isPresent()) {
            messages.error(MessageKeys.PROFICIENCY_LEVEL_IS_INVALID).target("in", ProjectExperienceHeader_.class,
                    header -> header.externalWorkExperience(
                            ext -> ext.ID().eq(externalWorkExperienceId).and(ext.IsActiveEntity().eq(Boolean.FALSE)))
                            .externalWorkExperienceSkills(sk -> sk.ID().eq(skillAssignmentRequest.getId())
                                    .and(sk.IsActiveEntity().eq(Boolean.FALSE)))
                            .proficiencyLevel_ID());
            LOGGER.info(EXT_WORK_EXP_SKILL_MARKER, "The proficiency level does not exists");
        }
    }

    /**
     * method to validate {@link ExternalWorkExperienceSkills}
     *
     * @param externalWorkExperienceSkills: Represents the list of assigned Skills
     *                                      to the ExternalWorkExperienceSkills
     * @param projectName:                  Represents the workExperience to which
     *                                      the skill is being assigned
     */
    public void validateMyResourceExternalWorkExperienceSkills(String externalWorkExperienceID,
            List<ExternalWorkExperienceSkills> externalWorkExperienceSkills, String projectName) {
        try {
            for (ExternalWorkExperienceSkills externalWorkExperienceSkill : externalWorkExperienceSkills) {
                if (!(checkNullForSkillAssigned(externalWorkExperienceID, externalWorkExperienceSkill, projectName))) {
                    checkSkillAssignedForXSS(externalWorkExperienceID, externalWorkExperienceSkill, projectName);
                    checkForeignKeyValueForAssignedSkill(externalWorkExperienceID, externalWorkExperienceSkill,
                            projectName);
                    checkInputFieldLength(externalWorkExperienceID, externalWorkExperienceSkill, projectName);
                    checkProficiencyLevel(externalWorkExperienceID, externalWorkExperienceSkill);
                }
            }
            checkForDuplicateSkillAssignment(externalWorkExperienceID, externalWorkExperienceSkills, projectName);
        } catch (ServiceException serviceException) {
            throw new ServiceException(serviceException);
        }
    }

    /**
     * method to check if given input value exists in related DB artifact
     *
     * @param externalWorkExperienceSkill: Represents an assigned Skill to the
     *                                     ExternalWorkExperienceSkills
     * @param projectName:                 Represents the workExperience to which
     *                                     the skill is being assigned
     */
    private boolean checkNullForSkillAssigned(String externalWorkExperienceID,
            ExternalWorkExperienceSkills externalWorkExperienceSkill, String projectName) {
        if ((NullUtils.isNullOrEmpty(externalWorkExperienceSkill.getSkillId())
                || externalWorkExperienceSkill.getSkillId().matches("^\\s*$"))) {
            messages.error(MessageKeys.INPUT_SKILL_CAN_NOT_EMPTY_IN_PROJECT, projectName)
                    .target("in", ProjectExperienceHeader_.class, projExp -> projExp
                            .externalWorkExperience(header -> header.ID().eq(externalWorkExperienceID)
                                    .and(header.IsActiveEntity().eq(Boolean.FALSE)))
                            .externalWorkExperienceSkills(skills -> skills.ID().eq(externalWorkExperienceSkill.getId())
                                    .and(skills.IsActiveEntity().eq(Boolean.FALSE)))
                            .skill_ID());
            LOGGER.info(EXT_WORK_EXP_SKILL_MARKER,
                    "The skill entered in the external work experience is null or empty");
            return true;
        } else
            return false;
    }

    /**
     * method to check input skills for cross site scripting
     *
     * @param externalWorkExperienceSkill: Represents an assigned Skill to the
     *                                     ExternalWorkExperienceSkills
     * @param projectName:                 Represents the workExperience to which
     *                                     the skill is being assigned
     */
    private void checkSkillAssignedForXSS(String externalWorkExperienceID,
            ExternalWorkExperienceSkills externalWorkExperienceSkill, String projectName) {
        if (!commonValidator.validateFreeTextforScripting(externalWorkExperienceSkill.getSkillId())) {
            messages.error(MessageKeys.INPUT_SKILL_IS_INVALID_IN_PROJECT, projectName)
                    .target("in", ProjectExperienceHeader_.class, projExp -> projExp
                            .externalWorkExperience(header -> header.ID().eq(externalWorkExperienceID)
                                    .and(header.IsActiveEntity().eq(Boolean.FALSE)))
                            .externalWorkExperienceSkills(skills -> skills.ID().eq(externalWorkExperienceSkill.getId())
                                    .and(skills.IsActiveEntity().eq(Boolean.FALSE)))
                            .skill_ID());
            LOGGER.info(EXT_WORK_EXP_SKILL_MARKER,
                    "The skill entered in the external work experience has scripting tags");
        }
    }

    /**
     * method to check if given input value exists in related DB artifact
     *
     * @param externalWorkExperienceSkills: Represents an assigned Skill to the
     *                                      ExternalWorkExperienceSkills
     * @param projectName:                  Represents the workExperience to which
     *                                      the skill is being assigned
     */
    private void checkForDuplicateSkillAssignment(String externalWorkExperienceID,
            List<ExternalWorkExperienceSkills> externalWorkExperienceSkills, String projectName) {
        Set<String> uniqueSkillsAssigned = new HashSet<>();
        Set<String> duplicaSkillsAssigned = new HashSet<>();
        List<String> duplicateSkillAssignmentId = new ArrayList<>();
        externalWorkExperienceSkills.forEach(skill -> {
            if (!uniqueSkillsAssigned.add(skill.getSkillId())) {
                duplicaSkillsAssigned.add(skill.getSkillId());
                duplicateSkillAssignmentId.add(skill.getId());
            }
        });
        if (!(NullUtils.isNullOrEmpty(duplicaSkillsAssigned))) {
            List<String> duplicateSkills = commonUtility.getRecordsValueFromDB(SkillMasterList_.CDS_NAME,
                    SkillMasterList.ID, duplicaSkillsAssigned, SkillMasterList.NAME);
            messages.error(MessageKeys.DUPLICATE_SKILL_CAN_NOT_BE_ASSIGN_IN_PROJECT, String.join(", ", duplicateSkills),
                    projectName)
                    .target("in", ProjectExperienceHeader_.class, projExp -> projExp
                            .externalWorkExperience(header -> header.ID().eq(externalWorkExperienceID)
                                    .and(header.IsActiveEntity().eq(Boolean.FALSE)))
                            .externalWorkExperienceSkills(skills -> skills.ID().eq(duplicateSkillAssignmentId.get(0))
                                    .and(skills.IsActiveEntity().eq(Boolean.FALSE)))
                            .skill_ID());
            LOGGER.info(EXT_WORK_EXP_SKILL_MARKER,
                    "The skill entered in the external work experience has already been added in the project");
        }
    }

    /**
     * method to check if given input value exists in related DB artifact
     *
     * @param externalWorkExperienceSkill: Represents an assigned Skill to the
     *                                     ExternalWorkExperienceSkills
     * @param projectName:                 Represents the workExperience to which
     *                                     the skill is being assigned
     */
    private void checkForeignKeyValueForAssignedSkill(String externalWorkExperienceID,
            ExternalWorkExperienceSkills externalWorkExperienceSkill, String projectName) {
        if (!commonValidator.checkInputValueExistingDB(SkillsConsumption_.CDS_NAME, SkillsConsumption.ID,
                externalWorkExperienceSkill.getSkillId())) {
            messages.error(MessageKeys.SKILL_DOES_NOT_EXISTS_IN_PROJECT, projectName)
                    .target("in", ProjectExperienceHeader_.class, projExp -> projExp
                            .externalWorkExperience(header -> header.ID().eq(externalWorkExperienceID)
                                    .and(header.IsActiveEntity().eq(Boolean.FALSE)))
                            .externalWorkExperienceSkills(skills -> skills.ID().eq(externalWorkExperienceSkill.getId())
                                    .and(skills.IsActiveEntity().eq(Boolean.FALSE)))
                            .skill_ID());
            LOGGER.info(EXT_WORK_EXP_SKILL_MARKER, "The skill entered in the external work experience is not in DB");
        }
    }

    /**
     * method to check if given input value of skill as ID is valid
     *
     * @param externalWorkExperienceSkill: Represents an assigned Skill to the
     *                                     ExternalWorkExperienceSkills
     * @param projectName:                 Represents the workExperience to which
     *                                     the skill is being assigned
     */
    boolean checkInputFieldLength(String externalWorkExperienceID,
            ExternalWorkExperienceSkills externalWorkExperienceSkill, String projectName) {
        final String skillID = externalWorkExperienceSkill.getSkillId();
        if (commonValidator.checkInputGuidFieldLength(skillID)) {
            messages.error(MessageKeys.SKILL_DOES_NOT_EXISTS_IN_PROJECT, projectName)
                    .target("in", ProjectExperienceHeader_.class, projExp -> projExp
                            .externalWorkExperience(header -> header.ID().eq(externalWorkExperienceID)
                                    .and(header.IsActiveEntity().eq(Boolean.FALSE)))
                            .externalWorkExperienceSkills(skills -> skills.ID().eq(externalWorkExperienceSkill.getId())
                                    .and(skills.IsActiveEntity().eq(Boolean.FALSE)))
                            .skill_ID());
            LOGGER.info(EXT_WORK_EXP_SKILL_MARKER,
                    "The skill entered in the external work experience has length greater than the guid length");
        }
        return true;
    }

}
