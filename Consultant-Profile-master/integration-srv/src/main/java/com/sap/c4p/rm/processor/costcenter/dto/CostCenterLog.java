
package com.sap.c4p.rm.processor.costcenter.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "log", "nextDeltaToken", "hasMoreEvents" })
public class CostCenterLog {

    @JsonProperty("log")
    private List<Log> log = null;
    @JsonProperty("nextDeltaToken")
    private String nextDeltaToken;
    @JsonProperty("hasMoreEvents")
    private Boolean hasMoreEvents;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<>();

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

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

}
