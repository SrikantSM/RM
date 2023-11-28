package com.sap.c4p.rm.utils.commonvalidations;

/**
 * Utility to validate common scenarios
 */
public interface CommonValidator {

    /**
     * Validates if the free text is clean of cross site scripting
     *
     * @param value: free text value
     * @return : boolean which denotes whether the value is clean
     */
    boolean validateFreeTextforScripting(final String value);

}
