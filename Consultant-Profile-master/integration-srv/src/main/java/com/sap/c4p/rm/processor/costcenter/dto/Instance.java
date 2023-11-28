
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
@JsonPropertyOrder({ "displayName", "localIdS4", "isValid", "attributes", "id" })
public class Instance {

    @JsonProperty("displayName")
    private String displayName;
    @JsonProperty("localIdS4")
    private LocalIdS4 localIdS4;
    @JsonProperty("isValid")
    private List<IsValid> isValid = null;
    @JsonProperty("attributes")
    private List<Attribute> attributes = null;
    @JsonProperty("id")
    private String id;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<>();

    @JsonProperty("displayName")
    public String getDisplayName() {
        return displayName;
    }

    @JsonProperty("displayName")
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    @JsonProperty("localIdS4")
    public LocalIdS4 getLocalIdS4() {
        return localIdS4;
    }

    @JsonProperty("localIdS4")
    public void setLocalIdS4(LocalIdS4 localIdS4) {
        this.localIdS4 = localIdS4;
    }

    @JsonProperty("isValid")
    public List<IsValid> getIsValid() {
        return isValid;
    }

    @JsonProperty("isValid")
    public void setIsValid(List<IsValid> isValid) {
        this.isValid = isValid;
    }

    @JsonProperty("attributes")
    public List<Attribute> getAttributes() {
        return attributes;
    }

    @JsonProperty("attributes")
    public void setAttributes(List<Attribute> attributes) {
        this.attributes = attributes;
    }

    @JsonProperty("id")
    public String getId() {
        return id;
    }

    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
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
