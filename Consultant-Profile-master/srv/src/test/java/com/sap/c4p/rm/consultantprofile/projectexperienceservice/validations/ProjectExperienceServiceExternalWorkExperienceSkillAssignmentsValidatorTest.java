package com.sap.c4p.rm.consultantprofile.projectexperienceservice.validations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Consumer;

import jakarta.annotation.Resource;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Answers;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.repositories.SkillConsumptionRepository;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;
import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.request.RequestContext;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;
import com.sap.resourcemanagement.employee.Headers;
import com.sap.resourcemanagement.employee.Headers_;
import com.sap.resourcemanagement.employee.priorexperience.ExternalWorkExperience;
import com.sap.resourcemanagement.employee.priorexperience.ExternalWorkExperience_;
import com.sap.resourcemanagement.skill.ProficiencyLevelsConsumption;
import com.sap.resourcemanagement.skill.ProficiencySetsConsumption;
import com.sap.resourcemanagement.skill.SkillsConsumption;
import com.sap.resourcemanagement.skill.SkillsConsumption_;

import myprojectexperienceservice.MyProjectExperienceService_;
import myresourcesservice.MyResourcesService_;
import projectexperienceservice.ExternalWorkExperienceSkillAssignments;
import projectexperienceservice.ProjectExperienceService_;

public class ProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidatorTest extends InitMocks{
	
	@Mock
    private CommonValidator mockCommonValidator;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private Messages messages;
    
    @Mock
    private SkillConsumptionRepository mockSkillConsumptionRepository;
    
    @Mock
    @Resource(name = MyProjectExperienceService_.CDS_NAME)
    private DraftService mockMyProjectExperienceService;

    @Mock
    @Resource(name = MyResourcesService_.CDS_NAME)
    private DraftService mockMyResourcesService;
    
    @Mock
    @Resource(name = ProjectExperienceService_.CDS_NAME)
    private CqnService mockProjectExperienceService;
    
    @Mock
    private PersistenceService mockPersistenceService;

    @Mock
    private Result mockResult;

    @Mock
    private RequestContextRunner mockRequestContextRunner;

    @Mock
    private CdsRuntime mockCdsRuntime;

    @Captor
    private ArgumentCaptor<Consumer<RequestContext>> consumerArgumentCaptor;
    
    private ProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator classUnderTest;
    
    @BeforeEach
    void setUp() {
        this.classUnderTest = new ProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator(mockCommonValidator, messages,
        		mockSkillConsumptionRepository, mockMyProjectExperienceService, mockMyResourcesService, mockCdsRuntime);
    }
    
