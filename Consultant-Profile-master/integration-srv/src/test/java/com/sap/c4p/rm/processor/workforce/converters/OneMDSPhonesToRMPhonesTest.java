package com.sap.c4p.rm.processor.workforce.converters;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.convert.support.GenericConversionService;

import com.sap.c4p.rm.processor.workforce.dto.*;

import com.sap.resourcemanagement.workforce.workforceperson.Phones;

public class OneMDSPhonesToRMPhonesTest {

    private static final String COUNTRY_CODE = "IN";
    private static final String DUMMY_PHONE_NUMBER = "+91-123456789";
    private static final String USAGE_CODE = "usageCode";

    private static final GenericConversionService classUnderTest = new GenericConversionService();

    @BeforeAll
    public static void setUpAll() {
        classUnderTest.addConverter(new OneMDSPhonesToRMPhones());
    }

    @Test
    @DisplayName("test convert if source is null.")
    public void testConvertIfSourceIsNull() {
        assertNull(OneMDSPhonesToRMPhonesTest.classUnderTest.convert(null, Phones.class));
    }

    @Test
    @DisplayName("test convert with null values.")
    public void testConvertWithNullValues() {
        Phone oneMDSPhone = new Phone();
        oneMDSPhone.setIsDefault(null);
        oneMDSPhone.setNumber(null);
        oneMDSPhone.setUsage(null);
        oneMDSPhone.setCountry(null);
        Phones phones = OneMDSPhonesToRMPhonesTest.classUnderTest.convert(oneMDSPhone, Phones.class);
        assertNotNull(phones);
        assertNotNull(phones.getId());
        assertNull(phones.getIsDefault());
        assertNull(phones.getNumber());
        assertNull(phones.getUsageCode());
        assertNull(phones.getCountryCode());
    }

    @Test
    @DisplayName("test convert with nested fields as null.")
    public void testConvertWithNestedFieldsAsNull() {
        Phone oneMDSPhone = new Phone();
        oneMDSPhone.setIsDefault(Boolean.TRUE);
        oneMDSPhone.setNumber(DUMMY_PHONE_NUMBER);
        oneMDSPhone.setUsage(new Usage_());
        oneMDSPhone.setCountry(new Country_());
        Phones phones = OneMDSPhonesToRMPhonesTest.classUnderTest.convert(oneMDSPhone, Phones.class);
        assertNotNull(phones);
        assertNotNull(phones.getId());
        assertTrue(phones.getIsDefault());
        assertEquals(DUMMY_PHONE_NUMBER, phones.getNumber());
        assertNull(phones.getUsageCode());
        assertNull(phones.getCountryCode());
    }

    @Test
    @DisplayName("test convert with nested fields as not null.")
    public void testConvertWithNestedFieldsAsNotNull() {
        Phone oneMDSPhone = new Phone();
        oneMDSPhone.setIsDefault(Boolean.TRUE);
        oneMDSPhone.setNumber(DUMMY_PHONE_NUMBER);
        Usage_ usage = new Usage_();
        usage.setCode(USAGE_CODE);
        oneMDSPhone.setUsage(usage);
        Country_ country = new Country_();
        country.setCode(COUNTRY_CODE);
        oneMDSPhone.setCountry(country);
        Phones phones = OneMDSPhonesToRMPhonesTest.classUnderTest.convert(oneMDSPhone, Phones.class);
        assertNotNull(phones);
        assertNotNull(phones.getId());
        assertTrue(phones.getIsDefault());
        assertEquals(DUMMY_PHONE_NUMBER, phones.getNumber());
        assertEquals(USAGE_CODE, phones.getUsageCode());
        assertEquals(COUNTRY_CODE, phones.getCountryCode());
    }

}
