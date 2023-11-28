package com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.repositories.SkillConsumptionRepository;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import com.sap.resourcemanagement.skill.ProficiencyLevelsConsumption;
import com.sap.resourcemanagement.skill.ProficiencySetsConsumption;
import com.sap.resourcemanagement.skill.SkillsConsumption;

import myprojectexperienceservice.Skills;

class MyProjectExperienceHeaderSkillValidatorTest extends InitMocks {

    @Mock
    Result mockResult;

    @Mock
    Row mockRow;

    @Mock
    Iterator<Row> mockItr;

    @Mock
    CommonValidator mockCommonValidator;

    @Mock
    Skills mockSkill1;

    @Mock
    Skills mockSkill2;

    @Mock
    SkillConsumptionRepository mockSkillConsumptionRepository;

    private Messages messages;

    @Autowired
    @InjectMocks
    MyProjectExperienceHeaderSkillValidator classUnderTest;

    List<Skills> skillsList;

    @BeforeEach
    public void setUp() {
        this.skillsList = Arrays.asList(mockSkill1, mockSkill2);
        messages = mock(Messages.class, RETURNS_DEEP_STUBS);
        classUnderTest = new MyProjectExperienceHeaderSkillValidator(mockCommonValidator, messages,
                mockSkillConsumptionRepository);
    }

    @Test
    @DisplayName("validate Skills when Skill ID is Null")
    void validateMyProjectExperienceHeaderSkills1() {
        String employeeId = UUID.randomUUID().toString();
        when(mockSkill1.getEmployeeId()).thenReturn(employeeId);
        classUnderTest.validateMyProjectExperienceHeaderSkills(skillsList);
        verify(messages, times(2)).error(MessageKeys.INPUT_SKILL_CAN_NOT_EMPTY);
    }

    @Test
    @DisplayName("validate Skills when Skill ID is Empty")
    void validateMyProjectExperienceHeaderSkills2() {
        String employeeId = UUID.randomUUID().toString();
        String skillId = "";
        when(mockSkill1.getEmployeeId()).thenReturn(employeeId);
        when(mockSkill1.getSkillId()).thenReturn(skillId);
        classUnderTest.validateMyProjectExperienceHeaderSkills(skillsList);
        verify(messages, times(2)).error(MessageKeys.INPUT_SKILL_CAN_NOT_EMPTY);
    }

    @Test
    @DisplayName("check If skill_ID of Skill being assigned have whitespaces")
    void validateMyProjectExperienceHeaderSkills3() {
        String employeeId = UUID.randomUUID().toString();
        String skillId = "   ";
        when(mockSkill1.getEmployeeId()).thenReturn(employeeId);
        when(mockSkill1.getSkillId()).thenReturn(skillId);
        classUnderTest.validateMyProjectExperienceHeaderSkills(skillsList);
        verify(messages, times(2)).error(MessageKeys.INPUT_SKILL_CAN_NOT_EMPTY);
    }

    @Test
    @DisplayName("validate Skills when Skill ID does not exists in Foreign table")
    void validateMyProjectExperienceHeaderSkills4() {
        String employeeId = UUID.randomUUID().toString();
        String skillId = UUID.randomUUID().toString();
        when(mockSkill1.getEmployeeId()).thenReturn(employeeId);
        when(mockSkill1.getSkillId()).thenReturn(skillId);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        when(mockCommonValidator.checkInputValueExistingDB(anyString(), anyString(), anyString())).thenReturn(false);
        classUnderTest.validateMyProjectExperienceHeaderSkills(skillsList);
        verify(messages, times(1)).error(MessageKeys.SKILL_DOES_NOT_EXISTS);
    }

