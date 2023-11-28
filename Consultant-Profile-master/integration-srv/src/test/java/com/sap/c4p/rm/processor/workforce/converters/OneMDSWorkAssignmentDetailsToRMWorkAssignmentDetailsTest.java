package com.sap.c4p.rm.processor.workforce.converters;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.core.convert.support.GenericConversionService;

import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.processor.workforce.dto.*;
import com.sap.c4p.rm.utils.CommonUtility;
import com.sap.c4p.rm.utils.CommonUtilityImpl;

import com.sap.resourcemanagement.workforce.workassignment.WorkAssignmentDetails;
import com.sap.resourcemanagement.workforce.workforceperson.Phones;

public class OneMDSWorkAssignmentDetailsToRMWorkAssignmentDetailsTest {

    private static final String VALID_FROM_DATE = "2020-12-30";
    private static final String VALID_TO_DATE = "2020-12-31";
    private static final String DEFAULT_VALID_TO_DATE = "9999-12-31";
    private static final GenericConversionService classUnderTest = new GenericConversionService();

    @Mock
    private static PersistenceService persistenceService;

    @BeforeAll
    public static void setUpAll() {
        CommonUtility commonUtility = new CommonUtilityImpl(persistenceService);
        classUnderTest.addConverter(new OneMDSWorkAssignmentDetailsToRMWorkAssignmentDetails(commonUtility));
    }

    @Test
    @DisplayName("test convert if source is null.")
    public void testConvertIfSourceIsNull() {
        assertNull(OneMDSWorkAssignmentDetailsToRMWorkAssignmentDetailsTest.classUnderTest.convert(null, Phones.class));
    }

    @Test
    @DisplayName("test convert with null values.")
    public void testConvertWithNullValues() {
        Detail oneMDSDetails = new Detail();
        oneMDSDetails.setValidFrom(null);
        oneMDSDetails.setValidTo(null);
        oneMDSDetails.setContent(null);
        WorkAssignmentDetails workAssignmentDetails = OneMDSWorkAssignmentDetailsToRMWorkAssignmentDetailsTest.classUnderTest
                .convert(oneMDSDetails, WorkAssignmentDetails.class);
        assertNotNull(workAssignmentDetails);
        assertNotNull(workAssignmentDetails.getId());
        assertNull(workAssignmentDetails.getValidFrom());
        assertNull(workAssignmentDetails.getValidTo());
        assertNull(workAssignmentDetails.getIsPrimary());
    }

    @Test
    @DisplayName("test convert with no content.")
    public void testConvertWithNoContent() {
        Detail oneMDSDetails = new Detail();
        oneMDSDetails.setValidFrom(VALID_FROM_DATE);
        oneMDSDetails.setValidTo(VALID_TO_DATE);
        oneMDSDetails.setContent(new Content__());
        WorkAssignmentDetails workAssignmentDetails = OneMDSWorkAssignmentDetailsToRMWorkAssignmentDetailsTest.classUnderTest
                .convert(oneMDSDetails, WorkAssignmentDetails.class);
        assertNotNull(workAssignmentDetails);
        assertNotNull(workAssignmentDetails.getId());
        assertEquals(VALID_FROM_DATE, workAssignmentDetails.getValidFrom().toString());
        assertEquals(VALID_TO_DATE, workAssignmentDetails.getValidTo().toString());
        assertNull(workAssignmentDetails.getIsPrimary());
    }

    @Test
    @DisplayName("test convert with no content and null valid to.")
    public void testConvertWithNoContentAndNullValidTo() {
        Detail oneMDSDetails = new Detail();
        oneMDSDetails.setValidFrom(VALID_FROM_DATE);
        oneMDSDetails.setValidTo(null);
        oneMDSDetails.setContent(new Content__());
        WorkAssignmentDetails workAssignmentDetails = OneMDSWorkAssignmentDetailsToRMWorkAssignmentDetailsTest.classUnderTest
                .convert(oneMDSDetails, WorkAssignmentDetails.class);
        assertNotNull(workAssignmentDetails);
        assertNotNull(workAssignmentDetails.getId());
        assertEquals(VALID_FROM_DATE, workAssignmentDetails.getValidFrom().toString());
        assertEquals(DEFAULT_VALID_TO_DATE, workAssignmentDetails.getValidTo().toString());
        assertNull(workAssignmentDetails.getIsPrimary());
    }

    @Test
    @DisplayName("test convert with no content and empty valid to.")
    public void testConvertWithNoContentAndEmptyValidTo() {
        Detail oneMDSDetails = new Detail();
        oneMDSDetails.setValidFrom(VALID_FROM_DATE);
        oneMDSDetails.setValidTo("");
        oneMDSDetails.setContent(new Content__());
        WorkAssignmentDetails workAssignmentDetails = OneMDSWorkAssignmentDetailsToRMWorkAssignmentDetailsTest.classUnderTest
                .convert(oneMDSDetails, WorkAssignmentDetails.class);
        assertNotNull(workAssignmentDetails);
        assertNotNull(workAssignmentDetails.getId());
        assertEquals(VALID_FROM_DATE, workAssignmentDetails.getValidFrom().toString());
        assertEquals(DEFAULT_VALID_TO_DATE, workAssignmentDetails.getValidTo().toString());
        assertNull(workAssignmentDetails.getIsPrimary());
    }

    @Test
    @DisplayName("test convert with content.")
    public void testConvertWithNoScriptedProfile() {
        Detail oneMDSDetails = new Detail();
        oneMDSDetails.setValidFrom(VALID_FROM_DATE);
        oneMDSDetails.setValidTo(VALID_TO_DATE);
        Content__ content = new Content__();
        content.setIsPrimary(Boolean.TRUE);
        oneMDSDetails.setContent(content);
        WorkAssignmentDetails workAssignmentDetails = OneMDSWorkAssignmentDetailsToRMWorkAssignmentDetailsTest.classUnderTest
                .convert(oneMDSDetails, WorkAssignmentDetails.class);
        assertNotNull(workAssignmentDetails);
        assertNotNull(workAssignmentDetails.getId());
        assertEquals(VALID_FROM_DATE, workAssignmentDetails.getValidFrom().toString());
        assertEquals(VALID_TO_DATE, workAssignmentDetails.getValidTo().toString());
        assertTrue(workAssignmentDetails.getIsPrimary());
    }

}
