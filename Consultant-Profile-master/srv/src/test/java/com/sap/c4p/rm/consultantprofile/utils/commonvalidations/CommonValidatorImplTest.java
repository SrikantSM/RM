package com.sap.c4p.rm.consultantprofile.utils.commonvalidations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.InitMocks;

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
    @DisplayName("Check if value of provided input exists in foreign table")
    void testCheckIfForeignKeyValueExists() {
        final String dbArtifactName = "dummyDBArtifactName";
        final String fieldName = "dummyFieldName";
        final String value = UUID.randomUUID().toString();
        Optional<Row> newRow = Optional.of(mockRow);
        when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first()).thenReturn(newRow);
        assertTrue(classUnderTest.checkInputValueExistingDB(dbArtifactName, fieldName, value));
    }

    @Test
    @DisplayName("Check if value of provided input contains forbidden characters")
    void testInvalidFreeTextforScripting() {
        final String value = "<script>";
        assertFalse(classUnderTest.validateFreeTextforScripting(value));
    }

    @Test
    @DisplayName("Check if value of provided input is blank or null")
    void testIsBlank() {
        final String value = "    ";
        assertTrue(classUnderTest.isBlank(value));
        assertTrue(classUnderTest.isBlank(null));
    }

    @Test
    @DisplayName("Check if value of provided input does not exists in foreign table")
    void testCheckIfForeignKeyValueDoesNotExists() {
        final String dbArtifactName = "dummyDBArtifactName";
        final String fieldName = "dummyFieldName";
        final String value = UUID.randomUUID().toString();
        Optional<Row> newRow = Optional.empty();
        when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first()).thenReturn(newRow);
        assertFalse(classUnderTest.checkInputValueExistingDB(dbArtifactName, fieldName, value));
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
        assertTrue(classUnderTest.isBlank(null));
    }

    @Test
    @DisplayName("Check if value of provided input is not blank or null")
    void testIsNotBlank() {
        final String value = "abc d";
        assertFalse(classUnderTest.isBlank(value));
    }

    @Test
    @DisplayName("Check If length of input GUID Field is less than 36")
    void checkInputGuidFieldLengthWhenStringIsOfLessThan36() {
        final String inputValueToBeTested = "randomString";
        final String inputValueToBeTestedWithOnlyWhiteSpaces = "     ";
        assertFalse(classUnderTest.checkInputGuidFieldLength(inputValueToBeTested));
        assertFalse(classUnderTest.checkInputGuidFieldLength(inputValueToBeTestedWithOnlyWhiteSpaces));
    }

    @Test
    @DisplayName("Check If length of input GUID Field is equal 36")
    void checkInputGuidFieldLengthWhenStringIsOfEqualTO36() {
        final String inputValueToBeTested = "randomStringRandomStringRandomString";
        final String inputValueToBeTestedWithOnlyWhiteSpaces = "                                    ";
        assertFalse(classUnderTest.checkInputGuidFieldLength(inputValueToBeTested));
        assertFalse(classUnderTest.checkInputGuidFieldLength(inputValueToBeTestedWithOnlyWhiteSpaces));
    }

    @Test
    @DisplayName("Check If length of input GUID Field is greater than 36")
    void checkInputGuidFieldLengthWhenStringIsOfGreaterThan36() {
        final String inputValueToBeTested = "randomStringRandomStringRandomStringRandomString";
        final String inputValueToBeTestedWithOnlyWhiteSpaces = "                                                                  ";
        assertTrue(classUnderTest.checkInputGuidFieldLength(inputValueToBeTested));
        assertTrue(classUnderTest.checkInputGuidFieldLength(inputValueToBeTestedWithOnlyWhiteSpaces));
    }

}
