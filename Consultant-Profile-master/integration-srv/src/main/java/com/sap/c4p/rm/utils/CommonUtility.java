package com.sap.c4p.rm.utils;

import java.time.LocalDate;

import com.sap.resourcemanagement.config.DefaultLanguages;

/**
 * Utility group common methods
 */
public interface CommonUtility {

    /**
     *
     * @param dateString : Input String and Should be of format 'yyyy-MM-dd'
     * @return LocalDate/Date Object
     */
    LocalDate toLocalDate(String dateString);

    /**
     *
     * Method to get the customer default language
     *
     * @return LocalDate/Date Object
     */
    DefaultLanguages getDefaultLanguage();

    boolean isValidJson(final String str);

	String convertBCPToISO(String bcpLanguageCode, String fieldName);
}
