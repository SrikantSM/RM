package com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import myprojectexperienceservice.ExternalWorkExperience;
import myprojectexperienceservice.ExternalWorkExperienceSkills;

class ExternalWorkExperienceHeaderValidatorTest extends InitMocks {
    private static final String PROJECT_NAME = "Sample Project";
    private static final String COMPANY_NAME = "Sample Company";
    private static final String ROLE_PLAYED = "Sample Role Played";
    private static final String COMMENT = "Sample Comment";
    private static final LocalDate START_DATE = LocalDate.of(1969, 1, 1);
    private static final LocalDate END_DATE = LocalDate.of(1970, 1, 1);
    private static final String FORBIDDEN_STRING = "<script>";
    private static final String BLANK_STRING = "    ";

    @Mock
    CommonValidator mockCommonValidator;

    @Mock
    ExternalWorkExperience mockExternalWorkExperience1;

    @Mock
    ExternalWorkExperience mockExternalWorkExperience2;

    @Mock
    ExternalWorkExperienceSkills mockExternalWorkExperienceSkills;

    @Mock
    ExternalWorkExperienceSkillsValidator mockExternalWorkExperienceSkillsValidator;

    Messages messages;

    @Autowired
    @InjectMocks
    ExternalWorkExperienceHeaderValidator classUnderTest;

    List<ExternalWorkExperience> externalWorkExperienceList;
    List<ExternalWorkExperienceSkills> externalWorkExperienceSkillList;

    @BeforeEach
    public void setUp() {
        messages = mock(Messages.class, RETURNS_DEEP_STUBS);
        this.externalWorkExperienceList = Arrays.asList(mockExternalWorkExperience1, mockExternalWorkExperience2);
        this.externalWorkExperienceSkillList = Collections.singletonList(mockExternalWorkExperienceSkills);
        when(mockExternalWorkExperience1.getComments()).thenReturn(COMPANY_NAME);
        when(mockExternalWorkExperience2.getComments()).thenReturn(COMPANY_NAME);
        when(mockExternalWorkExperience1.getStartDate()).thenReturn(START_DATE);
        when(mockExternalWorkExperience1.getEndDate()).thenReturn(END_DATE);
        when(mockExternalWorkExperience2.getStartDate()).thenReturn(START_DATE);
        when(mockExternalWorkExperience2.getEndDate()).thenReturn(END_DATE);
        when(mockExternalWorkExperience1.getProjectName()).thenReturn(PROJECT_NAME);
        when(mockExternalWorkExperience2.getProjectName()).thenReturn(PROJECT_NAME);
        when(mockExternalWorkExperience1.getCompanyName()).thenReturn(COMPANY_NAME);
        when(mockExternalWorkExperience2.getCompanyName()).thenReturn(COMPANY_NAME);
        when(mockExternalWorkExperience1.getRolePlayed()).thenReturn(ROLE_PLAYED);
        when(mockExternalWorkExperience2.getRolePlayed()).thenReturn(ROLE_PLAYED);
        classUnderTest = new ExternalWorkExperienceHeaderValidator(mockCommonValidator,
                mockExternalWorkExperienceSkillsValidator, messages);
    }

    @Test
    @DisplayName("validate External Work experience when external work experience list is empty")
    void validateExternalWorkExperienceHeaderEmpty() {
        List<ExternalWorkExperience> emptyList = new ArrayList<>();
        assertDoesNotThrow(() -> classUnderTest.validateExternalWorkExperienceHeader(emptyList));
    }

