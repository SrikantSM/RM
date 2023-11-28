package com.sap.c4p.rm.processor.workforce.converters;

import java.util.UUID;

import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.processor.workforce.dto.Country_;
import com.sap.c4p.rm.processor.workforce.dto.Phone;
import com.sap.c4p.rm.processor.workforce.dto.Usage_;

import com.sap.resourcemanagement.workforce.workforceperson.Phones;

/**
 * This Converter will convert oneMDS {@link Phone} record to
 * Resource-Management {@link Phones} entity. This Converter also checks if
 * record received from oneMDS have at least a default number. Converter will
 * throw {@link ConversionFailedException} if conversion fails.
 */
@Component
public class OneMDSPhonesToRMPhones implements Converter<Phone, Phones> {

    @Override
    public Phones convert(Phone oneMDSPhone) {
        Phones phone = Phones.create();
        phone.setId(UUID.randomUUID().toString());
        phone.setIsDefault(oneMDSPhone.getIsDefault());
        phone.setNumber(oneMDSPhone.getNumber());

        Usage_ phonesUsageCode;
        if ((phonesUsageCode = oneMDSPhone.getUsage()) != null)
            phone.setUsageCode(phonesUsageCode.getCode());

        Country_ phonesCountryCode;
        if ((phonesCountryCode = oneMDSPhone.getCountry()) != null)
            phone.setCountryCode(phonesCountryCode.getCode());

        return phone;
    }
}
