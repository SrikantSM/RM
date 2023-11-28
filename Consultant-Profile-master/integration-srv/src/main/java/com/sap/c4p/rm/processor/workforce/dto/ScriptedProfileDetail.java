
package com.sap.c4p.rm.processor.workforce.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "birthName", "firstName", "middleName", "lastName", "formalName", "initials", "academicTitle",
        "additionalAcademicTitle", "preferredName", "businessFirstName", "businessLastName", "partnerName",
        "partnerNamePrefix", "secondLastName", "nameSuffix", "namePrefix" })
public class ScriptedProfileDetail implements Serializable {

    @JsonProperty("birthName")
    private String birthName;
    @JsonProperty("firstName")
    private String firstName;
    @JsonProperty("middleName")
    private String middleName;
    @JsonProperty("lastName")
    private String lastName;
    @JsonProperty("formalName")
    private String formalName;
    @JsonProperty("initials")
    private String initials;
    @JsonProperty("academicTitle")
    private AcademicTitle academicTitle;
    @JsonProperty("additionalAcademicTitle")
    private AdditionalAcademicTitle additionalAcademicTitle;
    @JsonProperty("preferredName")
    private String preferredName;
    @JsonProperty("businessFirstName")
    private String businessFirstName;
    @JsonProperty("businessLastName")
    private String businessLastName;
    @JsonProperty("partnerName")
    private String partnerName;
    @JsonProperty("partnerNamePrefix")
    private PartnerNamePrefix partnerNamePrefix;
    @JsonProperty("secondLastName")
    private String secondLastName;
    @JsonProperty("nameSuffix")
    private NameSuffix nameSuffix;
    @JsonProperty("namePrefix")
    private NamePrefix namePrefix;

    private static final long serialVersionUID = -4445570531361302937L;

    @JsonProperty("birthName")
    public String getBirthName() {
        return birthName;
    }

    @JsonProperty("birthName")
    public void setBirthName(String birthName) {
        this.birthName = birthName;
    }

    @JsonProperty("firstName")
    public String getFirstName() {
        return firstName;
    }

    @JsonProperty("firstName")
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @JsonProperty("middleName")
    public String getMiddleName() {
        return middleName;
    }

    @JsonProperty("middleName")
    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    @JsonProperty("lastName")
    public String getLastName() {
        return lastName;
    }

    @JsonProperty("lastName")
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @JsonProperty("formalName")
    public String getFormalName() {
        return formalName;
    }

    @JsonProperty("formalName")
    public void setFormalName(String formalName) {
        this.formalName = formalName;
    }

    @JsonProperty("initials")
    public String getInitials() {
        return initials;
    }

    @JsonProperty("initials")
    public void setInitials(String initials) {
        this.initials = initials;
    }

    @JsonProperty("academicTitle")
    public AcademicTitle getAcademicTitle() {
        return academicTitle;
    }

    @JsonProperty("academicTitle")
    public void setAcademicTitle(AcademicTitle academicTitle) {
        this.academicTitle = academicTitle;
    }

    @JsonProperty("additionalAcademicTitle")
    public AdditionalAcademicTitle getAdditionalAcademicTitle() {
        return additionalAcademicTitle;
    }

    @JsonProperty("additionalAcademicTitle")
    public void setAdditionalAcademicTitle(AdditionalAcademicTitle additionalAcademicTitle) {
        this.additionalAcademicTitle = additionalAcademicTitle;
    }

    @JsonProperty("preferredName")
    public String getPreferredName() {
        return preferredName;
    }

    @JsonProperty("preferredName")
    public void setPreferredName(String preferredName) {
        this.preferredName = preferredName;
    }

    @JsonProperty("businessFirstName")
    public String getBusinessFirstName() {
        return businessFirstName;
    }

    @JsonProperty("businessFirstName")
    public void setBusinessFirstName(String businessFirstName) {
        this.businessFirstName = businessFirstName;
    }

    @JsonProperty("businessLastName")
    public String getBusinessLastName() {
        return businessLastName;
    }

    @JsonProperty("businessLastName")
    public void setBusinessLastName(String businessLastName) {
        this.businessLastName = businessLastName;
    }

    @JsonProperty("partnerName")
    public String getPartnerName() {
        return partnerName;
    }

    @JsonProperty("partnerName")
    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    @JsonProperty("partnerNamePrefix")
    public PartnerNamePrefix getPartnerNamePrefix() {
        return partnerNamePrefix;
    }

    @JsonProperty("partnerNamePrefix")
    public void setPartnerNamePrefix(PartnerNamePrefix partnerNamePrefix) {
        this.partnerNamePrefix = partnerNamePrefix;
    }

    @JsonProperty("secondLastName")
    public String getSecondLastName() {
        return secondLastName;
    }

    @JsonProperty("secondLastName")
    public void setSecondLastName(String secondLastName) {
        this.secondLastName = secondLastName;
    }

    @JsonProperty("nameSuffix")
    public NameSuffix getNameSuffix() {
        return nameSuffix;
    }

    @JsonProperty("nameSuffix")
    public void setNameSuffix(NameSuffix nameSuffix) {
        this.nameSuffix = nameSuffix;
    }

    @JsonProperty("namePrefix")
    public NamePrefix getNamePrefix() {
        return namePrefix;
    }

    @JsonProperty("namePrefix")
    public void setNamePrefix(NamePrefix namePrefix) {
        this.namePrefix = namePrefix;
    }

}
