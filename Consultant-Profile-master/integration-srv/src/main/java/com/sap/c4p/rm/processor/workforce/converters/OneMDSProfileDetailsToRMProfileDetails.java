package com.sap.c4p.rm.processor.workforce.converters;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.processor.workforce.dto.Content_;
import com.sap.c4p.rm.processor.workforce.dto.ProfileDetail;
import com.sap.c4p.rm.processor.workforce.dto.ScriptedProfileDetail;
import com.sap.c4p.rm.utils.CommonUtility;
import com.sap.c4p.rm.utils.IsNullCheckUtils;

import com.sap.resourcemanagement.workforce.workforceperson.ProfileDetails;

/**
 * This Converter will convert oneMDS {@link ProfileDetail} record to
 * Resource-Management {@link ProfileDetails} entity. Converter will throw
 * {@link ConversionFailedException} if conversion fails.
 */
@Component
public class OneMDSProfileDetailsToRMProfileDetails implements Converter<ProfileDetail, ProfileDetails> {

    private final CommonUtility commonUtility;

    @Autowired
    public OneMDSProfileDetailsToRMProfileDetails(final CommonUtility commonUtility) {
        this.commonUtility = commonUtility;
    }

    @Override
    public ProfileDetails convert(ProfileDetail oneMDSProfileDetail) {
        ProfileDetails profileDetail = ProfileDetails.create();
        profileDetail.setId(UUID.randomUUID().toString());
        String validFrom = oneMDSProfileDetail.getValidFrom();
        String validTo = oneMDSProfileDetail.getValidTo();
        profileDetail.setValidFrom(this.commonUtility.toLocalDate(validFrom));
        if (IsNullCheckUtils.isNullOrEmpty(validTo) && !IsNullCheckUtils.isNullOrEmpty(validFrom)) {
            validTo = "9999-12-31";
        }
        profileDetail.setValidTo(this.commonUtility.toLocalDate(validTo));

        Content_ profileDetailsContent;
        if ((profileDetailsContent = oneMDSProfileDetail.getContent()) != null) {
            List<ScriptedProfileDetail> scriptedProfileDetails;
            if ((scriptedProfileDetails = profileDetailsContent.getScriptedProfileDetails()) != null) {
                // First ScriptedProfile, also as aligned with S4/Hana
                ScriptedProfileDetail scriptedProfileDetail = scriptedProfileDetails.get(0);
                String firstName = scriptedProfileDetail.getFirstName();
                String lastName = scriptedProfileDetail.getLastName();
                profileDetail.setFirstName(firstName);
                profileDetail.setLastName(lastName);
                profileDetail.setFormalName(scriptedProfileDetail.getFormalName());
                if (firstName != null || lastName != null) {
                    profileDetail.setFullName(getFullName(firstName, lastName));
                    if (scriptedProfileDetail.getInitials() != null) {
                    	profileDetail.setInitials(scriptedProfileDetail.getInitials());
                    } else {
                    	profileDetail.setInitials(getInitials(firstName, lastName));
                    }
                }
            }
        }

        return profileDetail;
    }
    
    private String getFullName(String firstName, String lastName) {
    	if (firstName == null) return lastName;
    	else if (lastName == null) return firstName;
    	return firstName + " " + lastName;
    }
    
    private String getInitials(String firstName, String lastName) {
    	if (firstName == null) return lastName.substring(0,1).toUpperCase();
    	else if (lastName == null) return firstName.substring(0,1).toUpperCase();
    	return (firstName.substring(0,1) + lastName.substring(0,1)).toUpperCase();
    }

}
