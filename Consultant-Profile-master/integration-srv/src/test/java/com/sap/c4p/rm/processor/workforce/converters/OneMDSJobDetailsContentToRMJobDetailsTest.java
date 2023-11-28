package com.sap.c4p.rm.processor.workforce.converters;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.convert.support.GenericConversionService;

import com.sap.c4p.rm.processor.workforce.dto.*;

import com.sap.resourcemanagement.workforce.workassignment.JobDetails;
import com.sap.resourcemanagement.workforce.workforceperson.Phones;

public class OneMDSJobDetailsContentToRMJobDetailsTest {

    private static final String COUNTRY_CODE = "countryCode";
    private static final String COST_CENTER_ID = "costCenterId";
    private static final String EVENT_CODE = "eventCode";
    private static final String EVENT_REASON_CODE = "eventReasonCode";
    private static final int EVENT_SEQUENCE = 1;
    private static final String JOB_EXTERNAL_ID = "jobExternalId";
    private static final BigDecimal FTE_VALUE = BigDecimal.valueOf(1.0);
    private static final String JOB_TITLE = "jobTitle";
    private static final String LEGAL_EXTERNAL_ID = "legalExternalId";
    private static final String ORG_UNIT_EXTERNAL_ID = "orgUnitExternalId";
    private static final String STATUS_CODE = "statusCode";
    private static final String SUPER_ORDINATE_ORG_UNIT1_EXTERNAL_ID = "superOrdinateOrgUnit1ExternalId";
    private static final String SUPER_ORDINATE_ORG_UNIT2_EXTERNAL_ID = "superOrdinateOrgUnit2ExternalId";
    private static final String SUPER_VISOR_WORK_ASSIGNMENT_EXTERNAL_ID = "supervisorWorkAssignmentExternalId";
    private static final BigDecimal WORKING_HOURS_PER_WEEK = BigDecimal.valueOf(40.0);
    private static final BigDecimal WORKING_HOURS_PER_DAYS = BigDecimal.valueOf(8);

    private static final GenericConversionService classUnderTest = new GenericConversionService();

    @BeforeAll
    public static void setUpAll() {
        classUnderTest.addConverter(new OneMDSJobDetailsContentToRMJobDetails());
    }

    @Test
    @DisplayName("test convert if source is null.")
    public void testConvertIfSourceIsNull() {
        assertNull(OneMDSJobDetailsContentToRMJobDetailsTest.classUnderTest.convert(null, Phones.class));
    }

    @Test
    @DisplayName("test convert with null values.")
    public void testConvertWithNullValues() {
        Content___ oneMDSContent = new Content___();
        oneMDSContent.setSupervisorWorkAssignment(null);
        oneMDSContent.setCostCenter(null);
        oneMDSContent.setLegalEntity(null);
        oneMDSContent.setCountry(null);
        oneMDSContent.setJobTitle(null);
        oneMDSContent.setFte(null);
        oneMDSContent.setStatus(null);
        oneMDSContent.setJob(null);
        oneMDSContent.setWorkingDaysPerWeek(null);
        oneMDSContent.setWorkingHoursPerWeek(null);
        oneMDSContent.setEventSequence(null);
        oneMDSContent.setEvent(null);
        oneMDSContent.setEventReason(null);
        oneMDSContent.setOrgUnit(null);
        oneMDSContent.setSuperOrdinateOrgUnit1(null);
        oneMDSContent.setSuperOrdinateOrgUnit2(null);
        JobDetails jobDetails = OneMDSJobDetailsContentToRMJobDetailsTest.classUnderTest.convert(oneMDSContent,
                JobDetails.class);
        assertNotNull(jobDetails);
        assertNotNull(jobDetails.getId());
        assertNull(jobDetails.getSupervisorWorkAssignmentExternalID());
        assertNull(jobDetails.getCostCenter());
        assertNull(jobDetails.getLegalEntityExternalID());
        assertNull(jobDetails.getCountry());
        assertNull(jobDetails.getJobTitle());
        assertEquals(BigDecimal.valueOf(0),jobDetails.getFte());
        assertNull(jobDetails.getStatus());
        assertNull(jobDetails.getJobExternalID());
        assertEquals(BigDecimal.valueOf(0),jobDetails.getWorkingDaysPerWeek());
        assertEquals(BigDecimal.valueOf(0),jobDetails.getWorkingHoursPerWeek());
        assertEquals(0,jobDetails.getEventSequence());
        assertNull(jobDetails.getEvent());
        assertNull(jobDetails.getEventReason());
        assertNull(jobDetails.getOrgUnitExternalId());
        assertNull(jobDetails.getSuperOrdinateOrgUnit1ExternalId());
        assertNull(jobDetails.getSuperOrdinateOrgUnit2ExternalId());
    }

