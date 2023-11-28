package com.sap.c4p.rm.utils;

import com.sap.c4p.rm.exceptions.MandatoryFieldException;

/**
 * Utility to group Converter Utilities
 */
public interface ConverterUtility {

    /**
     * Method to check if the required field is available or not
     *
     * @param fieldValue: Represents value received from oneDMS system/
     * @param field1:     Represents key name received from OneMDS/MDI System
     * @param field2:     object type under which the field is present
     * @param <T>:        same response type as {@param fieldValue}
     * @return return field value if not null else throws
     *         {@link MandatoryFieldException}
     */
    <T> T checkMandatory(final T fieldValue, final String field1, final String field2);

}