    @Test
    @DisplayName("Verify if draft exists")
    void checkIfDraftExistsNoDraftTest() {
        ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceSkillAssignments.setProfileID("test-profile-ID");
        when(mockCdsRuntime.requestContext()).thenReturn(mockRequestContextRunner);
        when(mockRequestContextRunner.privilegedUser()).thenReturn(mockRequestContextRunner);
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockMyResourcesService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.rowCount()).thenReturn(Long.valueOf(0));
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkIfDraftExists(externalWorkExperienceSkillAssignments));
    }

    @Test
    @DisplayName("Verify if draft exists with null profile ID")
    void checkIfDraftExistsNullProfileIDTest() {
    	ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        when(mockCdsRuntime.requestContext()).thenReturn(mockRequestContextRunner);
        when(mockRequestContextRunner.privilegedUser()).thenReturn(mockRequestContextRunner);
        when(mockProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.rowCount()).thenReturn(Long.valueOf(0));
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkIfDraftExists(externalWorkExperienceSkillAssignments));
    }
    
    @Test
    @DisplayName("Check external work experience skill assignment attributes for XSS")
    void checkExternalWorkExperienceSkillAssignmentForXSSTest() {
        ExternalWorkExperienceSkillAssignments externalWorkExperienceskillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceskillAssignments.setExternalWorkExperienceID("test-external-work-experience-ID");
        externalWorkExperienceskillAssignments.setProfileID("test-profile-ID");
        externalWorkExperienceskillAssignments.setProficiencyLevelID("test-proficiency-ID");
        externalWorkExperienceskillAssignments.setSkillID("test-skill-ID");
        when(mockCommonValidator.validateFreeTextforScripting(any())).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkExternalWorkExperienceSkillAssignmentsForXSS(externalWorkExperienceskillAssignments));
    }
    
    @Test
    @DisplayName("Check external work experience skill assignment attributes for XSS - profile id is forbidden")
    void checkExternalWorkExperienceForXSSTestExternalWorkExperienceIDForbidden() {
    	ExternalWorkExperienceSkillAssignments externalWorkExperienceskillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceskillAssignments.setExternalWorkExperienceID("<test>");
        externalWorkExperienceskillAssignments.setProfileID("test-profile-ID");
        externalWorkExperienceskillAssignments.setProficiencyLevelID("test-proficiency-ID");
        externalWorkExperienceskillAssignments.setSkillID("test-skill-ID");
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
    	when(mockCommonValidator.validateFreeTextforScripting("test-external-work-experience-ID")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-proficiency-ID")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-skill-ID")).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkExternalWorkExperienceSkillAssignmentsForXSS(externalWorkExperienceskillAssignments));
    }
    
    @Test
    @DisplayName("Check external work experience skill assignment attributes for XSS - profile id is forbidden")
    void checkExternalWorkExperienceForXSSTestProfileIDForbidden() {
    	ExternalWorkExperienceSkillAssignments externalWorkExperienceskillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceskillAssignments.setExternalWorkExperienceID("test-external-work-experience-ID");
        externalWorkExperienceskillAssignments.setProfileID("<test>");
        externalWorkExperienceskillAssignments.setProficiencyLevelID("test-proficiency-ID");
        externalWorkExperienceskillAssignments.setSkillID("test-skill-ID");
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
    	when(mockCommonValidator.validateFreeTextforScripting("test-external-work-experience-ID")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-proficiency-ID")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-skill-ID")).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkExternalWorkExperienceSkillAssignmentsForXSS(externalWorkExperienceskillAssignments));
    }
    
    @Test
    @DisplayName("Check external work experience skill assignment attributes for XSS - skill id is forbidden")
    void checkExternalWorkExperienceForXSSTestSkillIDForbidden() {
    	ExternalWorkExperienceSkillAssignments externalWorkExperienceskillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceskillAssignments.setExternalWorkExperienceID("test-external-work-experience-ID");
        externalWorkExperienceskillAssignments.setProfileID("test-profile-ID");
        externalWorkExperienceskillAssignments.setProficiencyLevelID("test-proficiency-ID");
        externalWorkExperienceskillAssignments.setSkillID("<test>");
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
    	when(mockCommonValidator.validateFreeTextforScripting("test-external-work-experience-ID")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-proficiency-ID")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-profile-ID")).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkExternalWorkExperienceSkillAssignmentsForXSS(externalWorkExperienceskillAssignments));
    }
    
    @Test
    @DisplayName("Check external work experience skill assignment attributes for XSS - proficiency level id is forbidden")
    void checkExternalWorkExperienceForXSSTestProficiencyLevelIDForbidden() {
    	ExternalWorkExperienceSkillAssignments externalWorkExperienceskillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceskillAssignments.setExternalWorkExperienceID("test-external-work-experience-ID");
        externalWorkExperienceskillAssignments.setProfileID("test-profile-ID");
        externalWorkExperienceskillAssignments.setProficiencyLevelID("<test>");
        externalWorkExperienceskillAssignments.setSkillID("test-skill-ID");
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
    	when(mockCommonValidator.validateFreeTextforScripting("test-external-work-experience-ID")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-skill-ID")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-profile-ID")).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkExternalWorkExperienceSkillAssignmentsForXSS(externalWorkExperienceskillAssignments));
    }
    
    @Test
    @DisplayName("Check foreign key for profile ID in external work experience skill assignment - profile exists")
    void checkForeignKeyValueForAssignedProfileExistsTest() {
        ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceSkillAssignments.setProfileID("test-profile-ID");
        when(mockCommonValidator.checkInputValueExistingDB(Headers_.CDS_NAME, Headers.ID,
        		externalWorkExperienceSkillAssignments.getProfileID())).thenReturn(true);
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkForeignKeyValueForAssignedProfile(externalWorkExperienceSkillAssignments));
        verify(this.messages, times(0)).throwIfError();
    }
    
    @Test
    @DisplayName("Check foreign key for profile ID in external work experience skill assignment - profile does not exists")
    void checkForeignKeyValueForAssignedProfileDoesNotExistsTest() {
        ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceSkillAssignments.setProfileID("test-profile-ID");
        when(mockCommonValidator.checkInputValueExistingDB(Headers_.CDS_NAME, Headers.ID,
        		externalWorkExperienceSkillAssignments.getProfileID())).thenReturn(false);
        classUnderTest.checkForeignKeyValueForAssignedProfile(externalWorkExperienceSkillAssignments);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.PROFILE_ID_DOES_NOT_EXIST);
    }
    
    @Test
    @DisplayName("Check foreign key for external work experience ID in external work experience skill assignment - external work experience exists")
    void checkForeignKeyValueForAssignedExternalWorkExperienceExistsTest() {
        ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceSkillAssignments.setExternalWorkExperienceID("test-external-work-experience-ID");
        when(mockCommonValidator.checkInputValueExistingDB(ExternalWorkExperience_.CDS_NAME, ExternalWorkExperience.ID,
        		externalWorkExperienceSkillAssignments.getExternalWorkExperienceID())).thenReturn(true);
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkForeignKeyValueForAssignedExternalWorkExperience(externalWorkExperienceSkillAssignments));
        verify(this.messages, times(0)).throwIfError();
    }

    @Test
    @DisplayName("Check foreign key for external work experience ID in external work experience skill assignment - external work experience does not exists")
    void checkForeignKeyValueForAssignedExternalWorkExperienceDoesNotExistsTest() {
        ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceSkillAssignments.setExternalWorkExperienceID("test-external-work-experience-ID");
        when(mockCommonValidator.checkInputValueExistingDB(ExternalWorkExperience_.CDS_NAME, ExternalWorkExperience.ID,
        		externalWorkExperienceSkillAssignments.getExternalWorkExperienceID())).thenReturn(false);
        classUnderTest.checkForeignKeyValueForAssignedExternalWorkExperience(externalWorkExperienceSkillAssignments);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.EXTERNAL_WORK_EXPERIENCE_ID_DOES_NOT_EXIST);
    }
    
    @Test
    @DisplayName("Check foreign key for skill ID in external work experience skill assignment - skill exists")
    void checkForeignKeyValueForAssignedSkillExistsTest() {
        ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceSkillAssignments.setSkillID("test-skill-ID");
        when(mockCommonValidator.checkInputValueExistingDB(SkillsConsumption_.CDS_NAME, SkillsConsumption.ID,
        		externalWorkExperienceSkillAssignments.getSkillID())).thenReturn(true);
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkForeignKeyValueForAssignedSkill(externalWorkExperienceSkillAssignments));
        verify(this.messages, times(0)).throwIfError();
    }
    
    @Test
    @DisplayName("Check foreign key for skill ID in external work experience skill assignment - skill does not exists")
    void checkForeignKeyValueForAssignedSkillDoesNotExistsTest() {
        ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceSkillAssignments.setSkillID("test-skill-ID");
        when(mockCommonValidator.checkInputValueExistingDB(SkillsConsumption_.CDS_NAME, SkillsConsumption.ID,
        		externalWorkExperienceSkillAssignments.getSkillID())).thenReturn(false);
        classUnderTest.checkForeignKeyValueForAssignedSkill(externalWorkExperienceSkillAssignments);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.SKILL_ID_DOES_NOT_EXIST);
    }
    
    @Test
    @DisplayName("Check foreign key for proficiency level ID in external work experience skill assignment - proficiency level exists")
    void checkForeignKeyValueForAssignedProficiencyLevelExistsTest() {
    	final String id1 = UUID.randomUUID().toString();
        ProficiencySetsConsumption proficiencySet = ProficiencySetsConsumption.create();
        ProficiencyLevelsConsumption proficiencyLevel = ProficiencyLevelsConsumption.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());
        proficiencySet.setId(id1);
        proficiencySet.setProficiencyLevels(Collections.singletonList(proficiencyLevel));
        SkillsConsumption skillsConsumption = SkillsConsumption.create();
        skillsConsumption.setProficiencySet(proficiencySet);
        ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceSkillAssignments.setProficiencyLevelID(proficiencyLevel.getId());
        when(mockSkillConsumptionRepository.findById(externalWorkExperienceSkillAssignments.getSkillID()))
        .thenReturn(Optional.of(skillsConsumption));
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkForeignKeyValueForAssignedProficiencyLevel(externalWorkExperienceSkillAssignments));
        verify(this.messages, times(0)).throwIfError();
    }
    
    @Test
    @DisplayName("Check foreign key for proficiency level ID in external work experience skill assignment - proficiency level does not exists")
    void checkForeignKeyValueForAssignedProficiencyLevelDoesNotExistsTest() {
    	final String id1 = UUID.randomUUID().toString();
        ProficiencySetsConsumption proficiencySet = ProficiencySetsConsumption.create();
        ProficiencyLevelsConsumption proficiencyLevel = ProficiencyLevelsConsumption.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());
        proficiencySet.setId(id1);
        proficiencySet.setProficiencyLevels(Collections.singletonList(proficiencyLevel));
        SkillsConsumption skillsConsumption = SkillsConsumption.create();
        skillsConsumption.setProficiencySet(proficiencySet);
        ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceSkillAssignments.setSkillID("test-skill-ID");
        externalWorkExperienceSkillAssignments.setProficiencyLevelID("test-proficiency-level-ID");
        when(mockSkillConsumptionRepository.findById(externalWorkExperienceSkillAssignments.getSkillID())).thenReturn(Optional.of(skillsConsumption));
        classUnderTest.checkForeignKeyValueForAssignedProficiencyLevel(externalWorkExperienceSkillAssignments);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.PROFICIENCY_LEVEL_ID_DOES_NOT_EXIST);
    }
}
