package com.sap.c4p.rm.consultantprofile.myresourceservice.validations;

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

import myresourcesservice.ExternalWorkExperience;
import myresourcesservice.ProjectExperienceHeader_;

@Component
public class MyResourceExternalWorkExperienceHeaderValidator {
    private static final Logger LOGGER = LoggerFactory.getLogger(MyResourceExternalWorkExperienceHeaderValidator.class);
    private static final Marker EXT_WORK_EXP_MARKER = LoggingMarker.EXT_WORK_EXP_MARKER.getMarker();

    private final CommonValidator commonValidator;
    private final ExternalWorkExperienceSkillValidator externalWorkExperienceSkillsValidator;
    private final Messages messages;

    /**
     * initialize {@link ProjectExperienceHeaderRoleValidator} instance and accept
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
    public MyResourceExternalWorkExperienceHeaderValidator(final CommonValidator commonValidator,
            final ExternalWorkExperienceSkillValidator externalWorkExperienceSkillsValidator, final Messages messages) {
        this.commonValidator = commonValidator;
        this.externalWorkExperienceSkillsValidator = externalWorkExperienceSkillsValidator;
        this.messages = messages;
    }

    private void validateComment(String comments, String projectName, String extWorkExperienceId) {
        if (!commonValidator.validateFreeTextforScripting(comments)) {
            prepareErrorMessageForComment(extWorkExperienceId,
                    "The comment entered in the external work experience has scripting tags",
                    MessageKeys.INPUT_COMMENT_IS_INVALID, projectName);
        }
    }

    private void validateCustomerField(String customer, String extWorkExperienceId) {
        if (!commonValidator.validateFreeTextforScripting(customer)) {
            prepareErrorMessageForCustomer(extWorkExperienceId,
                    "The customer entered in the external work experience has scripting tags",
                    MessageKeys.INPUT_CUSTOMER_IS_INVALID);
        }
    }

    private void startDateValidation(ChronoLocalDate startDate, ChronoLocalDate endDate, String extWorkExperienceId) {
        if (startDate == null) {
            prepareErrorMessageForStartDate(extWorkExperienceId,
                    "The start date entered in the external work experience is null",
                    MessageKeys.INPUT_START_DATE_CAN_NOT_BE_EMPTY);
        } else if (endDate != null && isStartDateAcceptable(startDate, endDate)) {
            prepareErrorMessageForStartDate(extWorkExperienceId,
                    "The start date entered in the external work experience is greater than the end date",
                    MessageKeys.STARTDATE_CAN_NOT_GREATER_THAN_ENDDATE);
        }
    }

    private boolean isStartDateAcceptable(ChronoLocalDate startDate, ChronoLocalDate endDate) {
        return startDate.compareTo(endDate) > 0;
    }

    private void endDateValidation(ChronoLocalDate endDate, String extWorkExperienceId) {
        if (endDate == null)
            prepareErrorMessageForEndDate(extWorkExperienceId,
                    "The end date entered in the external work experience is null",
                    MessageKeys.INPUT_END_DATE_CAN_NOT_BE_EMPTY);
    }

    private void validatePlayedRole(String rolePlayed, String extWorkExperienceId) {
        if (commonValidator.isBlank(rolePlayed))
            prepareErrorMessageForRolePlayed(extWorkExperienceId,
                    "The role played entered in the external work experience is empty",
                    MessageKeys.INPUT_ROLE_PLAYED_CAN_NOT_BE_EMPTY);
        if (!commonValidator.validateFreeTextforScripting(rolePlayed))
            prepareErrorMessageForRolePlayed(extWorkExperienceId,
                    "The role played entered in the external work experience has scripting tags",
                    MessageKeys.INPUT_ROLE_PLAYED_IS_INVALID);
    }

    private void companyNameValidation(String companyName, String extWorkExperienceId) {
        if (commonValidator.isBlank(companyName))
            prepareErrorMessageForCompanyName(extWorkExperienceId,
                    "The company name entered in the external work experience is empty",
                    MessageKeys.INPUT_COMPANY_NAME_CAN_NOT_BE_EMPTY);
        if (!commonValidator.validateFreeTextforScripting(companyName))
            prepareErrorMessageForCompanyName(extWorkExperienceId,
                    "The company name entered in the external work experience has scripting tags",
                    MessageKeys.INPUT_COMPANY_NAME_IS_INVALID);
    }

    private void projectNameValidation(String projectName, String extWorkExperienceId) {
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
    private void checkForDuplicateExternalWorkExperience(List<ExternalWorkExperience> externalWorkExperienceRecords) {
        final Set<ExternalWorkExperienceWithMandatoryValues> uniqueExternalWorkExperienceRecords = externalWorkExperienceRecords
                .stream()
                .map(externalWorkExperience -> new ExternalWorkExperienceWithMandatoryValues(
                        externalWorkExperience.getProjectName(), externalWorkExperience.getRolePlayed(),
                        externalWorkExperience.getCompanyName(), externalWorkExperience.getStartDate(),
                        externalWorkExperience.getEndDate()))
                .collect(Collectors.toSet());
        if (uniqueExternalWorkExperienceRecords.size() != externalWorkExperienceRecords.size()) {
            Set<String> uniqueExternalWorkExperience = new HashSet<>();
            List<String> duplicateExternalWorkExperience = new ArrayList<>();
            List<String> externalWorkExperienceId = new ArrayList<>();
            externalWorkExperienceRecords.forEach(externalWorkExperience -> {
                if (!uniqueExternalWorkExperience.add(externalWorkExperience.getProjectName())) {
                    duplicateExternalWorkExperience.add(externalWorkExperience.getProjectName());
                    externalWorkExperienceId.add(externalWorkExperience.getId());
                }
            });

            prepareErrorMessageForProject(externalWorkExperienceId.get(0),
                    "A duplicate external work experience with the same project name was created",
                    MessageKeys.DUPLICATE_EXTERNAL_PROJECT_CAN_NOT_BE_ASSIGNED, duplicateExternalWorkExperience.get(0));
        }
    }

    /**
     * method to validate {@link ExternalWorkExperience}
     *
     * @param externalWorkExperiences A {@link List} of
     *                                {@link ExternalWorkExperience} to validate
     */
    public void validateMyResourceExternalWorkExperienceHeader(List<ExternalWorkExperience> externalWorkExperiences) {
        try {
            for (ExternalWorkExperience externalWorkExperience : externalWorkExperiences) {
                validateComment(externalWorkExperience.getComments(), externalWorkExperience.getProjectName(),
                        externalWorkExperience.getId());
                projectNameValidation(externalWorkExperience.getProjectName(), externalWorkExperience.getId());
                companyNameValidation(externalWorkExperience.getCompanyName(), externalWorkExperience.getId());
                validatePlayedRole(externalWorkExperience.getRolePlayed(), externalWorkExperience.getId());
                endDateValidation(externalWorkExperience.getEndDate(), externalWorkExperience.getId());
                startDateValidation(externalWorkExperience.getStartDate(), externalWorkExperience.getEndDate(),
                        externalWorkExperience.getId());
                validateCustomerField(externalWorkExperience.getCustomer(), externalWorkExperience.getId());

                if (!(NullUtils.isNullOrEmpty(externalWorkExperience.getExternalWorkExperienceSkills()))) {
                    externalWorkExperienceSkillsValidator.validateMyResourceExternalWorkExperienceSkills(
                            externalWorkExperience.getId(), externalWorkExperience.getExternalWorkExperienceSkills(),
                            externalWorkExperience.getProjectName());
                }
            }
            if (!externalWorkExperiences.isEmpty()) {
                checkForDuplicateExternalWorkExperience(externalWorkExperiences);
            }
        } catch (ServiceException serviceException) {
            throw new ServiceException(serviceException);
        }
    }

