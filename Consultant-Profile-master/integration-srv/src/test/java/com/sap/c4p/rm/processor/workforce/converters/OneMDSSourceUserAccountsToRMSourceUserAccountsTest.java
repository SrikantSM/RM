package com.sap.c4p.rm.processor.workforce.converters;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.convert.support.GenericConversionService;

import com.sap.c4p.rm.processor.workforce.dto.*;

import com.sap.resourcemanagement.workforce.workforceperson.Phones;
import com.sap.resourcemanagement.workforce.workforceperson.SourceUserAccounts;

public class OneMDSSourceUserAccountsToRMSourceUserAccountsTest {

    private static final String DUMMY_USER_NAME = "dummyUserName";
    private static final GenericConversionService classUnderTest = new GenericConversionService();

    @BeforeAll
    public static void setUpAll() {
        classUnderTest.addConverter(new OneMDSSourceUserAccountsToRMSourceUserAccounts());
    }

    @Test
    @DisplayName("test convert if source is null.")
    public void testConvertIfSourceIsNull() {
        assertNull(OneMDSSourceUserAccountsToRMSourceUserAccountsTest.classUnderTest.convert(null, Phones.class));
    }

    @Test
    @DisplayName("test convert with null values.")
    public void testConvertWithNullValues() {
        UserAccount oneMDSUserAccount = new UserAccount();
        oneMDSUserAccount.setUserName(null);
        SourceUserAccounts sourceUserAccounts = OneMDSSourceUserAccountsToRMSourceUserAccountsTest.classUnderTest
                .convert(oneMDSUserAccount, SourceUserAccounts.class);
        assertNotNull(sourceUserAccounts);
        assertNotNull(sourceUserAccounts.getId());
        assertNull(sourceUserAccounts.getUserName());
    }

    @Test
    @DisplayName("test convert with user name.")
    public void testConvertWithUserName() {
        UserAccount oneMDSUserAccount = new UserAccount();
        oneMDSUserAccount.setUserName(DUMMY_USER_NAME);
        SourceUserAccounts sourceUserAccounts = OneMDSSourceUserAccountsToRMSourceUserAccountsTest.classUnderTest
                .convert(oneMDSUserAccount, SourceUserAccounts.class);
        assertNotNull(sourceUserAccounts);
        assertNotNull(sourceUserAccounts.getId());
        assertEquals(DUMMY_USER_NAME, sourceUserAccounts.getUserName());
    }

}
