
package com.sap.c4p.rm.processor.workforce.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "country", "number", "isDefault", "usage" })
public class Phone implements Serializable {

    @JsonProperty("country")
    private Country_ country;
    @JsonProperty("number")
    private String number;
    @JsonProperty("isDefault")
    private Boolean isDefault;
    @JsonProperty("usage")
    private Usage_ usage;

    private static final long serialVersionUID = 4314545461937102765L;

    @JsonProperty("country")
    public Country_ getCountry() {
        return country;
    }

    @JsonProperty("country")
    public void setCountry(Country_ country) {
        this.country = country;
    }

    @JsonProperty("number")
    public String getNumber() {
        return number;
    }

    @JsonProperty("number")
    public void setNumber(String number) {
        this.number = number;
    }

    @JsonProperty("isDefault")
    public Boolean getIsDefault() {
        return isDefault;
    }

    @JsonProperty("isDefault")
    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    @JsonProperty("usage")
    public Usage_ getUsage() {
        return usage;
    }

    @JsonProperty("usage")
    public void setUsage(Usage_ usage) {
        this.usage = usage;
    }

}
