
package com.sap.c4p.rm.processor.workforce.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "emails", "personalDetail", "profileDetail", "userAccount", "workAssignments",
        "systemOfRecordKeys", "externalId", "phones", "id" })
public class Instance implements Serializable {

    @JsonProperty("emails")
    private List<Email> emails = null;
    @JsonProperty("personalDetail")
    private List<PersonalDetail> personalDetail = null;
    @JsonProperty("profileDetail")
    private List<ProfileDetail> profileDetail = null;
    @JsonProperty("userAccount")
    private UserAccount userAccount;
    @JsonProperty("workAssignments")
    private List<WorkAssignment> workAssignments = null;
    @JsonProperty("systemOfRecordKeys")
    private List<SystemOfRecordKey> systemOfRecordKeys = null;
    @JsonProperty("externalId")
    private String externalId;
    @JsonProperty("phones")
    private List<Phone> phones = null;
    @JsonProperty("id")
    private String id;

    private static final long serialVersionUID = -4458838324309273444L;

    @JsonProperty("emails")
    public List<Email> getEmails() {
        return emails;
    }

    @JsonProperty("emails")
    public void setEmails(List<Email> emails) {
        this.emails = emails;
    }

    @JsonProperty("personalDetail")
    public List<PersonalDetail> getPersonalDetail() {
        return personalDetail;
    }

    @JsonProperty("personalDetail")
    public void setPersonalDetail(List<PersonalDetail> personalDetail) {
        this.personalDetail = personalDetail;
    }

    @JsonProperty("profileDetail")
    public List<ProfileDetail> getProfileDetail() {
        return profileDetail;
    }

    @JsonProperty("profileDetail")
    public void setProfileDetail(List<ProfileDetail> profileDetail) {
        this.profileDetail = profileDetail;
    }

    @JsonProperty("userAccount")
    public UserAccount getUserAccount() {
        return userAccount;
    }

    @JsonProperty("userAccount")
    public void setUserAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    @JsonProperty("workAssignments")
    public List<WorkAssignment> getWorkAssignments() {
        return workAssignments;
    }

    @JsonProperty("workAssignments")
    public void setWorkAssignments(List<WorkAssignment> workAssignments) {
        this.workAssignments = workAssignments;
    }

    @JsonProperty("systemOfRecordKeys")
    public List<SystemOfRecordKey> getSystemOfRecordKeys() {
        return systemOfRecordKeys;
    }

    @JsonProperty("systemOfRecordKeys")
    public void setSystemOfRecordKeys(List<SystemOfRecordKey> systemOfRecordKeys) {
        this.systemOfRecordKeys = systemOfRecordKeys;
    }

    @JsonProperty("externalId")
    public String getExternalId() {
        return externalId;
    }

    @JsonProperty("externalId")
    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    @JsonProperty("phones")
    public List<Phone> getPhones() {
        return phones;
    }

    @JsonProperty("phones")
    public void setPhones(List<Phone> phones) {
        this.phones = phones;
    }

    @JsonProperty("id")
    public String getId() {
        return id;
    }

    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

}