    @Test
    @DisplayName("validate Skills when Duplicate Assignment is done")
    void validateMyProjectExperienceHeaderSkills5() {
        final String employeeID = UUID.randomUUID().toString();
        final String skillID = UUID.randomUUID().toString();
        Optional<Row> newRow = Optional.of(mockRow);
        when(mockResult.first()).thenReturn(newRow);
        when(mockResult.iterator()).thenReturn(mockItr);
        when(mockItr.hasNext()).thenReturn(true).thenReturn(false);
        when(mockItr.next()).thenReturn(mockRow);
        when(mockRow.get(anyString())).thenReturn("duplicateSkillName");
        when(mockSkill1.getEmployeeId()).thenReturn(employeeID);
        when(mockSkill1.getSkillId()).thenReturn(skillID);
        when(mockSkill2.getEmployeeId()).thenReturn(employeeID);
        when(mockSkill2.getSkillId()).thenReturn(skillID);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        when(mockCommonValidator.checkInputValueExistingDB(anyString(), anyString(), anyString())).thenReturn(true);
        classUnderTest.validateMyProjectExperienceHeaderSkills(skillsList);
        verify(messages, times(1)).error(MessageKeys.DUPLICATE_SKILL_CAN_NOT_BE_ASSIGNED);
    }

    @Test
    @DisplayName("check If skill containing forbidden characters is being assigned to MyProjectExperience")
    void validateMyProjectExperienceHeaderSkills6() {
        final String employeeID = UUID.randomUUID().toString();
        final String skillID = UUID.randomUUID().toString();
        when(mockSkill1.getEmployeeId()).thenReturn(employeeID);
        when(mockSkill1.getSkillId()).thenReturn(skillID);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(false);
        classUnderTest.validateMyProjectExperienceHeaderSkills(skillsList);
        verify(messages, times(1)).error(MessageKeys.INPUT_SKILL_IS_INVALID);
    }

