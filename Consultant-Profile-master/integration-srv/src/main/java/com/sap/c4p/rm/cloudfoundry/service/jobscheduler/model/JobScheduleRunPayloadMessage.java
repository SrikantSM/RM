package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobScheduleRunPayloadMessage {

    @JsonProperty("errorCode")
    private final String errorCode;
    @JsonProperty("deltaToken")
    private final String deltaToken;
    @JsonProperty("message")
    private final String message;

    @Override
    public String toString() {
        return "{" +
            "errorCode: '" + errorCode + '\'' +
            ", deltaToken: '" + deltaToken + '\'' +
            ", message: '" + message + '\'' +
            '}';
    }
}