    @Test
    @DisplayName("test convert with nested fields as null.")
    public void testConvertWithNestedFieldsAsNull() {
        Content___ oneMDSContent = new Content___();
        oneMDSContent.setSupervisorWorkAssignment(new SupervisorWorkAssignment());
        oneMDSContent.setCostCenter(new CostCenter());
        oneMDSContent.setLegalEntity(new LegalEntity());
        oneMDSContent.setCountry(new Country());
        oneMDSContent.setJobTitle(JOB_TITLE);
        oneMDSContent.setFte(FTE_VALUE);
        oneMDSContent.setStatus(new Status());
        oneMDSContent.setJob(new Job());
        oneMDSContent.setWorkingDaysPerWeek(WORKING_HOURS_PER_WEEK);
        oneMDSContent.setWorkingHoursPerWeek(WORKING_HOURS_PER_DAYS);
        oneMDSContent.setEventSequence(EVENT_SEQUENCE);
        oneMDSContent.setEvent(new Event());
        oneMDSContent.setEventReason(new EventReason());
        oneMDSContent.setOrgUnit(new OrgUnit());
        oneMDSContent.setSuperOrdinateOrgUnit1(new SuperOrdinateOrgUnit1());
        oneMDSContent.setSuperOrdinateOrgUnit2(new SuperOrdinateOrgUnit2());
        JobDetails jobDetails = OneMDSJobDetailsContentToRMJobDetailsTest.classUnderTest.convert(oneMDSContent,
                JobDetails.class);
        assertNotNull(jobDetails);
        assertNotNull(jobDetails.getId());
        assertNull(jobDetails.getSupervisorWorkAssignmentExternalID());
        assertNull(jobDetails.getCostCenter());
        assertNull(jobDetails.getLegalEntityExternalID());
        assertNull(jobDetails.getCountry());
        assertEquals(JOB_TITLE, jobDetails.getJobTitle());
        assertEquals(FTE_VALUE, jobDetails.getFte());
        assertNull(jobDetails.getStatus());
        assertNull(jobDetails.getJobExternalID());
        assertEquals(WORKING_HOURS_PER_WEEK, jobDetails.getWorkingDaysPerWeek());
        assertEquals(WORKING_HOURS_PER_DAYS, jobDetails.getWorkingHoursPerWeek());
        assertEquals(EVENT_SEQUENCE, jobDetails.getEventSequence());
        assertNull(jobDetails.getEvent());
        assertNull(jobDetails.getEventReason());
        assertNull(jobDetails.getOrgUnitExternalId());
        assertNull(jobDetails.getSuperOrdinateOrgUnit1ExternalId());
        assertNull(jobDetails.getSuperOrdinateOrgUnit2ExternalId());
    }