    @Test
    @DisplayName("validate Skills when entire payload is valid")
    void validateMyProjectExperienceHeaderSkills7() {
        final String employeeID = UUID.randomUUID().toString();
        when(mockSkill1.getEmployeeId()).thenReturn(employeeID);
        when(mockSkill1.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill2.getEmployeeId()).thenReturn(employeeID);
        when(mockSkill2.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        when(mockCommonValidator.checkInputValueExistingDB(anyString(), anyString(), anyString())).thenReturn(true);
        assertDoesNotThrow(() -> classUnderTest.validateMyProjectExperienceHeaderSkills(skillsList));
    }

    @Test
    @DisplayName("Check if Messages API error is added")
    void validateMyProjectExperienceHeaderSkills10() {
        classUnderTest.prepareErrorMessageSkill(mockSkill1, MessageKeys.SKILL_DOES_NOT_EXISTS);
        verify(messages, times(1)).error(MessageKeys.SKILL_DOES_NOT_EXISTS);
    }

    @Test
    @DisplayName("Check checkInputFieldLength case input too long")
    void checkInputFieldLengthTooLong() {
        when(mockSkill1.getSkillId()).thenReturn(UUID.randomUUID().toString() + UUID.randomUUID());
        when(mockCommonValidator.checkInputGuidFieldLength(anyString())).thenReturn(true);
        boolean result = classUnderTest.checkInputFieldLength(mockSkill1);
        assertFalse(result);
        verify(messages, times(1)).error(MessageKeys.SKILL_DOES_NOT_EXISTS);
    }

    @Test
    @DisplayName("Check checkInputFieldLength case input too long")
    void checkInputFieldLengthOk() {
        when(mockSkill1.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockCommonValidator.checkInputGuidFieldLength(anyString())).thenReturn(false);
        boolean result = classUnderTest.checkInputFieldLength(mockSkill1);
        assertTrue(result);
        verify(messages, times(0)).error(MessageKeys.SKILL_DOES_NOT_EXISTS);
    }

    @Test
    @DisplayName("Check that checkProficiencyLevel throws no exception when proficiencyLevel id is null")
    void checkProficiencyLevelWithProficiencyLevelIdNull() {
        when(mockSkill1.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill2.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill1.getProficiencyLevelId()).thenReturn(null);
        when(mockSkill2.getProficiencyLevelId()).thenReturn(null);

        assertDoesNotThrow(() -> classUnderTest.validateMyProjectExperienceHeaderSkills(skillsList));
        verify(messages, times(2)).error(MessageKeys.PROFICIENCY_LEVEL_NULL);
    }

    @Test
    @DisplayName("Check that checkProficiencyLevel throws no exception when proficiencyLevel is default")
    void checkProficiencyLevelWithDefaultProficiencyLevel() {
        final String DEFAULT_PROFICIENCY_LEVEL_ID = "8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee";

        when(mockSkill1.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill2.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill1.getProficiencyLevelId()).thenReturn(DEFAULT_PROFICIENCY_LEVEL_ID);
        when(mockSkill2.getProficiencyLevelId()).thenReturn(DEFAULT_PROFICIENCY_LEVEL_ID);
        assertDoesNotThrow(() -> classUnderTest.validateMyProjectExperienceHeaderSkills(skillsList));

        verify(messages, times(0)).error(MessageKeys.PROFICIENCY_LEVEL_NULL);
    }

    @Test
    @DisplayName("Check that checkProficiencyLevel() does not throw an exception when proficiency level exists on db")
    void checkProficiencyLevelWithExistingProficiencyLevelOnDb() {
        final String id1 = UUID.randomUUID().toString();

        ProficiencySetsConsumption proficiencySet = ProficiencySetsConsumption.create();
        ProficiencyLevelsConsumption proficiencyLevel = ProficiencyLevelsConsumption.create();
        proficiencyLevel.setId(id1);
        proficiencySet.setId(id1);
        proficiencySet.setProficiencyLevels(Collections.singletonList(proficiencyLevel));

        SkillsConsumption skillsConsumption = SkillsConsumption.create();
        skillsConsumption.setProficiencySet(proficiencySet);

        Result mockResult = mock(Result.class);

        Skills skillAssignmentRequest = Skills.create();
        skillAssignmentRequest.setProficiencyLevelId(id1);
        skillAssignmentRequest.setSkillId(id1);

        when(mockSkill1.getSkillId()).thenReturn(id1);
        when(mockSkill1.getId()).thenReturn(id1);
        when(mockSkill1.getProficiencyLevelId()).thenReturn(id1);
        when(mockSkillConsumptionRepository.findById(any())).thenReturn(Optional.of(skillsConsumption));
        when(mockResult.first(SkillsConsumption.class)).thenReturn(Optional.of(skillsConsumption));
        assertDoesNotThrow(() -> classUnderTest
                .validateMyProjectExperienceHeaderSkills(Collections.singletonList(skillAssignmentRequest)));
    }

    @Test
    @DisplayName("Check that checkProficiencyLevel() throws an error when proficiency level id is not found on db")
    void checkProficiencyLevelWithNotExistingProficiencyLevelOnDb() {
        final String id1 = UUID.randomUUID().toString();

        ProficiencySetsConsumption proficiencySet = ProficiencySetsConsumption.create();
        ProficiencyLevelsConsumption proficiencyLevel = ProficiencyLevelsConsumption.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());
        proficiencySet.setId(id1);

        proficiencySet.setProficiencyLevels(Collections.singletonList(proficiencyLevel));

        SkillsConsumption skillsConsumption = SkillsConsumption.create();
        skillsConsumption.setProficiencySet(proficiencySet);

        Skills skillAssignmentRequest = Skills.create();
        skillAssignmentRequest.setProficiencyLevelId(id1);
        skillAssignmentRequest.setSkillId(id1);

        when(mockSkill1.getSkillId()).thenReturn(id1);
        when(mockSkill1.getId()).thenReturn(id1);
        when(mockSkill1.getProficiencyLevelId()).thenReturn(id1);
        when(mockSkillConsumptionRepository.findById(any())).thenReturn(Optional.of(skillsConsumption));

        classUnderTest.validateMyProjectExperienceHeaderSkills(Collections.singletonList(skillAssignmentRequest));

        verify(messages, times(1)).error(MessageKeys.PROFICIENCY_LEVEL_IS_INVALID);
    }
}
