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
import com.sap.c4p.rm.consultantprofile.repositories.ProficiencyLevelConsumptionRepository;
import com.sap.c4p.rm.consultantprofile.utils.commonutility.CommonUtility;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import com.sap.resourcemanagement.skill.ProficiencyLevelsConsumption;

import myprojectexperienceservice.ExternalWorkExperienceSkills;

public class ExternalWorkExperienceValidatorSkillsTest extends InitMocks {

    private String projectName = "ProjectName";
    private String externalExperienceID = UUID.randomUUID().toString();

    @Mock
    Result mockResult;

    @Mock
    Row mockRow;

    @Mock
    Iterator<Row> mockItr;

    @Mock
    CommonValidator mockCommonValidator;

    @Mock
    CommonUtility mockCommonUtility;

    @Mock
    ExternalWorkExperienceSkills mockSkill1;

    @Mock
    ExternalWorkExperienceSkills mockSkill2;

    @Mock
    ProficiencyLevelConsumptionRepository mockProficiencyLevelConsumptionRepository;

    Messages messages;

    @Autowired
    @InjectMocks
    ExternalWorkExperienceSkillsValidator classUnderTest;

    List<ExternalWorkExperienceSkills> skillsList;

    @BeforeEach
    public void setUp() {
        messages = mock(Messages.class, RETURNS_DEEP_STUBS);
        this.skillsList = Arrays.asList(mockSkill1, mockSkill2);
        classUnderTest = new ExternalWorkExperienceSkillsValidator(mockCommonValidator, mockCommonUtility, messages,
                mockProficiencyLevelConsumptionRepository);
    }

    @Test
    @DisplayName("validate external work experience Skills when Skill ID is Null")
    void validateExternalWorkExperienceSkills1() {
        String workExperienceID = UUID.randomUUID().toString();
        when(mockSkill1.getWorkExperienceId()).thenReturn(workExperienceID);
        classUnderTest.validateExternalWorkExperienceSkills(externalExperienceID, skillsList, projectName);
        verify(messages, times(2)).error(MessageKeys.INPUT_SKILL_CAN_NOT_EMPTY_IN_PROJECT, projectName);

    }

    @Test
    @DisplayName("validate external work experience Skills when Skill ID is Empty")
    void validateExternalWorkExperienceSkills2() {
        String workExperienceID = UUID.randomUUID().toString();
        String skillId = "";
        when(mockSkill1.getWorkExperienceId()).thenReturn(workExperienceID);
        when(mockSkill1.getSkillId()).thenReturn(skillId);
        classUnderTest.validateExternalWorkExperienceSkills(externalExperienceID, skillsList, projectName);
        verify(messages, times(2)).error(MessageKeys.INPUT_SKILL_CAN_NOT_EMPTY_IN_PROJECT, projectName);

    }

    @Test
    @DisplayName("check If skill_ID of external work experience Skill being assigned have whitespaces")
    void validateExternalWorkExperienceSkills3() {
        String workExperienceID = UUID.randomUUID().toString();
        String skillId = "   ";
        when(mockSkill1.getWorkExperienceId()).thenReturn(workExperienceID);
        when(mockSkill1.getSkillId()).thenReturn(skillId);
        classUnderTest.validateExternalWorkExperienceSkills(externalExperienceID, skillsList, projectName);
        verify(messages, times(2)).error(MessageKeys.INPUT_SKILL_CAN_NOT_EMPTY_IN_PROJECT, projectName);

    }

    @Test
    @DisplayName("check If skill_ID of external work experience Skill being assigned has forbidden characters")
    void validateExternalWorkExperienceSkills4() {
        String workExperienceID = UUID.randomUUID().toString();
        String skillId = "Skill<script>";
        when(mockSkill1.getWorkExperienceId()).thenReturn(workExperienceID);
        when(mockSkill1.getSkillId()).thenReturn(skillId);
        classUnderTest.validateExternalWorkExperienceSkills(externalExperienceID, skillsList, projectName);
        verify(messages, times(1)).error(MessageKeys.INPUT_SKILL_IS_INVALID_IN_PROJECT, projectName);

    }

    @Test
    @DisplayName("validate external work experience Skills when Skill ID does not exists in Foreign table")
    void validateExternalWorkExperienceSkills5() {
        String workExperienceID = UUID.randomUUID().toString();
        String skillId = UUID.randomUUID().toString();
        when(mockSkill1.getWorkExperienceId()).thenReturn(workExperienceID);
        when(mockSkill1.getSkillId()).thenReturn(skillId);
        when(mockCommonValidator.checkInputValueExistingDB(anyString(), anyString(), anyString())).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        classUnderTest.validateExternalWorkExperienceSkills(externalExperienceID, skillsList, projectName);
        verify(messages, times(1)).error(MessageKeys.SKILL_DOES_NOT_EXISTS_IN_PROJECT, projectName);

    }

    @Test
    @DisplayName("validate external work experience Skills when Duplicate Assignment is done")
    void validateExternalWorkExperienceSkills6() {
        final String workExperienceID = UUID.randomUUID().toString();
        final String skillID = UUID.randomUUID().toString();
        Optional<Row> newRow = Optional.of(mockRow);
        when(mockResult.first()).thenReturn(newRow);
        when(mockResult.iterator()).thenReturn(mockItr);
        when(mockItr.hasNext()).thenReturn(true).thenReturn(false);
        when(mockItr.next()).thenReturn(mockRow);
        when(mockRow.get(anyString())).thenReturn("duplicateSkillName");
        when(mockSkill1.getWorkExperienceId()).thenReturn(workExperienceID);
        when(mockSkill1.getSkillId()).thenReturn(skillID);
        when(mockSkill2.getWorkExperienceId()).thenReturn(workExperienceID);
        when(mockSkill2.getSkillId()).thenReturn(skillID);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        when(mockCommonValidator.checkInputValueExistingDB(anyString(), anyString(), anyString())).thenReturn(true);
        when(mockCommonUtility.getRecordsValueFromDB(anyString(), anyString(), anySet(), anyString()))
                .thenReturn(new ArrayList<>());
        classUnderTest.validateExternalWorkExperienceSkills(externalExperienceID, skillsList, projectName);
        verify(messages, times(1)).error(MessageKeys.DUPLICATE_SKILL_CAN_NOT_BE_ASSIGN_IN_PROJECT, "", projectName);

    }

