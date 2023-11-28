package com.sap.c4p.rm.consultantprofile.myresourceservice.validations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.c4p.rm.consultantprofile.utils.NullUtils;

import myresourcesservice.ProjectExperienceHeader;

/**
 * Class to initiate the validation on {@link ProjectExperienceHeader}
 */
@Service
public class ProjectExperienceHeaderValidator {
    /**
     * instance to invoke the validate methods of {@link ProjectExperienceHeader}
     * properties
     */
    private final ProjectExperienceHeaderRoleValidator projectExperienceHeaderRoleValidator;
    private final ProjectExperienceHeaderSkillValidator projectExperienceHeaderSKillValidator;
    private final MyResourceExternalWorkExperienceHeaderValidator externalWorkExperienceHeaderValidator;

    @Autowired
    public ProjectExperienceHeaderValidator(
            final ProjectExperienceHeaderRoleValidator projectExperienceHeaderRoleValidator,
            final ProjectExperienceHeaderSkillValidator projectExperienceHeaderSKillValidator,
            final MyResourceExternalWorkExperienceHeaderValidator externalWorkExperienceHeaderValidator) {
        this.projectExperienceHeaderRoleValidator = projectExperienceHeaderRoleValidator;
        this.projectExperienceHeaderSKillValidator = projectExperienceHeaderSKillValidator;
        this.externalWorkExperienceHeaderValidator = externalWorkExperienceHeaderValidator;
    }

    /**
     * method to invoke the validation on {@link ProjectExperienceHeader}
     *
     * @param ProjectExperienceHeader to validate the myProject experience header
     *                                information
     */
    public void validateProjectExperienceHeaderProperty(ProjectExperienceHeader projectExperienceHeader) {
        if (!(NullUtils.isNullOrEmpty(projectExperienceHeader.getRoles()))) {
            projectExperienceHeaderRoleValidator
                    .validateProjectExperienceHeaderRoles(projectExperienceHeader.getRoles());
        }
        if (!(NullUtils.isNullOrEmpty(projectExperienceHeader.getSkills()))) {
            projectExperienceHeaderSKillValidator
                    .validateProjectExperienceHeaderSkills(projectExperienceHeader.getSkills());
        }
        if (!(NullUtils.isNullOrEmpty(projectExperienceHeader.getExternalWorkExperience()))) {
            externalWorkExperienceHeaderValidator.validateMyResourceExternalWorkExperienceHeader(
                    projectExperienceHeader.getExternalWorkExperience());
        }
    }

}