    private void prepareErrorMessageForCustomer(final String externalWEId, final String loggerMsg,
            final String messageKey) {
        messages.error(messageKey)
                .target("in", ProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .customer());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

    private void prepareErrorMessageForStartDate(final String externalWEId, final String loggerMsg,
            final String messageKey) {
        messages.error(messageKey)
                .target("in", ProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .startDate());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

    private void prepareErrorMessageForEndDate(final String externalWEId, final String loggerMsg,
            final String messageKey) {
        messages.error(messageKey)
                .target("in", ProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .endDate());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

    private void prepareErrorMessageForRolePlayed(final String externalWEId, final String loggerMsg,
            final String messageKey) {
        messages.error(messageKey)
                .target("in", ProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .rolePlayed());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

    private void prepareErrorMessageForCompanyName(final String externalWEId, final String loggerMsg,
            final String messageKey) {
        messages.error(messageKey)
                .target("in", ProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .companyName());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

    private void prepareErrorMessageForProject(final String externalWEId, final String loggerMsg,
            final String messageKey, final String projectName) {
        messages.error(messageKey, projectName)
                .target("in", ProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .projectName());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }

    private void prepareErrorMessageForComment(final String externalWEId, final String loggerMsg,
            final String messageKey, final String projectName) {
        messages.error(messageKey, projectName)
                .target("in", ProjectExperienceHeader_.class,
                        projExp -> projExp.externalWorkExperience(
                                header -> header.ID().eq(externalWEId).and(header.IsActiveEntity().eq(Boolean.FALSE)))
                                .comments());
        LOGGER.info(EXT_WORK_EXP_MARKER, loggerMsg);
    }
}
