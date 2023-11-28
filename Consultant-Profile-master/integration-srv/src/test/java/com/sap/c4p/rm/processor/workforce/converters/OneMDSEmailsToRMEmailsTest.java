package com.sap.c4p.rm.processor.workforce.converters;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.support.GenericConversionService;

import com.sap.c4p.rm.exceptions.MandatoryFieldException;
import com.sap.c4p.rm.processor.workforce.dto.Email;
import com.sap.c4p.rm.processor.workforce.dto.Usage;
import com.sap.c4p.rm.utils.ConverterUtility;
import com.sap.c4p.rm.utils.ConverterUtilityImpl;

import com.sap.resourcemanagement.workforce.workforceperson.Emails;

public class OneMDSEmailsToRMEmailsTest {

    private static final String DUMMY_EMAIL = "dummyEmail@sap.com";
    private static final String USAGE_CODE = "usageCode";

    private static final ConverterUtility converterUtility = new ConverterUtilityImpl();
    private static final GenericConversionService classUnderTest = new GenericConversionService();

    @BeforeAll
    public static void setUpAll() {
        classUnderTest.addConverter(new OneMDSEmailsToRMEmails(converterUtility));
    }

    @Test
    @DisplayName("test convert if source is null.")
    public void testConvertIfSourceIsNull() {
        assertNull(classUnderTest.convert(null, Emails.class));
    }

    @Test
    @DisplayName("test convert with isDefault as null.")
    public void testConvertWithIsDefaultAsNull() {
        Email oneMDSEmail = new Email();
        oneMDSEmail.setIsDefault(null);
        ConversionFailedException conversionFailedException = assertThrows(ConversionFailedException.class,
                () -> classUnderTest.convert(oneMDSEmail, Emails.class));
        MandatoryFieldException mandatoryFieldException = (MandatoryFieldException) conversionFailedException
                .getCause();
        List<String> mandatoryFieldExceptionParameters = mandatoryFieldException.getParameters();
        assertEquals(OneMDSEmailsToRMEmails.IS_DEFAULT, mandatoryFieldExceptionParameters.get(0));
        assertEquals(OneMDSEmailsToRMEmails.EMAIL_ARRAY, mandatoryFieldExceptionParameters.get(1));
    }

    @Test
    @DisplayName("test convert with email address as null.")
    public void testConvertWithEmailAddressAsNull() {
        Email oneMDSEmail = new Email();
        oneMDSEmail.setIsDefault(Boolean.TRUE);
        oneMDSEmail.setAddress(null);
        ConversionFailedException conversionFailedException = assertThrows(ConversionFailedException.class,
                () -> OneMDSEmailsToRMEmailsTest.classUnderTest.convert(oneMDSEmail, Emails.class));
        MandatoryFieldException mandatoryFieldException = (MandatoryFieldException) conversionFailedException
                .getCause();
        List<String> mandatoryFieldExceptionParameters = mandatoryFieldException.getParameters();
        assertEquals(OneMDSEmailsToRMEmails.EMAIL_ADDRESS, mandatoryFieldExceptionParameters.get(0));
        assertEquals(OneMDSEmailsToRMEmails.EMAIL_ARRAY, mandatoryFieldExceptionParameters.get(1));
    }

    @Test
    @DisplayName("test convert with usage object as null.")
    public void testConvertWithUsageCodeObjectAsNull() {
        Email oneMDSEmail = new Email();
        oneMDSEmail.setIsDefault(Boolean.TRUE);
        oneMDSEmail.setAddress(DUMMY_EMAIL);
        oneMDSEmail.setUsage(null);
        ConversionFailedException conversionFailedException = assertThrows(ConversionFailedException.class,
                () -> OneMDSEmailsToRMEmailsTest.classUnderTest.convert(oneMDSEmail, Emails.class));
        MandatoryFieldException mandatoryFieldException = (MandatoryFieldException) conversionFailedException
                .getCause();
        List<String> mandatoryFieldExceptionParameters = mandatoryFieldException.getParameters();
        assertEquals(OneMDSEmailsToRMEmails.EMAIL_USAGE, mandatoryFieldExceptionParameters.get(0));
        assertEquals(OneMDSEmailsToRMEmails.EMAIL_ARRAY, mandatoryFieldExceptionParameters.get(1));
    }

    @Test
    @DisplayName("test convert with no usage code.")
    public void testConvertWithNoUsageCode() {
        Email oneMDSEmail = new Email();
        oneMDSEmail.setIsDefault(Boolean.TRUE);
        oneMDSEmail.setAddress(DUMMY_EMAIL);
        Usage usage = new Usage();
        oneMDSEmail.setUsage(usage);
        ConversionFailedException conversionFailedException = assertThrows(ConversionFailedException.class,
                () -> OneMDSEmailsToRMEmailsTest.classUnderTest.convert(oneMDSEmail, Emails.class));
        MandatoryFieldException mandatoryFieldException = (MandatoryFieldException) conversionFailedException
                .getCause();
        List<String> mandatoryFieldExceptionParameters = mandatoryFieldException.getParameters();
        assertEquals(OneMDSEmailsToRMEmails.EMAIL_USAGE_CODE, mandatoryFieldExceptionParameters.get(0));
        assertEquals(OneMDSEmailsToRMEmails.EMAIL_ARRAY, mandatoryFieldExceptionParameters.get(1));
    }

    @Test
    @DisplayName("test convert.")
    public void testConvert() {
        Email oneMDSEmail = new Email();
        oneMDSEmail.setIsDefault(Boolean.TRUE);
        oneMDSEmail.setAddress(DUMMY_EMAIL);
        Usage emailUsageCode = new Usage();
        emailUsageCode.setCode(USAGE_CODE);
        oneMDSEmail.setUsage(emailUsageCode);
        Emails rmEmail = OneMDSEmailsToRMEmailsTest.classUnderTest.convert(oneMDSEmail, Emails.class);
        assertNotNull(rmEmail);
        assertNotNull(rmEmail.getId());
        assertTrue(rmEmail.getIsDefault());
        assertEquals(DUMMY_EMAIL, rmEmail.getAddress());
        assertEquals(USAGE_CODE, rmEmail.getUsageCode());
        assertNull(rmEmail.getParent());
    }

}
