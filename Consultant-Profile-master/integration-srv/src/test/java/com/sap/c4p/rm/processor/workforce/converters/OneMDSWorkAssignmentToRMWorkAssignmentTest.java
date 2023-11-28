package com.sap.c4p.rm.processor.workforce.converters;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.support.GenericConversionService;

import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.exceptions.MandatoryFieldException;
import com.sap.c4p.rm.processor.workforce.dto.WorkAssignment;
import com.sap.c4p.rm.utils.CommonUtility;
import com.sap.c4p.rm.utils.CommonUtilityImpl;
import com.sap.c4p.rm.utils.ConverterUtility;
import com.sap.c4p.rm.utils.ConverterUtilityImpl;

import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;
import com.sap.resourcemanagement.workforce.workforceperson.Emails;

public class OneMDSWorkAssignmentToRMWorkAssignmentTest {

    private static final ConverterUtility converterUtility = new ConverterUtilityImpl();
    private static final GenericConversionService classUnderTest = new GenericConversionService();

    @Mock
    private static PersistenceService persistenceService;

    @BeforeAll
    public static void setUpAll() {
        CommonUtility commonUtility = new CommonUtilityImpl(persistenceService);
        classUnderTest.addConverter(new OneMDSWorkAssignmentToRMWorkAssignment(commonUtility, converterUtility));
    }

    @Test
    @DisplayName("test convert if source is null.")
    public void testConvertIfSourceIsNull() {
        assertNull(classUnderTest.convert(null, Emails.class));
    }

    @Test
    @DisplayName("test convert with externalId as null.")
    public void testConvertWithExternalIdAsNull() {
        WorkAssignment oneMDSWorkAssignment = new WorkAssignment();
        oneMDSWorkAssignment.setExternalId(null);
        ConversionFailedException conversionFailedException = assertThrows(ConversionFailedException.class,
                () -> classUnderTest.convert(oneMDSWorkAssignment, WorkAssignments.class));
        MandatoryFieldException mandatoryFieldException = (MandatoryFieldException) conversionFailedException
                .getCause();
        List<String> mandatoryFieldExceptionParameters = mandatoryFieldException.getParameters();
        assertEquals(OneMDSWorkAssignmentToRMWorkAssignment.EXTERNAL_ID, mandatoryFieldExceptionParameters.get(0));
        assertEquals(OneMDSWorkAssignmentToRMWorkAssignment.WORK_ASSIGNMENT, mandatoryFieldExceptionParameters.get(1));
    }

    @Test
    @DisplayName("test convert with Id as null.")
    public void testConvertWithIdAsNull() {
        WorkAssignment oneMDSWorkAssignment = new WorkAssignment();
        oneMDSWorkAssignment.setExternalId(WorkAssignments.EXTERNAL_ID);
        oneMDSWorkAssignment.setId(null);
        ConversionFailedException conversionFailedException = assertThrows(ConversionFailedException.class,
                () -> classUnderTest.convert(oneMDSWorkAssignment, WorkAssignments.class));
        MandatoryFieldException mandatoryFieldException = (MandatoryFieldException) conversionFailedException
                .getCause();
        List<String> mandatoryFieldExceptionParameters = mandatoryFieldException.getParameters();
        assertEquals(OneMDSWorkAssignmentToRMWorkAssignment.WORK_ASSIGNMENT_ID,
                mandatoryFieldExceptionParameters.get(0));
        assertEquals(OneMDSWorkAssignmentToRMWorkAssignment.WORK_ASSIGNMENT, mandatoryFieldExceptionParameters.get(1));
    }

    @Test
    @DisplayName("test convert with startDate as null.")
    public void testConvertWithStartDateAsNull() {
        WorkAssignment oneMDSWorkAssignment = new WorkAssignment();
        oneMDSWorkAssignment.setExternalId(WorkAssignments.EXTERNAL_ID);
        oneMDSWorkAssignment.setId(WorkAssignments.WORK_ASSIGNMENT_ID);
        oneMDSWorkAssignment.setStartDate(null);
        ConversionFailedException conversionFailedException = assertThrows(ConversionFailedException.class,
                () -> classUnderTest.convert(oneMDSWorkAssignment, WorkAssignments.class));
        MandatoryFieldException mandatoryFieldException = (MandatoryFieldException) conversionFailedException
                .getCause();
        List<String> mandatoryFieldExceptionParameters = mandatoryFieldException.getParameters();
        assertEquals(OneMDSWorkAssignmentToRMWorkAssignment.START_DATE, mandatoryFieldExceptionParameters.get(0));
        assertEquals(OneMDSWorkAssignmentToRMWorkAssignment.WORK_ASSIGNMENT, mandatoryFieldExceptionParameters.get(1));
    }

