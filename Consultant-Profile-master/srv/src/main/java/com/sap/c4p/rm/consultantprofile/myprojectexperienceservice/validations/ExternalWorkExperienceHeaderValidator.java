package com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations;

import java.time.chrono.ChronoLocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.pojo.ExternalWorkExperienceWithMandatoryValues;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import com.sap.resourcemanagement.employee.priorexperience.ExternalWorkExperienceSkills;

import myprojectexperienceservice.ExternalWorkExperience;
import myprojectexperienceservice.MyProjectExperienceHeader_;

@Component
public class ExternalWorkExperienceHeaderValidator {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExternalWorkExperienceHeaderValidator.class);
    private static final Marker EXT_WORK_EXP_MARKER = LoggingMarker.EXT_WORK_EXP_MARKER.getMarker();

    private final CommonValidator commonValidator;
    private final ExternalWorkExperienceSkillsValidator externalWorkExperienceSkillsValidator;
    private final Messages messages;

    /**
     * initialize {@link MyProjectExperienceHeaderRoleValidator} instance and accept
     * the instance of
     * {@link CommonValidator},{@link ExternalWorkExperienceHeaderValidator}, to be
     * used and initialize the list mandatoryFields
     *
     * @param commonValidator                       will be used to invoke common
     *                                              validation methods
     * @param externalWorkExperienceSkillsValidator will me used to validate
     *                                              {@link ExternalWorkExperienceSkills}
     */
    @Autowired
    public ExternalWorkExperienceHeaderValidator(final CommonValidator commonValidator,
            final ExternalWorkExperienceSkillsValidator externalWorkExperienceSkillsValidator,
            final Messages messages) {
        this.commonValidator = commonValidator;
        this.externalWorkExperienceSkillsValidator = externalWorkExperienceSkillsValidator;
        this.messages = messages;
    }

    /**
     * method to validate {@link ExternalWorkExperience}
     *
     * @param externalWorkExperiences A {@link List} of
     *                                {@link ExternalWorkExperience} to validate
     */
    public void validateExternalWorkExperienceHeader(List<ExternalWorkExperience> externalWorkExperiences) {
        try {
            for (ExternalWorkExperience externalWorkExperience : externalWorkExperiences) {
                validateComments(externalWorkExperience.getComments(), externalWorkExperience.getProjectName(),
                        externalWorkExperience.getId());
                validateProjectName(externalWorkExperience.getProjectName(), externalWorkExperience.getId());
                validateCompanyName(externalWorkExperience.getCompanyName(), externalWorkExperience.getId());
                validateRolePlayed(externalWorkExperience.getRolePlayed(), externalWorkExperience.getId());
                validateEndDate(externalWorkExperience.getEndDate(), externalWorkExperience.getId());
                validateStartDate(externalWorkExperience.getStartDate(), externalWorkExperience.getEndDate(),
                        externalWorkExperience.getId());
                validateCustomer(externalWorkExperience.getCustomer(), externalWorkExperience.getId());

                if (!(NullUtils.isNullOrEmpty(externalWorkExperience.getExternalWorkExperienceSkills()))) {
                    externalWorkExperienceSkillsValidator.validateExternalWorkExperienceSkills(
                            externalWorkExperience.getId(), externalWorkExperience.getExternalWorkExperienceSkills(),
                            externalWorkExperience.getProjectName());
                }
            }
            if (!externalWorkExperiences.isEmpty()) {
                checkDuplicateExternalWorkExperience(externalWorkExperiences);
            }
        } catch (ServiceException serviceException) {
            throw new ServiceException(serviceException);
        }
    }

    private void validateComments(String comments, String projectName, String extWorkExperienceId) {
        if (!commonValidator.validateFreeTextforScripting(comments)) {
            prepareErrorMessageForComment(extWorkExperienceId,
                    "The comment entered in the external work experience has scripting tags",
                    MessageKeys.INPUT_COMMENT_IS_INVALID, projectName);
        }
    }

    private void validateCustomer(String customer, String extWorkExperienceId) {
        if (!commonValidator.validateFreeTextforScripting(customer)) {
            prepareErrorMessageForCustomer(extWorkExperienceId,
                    "The customer entered in the external work experience has scripting tags",
                    MessageKeys.INPUT_CUSTOMER_IS_INVALID);
        }
    }

    private void validateStartDate(ChronoLocalDate startDate, ChronoLocalDate endDate, String extWorkExperienceId) {
        if (startDate == null) {
            prepareErrorMessageForStartDate(extWorkExperienceId,
                    "The start date entered in the external work experience is null",
                    MessageKeys.INPUT_START_DATE_CAN_NOT_BE_EMPTY);
        } else if (endDate != null && isStartDateGreater(startDate, endDate)) {
            prepareErrorMessageForStartDate(extWorkExperienceId,
                    "The start date entered in the external work experience is greater than the end date",
                    MessageKeys.STARTDATE_CAN_NOT_GREATER_THAN_ENDDATE);
        }
    }

    private boolean isStartDateGreater(ChronoLocalDate startDate, ChronoLocalDate endDate) {
        return startDate.compareTo(endDate) > 0;
    }

    private void validateEndDate(ChronoLocalDate endDate, String extWorkExperienceId) {
        if (endDate == null)
            prepareErrorMessageForEndDate(extWorkExperienceId,
                    "The end date entered in the external work experience is null",
                    MessageKeys.INPUT_END_DATE_CAN_NOT_BE_EMPTY);
    }

    private void validateRolePlayed(String rolePlayed, String extWorkExperienceId) {
        if (commonValidator.isBlank(rolePlayed))
            prepareErrorMessageForRolePlayed(extWorkExperienceId,
                    "The role played entered in the external work experience is empty",
                    MessageKeys.INPUT_ROLE_PLAYED_CAN_NOT_BE_EMPTY);
        if (!commonValidator.validateFreeTextforScripting(rolePlayed))
            prepareErrorMessageForRolePlayed(extWorkExperienceId,
                    "The role played entered in the external work experience has scripting tags",
                    MessageKeys.INPUT_ROLE_PLAYED_IS_INVALID);
    }

    private void validateCompanyName(String companyName, String extWorkExperienceId) {
        if (commonValidator.isBlank(companyName))
            prepareErrorMessageForCompanyName(extWorkExperienceId,
                    "The company name entered in the external work experience is empty",
                    MessageKeys.INPUT_COMPANY_NAME_CAN_NOT_BE_EMPTY);
        if (!commonValidator.validateFreeTextforScripting(companyName))
            prepareErrorMessageForCompanyName(extWorkExperienceId,
                    "The company name entered in the external work experience has scripting tags",
                    MessageKeys.INPUT_COMPANY_NAME_IS_INVALID);
    }

    private void validateProjectName(String projectName, String extWorkExperienceId) {
        if (commonValidator.isBlank(projectName))
            prepareErrorMessageForProject(extWorkExperienceId,
                    "The project name entered in the external work experience is empty",
                    MessageKeys.INPUT_PROJECT_NAME_CAN_NOT_BE_EMPTY, projectName);

        if (!commonValidator.validateFreeTextforScripting(projectName))
            prepareErrorMessageForProject(extWorkExperienceId,
                    "The project name entered in the external work experience has scripting tags",
                    MessageKeys.INPUT_PROJECT_NAME_IS_INVALID, projectName);
    }

    /**
     * method to validate if there are duplicate {@link ExternalWorkExperience}
     *
     * @param externalWorkExperiences A {@link List} of
     *                                {@link ExternalWorkExperience} to validate
     */
    private void checkDuplicateExternalWorkExperience(List<ExternalWorkExperience> externalWorkExperiences) {
        final Set<ExternalWorkExperienceWithMandatoryValues> uniqueExternalWorkExperiences = externalWorkExperiences
                .stream()
                .map(externalWorkExperience -> new ExternalWorkExperienceWithMandatoryValues(
                        externalWorkExperience.getProjectName(), externalWorkExperience.getRolePlayed(),
                        externalWorkExperience.getCompanyName(), externalWorkExperience.getStartDate(),
                        externalWorkExperience.getEndDate()))
                .collect(Collectors.toSet());
        if (uniqueExternalWorkExperiences.size() != externalWorkExperiences.size()) {
            Set<String> uniqueExternalWorkExp = new HashSet<>();
            List<String> duplicateExternalWorkExp = new ArrayList<>();
            List<String> externalWorkExpId = new ArrayList<>();
            externalWorkExperiences.forEach(externalWorkExperience -> {
                if (!uniqueExternalWorkExp.add(externalWorkExperience.getProjectName())) {
                    duplicateExternalWorkExp.add(externalWorkExperience.getProjectName());
                    externalWorkExpId.add(externalWorkExperience.getId());
                }
            });

            prepareErrorMessageForProject(externalWorkExpId.get(0),
                    "A duplicate external work experience with the same project name was created",
                    MessageKeys.DUPLICATE_EXTERNAL_PROJECT_CAN_NOT_BE_ASSIGNED, duplicateExternalWorkExp.get(0));
        }
    }

    private void prepareErrorMessageForComment(final String externalWEId, final String loggerMsg,
            final String messageKey, final String projectName) {
        messages.error(messageKey, projectName)
                .target("in", MyProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .comments());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

    private void prepareErrorMessageForCustomer(final String externalWEId, final String loggerMsg,
            final String messageKey) {
        messages.error(messageKey)
                .target("in", MyProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .customer());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

    private void prepareErrorMessageForStartDate(final String externalWEId, final String loggerMsg,
            final String messageKey) {
        messages.error(messageKey)
                .target("in", MyProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .startDate());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

    private void prepareErrorMessageForEndDate(final String externalWEId, final String loggerMsg,
            final String messageKey) {
        messages.error(messageKey)
                .target("in", MyProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .endDate());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

    private void prepareErrorMessageForRolePlayed(final String externalWEId, final String loggerMsg,
            final String messageKey) {
        messages.error(messageKey)
                .target("in", MyProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .rolePlayed());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

    private void prepareErrorMessageForCompanyName(final String externalWEId, final String loggerMsg,
            final String messageKey) {
        messages.error(messageKey)
                .target("in", MyProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .companyName());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

    private void prepareErrorMessageForProject(final String externalWEId, final String loggerMsg,
            final String messageKey, final String projectName) {
        messages.error(messageKey, projectName)
                .target("in", MyProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .projectName());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

}
