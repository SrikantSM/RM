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
import com.sap.resourcemanagement.skill.ProficiencyLevelsConsumption;
import com.sap.resourcemanagement.skill.ProficiencySetsConsumption;
import com.sap.resourcemanagement.skill.SkillsConsumption;
import com.sap.resourcemanagement.skill.SkillsConsumption_;

import myprojectexperienceservice.MyProjectExperienceService_;
import myresourcesservice.MyResourcesService_;
import projectexperienceservice.ProjectExperienceService_;
import projectexperienceservice.SkillAssignments;

public class ProjectExperienceServiceSkillAssignmentsValidatorTest extends InitMocks {

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

//    @Autowired
//    @InjectMocks
    private ProjectExperienceServiceSkillAssignmentsValidator classUnderTest;

    @BeforeEach
    void setUp() {
        this.classUnderTest = new ProjectExperienceServiceSkillAssignmentsValidator(mockCommonValidator, messages,
                mockSkillConsumptionRepository, mockMyProjectExperienceService, mockMyResourcesService, mockCdsRuntime);
    }

    @Test
    @DisplayName("Verify if draft exists")
    void checkIfDraftExistsNoDraftTest() {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        skillAssignments.setProfileID("test-profile-ID");
        when(mockCdsRuntime.requestContext()).thenReturn(mockRequestContextRunner);
        when(mockRequestContextRunner.privilegedUser()).thenReturn(mockRequestContextRunner);
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockMyResourcesService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.rowCount()).thenReturn(Long.valueOf(0));
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkIfDraftExists(skillAssignments));
    }

    @Test
    @DisplayName("Verify if draft exists with null profile ID")
    void checkIfDraftExistsNullProfileIDTest() {
    	SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        when(mockCdsRuntime.requestContext()).thenReturn(mockRequestContextRunner);
        when(mockRequestContextRunner.privilegedUser()).thenReturn(mockRequestContextRunner);
        when(mockProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.rowCount()).thenReturn(Long.valueOf(0));
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkIfDraftExists(skillAssignments));
    }

    @Test
    @DisplayName("Check skill assignment attributes for XSS")
    void checkSkillAssignmentForXSSTest() {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        skillAssignments.setProfileID("test-profile-ID");
        skillAssignments.setProficiencyLevelID("test-proficiency-ID");
        skillAssignments.setSkillID("test-skill-ID");
        when(mockCommonValidator.validateFreeTextforScripting(any())).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkSkillAssignmentForXSS(skillAssignments));
    }

    @Test
    @DisplayName("Check skill assignment attributes for XSS - skill ID is forbidden")
    void checkSkillAssignmentForXSSTestSkillIDForbidden() {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        skillAssignments.setProfileID("test-profile-ID");
        skillAssignments.setProficiencyLevelID("test-proficiency-ID");
        skillAssignments.setSkillID("<test>");
        when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting("test-profile-ID")).thenReturn(true);
        when(mockCommonValidator.validateFreeTextforScripting("test-proficiency-ID")).thenReturn(true);
        classUnderTest.checkSkillAssignmentForXSS(skillAssignments);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.INPUT_SKILL_ID_IS_FORBIDDEN);
    }

    @Test
    @DisplayName("Check skill assignment attributes for XSS - profile ID is forbidden")
    void checkSkillAssignmentForXSSTestProfileIDForbidden() {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        skillAssignments.setProfileID("<test>");
        skillAssignments.setProficiencyLevelID("test-proficiency-ID");
        skillAssignments.setSkillID("test-skill-ID");
        when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting("test-skill-ID")).thenReturn(true);
        when(mockCommonValidator.validateFreeTextforScripting("test-proficiency-ID")).thenReturn(true);
        classUnderTest.checkSkillAssignmentForXSS(skillAssignments);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.INPUT_PROFILE_ID_IS_FORBIDDEN);
    }

    @Test
    @DisplayName("Check skill assignment attributes for XSS - skill ID is forbidden")
    void checkSkillAssignmentForXSSTestProficiencyLevelForbidden() {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        skillAssignments.setProfileID("test-profile-ID");
        skillAssignments.setProficiencyLevelID("<test>");
        skillAssignments.setSkillID("test-skill-ID");
        when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting("test-profile-ID")).thenReturn(true);
        when(mockCommonValidator.validateFreeTextforScripting("test-skill-ID")).thenReturn(true);
        classUnderTest.checkSkillAssignmentForXSS(skillAssignments);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.INPUT_PROFICIENCY_LEVEL_ID_IS_FORBIDDEN);
    }

    @Test
    @DisplayName("Check foreign key for skill ID in skill assignment - skill exists")
    void checkForeignKeyValueForAssignedSkillExistsTest() {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        skillAssignments.setProfileID("test-profile-ID");
        skillAssignments.setProficiencyLevelID("test-proficiency-ID");
        skillAssignments.setSkillID("test-skill-ID");
        when(mockCommonValidator.checkInputValueExistingDB(SkillsConsumption_.CDS_NAME, SkillsConsumption.ID,
                skillAssignments.getSkillID())).thenReturn(true);
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkForeignKeyValueForAssignedSkill(skillAssignments));
        verify(this.messages, times(0)).throwIfError();
    }

    @Test
    @DisplayName("Check foreign key for skill ID in skill assignment - skill does not exists")
    void checkForeignKeyValueForAssignedSkillDoesNotExistsTest() {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        skillAssignments.setProfileID("test-profile-ID");
        skillAssignments.setProficiencyLevelID("test-proficiency-ID");
        skillAssignments.setSkillID("test-skill-ID");
        when(mockCommonValidator.checkInputValueExistingDB(SkillsConsumption_.CDS_NAME, SkillsConsumption.ID,
                skillAssignments.getSkillID())).thenReturn(false);
        classUnderTest.checkForeignKeyValueForAssignedSkill(skillAssignments);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.SKILL_ID_DOES_NOT_EXIST);
    }

    @Test
    @DisplayName("Check foreign key for profile ID in skill assignment - skill exists")
    void checkForeignKeyValueForAssignedProfileExistsTest() {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        skillAssignments.setProfileID("test-profile-ID");
        skillAssignments.setProficiencyLevelID("test-proficiency-ID");
        skillAssignments.setSkillID("test-skill-ID");
        when(mockCommonValidator.checkInputValueExistingDB(Headers_.CDS_NAME, Headers.ID,
                skillAssignments.getProfileID())).thenReturn(true);
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkForeignKeyValueForAssignedProfile(skillAssignments));
        verify(this.messages, times(0)).throwIfError();
    }

    @Test
    @DisplayName("Check foreign key for profile ID in skill assignment - skill does not exists")
    void checkForeignKeyValueForAssignedProfileDoesNotExistsTest() {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        skillAssignments.setProfileID("test-profile-ID");
        skillAssignments.setProficiencyLevelID("test-proficiency-ID");
        skillAssignments.setSkillID("test-skill-ID");
        when(mockCommonValidator.checkInputValueExistingDB(Headers_.CDS_NAME, Headers.ID,
                skillAssignments.getProfileID())).thenReturn(false);
        classUnderTest.checkForeignKeyValueForAssignedProfile(skillAssignments);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.PROFILE_ID_DOES_NOT_EXIST);
    }

    @Test
    @DisplayName("Check foreign key for proficiency level ID in skill assignment - proficiency level exists")
    void checkForeignKeyValueForAssignedProficiencyLevelTest() {
        final String id1 = UUID.randomUUID().toString();
        ProficiencySetsConsumption proficiencySet = ProficiencySetsConsumption.create();
        ProficiencyLevelsConsumption proficiencyLevel = ProficiencyLevelsConsumption.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());
        proficiencySet.setId(id1);
        proficiencySet.setProficiencyLevels(Collections.singletonList(proficiencyLevel));
        SkillsConsumption skillsConsumption = SkillsConsumption.create();
        skillsConsumption.setProficiencySet(proficiencySet);
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        skillAssignments.setProfileID("test-profile-ID");
        skillAssignments.setProficiencyLevelID(proficiencyLevel.getId());
        skillAssignments.setSkillID("test-skill-ID");
        when(mockSkillConsumptionRepository.findById(skillAssignments.getSkillID()))
                .thenReturn(Optional.of(skillsConsumption));
        Assertions.assertDoesNotThrow(
                () -> classUnderTest.checkForeignKeyValueForAssignedProficiencyLevel(skillAssignments));
        verify(this.messages, times(0)).throwIfError();
    }

    @Test
    @DisplayName("Check foreign key for proficiency level ID in skill assignment - proficiency level does exists")
    void checkForeignKeyValueForAssignedProficiencyLevelDoesNotExistTest() {
        final String id1 = UUID.randomUUID().toString();
        ProficiencySetsConsumption proficiencySet = ProficiencySetsConsumption.create();
        ProficiencyLevelsConsumption proficiencyLevel = ProficiencyLevelsConsumption.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());
        proficiencySet.setId(id1);
        proficiencySet.setProficiencyLevels(Collections.singletonList(proficiencyLevel));
        SkillsConsumption skillsConsumption = SkillsConsumption.create();
        skillsConsumption.setProficiencySet(proficiencySet);
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        skillAssignments.setProfileID("test-profile-ID");
        skillAssignments.setProficiencyLevelID("test-proficiency-ID");
        skillAssignments.setSkillID("test-skill-ID");
        when(mockSkillConsumptionRepository.findById(skillAssignments.getSkillID()))
                .thenReturn(Optional.of(skillsConsumption));
        classUnderTest.checkForeignKeyValueForAssignedProficiencyLevel(skillAssignments);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.PROFICIENCY_LEVEL_ID_DOES_NOT_EXIST);
    }
}