    @Test
    @DisplayName("test convert with endDate as null.")
    public void testConvertWithEndDateAsNull() {
        WorkAssignment oneMDSWorkAssignment = new WorkAssignment();
        oneMDSWorkAssignment.setExternalId(WorkAssignments.EXTERNAL_ID);
        oneMDSWorkAssignment.setId(WorkAssignments.WORK_ASSIGNMENT_ID);
        oneMDSWorkAssignment.setStartDate("2020-01-01");
        oneMDSWorkAssignment.setEndDate(null);
        WorkAssignments rmWorkAssignments = classUnderTest.convert(oneMDSWorkAssignment, WorkAssignments.class);
        assertNotNull(rmWorkAssignments);
        assertEquals(WorkAssignments.EXTERNAL_ID, rmWorkAssignments.getExternalID());
        assertEquals(WorkAssignments.WORK_ASSIGNMENT_ID, rmWorkAssignments.getWorkAssignmentID());
        assertEquals("2020-01-01", rmWorkAssignments.getStartDate().toString());
        assertEquals("9999-12-31", rmWorkAssignments.getEndDate().toString());
        assertFalse(rmWorkAssignments.getIsContingentWorker());
    }

    @Test
    @DisplayName("test convert with same endDate and startDate.")
    public void testConvertWithEndDateAndIsContingentAsNotNull() {
        WorkAssignment oneMDSWorkAssignment = new WorkAssignment();
        oneMDSWorkAssignment.setExternalId(WorkAssignments.EXTERNAL_ID);
        oneMDSWorkAssignment.setId(WorkAssignments.WORK_ASSIGNMENT_ID);
        oneMDSWorkAssignment.setStartDate("2020-01-01");
        oneMDSWorkAssignment.setEndDate("2020-01-01");
        WorkAssignments rmWorkAssignments = classUnderTest.convert(oneMDSWorkAssignment, WorkAssignments.class);
        assertNotNull(rmWorkAssignments);
        assertEquals(WorkAssignments.EXTERNAL_ID, rmWorkAssignments.getExternalID());
        assertEquals(WorkAssignments.WORK_ASSIGNMENT_ID, rmWorkAssignments.getWorkAssignmentID());
        assertEquals("2020-01-01", rmWorkAssignments.getStartDate().toString());
        assertEquals("2020-01-01", rmWorkAssignments.getEndDate().toString());
        assertFalse(rmWorkAssignments.getIsContingentWorker());
    }

    @Test
    @DisplayName("test convert with IsContingent as true.")
    public void testConvertWithIsContingentAsTrue() {
        WorkAssignment oneMDSWorkAssignment = new WorkAssignment();
        oneMDSWorkAssignment.setExternalId(WorkAssignments.EXTERNAL_ID);
        oneMDSWorkAssignment.setId(WorkAssignments.WORK_ASSIGNMENT_ID);
        oneMDSWorkAssignment.setStartDate("2020-01-01");
        oneMDSWorkAssignment.setEndDate("2020-02-01");
        oneMDSWorkAssignment.setIsContingentWorker(Boolean.TRUE);
        WorkAssignments rmWorkAssignments = classUnderTest.convert(oneMDSWorkAssignment, WorkAssignments.class);
        assertNotNull(rmWorkAssignments);
        assertEquals(WorkAssignments.EXTERNAL_ID, rmWorkAssignments.getExternalID());
        assertEquals(WorkAssignments.WORK_ASSIGNMENT_ID, rmWorkAssignments.getWorkAssignmentID());
        assertEquals("2020-01-01", rmWorkAssignments.getStartDate().toString());
        assertEquals("2020-02-01", rmWorkAssignments.getEndDate().toString());
        assertTrue(rmWorkAssignments.getIsContingentWorker());
    }

    @Test
    @DisplayName("test convert with IsContingent as false.")
    public void testConvertWithIsContingentAsFalse() {
        WorkAssignment oneMDSWorkAssignment = new WorkAssignment();
        oneMDSWorkAssignment.setExternalId(WorkAssignments.EXTERNAL_ID);
        oneMDSWorkAssignment.setId(WorkAssignments.WORK_ASSIGNMENT_ID);
        oneMDSWorkAssignment.setStartDate("2020-01-01");
        oneMDSWorkAssignment.setEndDate("2020-02-01");
        oneMDSWorkAssignment.setIsContingentWorker(Boolean.FALSE);
        WorkAssignments rmWorkAssignments = classUnderTest.convert(oneMDSWorkAssignment, WorkAssignments.class);
        assertNotNull(rmWorkAssignments);
        assertEquals(WorkAssignments.EXTERNAL_ID, rmWorkAssignments.getExternalID());
        assertEquals(WorkAssignments.WORK_ASSIGNMENT_ID, rmWorkAssignments.getWorkAssignmentID());
        assertEquals("2020-01-01", rmWorkAssignments.getStartDate().toString());
        assertEquals("2020-02-01", rmWorkAssignments.getEndDate().toString());
        assertFalse(rmWorkAssignments.getIsContingentWorker());
    }

}
