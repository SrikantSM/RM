package com.sap.c4p.rm.processor.workforce.converters;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Collections;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.core.convert.support.GenericConversionService;

import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.processor.workforce.dto.*;
import com.sap.c4p.rm.utils.CommonUtility;
import com.sap.c4p.rm.utils.CommonUtilityImpl;

import com.sap.resourcemanagement.workforce.workforceperson.Phones;
import com.sap.resourcemanagement.workforce.workforceperson.ProfileDetails;

public class OneMDSProfileDetailsToRMProfileDetailsTest {

    private static final String VALID_FROM_DATE = "2020-12-30";
    private static final String VALID_TO_DATE = "2020-12-31";
    private static final String DEFAULT_VALID_TO_DATE = "9999-12-31";
    private static final String INITIALS = "FL";
    private static final GenericConversionService classUnderTest = new GenericConversionService();

    @Mock
    private static PersistenceService persistenceService;

    @BeforeAll
    public static void setUpAll() {
        CommonUtility commonUtility = new CommonUtilityImpl(persistenceService);
        classUnderTest.addConverter(new OneMDSProfileDetailsToRMProfileDetails(commonUtility));
    }

    @Test
    @DisplayName("test convert if source is null.")
    public void testConvertIfSourceIsNull() {
        assertNull(OneMDSProfileDetailsToRMProfileDetailsTest.classUnderTest.convert(null, Phones.class));
    }

    @Test
    @DisplayName("test convert with null values.")
    public void testConvertWithNullValues() {
        ProfileDetail oneMDSProfileDetail = new ProfileDetail();
        oneMDSProfileDetail.setValidFrom(null);
        oneMDSProfileDetail.setValidTo(null);
        oneMDSProfileDetail.setContent(null);
        ProfileDetails profileDetail = OneMDSProfileDetailsToRMProfileDetailsTest.classUnderTest
                .convert(oneMDSProfileDetail, ProfileDetails.class);
        assertNotNull(profileDetail);
        assertNotNull(profileDetail.getId());
        assertNull(profileDetail.getFirstName());
        assertNull(profileDetail.getLastName());
        assertNull(profileDetail.getFormalName());
    }

    @Test
    @DisplayName("test convert with no content.")
    public void testConvertWithNoContent() {
        ProfileDetail oneMDSProfileDetail = new ProfileDetail();
        oneMDSProfileDetail.setValidFrom(VALID_FROM_DATE);
        oneMDSProfileDetail.setValidTo(VALID_TO_DATE);
        oneMDSProfileDetail.setContent(new Content_());
        ProfileDetails profileDetail = OneMDSProfileDetailsToRMProfileDetailsTest.classUnderTest
                .convert(oneMDSProfileDetail, ProfileDetails.class);
        assertNotNull(profileDetail);
        assertNotNull(profileDetail.getId());
        assertEquals(VALID_FROM_DATE, profileDetail.getValidFrom().toString());
        assertEquals(VALID_TO_DATE, profileDetail.getValidTo().toString());
        assertNull(profileDetail.getFirstName());
        assertNull(profileDetail.getLastName());
        assertNull(profileDetail.getFormalName());
        assertNull(profileDetail.getFullName());
        assertNull(profileDetail.getInitials());
    }

    @Test
    @DisplayName("test convert with no scripted profile.")
    public void testConvertWithNoScriptedProfile() {
        ProfileDetail oneMDSProfileDetail = new ProfileDetail();
        oneMDSProfileDetail.setValidFrom(VALID_FROM_DATE);
        oneMDSProfileDetail.setValidTo(VALID_TO_DATE);
        Content_ content = new Content_();
        content.setScriptedProfileDetails(Collections.singletonList(new ScriptedProfileDetail()));
        oneMDSProfileDetail.setContent(content);
        ProfileDetails profileDetail = OneMDSProfileDetailsToRMProfileDetailsTest.classUnderTest
                .convert(oneMDSProfileDetail, ProfileDetails.class);
        assertNotNull(profileDetail);
        assertNotNull(profileDetail.getId());
        assertEquals(VALID_FROM_DATE, profileDetail.getValidFrom().toString());
        assertEquals(VALID_TO_DATE, profileDetail.getValidTo().toString());
        assertNull(profileDetail.getFirstName());
        assertNull(profileDetail.getLastName());
        assertNull(profileDetail.getFormalName());
    }

