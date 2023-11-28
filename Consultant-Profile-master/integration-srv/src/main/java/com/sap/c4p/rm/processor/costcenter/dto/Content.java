
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
@JsonPropertyOrder({ "isBlockedForPrimaryPosting", "isBlockedForSecondaryPosting", "name", "description" })
public class Content {

    @JsonProperty("isBlockedForPrimaryPosting")
    private Boolean isBlockedForPrimaryPosting;
    @JsonProperty("isBlockedForSecondaryPosting")
    private Boolean isBlockedForSecondaryPosting;
    @JsonProperty("name")
    private List<Name> name = null;
    @JsonProperty("description")
    private List<Description> description = null;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<>();

    @JsonProperty("isBlockedForPrimaryPosting")
    public Boolean getIsBlockedForPrimaryPosting() {
        return isBlockedForPrimaryPosting;
    }

    @JsonProperty("isBlockedForPrimaryPosting")
    public void setIsBlockedForPrimaryPosting(Boolean isBlockedForPrimaryPosting) {
        this.isBlockedForPrimaryPosting = isBlockedForPrimaryPosting;
    }

    @JsonProperty("isBlockedForSecondaryPosting")
    public Boolean getIsBlockedForSecondaryPosting() {
        return isBlockedForSecondaryPosting;
    }

    @JsonProperty("isBlockedForSecondaryPosting")
    public void setIsBlockedForSecondaryPosting(Boolean isBlockedForSecondaryPosting) {
        this.isBlockedForSecondaryPosting = isBlockedForSecondaryPosting;
    }

    @JsonProperty("name")
    public List<Name> getName() {
        return name;
    }

    @JsonProperty("name")
    public void setName(List<Name> name) {
        this.name = name;
    }

    @JsonProperty("description")
    public List<Description> getDescription() {
        return description;
    }

    @JsonProperty("description")
    public void setDescription(List<Description> description) {
        this.description = description;
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
