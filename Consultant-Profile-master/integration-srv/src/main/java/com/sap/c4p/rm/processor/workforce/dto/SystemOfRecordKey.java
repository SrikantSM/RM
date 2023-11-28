
package com.sap.c4p.rm.processor.workforce.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "systemOfRecordId", "isCurrentSystemOfRecord", "systemOfRecordWorkAssignmentId",
        "workAssignmentExternalId" })
public class SystemOfRecordKey implements Serializable {

    @JsonProperty("systemOfRecordId")
    private String systemOfRecordId;
    @JsonProperty("isCurrentSystemOfRecord")
    private Boolean isCurrentSystemOfRecord;
    @JsonProperty("systemOfRecordWorkAssignmentId")
    private String systemOfRecordWorkAssignmentId;
    @JsonProperty("workAssignmentExternalId")
    private String workAssignmentExternalId;

    private static final long serialVersionUID = 4238141290367254015L;

    @JsonProperty("systemOfRecordId")
    public String getSystemOfRecordId() {
        return systemOfRecordId;
    }

    @JsonProperty("systemOfRecordId")
    public void setSystemOfRecordId(String systemOfRecordId) {
        this.systemOfRecordId = systemOfRecordId;
    }

    @JsonProperty("isCurrentSystemOfRecord")
    public Boolean getIsCurrentSystemOfRecord() {
        return isCurrentSystemOfRecord;
    }

    @JsonProperty("isCurrentSystemOfRecord")
    public void setIsCurrentSystemOfRecord(Boolean isCurrentSystemOfRecord) {
        this.isCurrentSystemOfRecord = isCurrentSystemOfRecord;
    }

    @JsonProperty("systemOfRecordWorkAssignmentId")
    public String getSystemOfRecordWorkAssignmentId() {
        return systemOfRecordWorkAssignmentId;
    }

    @JsonProperty("systemOfRecordWorkAssignmentId")
    public void setSystemOfRecordWorkAssignmentId(String systemOfRecordWorkAssignmentId) {
        this.systemOfRecordWorkAssignmentId = systemOfRecordWorkAssignmentId;
    }

    @JsonProperty("workAssignmentExternalId")
    public String getWorkAssignmentExternalId() {
        return workAssignmentExternalId;
    }

    @JsonProperty("workAssignmentExternalId")
    public void setWorkAssignmentExternalId(String workAssignmentExternalId) {
        this.workAssignmentExternalId = workAssignmentExternalId;
    }

}