    @Test
    @DisplayName("test convert with profile detail.")
    public void testConvertWithProfileDetail() {
        ProfileDetail oneMDSProfileDetail = new ProfileDetail();
        oneMDSProfileDetail.setValidFrom(VALID_FROM_DATE);
        oneMDSProfileDetail.setValidTo(VALID_TO_DATE);
        Content_ content = new Content_();
        ScriptedProfileDetail scriptedProfileDetail = new ScriptedProfileDetail();
        scriptedProfileDetail.setFirstName(ProfileDetails.FIRST_NAME);
        scriptedProfileDetail.setLastName(ProfileDetails.LAST_NAME);
        scriptedProfileDetail.setFormalName(ProfileDetails.FORMAL_NAME);
        content.setScriptedProfileDetails(Collections.singletonList(scriptedProfileDetail));
        oneMDSProfileDetail.setContent(content);
        ProfileDetails profileDetail = OneMDSProfileDetailsToRMProfileDetailsTest.classUnderTest
                .convert(oneMDSProfileDetail, ProfileDetails.class);
        assertNotNull(profileDetail);
        assertNotNull(profileDetail.getId());
        assertEquals(VALID_FROM_DATE, profileDetail.getValidFrom().toString());
        assertEquals(VALID_TO_DATE, profileDetail.getValidTo().toString());
        assertEquals(ProfileDetails.FIRST_NAME, profileDetail.getFirstName());
        assertEquals(ProfileDetails.LAST_NAME, profileDetail.getLastName());
        assertEquals(ProfileDetails.FORMAL_NAME, profileDetail.getFormalName());
        assertEquals(INITIALS, profileDetail.getInitials());
        assertEquals(profileDetail.getFirstName() + " " + profileDetail.getLastName(), profileDetail.getFullName());
    }

    @Test
    @DisplayName("test convert with profile detail with null valid to.")
    public void testConvertWithProfileDetailWithNullValidTo() {
    	ProfileDetail oneMDSProfileDetail = new ProfileDetail();
        oneMDSProfileDetail.setValidFrom(VALID_FROM_DATE);
        oneMDSProfileDetail.setValidTo(null);
        Content_ content = new Content_();
        ScriptedProfileDetail scriptedProfileDetail = new ScriptedProfileDetail();
        scriptedProfileDetail.setFirstName(ProfileDetails.FIRST_NAME);
        scriptedProfileDetail.setLastName(ProfileDetails.LAST_NAME);
        scriptedProfileDetail.setFormalName(ProfileDetails.FORMAL_NAME);
        content.setScriptedProfileDetails(Collections.singletonList(scriptedProfileDetail));
        oneMDSProfileDetail.setContent(content);
        ProfileDetails profileDetail = OneMDSProfileDetailsToRMProfileDetailsTest.classUnderTest
                .convert(oneMDSProfileDetail, ProfileDetails.class);
        assertNotNull(profileDetail);
        assertNotNull(profileDetail.getId());
        assertEquals(VALID_FROM_DATE, profileDetail.getValidFrom().toString());
        assertEquals(DEFAULT_VALID_TO_DATE, profileDetail.getValidTo().toString());
        assertEquals(ProfileDetails.FIRST_NAME, profileDetail.getFirstName());
        assertEquals(ProfileDetails.LAST_NAME, profileDetail.getLastName());
        assertEquals(ProfileDetails.FORMAL_NAME, profileDetail.getFormalName());
        assertEquals(INITIALS, profileDetail.getInitials());
        assertEquals(profileDetail.getFirstName() + " " + profileDetail.getLastName(), profileDetail.getFullName());
    }

    @Test
    @DisplayName("test convert with profile detail with empty valid to.")
    public void testConvertWithProfileDetailWithEmptyValidTo() {
    	ProfileDetail oneMDSProfileDetail = new ProfileDetail();
        oneMDSProfileDetail.setValidFrom(VALID_FROM_DATE);
        oneMDSProfileDetail.setValidTo("");
        Content_ content = new Content_();
        ScriptedProfileDetail scriptedProfileDetail = new ScriptedProfileDetail();
        scriptedProfileDetail.setFirstName(ProfileDetails.FIRST_NAME);
        scriptedProfileDetail.setLastName(ProfileDetails.LAST_NAME);
        scriptedProfileDetail.setFormalName(ProfileDetails.FORMAL_NAME);
        scriptedProfileDetail.setInitials(INITIALS);
        content.setScriptedProfileDetails(Collections.singletonList(scriptedProfileDetail));
        oneMDSProfileDetail.setContent(content);
        ProfileDetails profileDetail = OneMDSProfileDetailsToRMProfileDetailsTest.classUnderTest
                .convert(oneMDSProfileDetail, ProfileDetails.class);
        assertNotNull(profileDetail);
        assertNotNull(profileDetail.getId());
        assertEquals(VALID_FROM_DATE, profileDetail.getValidFrom().toString());
        assertEquals(DEFAULT_VALID_TO_DATE, profileDetail.getValidTo().toString());
        assertEquals(ProfileDetails.FIRST_NAME, profileDetail.getFirstName());
        assertEquals(ProfileDetails.LAST_NAME, profileDetail.getLastName());
        assertEquals(ProfileDetails.FORMAL_NAME, profileDetail.getFormalName());
        assertEquals(INITIALS, profileDetail.getInitials());
        assertEquals(profileDetail.getFirstName() + " " + profileDetail.getLastName(), profileDetail.getFullName());
    }
    
