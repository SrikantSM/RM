package com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.c4p.rm.consultantprofile.utils.NullUtils;

import myprojectexperienceservice.MyProjectExperienceHeader;

/**
 * Class to initiate the validation on {@link MyProjectExperienceHeader}
 */
@Service
public class MyProjectExperienceHeaderValidator {
    /**
     * instance to invoke the validate methods of {@link MyProjectExperienceHeader}
     * properties
     */
    private final MyProjectExperienceHeaderRoleValidator myProjectExperienceHeaderRoleValidator;
    private final MyProjectExperienceHeaderSkillValidator myProjectExperienceHeaderSKillValidator;
    private final ExternalWorkExperienceHeaderValidator externalWorkExperienceHeaderValidator;

    @Autowired
    public MyProjectExperienceHeaderValidator(
            final MyProjectExperienceHeaderRoleValidator myProjectExperienceHeaderRoleValidator,
            final MyProjectExperienceHeaderSkillValidator myProjectExperienceHeaderSKillValidator,
            final ExternalWorkExperienceHeaderValidator externalWorkExperienceHeaderValidator) {
        this.myProjectExperienceHeaderRoleValidator = myProjectExperienceHeaderRoleValidator;
        this.myProjectExperienceHeaderSKillValidator = myProjectExperienceHeaderSKillValidator;
        this.externalWorkExperienceHeaderValidator = externalWorkExperienceHeaderValidator;
    }

    /**
     * method to invoke the validation on {@link MyProjectExperienceHeader}
     *
     * @param myProjectExperienceHeader to validate the myProject experience header
     *                                  information
     */
    public void validateMyProjectExperienceHeaderProperty(MyProjectExperienceHeader myProjectExperienceHeader) {
        if (!(NullUtils.isNullOrEmpty(myProjectExperienceHeader.getRoles()))) {
            myProjectExperienceHeaderRoleValidator
                    .validateMyProjectExperienceHeaderRoles(myProjectExperienceHeader.getRoles());
        }
        if (!(NullUtils.isNullOrEmpty(myProjectExperienceHeader.getSkills()))) {
            myProjectExperienceHeaderSKillValidator
                    .validateMyProjectExperienceHeaderSkills(myProjectExperienceHeader.getSkills());
        }
        if (!(NullUtils.isNullOrEmpty(myProjectExperienceHeader.getExternalWorkExperience()))) {
            externalWorkExperienceHeaderValidator
                    .validateExternalWorkExperienceHeader(myProjectExperienceHeader.getExternalWorkExperience());
        }
    }

}
