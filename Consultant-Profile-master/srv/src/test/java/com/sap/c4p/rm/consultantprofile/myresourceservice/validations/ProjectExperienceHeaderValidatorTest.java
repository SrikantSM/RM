package com.sap.c4p.rm.consultantprofile.myresourceservice.validations;

import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.c4p.rm.consultantprofile.InitMocks;

import myresourcesservice.ExternalWorkExperience;
import myresourcesservice.InternalWorkExperience;
import myresourcesservice.ProjectExperienceHeader;
import myresourcesservice.Roles;
import myresourcesservice.Skills;

class ProjectExperienceHeaderValidatorTest extends InitMocks {

    @Mock
    ProjectExperienceHeaderRoleValidator mockProjectExperienceHeaderRoleValidator;

    @Mock
    ProjectExperienceHeaderSkillValidator mockProjectExperienceHeaderSkillValidator;

    @Mock
    MyResourceExternalWorkExperienceHeaderValidator mockExternalWorkExperienceHeaderValidator;

    @Mock
    private ProjectExperienceHeader mockProjectExperienceHeader;

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
    ProjectExperienceHeaderValidator classUnderTest;

    @Test
    @DisplayName("Check when internalWorkExperience, externalWorkExperience, role and skill has not been assigned to My Project Experience ( internalWorkExperience, externalWorkExperience, roles and skill are null).")
    void validateMyProjectExperienceHeaderProperty1() {
        when(mockProjectExperienceHeader.getRoles()).thenReturn(null);
        when(mockProjectExperienceHeader.getSkills()).thenReturn(null);
        when(mockProjectExperienceHeader.getExternalWorkExperience()).thenReturn(null);
        classUnderTest.validateProjectExperienceHeaderProperty(mockProjectExperienceHeader);
        verify(this.mockProjectExperienceHeaderRoleValidator, times(0)).validateProjectExperienceHeaderRoles(anyList());
        verify(this.mockProjectExperienceHeaderSkillValidator, times(0))
                .validateProjectExperienceHeaderSkills(anyList());
        verify(this.mockExternalWorkExperienceHeaderValidator, times(0))
                .validateMyResourceExternalWorkExperienceHeader(anyList());
    }

    @Test
    @DisplayName("Check when internalWorkExperience, externalWorkExperience, role and skill has not been assigned to My Project Experience ( internalWorkExperience, externalWorkExperience, roles and skill are empty).")
    void validateMyProjectExperienceHeaderProperty2() {
        classUnderTest.validateProjectExperienceHeaderProperty(mockProjectExperienceHeader);
        verify(this.mockProjectExperienceHeaderRoleValidator, times(0)).validateProjectExperienceHeaderRoles(anyList());
        verify(this.mockProjectExperienceHeaderSkillValidator, times(0))
                .validateProjectExperienceHeaderSkills(anyList());
        verify(this.mockExternalWorkExperienceHeaderValidator, times(0))
                .validateMyResourceExternalWorkExperienceHeader(anyList());
    }

    @Test
    @DisplayName("Check when role and skill have been assigned to My Project Experience and External Work Experience has assignment")
    void validateMyProjectExperienceHeaderProperty3() {
        List<Roles> roles = Arrays.asList(mockRole);
        List<Skills> skills = Arrays.asList(mockSkill);
        List<ExternalWorkExperience> externalWorkExperience = Arrays.asList(mockExternalWorkExperience);
        when(mockProjectExperienceHeader.getRoles()).thenReturn(roles);
        when(mockProjectExperienceHeader.getSkills()).thenReturn(skills);
        when(mockProjectExperienceHeader.getExternalWorkExperience()).thenReturn(externalWorkExperience);
        classUnderTest.validateProjectExperienceHeaderProperty(mockProjectExperienceHeader);
        verify(this.mockProjectExperienceHeaderRoleValidator, times(1)).validateProjectExperienceHeaderRoles(anyList());
        verify(this.mockProjectExperienceHeaderSkillValidator, times(1))
                .validateProjectExperienceHeaderSkills(anyList());
        verify(this.mockExternalWorkExperienceHeaderValidator, times(1))
                .validateMyResourceExternalWorkExperienceHeader(anyList());
    }

}
