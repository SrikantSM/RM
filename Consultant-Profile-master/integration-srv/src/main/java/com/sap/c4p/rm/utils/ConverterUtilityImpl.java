package com.sap.c4p.rm.utils;

import org.springframework.stereotype.Component;

import com.sap.c4p.rm.exceptions.MandatoryFieldException;

/**
 * Class to implement {@link ConverterUtility}.
 */
@Component
public class ConverterUtilityImpl implements ConverterUtility {

    @Override
    public <T> T checkMandatory(final T fieldValue, final String field1, final String field2) {
        if (IsNullCheckUtils.isNullOrEmpty(fieldValue))
            throw new MandatoryFieldException(field1, field2);
        else
            return fieldValue;
    }

}
