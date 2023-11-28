package com.sap.c4p.rm.processor.workforce.converters;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.processor.workforce.dto.Email;
import com.sap.c4p.rm.processor.workforce.dto.Usage;
import com.sap.c4p.rm.utils.ConverterUtility;

import com.sap.resourcemanagement.workforce.workforceperson.Emails;

/**
 * This Converter will convert oneMDS {@link Email} record to
 * Resource-Management {@link Emails} entity. This Converter also checks if
 * record received from oneMDS have at least a default email address. Converter
 * will throw {@link ConversionFailedException} if conversion fails.
 */
@Component
public class OneMDSEmailsToRMEmails implements Converter<Email, Emails> {

    public static final String EMAIL_ADDRESS = "Email Address";
    public static final String EMAIL_ARRAY = "Email Array";
    public static final String EMAIL_USAGE = "Email Usage";
    public static final String EMAIL_USAGE_CODE = "Email Usage Code";
    public static final String IS_DEFAULT = "IsDefault";

    private final ConverterUtility converterUtility;

    @Autowired
    public OneMDSEmailsToRMEmails(final ConverterUtility converterUtility) {
        this.converterUtility = converterUtility;
    }

    @Override
    public Emails convert(Email oneMDSEmail) {
        Emails email = Emails.create();
        email.setId(UUID.randomUUID().toString());
        email.setIsDefault(this.converterUtility.checkMandatory(oneMDSEmail.getIsDefault(), IS_DEFAULT, EMAIL_ARRAY));
        email.setAddress(this.converterUtility.checkMandatory(oneMDSEmail.getAddress(), EMAIL_ADDRESS, EMAIL_ARRAY));
        Usage emailUsageCode = this.converterUtility.checkMandatory(oneMDSEmail.getUsage(), EMAIL_USAGE, EMAIL_ARRAY);
        email.setUsageCode(
                this.converterUtility.checkMandatory(emailUsageCode.getCode(), EMAIL_USAGE_CODE, EMAIL_ARRAY));
        return email;
    }

}
