package com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.pojo;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.util.Objects;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.c4p.rm.consultantprofile.InitMocks;

import myprojectexperienceservice.ExternalWorkExperience;

public class ExternalWorkExperienceWithMandatoryValuesTest extends InitMocks {

    private static final String COMPANY_NAME_1 = "companyName1";
    private static final String PROJECT_NAME_1 = "projectName1";
    private static final String ROLE_PLAYED_1 = "rolePlayed1";
    private static final LocalDate START_DATE_1 = LocalDate.of(1979, 1, 1);
    private static final LocalDate END_DATE_1 = LocalDate.of(1980, 1, 1);

    private static final String COMPANY_NAME_2 = "companyName2";
    private static final String PROJECT_NAME_2 = "projectName2";
    private static final String ROLE_PLAYED_2 = "rolePlayed2";
    private static final LocalDate START_DATE_2 = LocalDate.of(1979, 1, 2);
    private static final LocalDate END_DATE_2 = LocalDate.of(1980, 1, 2);

    ExternalWorkExperienceWithMandatoryValues classUnderTest = new ExternalWorkExperienceWithMandatoryValues(
            PROJECT_NAME_1, ROLE_PLAYED_1, COMPANY_NAME_1, START_DATE_1, END_DATE_1);

    @Test
    @DisplayName("test with different instance")
    public void testWithDifferentInstance() {
        assertFalse(classUnderTest.equals(null));
        assertFalse(classUnderTest.equals(ExternalWorkExperience.create()));
    }

    @Test
    @DisplayName("Check equals method when ProjectName field is null or different")
    public void testEqualsWithProjectNameIsNullOrDifferent() {
        ExternalWorkExperienceWithMandatoryValues externalWorkExperienceWithMandatoryValues = new ExternalWorkExperienceWithMandatoryValues(
                null, null, null, null, null);
        assertFalse(classUnderTest.equals(externalWorkExperienceWithMandatoryValues));
        externalWorkExperienceWithMandatoryValues.setProjectName(PROJECT_NAME_2);
        assertFalse(classUnderTest.equals(externalWorkExperienceWithMandatoryValues));
    }

    @Test
    @DisplayName("Check equals method when RolePlayed field is null or different")
    public void testEqualsWithRolePlayedIsNullOrDifferent() {
        ExternalWorkExperienceWithMandatoryValues externalWorkExperienceWithMandatoryValues = new ExternalWorkExperienceWithMandatoryValues(
                PROJECT_NAME_1, null, null, null, null);
        assertFalse(classUnderTest.equals(externalWorkExperienceWithMandatoryValues));
        externalWorkExperienceWithMandatoryValues.setRolePlayed(ROLE_PLAYED_2);
        assertFalse(classUnderTest.equals(externalWorkExperienceWithMandatoryValues));
    }

    @Test
    @DisplayName("Check equals method when CompanyName field is null or different")
    public void testEqualsWithCompanyNameIsNullOrDifferent() {
        ExternalWorkExperienceWithMandatoryValues externalWorkExperienceWithMandatoryValues = new ExternalWorkExperienceWithMandatoryValues(
                PROJECT_NAME_1, ROLE_PLAYED_1, null, null, null);
        assertFalse(classUnderTest.equals(externalWorkExperienceWithMandatoryValues));
        externalWorkExperienceWithMandatoryValues.setCompanyName(COMPANY_NAME_2);
        assertFalse(classUnderTest.equals(externalWorkExperienceWithMandatoryValues));
    }

    @Test
    @DisplayName("Check equals method when StartDate field is null or different")
    public void testEqualsWithStartDateIsNullOrDifferent() {
        ExternalWorkExperienceWithMandatoryValues externalWorkExperienceWithMandatoryValues = new ExternalWorkExperienceWithMandatoryValues(
                PROJECT_NAME_1, ROLE_PLAYED_1, COMPANY_NAME_1, null, null);
        assertFalse(classUnderTest.equals(externalWorkExperienceWithMandatoryValues));
        externalWorkExperienceWithMandatoryValues.setStartDate(START_DATE_2);
        assertFalse(classUnderTest.equals(externalWorkExperienceWithMandatoryValues));
    }

    @Test
    @DisplayName("Check equals method when EndDate field is null or different")
    public void testEqualsWithEndDateIsNullOrDifferent() {
        ExternalWorkExperienceWithMandatoryValues externalWorkExperienceWithMandatoryValues = new ExternalWorkExperienceWithMandatoryValues(
                PROJECT_NAME_1, ROLE_PLAYED_1, COMPANY_NAME_1, START_DATE_1, null);
        assertFalse(classUnderTest.equals(externalWorkExperienceWithMandatoryValues));
        externalWorkExperienceWithMandatoryValues.setEndDate(END_DATE_2);
        assertFalse(classUnderTest.equals(externalWorkExperienceWithMandatoryValues));
    }

    @Test
    @DisplayName("test equals method for same field valued objects")
    public void testEquals() {
        ExternalWorkExperienceWithMandatoryValues externalWorkExperienceWithMandatoryValues = new ExternalWorkExperienceWithMandatoryValues(
                PROJECT_NAME_1, ROLE_PLAYED_1, COMPANY_NAME_1, START_DATE_1, END_DATE_1);
        assertTrue(classUnderTest.equals(externalWorkExperienceWithMandatoryValues));
    }

    @Test
    @DisplayName("test Getters")
    public void tesGetters() {
        assertEquals(PROJECT_NAME_1, classUnderTest.getProjectName());
        assertEquals(COMPANY_NAME_1, classUnderTest.getCompanyName());
        assertEquals(ROLE_PLAYED_1, classUnderTest.getRolePlayed());
        assertEquals(START_DATE_1, classUnderTest.getStartDate());
        assertEquals(END_DATE_1, classUnderTest.getEndDate());
    }

    @Test
    @DisplayName("Check hashCode method")
    public void testHashCode() {
        ExternalWorkExperienceWithMandatoryValues externalWorkExperienceWithMandatoryValues = new ExternalWorkExperienceWithMandatoryValues(
                PROJECT_NAME_1, ROLE_PLAYED_1, COMPANY_NAME_1, START_DATE_1, END_DATE_1);
        assertEquals(Objects.hash(PROJECT_NAME_1, COMPANY_NAME_1, ROLE_PLAYED_1, START_DATE_1, END_DATE_1),
                externalWorkExperienceWithMandatoryValues.hashCode());
    }

}