    @Test
    @DisplayName("validate external work experience Skills when entire payload is valid")
    void validateExternalWorkExperienceSkills7() {
        final String workExperienceID = UUID.randomUUID().toString();
        when(mockSkill1.getWorkExperienceId()).thenReturn(workExperienceID);
        when(mockSkill1.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill2.getWorkExperienceId()).thenReturn(workExperienceID);
        when(mockSkill2.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockCommonValidator.checkInputValueExistingDB(anyString(), anyString(), anyString())).thenReturn(true);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        assertDoesNotThrow(() -> classUnderTest.validateExternalWorkExperienceSkills(externalExperienceID, skillsList,
                projectName));
    }

    @Test
    @DisplayName("Check skillId is of valid length when valid value is not given")
    void validateExternalWorkExperienceSkills8() {
        final String skillId = "randomStringRandomStringRandomStringRandomString";
        when(mockSkill1.getSkillId()).thenReturn(skillId);
        when(mockCommonValidator.checkInputGuidFieldLength(anyString())).thenReturn(true);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        classUnderTest.checkInputFieldLength(externalExperienceID, mockSkill1, projectName);
        verify(messages, times(1)).error(MessageKeys.SKILL_DOES_NOT_EXISTS_IN_PROJECT, projectName);

    }

    @Test
    @DisplayName("Check skillId and workExperienceID is of valid length is given")
    void validateExternalWorkExperienceSkills9() {
        final String skillId = UUID.randomUUID().toString();
        when(mockSkill1.getSkillId()).thenReturn(skillId);
        when(mockCommonValidator.checkInputGuidFieldLength(anyString())).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        assertDoesNotThrow(() -> classUnderTest.checkInputFieldLength(externalExperienceID, mockSkill1, projectName));
    }

    @Test
    @DisplayName("Check that checkProficiencyLevel throws no exception when proficiencyLevel id is null")
    void checkProficiencyLevelWithProficiencyLevelIdNull() {
        when(mockSkill1.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill2.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill1.getProficiencyLevelId()).thenReturn(null);
        when(mockSkill2.getProficiencyLevelId()).thenReturn(null);

        assertDoesNotThrow(() -> classUnderTest.validateExternalWorkExperienceSkills(UUID.randomUUID().toString(),
                skillsList, projectName));
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
        assertDoesNotThrow(() -> classUnderTest.validateExternalWorkExperienceSkills(UUID.randomUUID().toString(),
                skillsList, projectName));

        verify(messages, times(0)).error(MessageKeys.PROFICIENCY_LEVEL_NULL);
    }

    @Test
    @DisplayName("Check that checkProficiencyLevel() does not throw an exception when proficiency level exists on db")
    void checkProficiencyLevelWithExistingProficiencyLevelOnDb() {
        final String id1 = UUID.randomUUID().toString();

        ProficiencyLevelsConsumption proficiencyLevel = ProficiencyLevelsConsumption.create();
        proficiencyLevel.setId(id1);

        ExternalWorkExperienceSkills externalWorkExperienceSkill = ExternalWorkExperienceSkills.create();
        externalWorkExperienceSkill.setProficiencyLevelId(id1);
        externalWorkExperienceSkill.setSkillId(id1);

        when(mockSkill1.getSkillId()).thenReturn(id1);
        when(mockSkill1.getId()).thenReturn(id1);
        when(mockSkill1.getProficiencyLevelId()).thenReturn(id1);
        when(mockProficiencyLevelConsumptionRepository.findById(any())).thenReturn(Optional.of(proficiencyLevel));

        assertDoesNotThrow(() -> classUnderTest.validateExternalWorkExperienceSkills(id1,
                Collections.singletonList(externalWorkExperienceSkill), projectName));

        verify(mockProficiencyLevelConsumptionRepository, times(1)).findById(any());
    }

    @Test
    @DisplayName("Check that checkProficiencyLevel() throws an error when proficiency level id is not found on db")
    void checkProficiencyLevelWithNotExistingProficiencyLevelOnDb() {
        final String id1 = UUID.randomUUID().toString();
        ProficiencyLevelsConsumption resultProficiencyLevel = ProficiencyLevelsConsumption.create();
        resultProficiencyLevel.setId(UUID.randomUUID().toString());

        ExternalWorkExperienceSkills externalWorkExperienceSkill = ExternalWorkExperienceSkills.create();
        externalWorkExperienceSkill.setProficiencyLevelId(id1);
        externalWorkExperienceSkill.setSkillId(id1);

        when(mockSkill1.getSkillId()).thenReturn(id1);
        when(mockSkill1.getId()).thenReturn(id1);
        when(mockSkill1.getProficiencyLevelId()).thenReturn(id1);
        when(mockProficiencyLevelConsumptionRepository.findById(any())).thenReturn(Optional.empty());

        classUnderTest.validateExternalWorkExperienceSkills(id1, Collections.singletonList(externalWorkExperienceSkill),
                projectName);

        verify(messages, times(1)).error(MessageKeys.PROFICIENCY_LEVEL_IS_INVALID);
        verify(mockProficiencyLevelConsumptionRepository, times(1)).findById(any());
    }
}
