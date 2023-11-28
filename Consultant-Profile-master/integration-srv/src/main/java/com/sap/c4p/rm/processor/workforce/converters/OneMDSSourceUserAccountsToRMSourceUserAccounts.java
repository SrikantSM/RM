package com.sap.c4p.rm.processor.workforce.converters;

import java.util.UUID;

import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.processor.workforce.dto.UserAccount;

import com.sap.resourcemanagement.workforce.workforceperson.SourceUserAccounts;

/**
 * This Converter will convert oneMDS {@link UserAccount} record to
 * Resource-Management {@link SourceUserAccounts} entity. Converter will throw
 * {@link ConversionFailedException} if conversion fails.
 */
@Component
public class OneMDSSourceUserAccountsToRMSourceUserAccounts implements Converter<UserAccount, SourceUserAccounts> {

    @Override
    public SourceUserAccounts convert(UserAccount oneMDSUserAccount) {
        SourceUserAccounts workforceSourceUserAccounts = SourceUserAccounts.create();
        workforceSourceUserAccounts.setId(UUID.randomUUID().toString());
        workforceSourceUserAccounts.setUserName(oneMDSUserAccount.getUserName());
        return workforceSourceUserAccounts;
    }

}
