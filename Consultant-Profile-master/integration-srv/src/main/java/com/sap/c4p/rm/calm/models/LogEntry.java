package com.sap.c4p.rm.calm.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

// @JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class LogEntry {
	
    /**
     * "ObjectType": "String” # type ID according to ODM
     */
    @JsonProperty("ObjectType")
    private String objectType;
    /**
     * "String” # an object UUID from MDI or empty (in case of sender error)
     */
    @JsonProperty("ObjectId")
    private String objectId;
    /**
     * "String” # an object version ID from MDI
     */
    @JsonProperty("ObjectVersionId")
    private String objectVersionId;
    /**
     * "LocalId": "String” # ID used for display purposes defined by the MDO provider
     */
    @JsonProperty("LocalId")
    private String localId;   
    //enumerated string
    /**
     * "Enum” # [SENT|SUCCESS|CONFIRMED|WARNING|FAILED]
     */
    @JsonProperty("Status")
    private LogEntryStatus status;
    /**
     * "String"
     */
    @JsonProperty("ErrorCode")
    private String errorCode;
    /**
     * "String” # a user readable error message in system / default language
     */
    @JsonProperty("ErrorMessage")
    private String errorMessage;

}