    @Test
    @DisplayName("validate External Work experience when comment has forbidden characters")
    void validateExternalWorkExperienceHeader() {
        when(mockExternalWorkExperience1.getComments()).thenReturn(FORBIDDEN_STRING);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(false);
        classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList);
        verify(messages, times(2)).error(MessageKeys.INPUT_COMMENT_IS_INVALID, PROJECT_NAME);
    }

    @Test
    @DisplayName("validate External Work experience when project name has forbidden characters")
    void validateExternalWorkExperienceHeader2() {
        when(mockExternalWorkExperience1.getComments()).thenReturn(COMMENT);
        when(mockExternalWorkExperience1.getProjectName()).thenReturn(FORBIDDEN_STRING);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true, false);
        classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList);
        verify(messages, times(1)).error(MessageKeys.INPUT_PROJECT_NAME_IS_INVALID, PROJECT_NAME);
    }

    @Test
    @DisplayName("validate External Work experience when project name is blank")
    void validateExternalWorkExperienceHeader3() {
        when(mockExternalWorkExperience1.getComments()).thenReturn(COMMENT);
        when(mockExternalWorkExperience1.getProjectName()).thenReturn(BLANK_STRING);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        when(mockCommonValidator.isBlank(anyString())).thenReturn(true);
        classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList);
        verify(messages, times(1)).error(MessageKeys.INPUT_PROJECT_NAME_CAN_NOT_BE_EMPTY, BLANK_STRING);
    }

    @Test
    @DisplayName("validate External Work experience when company name has forbidden characters")
    void validateExternalWorkExperienceHeader4() {
        when(mockExternalWorkExperience1.getCompanyName()).thenReturn(FORBIDDEN_STRING);
        when(mockCommonValidator.isBlank(anyString())).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting(FORBIDDEN_STRING)).thenReturn(false);
        classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList);
        verify(messages, times(2)).error(MessageKeys.INPUT_COMPANY_NAME_IS_INVALID);
    }

    @Test
    @DisplayName("validate External Work experience when project name is blank")
    void validateExternalWorkExperienceHeader5() {
        when(mockExternalWorkExperience1.getCompanyName()).thenReturn(BLANK_STRING);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        when(mockCommonValidator.isBlank(anyString())).thenReturn(false, true);
        classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList);
        verify(messages, times(2)).error(MessageKeys.INPUT_COMPANY_NAME_CAN_NOT_BE_EMPTY);
    }

    @Test
    @DisplayName("validate External Work experience when role played has forbidden characters")
    void validateExternalWorkExperienceHeader6() {
        when(mockExternalWorkExperience1.getRolePlayed()).thenReturn(FORBIDDEN_STRING);
        when(mockCommonValidator.isBlank(anyString())).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting(FORBIDDEN_STRING)).thenReturn(false);
        classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList);
        verify(messages, times(2)).error(MessageKeys.INPUT_ROLE_PLAYED_IS_INVALID);
    }

    @Test
    @DisplayName("validate External Work experience when role played is blank")
    void validateExternalWorkExperienceHeader7() {
        when(mockExternalWorkExperience1.getRolePlayed()).thenReturn(BLANK_STRING);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        when(mockCommonValidator.isBlank(BLANK_STRING)).thenReturn(true);
        classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList);
        verify(messages, times(1)).error(MessageKeys.INPUT_ROLE_PLAYED_CAN_NOT_BE_EMPTY);
    }

    @Test
    @DisplayName("validate External Work experience when start date is null")
    void validateExternalWorkExperienceHeader8() {
        when(mockExternalWorkExperience1.getStartDate()).thenReturn(null);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        when(mockCommonValidator.isBlank(COMMENT)).thenReturn(false);
        when(mockCommonValidator.isBlank(PROJECT_NAME)).thenReturn(false);
        when(mockCommonValidator.isBlank(COMPANY_NAME)).thenReturn(false);
        when(mockCommonValidator.isBlank(ROLE_PLAYED)).thenReturn(false);
        classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList);
        verify(messages, times(1)).error(MessageKeys.INPUT_START_DATE_CAN_NOT_BE_EMPTY);
    }

    @Test
    @DisplayName("validate External Work experience when start date is after end date")
    void validateExternalWorkExperienceHeader9() {
        when(mockExternalWorkExperience1.getStartDate()).thenReturn(LocalDate.of(1971, 1, 1));
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        when(mockCommonValidator.isBlank(COMMENT)).thenReturn(false);
        when(mockCommonValidator.isBlank(PROJECT_NAME)).thenReturn(false);
        when(mockCommonValidator.isBlank(COMPANY_NAME)).thenReturn(false);
        when(mockCommonValidator.isBlank(ROLE_PLAYED)).thenReturn(false);
        classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList);
        verify(messages, times(1)).error(MessageKeys.STARTDATE_CAN_NOT_GREATER_THAN_ENDDATE);
    }

    @Test
    @DisplayName("validate External Work experience when end date is null")
    void validateExternalWorkExperienceHeader10() {
        when(mockExternalWorkExperience1.getEndDate()).thenReturn(null);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        when(mockCommonValidator.isBlank(COMMENT)).thenReturn(false);
        when(mockCommonValidator.isBlank(PROJECT_NAME)).thenReturn(false);
        when(mockCommonValidator.isBlank(COMPANY_NAME)).thenReturn(false);
        when(mockCommonValidator.isBlank(ROLE_PLAYED)).thenReturn(false);
        classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList);
        verify(messages, times(1)).error(MessageKeys.INPUT_END_DATE_CAN_NOT_BE_EMPTY);
    }

    @Test
    @DisplayName("validate External Work experience when customer name has forbidden characters")
    void validateExternalWorkExperienceHeader11() {
        when(mockExternalWorkExperience1.getCustomer()).thenReturn(FORBIDDEN_STRING);
        when(mockCommonValidator.isBlank(anyString())).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting(FORBIDDEN_STRING)).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting(COMMENT)).thenReturn(true);
        when(mockCommonValidator.validateFreeTextforScripting(PROJECT_NAME)).thenReturn(true);
        when(mockCommonValidator.validateFreeTextforScripting(COMPANY_NAME)).thenReturn(true);
        when(mockCommonValidator.validateFreeTextforScripting(ROLE_PLAYED)).thenReturn(true);

        classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList);
        verify(messages, times(2)).error(MessageKeys.INPUT_CUSTOMER_IS_INVALID);
    }

    @Test
    @DisplayName("validate External Work experience when duplicate external project is being assigned")
    void validateExternalWorkExperienceHeader12() {
        when(mockExternalWorkExperience2.getComments()).thenReturn("COMMENT2");
        when(mockExternalWorkExperience2.getCustomer()).thenReturn("CUSTOMER2");
        when(mockCommonValidator.isBlank(anyString())).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);

        classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList);
        verify(messages, times(1)).error(MessageKeys.DUPLICATE_EXTERNAL_PROJECT_CAN_NOT_BE_ASSIGNED, PROJECT_NAME);
    }

    @Test
    @DisplayName("validate External Work experience when entire payload is correct but skill is empty")
    void validateExternalWorkExperienceHeader13() {
        when(mockExternalWorkExperience2.getComments()).thenReturn("COMMENT2");
        when(mockExternalWorkExperience2.getCompanyName()).thenReturn("COMPANY_NAME2");
        when(mockExternalWorkExperience2.getCustomer()).thenReturn("CUSTOMER2");
        when(mockCommonValidator.isBlank(anyString())).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);

        assertDoesNotThrow(() -> classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList));
        verify(mockExternalWorkExperienceSkillsValidator, times(0)).validateExternalWorkExperienceSkills(anyString(),
                anyList(), anyString());
    }

    @Test
    @DisplayName("validate External Work experience when entire payload is correct but skill is null")
    void validateExternalWorkExperienceHeader14() {
        when(mockExternalWorkExperience1.getExternalWorkExperienceSkills()).thenReturn(null);
        when(mockExternalWorkExperience2.getComments()).thenReturn("COMMENT2");
        when(mockExternalWorkExperience2.getCompanyName()).thenReturn("COMPANY_NAME2");
        when(mockExternalWorkExperience2.getCustomer()).thenReturn("CUSTOMER2");
        when(mockExternalWorkExperience2.getExternalWorkExperienceSkills()).thenReturn(null);
        when(mockCommonValidator.isBlank(anyString())).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);

        assertDoesNotThrow(() -> classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList));
        verify(mockExternalWorkExperienceSkillsValidator, times(0)).validateExternalWorkExperienceSkills(anyString(),
                anyList(), anyString());
    }

    @Test
    @DisplayName("validate External Work experience when entire payload is correct")
    void validateExternalWorkExperienceHeader15() {
        when(mockExternalWorkExperience1.getExternalWorkExperienceSkills()).thenReturn(externalWorkExperienceSkillList);
        when(mockExternalWorkExperience2.getComments()).thenReturn("COMMENT2");
        when(mockExternalWorkExperience2.getCompanyName()).thenReturn("COMPANY_NAME2");
        when(mockExternalWorkExperience2.getCustomer()).thenReturn("CUSTOMER2");
        when(mockExternalWorkExperience2.getExternalWorkExperienceSkills()).thenReturn(externalWorkExperienceSkillList);
        when(mockCommonValidator.isBlank(anyString())).thenReturn(false);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);

        assertDoesNotThrow(() -> classUnderTest.validateExternalWorkExperienceHeader(externalWorkExperienceList));
    }
}
