package com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations;

import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.c4p.rm.consultantprofile.InitMocks;

import myprojectexperienceservice.ExternalWorkExperience;
import myprojectexperienceservice.InternalWorkExperience;
import myprojectexperienceservice.MyProjectExperienceHeader;
import myprojectexperienceservice.Roles;
import myprojectexperienceservice.Skills;

public class MyProjectExperienceHeaderValidatorTest extends InitMocks {

    @Mock
    MyProjectExperienceHeaderRoleValidator mockMyProjectExperienceHeaderRoleValidator;

    @Mock
    MyProjectExperienceHeaderSkillValidator mockMyProjectExperienceHeaderSkillValidator;

    @Mock
    ExternalWorkExperienceHeaderValidator mockExternalWorkExperienceHeaderValidator;

    @Mock
    private MyProjectExperienceHeader mockMyProjectExperienceHeader;

    @Mock
    private Roles mockRole;

    @Mock
    private Skills mockSkill;

    @Mock
    private InternalWorkExperience mockInternalWorkExperience;

    @Mock
    private ExternalWorkExperience mockExternalWorkExperience;

    @Autowired
    @InjectMocks
    MyProjectExperienceHeaderValidator classUnderTest;

    @Test
    @DisplayName("Check when internalWorkExperience, externalWorkExperience, role and skill has not been assigned to My Project Experience ( internalWorkExperience, externalWorkExperience, roles and skill are null).")
    void validateMyProjectExperienceHeaderProperty1() {
        when(mockMyProjectExperienceHeader.getRoles()).thenReturn(null);
        when(mockMyProjectExperienceHeader.getSkills()).thenReturn(null);
        when(mockMyProjectExperienceHeader.getExternalWorkExperience()).thenReturn(null);
        classUnderTest.validateMyProjectExperienceHeaderProperty(mockMyProjectExperienceHeader);
        verify(this.mockMyProjectExperienceHeaderRoleValidator, times(0))
                .validateMyProjectExperienceHeaderRoles(anyList());
        verify(this.mockMyProjectExperienceHeaderSkillValidator, times(0))
                .validateMyProjectExperienceHeaderSkills(anyList());
        verify(this.mockExternalWorkExperienceHeaderValidator, times(0))
                .validateExternalWorkExperienceHeader(anyList());
    }

    @Test
    @DisplayName("Check when internalWorkExperience, externalWorkExperience, role and skill has not been assigned to My Project Experience ( internalWorkExperience, externalWorkExperience, roles and skill are empty).")
    void validateMyProjectExperienceHeaderProperty2() {
        classUnderTest.validateMyProjectExperienceHeaderProperty(mockMyProjectExperienceHeader);
        verify(this.mockMyProjectExperienceHeaderRoleValidator, times(0))
                .validateMyProjectExperienceHeaderRoles(anyList());
        verify(this.mockMyProjectExperienceHeaderSkillValidator, times(0))
                .validateMyProjectExperienceHeaderSkills(anyList());
        verify(this.mockExternalWorkExperienceHeaderValidator, times(0))
                .validateExternalWorkExperienceHeader(anyList());
    }

    @Test
    @DisplayName("Check when role and skill have been assigned to My Project Experience and External Work Experience has assignment")
    void validateMyProjectExperienceHeaderProperty3() {
        List<Roles> roles = Arrays.asList(mockRole);
        List<Skills> skills = Arrays.asList(mockSkill);
        List<ExternalWorkExperience> externalWorkExperience = Arrays.asList(mockExternalWorkExperience);
        when(mockMyProjectExperienceHeader.getRoles()).thenReturn(roles);
        when(mockMyProjectExperienceHeader.getSkills()).thenReturn(skills);
        when(mockMyProjectExperienceHeader.getExternalWorkExperience()).thenReturn(externalWorkExperience);
        classUnderTest.validateMyProjectExperienceHeaderProperty(mockMyProjectExperienceHeader);
        verify(this.mockMyProjectExperienceHeaderRoleValidator, times(1))
                .validateMyProjectExperienceHeaderRoles(anyList());
        verify(this.mockMyProjectExperienceHeaderSkillValidator, times(1))
                .validateMyProjectExperienceHeaderSkills(anyList());
        verify(this.mockExternalWorkExperienceHeaderValidator, times(1))
                .validateExternalWorkExperienceHeader(anyList());
    }

}