    @Test
    @DisplayName("test convert with nested fields as not null.")
    public void testConvertWithNestedFieldsAsNotNull() {
        Content___ oneMDSContent = new Content___();

        SupervisorWorkAssignment supervisorWorkAssignment = new SupervisorWorkAssignment();
        supervisorWorkAssignment.setExternalId(SUPER_VISOR_WORK_ASSIGNMENT_EXTERNAL_ID);
        oneMDSContent.setSupervisorWorkAssignment(supervisorWorkAssignment);
        CostCenter costCenter = new CostCenter();
        costCenter.setId(COST_CENTER_ID);
        oneMDSContent.setCostCenter(costCenter);
        LegalEntity legalEntity = new LegalEntity();
        legalEntity.setExternalId(LEGAL_EXTERNAL_ID);
        oneMDSContent.setLegalEntity(legalEntity);
        Country country = new Country();
        country.setCode(COUNTRY_CODE);
        oneMDSContent.setCountry(country);
        oneMDSContent.setJobTitle(JOB_TITLE);
        oneMDSContent.setFte(FTE_VALUE);
        Status status = new Status();
        status.setCode(STATUS_CODE);
        oneMDSContent.setStatus(status);
        Job job = new Job();
        job.setExternalId(JOB_EXTERNAL_ID);
        oneMDSContent.setJob(job);
        oneMDSContent.setWorkingDaysPerWeek(WORKING_HOURS_PER_WEEK);
        oneMDSContent.setWorkingHoursPerWeek(WORKING_HOURS_PER_DAYS);
        oneMDSContent.setEventSequence(EVENT_SEQUENCE);
        Event event = new Event();
        event.setCode(EVENT_CODE);
        oneMDSContent.setEvent(event);
        EventReason eventReason = new EventReason();
        eventReason.setCode(EVENT_REASON_CODE);
        oneMDSContent.setEventReason(eventReason);
        OrgUnit orgUnit = new OrgUnit();
        orgUnit.setExternalId(ORG_UNIT_EXTERNAL_ID);
        oneMDSContent.setOrgUnit(orgUnit);
        SuperOrdinateOrgUnit1 superOrdinateOrgUnit1 = new SuperOrdinateOrgUnit1();
        superOrdinateOrgUnit1.setExternalId(SUPER_ORDINATE_ORG_UNIT1_EXTERNAL_ID);
        oneMDSContent.setSuperOrdinateOrgUnit1(superOrdinateOrgUnit1);
        SuperOrdinateOrgUnit2 superOrdinateOrgUnit2 = new SuperOrdinateOrgUnit2();
        superOrdinateOrgUnit2.setExternalId(SUPER_ORDINATE_ORG_UNIT2_EXTERNAL_ID);
        oneMDSContent.setSuperOrdinateOrgUnit2(superOrdinateOrgUnit2);
        JobDetails jobDetails = OneMDSJobDetailsContentToRMJobDetailsTest.classUnderTest.convert(oneMDSContent,
                JobDetails.class);
        assertNotNull(jobDetails);
        assertNotNull(jobDetails.getId());
        assertEquals(SUPER_VISOR_WORK_ASSIGNMENT_EXTERNAL_ID, jobDetails.getSupervisorWorkAssignmentExternalID());
        assertEquals(COST_CENTER_ID, jobDetails.getCostCenterExternalID());
        assertEquals(LEGAL_EXTERNAL_ID, jobDetails.getLegalEntityExternalID());
        assertEquals(COUNTRY_CODE, jobDetails.getCountryCode());
        assertEquals(JOB_TITLE, jobDetails.getJobTitle());
        assertEquals(FTE_VALUE, jobDetails.getFte());
        assertEquals(STATUS_CODE, jobDetails.getStatusCode());
        assertEquals(JOB_EXTERNAL_ID, jobDetails.getJobExternalID());
        assertEquals(WORKING_HOURS_PER_WEEK, jobDetails.getWorkingDaysPerWeek());
        assertEquals(WORKING_HOURS_PER_DAYS, jobDetails.getWorkingHoursPerWeek());
        assertEquals(EVENT_SEQUENCE, jobDetails.getEventSequence());
        assertEquals(EVENT_CODE, jobDetails.getEventCode());
        assertEquals(EVENT_REASON_CODE, jobDetails.getEventReasonCode());
        assertEquals(ORG_UNIT_EXTERNAL_ID, jobDetails.getOrgUnitExternalId());
        assertEquals(SUPER_ORDINATE_ORG_UNIT1_EXTERNAL_ID, jobDetails.getSuperOrdinateOrgUnit1ExternalId());
        assertEquals(SUPER_ORDINATE_ORG_UNIT2_EXTERNAL_ID, jobDetails.getSuperOrdinateOrgUnit2ExternalId());
    }

    @Test
    @DisplayName("tests String value for BigDecimal fields")
    public void testConvertWithStringValueForBigDecimal() {
        Content___ oneMDSContent = new Content___();
        oneMDSContent.setFte(new BigDecimal("2.5"));
        oneMDSContent.setWorkingDaysPerWeek(BigDecimal.valueOf(Double.parseDouble("5.58")));
        oneMDSContent.setWorkingHoursPerWeek(new BigDecimal("42.8"));
        JobDetails jobDetails = OneMDSJobDetailsContentToRMJobDetailsTest.classUnderTest.convert(oneMDSContent,
            JobDetails.class);
        assert jobDetails != null;
        assertEquals(new BigDecimal("2.5"),jobDetails.getFte());
        assertEquals(new BigDecimal("5.58").setScale(2, BigDecimal.ROUND_HALF_UP), jobDetails.getWorkingDaysPerWeek());
        assertEquals(new BigDecimal("42.8"),jobDetails.getWorkingHoursPerWeek());
    }

    @Test
    @DisplayName("tests decimal and integer value for BigDecimal fields")
    public void testConvertWithDecimalandIntegerValueForBigDecimal() {
        Content___ oneMDSContent = new Content___();
        oneMDSContent.setFte(BigDecimal.valueOf(2.5));
        oneMDSContent.setWorkingDaysPerWeek(BigDecimal.valueOf(5.5));
        oneMDSContent.setWorkingHoursPerWeek(BigDecimal.valueOf(42));
        JobDetails jobDetails = OneMDSJobDetailsContentToRMJobDetailsTest.classUnderTest.convert(oneMDSContent,
            JobDetails.class);
        assert jobDetails != null;
        assertEquals(BigDecimal.valueOf(2.5),jobDetails.getFte());
        assertEquals(BigDecimal.valueOf(5.5),jobDetails.getWorkingDaysPerWeek());
        assertEquals(BigDecimal.valueOf(42),jobDetails.getWorkingHoursPerWeek());
    }

}
