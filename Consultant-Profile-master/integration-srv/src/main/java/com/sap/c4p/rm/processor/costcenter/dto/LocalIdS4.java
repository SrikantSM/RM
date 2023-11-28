
package com.sap.c4p.rm.processor.costcenter.dto;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "logicalSystem", "companyCode", "costCenterId", "controllingArea" })
public class LocalIdS4 {

    @JsonProperty("logicalSystem")
    private String logicalSystem;
    @JsonProperty("companyCode")
    private String companyCode;
    @JsonProperty("costCenterId")
    private String costCenterId;
    @JsonProperty("controllingArea")
    private String controllingArea;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<>();

    @JsonProperty("logicalSystem")
    public String getLogicalSystem() {
        return logicalSystem;
    }

    @JsonProperty("logicalSystem")
    public void setLogicalSystem(String logicalSystem) {
        this.logicalSystem = logicalSystem;
    }

    @JsonProperty("companyCode")
    public String getCompanyCode() {
        return companyCode;
    }

    @JsonProperty("companyCode")
    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    @JsonProperty("costCenterId")
    public String getCostCenterId() {
        return costCenterId;
    }

    @JsonProperty("costCenterId")
    public void setCostCenterId(String costCenterId) {
        this.costCenterId = costCenterId;
    }

    @JsonProperty("controllingArea")
    public String getControllingArea() {
        return controllingArea;
    }

    @JsonProperty("controllingArea")
    public void setControllingArea(String controllingArea) {
        this.controllingArea = controllingArea;
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
