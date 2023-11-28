
package com.sap.c4p.rm.processor.workforce.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "log", "nextDeltaToken", "hasMoreEvents" })
public class WorkforceLog implements Serializable {

    @JsonProperty("log")
    private List<Log> log = null;
    @JsonProperty("nextDeltaToken")
    private String nextDeltaToken;
    @JsonProperty("hasMoreEvents")
    private Boolean hasMoreEvents;

    private static final long serialVersionUID = -5209776673080554440L;

    @JsonProperty("log")
    public List<Log> getLog() {
        return log;
    }

    @JsonProperty("log")
    public void setLog(List<Log> log) {
        this.log = log;
    }

    @JsonProperty("nextDeltaToken")
    public String getNextDeltaToken() {
        return nextDeltaToken;
    }

    @JsonProperty("nextDeltaToken")
    public void setNextDeltaToken(String nextDeltaToken) {
        this.nextDeltaToken = nextDeltaToken;
    }

    @JsonProperty("hasMoreEvents")
    public Boolean getHasMoreEvents() {
        return hasMoreEvents;
    }

    @JsonProperty("hasMoreEvents")
    public void setHasMoreEvents(Boolean hasMoreEvents) {
        this.hasMoreEvents = hasMoreEvents;
    }

}
