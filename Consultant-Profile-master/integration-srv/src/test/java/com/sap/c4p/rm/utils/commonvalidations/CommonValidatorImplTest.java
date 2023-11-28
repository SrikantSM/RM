package com.sap.c4p.rm.utils.commonvalidations;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.InitMocks;

public class CommonValidatorImplTest extends InitMocks {

    @Mock
    PersistenceService mockPersistenceService;

    @Mock
    Result mockResult;

    @Mock
    Row mockRow;

    @Autowired
    @InjectMocks
    CommonValidatorImpl classUnderTest;

    @Test
    @DisplayName("Check if value of provided input contains forbidden characters")
    void testInvalidFreeTextforScripting() {
        final String value = "<script>";
        assertFalse(classUnderTest.validateFreeTextforScripting(value));
    }

    @Test
    @DisplayName("Check if value of provided input does not contain forbidden characters")
    void testValidFreeTextforScripting1() {
        final String value = "duyedfgyuedg";
        assertTrue(classUnderTest.validateFreeTextforScripting(value));
    }

    @Test
    @DisplayName("Check if value of provided input is null")
    void testValidFreeTextforScripting2() {
        assertTrue(classUnderTest.validateFreeTextforScripting(null));
    }

}
