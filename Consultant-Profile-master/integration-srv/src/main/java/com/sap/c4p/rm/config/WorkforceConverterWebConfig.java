package com.sap.c4p.rm.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.sap.c4p.rm.processor.workforce.converters.*;

/**
 * A Configuration class to inform registry about the spring converters
 */
@Configuration
public class WorkforceConverterWebConfig implements WebMvcConfigurer {

    private final OneMDSEmailsToRMEmails oneMDSEmailsToRMEmails;
    private final OneMDSJobDetailsContentToRMJobDetails oneMDSJobDetailsContentToRMJobDetails;
    private final OneMDSPhonesToRMPhones oneMDSPhonesToRMPhones;
    private final OneMDSProfileDetailsToRMProfileDetails oneMDSProfileDetailsToRMProfileDetails;
    private final OneMDSSourceUserAccountsToRMSourceUserAccounts oneMDSSourceUserAccountsToRMSourceUserAccounts;
    private final OneMDSWorkAssignmentDetailsToRMWorkAssignmentDetails oneMDSWorkAssignmentDetailsToRMWorkAssignmentDetails;
    private final OneMDSWorkAssignmentToRMWorkAssignment oneMDSWorkAssignmentToRMWorkAssignment;

    @Autowired
    public WorkforceConverterWebConfig(final OneMDSEmailsToRMEmails oneMDSEmailsToRMEmails,
            final OneMDSJobDetailsContentToRMJobDetails oneMDSJobDetailsContentToRMJobDetails,
            final OneMDSPhonesToRMPhones oneMDSPhonesToRMPhones,
            final OneMDSProfileDetailsToRMProfileDetails oneMDSProfileDetailsToRMProfileDetails,
            final OneMDSSourceUserAccountsToRMSourceUserAccounts oneMDSSourceUserAccountsToRMSourceUserAccounts,
            final OneMDSWorkAssignmentDetailsToRMWorkAssignmentDetails oneMDSWorkAssignmentDetailsToRMWorkAssignmentDetails,
            final OneMDSWorkAssignmentToRMWorkAssignment oneMDSWorkAssignmentToRMWorkAssignment) {
        this.oneMDSEmailsToRMEmails = oneMDSEmailsToRMEmails;
        this.oneMDSJobDetailsContentToRMJobDetails = oneMDSJobDetailsContentToRMJobDetails;
        this.oneMDSPhonesToRMPhones = oneMDSPhonesToRMPhones;
        this.oneMDSProfileDetailsToRMProfileDetails = oneMDSProfileDetailsToRMProfileDetails;
        this.oneMDSSourceUserAccountsToRMSourceUserAccounts = oneMDSSourceUserAccountsToRMSourceUserAccounts;
        this.oneMDSWorkAssignmentDetailsToRMWorkAssignmentDetails = oneMDSWorkAssignmentDetailsToRMWorkAssignmentDetails;
        this.oneMDSWorkAssignmentToRMWorkAssignment = oneMDSWorkAssignmentToRMWorkAssignment;
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(this.oneMDSEmailsToRMEmails);
        registry.addConverter(this.oneMDSJobDetailsContentToRMJobDetails);
        registry.addConverter(this.oneMDSPhonesToRMPhones);
        registry.addConverter(this.oneMDSProfileDetailsToRMProfileDetails);
        registry.addConverter(this.oneMDSSourceUserAccountsToRMSourceUserAccounts);
        registry.addConverter(this.oneMDSWorkAssignmentDetailsToRMWorkAssignmentDetails);
        registry.addConverter(this.oneMDSWorkAssignmentToRMWorkAssignment);
    }

}