    @Test
    @DisplayName("test convert with profile detail with null first name.")
    public void testConvertWithProfileDetailWithNullFirstName() {
    	ProfileDetail oneMDSProfileDetail = new ProfileDetail();
        oneMDSProfileDetail.setValidFrom(VALID_FROM_DATE);
        oneMDSProfileDetail.setValidTo(null);
        Content_ content = new Content_();
        ScriptedProfileDetail scriptedProfileDetail = new ScriptedProfileDetail();
        scriptedProfileDetail.setFirstName(null);
        scriptedProfileDetail.setLastName(ProfileDetails.LAST_NAME);
        scriptedProfileDetail.setFormalName(ProfileDetails.FORMAL_NAME);
        content.setScriptedProfileDetails(Collections.singletonList(scriptedProfileDetail));
        oneMDSProfileDetail.setContent(content);
        ProfileDetails profileDetail = OneMDSProfileDetailsToRMProfileDetailsTest.classUnderTest
                .convert(oneMDSProfileDetail, ProfileDetails.class);
        assertNotNull(profileDetail);
        assertNotNull(profileDetail.getId());
        assertNull(profileDetail.getFirstName());
        assertEquals(VALID_FROM_DATE, profileDetail.getValidFrom().toString());
        assertEquals(DEFAULT_VALID_TO_DATE, profileDetail.getValidTo().toString());
        assertEquals(ProfileDetails.LAST_NAME, profileDetail.getLastName());
        assertEquals(ProfileDetails.FORMAL_NAME, profileDetail.getFormalName());
        assertEquals(ProfileDetails.LAST_NAME.substring(0,1).toUpperCase(), profileDetail.getInitials());
        assertEquals(ProfileDetails.LAST_NAME, profileDetail.getFullName());
    }
    
    @Test
    @DisplayName("test convert with profile detail with null last name.")
    public void testConvertWithProfileDetailWithNullLastName() {
    	ProfileDetail oneMDSProfileDetail = new ProfileDetail();
        oneMDSProfileDetail.setValidFrom(VALID_FROM_DATE);
        oneMDSProfileDetail.setValidTo(null);
        Content_ content = new Content_();
        ScriptedProfileDetail scriptedProfileDetail = new ScriptedProfileDetail();
        scriptedProfileDetail.setFirstName(ProfileDetails.FIRST_NAME);
        scriptedProfileDetail.setLastName(null);
        scriptedProfileDetail.setFormalName(ProfileDetails.FORMAL_NAME);
        content.setScriptedProfileDetails(Collections.singletonList(scriptedProfileDetail));
        oneMDSProfileDetail.setContent(content);
        ProfileDetails profileDetail = OneMDSProfileDetailsToRMProfileDetailsTest.classUnderTest
                .convert(oneMDSProfileDetail, ProfileDetails.class);
        assertNotNull(profileDetail);
        assertNotNull(profileDetail.getId());
        assertNull(profileDetail.getLastName());
        assertEquals(VALID_FROM_DATE, profileDetail.getValidFrom().toString());
        assertEquals(DEFAULT_VALID_TO_DATE, profileDetail.getValidTo().toString());
        assertEquals(ProfileDetails.FIRST_NAME, profileDetail.getFirstName());
        assertEquals(ProfileDetails.FORMAL_NAME, profileDetail.getFormalName());
        assertEquals(ProfileDetails.FIRST_NAME.substring(0,1).toUpperCase(), profileDetail.getInitials());
        assertEquals(ProfileDetails.FIRST_NAME, profileDetail.getFullName());
    }
    
    @Test
    @DisplayName("test convert with profile detail with null first name and last name.")
    public void testConvertWithProfileDetailWithNullFirstNameAndLastName() {
    	ProfileDetail oneMDSProfileDetail = new ProfileDetail();
        oneMDSProfileDetail.setValidFrom(VALID_FROM_DATE);
        oneMDSProfileDetail.setValidTo(null);
        Content_ content = new Content_();
        ScriptedProfileDetail scriptedProfileDetail = new ScriptedProfileDetail();
        scriptedProfileDetail.setFirstName(null);
        scriptedProfileDetail.setLastName(null);
        scriptedProfileDetail.setFormalName(ProfileDetails.FORMAL_NAME);
        content.setScriptedProfileDetails(Collections.singletonList(scriptedProfileDetail));
        oneMDSProfileDetail.setContent(content);
        ProfileDetails profileDetail = OneMDSProfileDetailsToRMProfileDetailsTest.classUnderTest
                .convert(oneMDSProfileDetail, ProfileDetails.class);
        assertNotNull(profileDetail);
        assertNotNull(profileDetail.getId());
        assertNull(profileDetail.getInitials());
        assertNull(profileDetail.getFullName());
        assertNull(profileDetail.getFirstName());
        assertNull(profileDetail.getLastName());
        assertEquals(VALID_FROM_DATE, profileDetail.getValidFrom().toString());
        assertEquals(DEFAULT_VALID_TO_DATE, profileDetail.getValidTo().toString());
        assertEquals(ProfileDetails.FORMAL_NAME, profileDetail.getFormalName());
    }

}
