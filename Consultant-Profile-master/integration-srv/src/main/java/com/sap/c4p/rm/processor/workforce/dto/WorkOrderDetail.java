
package com.sap.c4p.rm.processor.workforce.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "valid_from", "valid_to", "content" })
public class WorkOrderDetail implements Serializable {

    @JsonProperty("valid_from")
    private String validFrom;
    @JsonProperty("valid_to")
    private String validTo;
    @JsonProperty("content")
    private Content____ content;

    private static final long serialVersionUID = -2016471052306769914L;

    @JsonProperty("valid_from")
    public String getValidFrom() {
        return validFrom;
    }

    @JsonProperty("valid_from")
    public void setValidFrom(String validFrom) {
        this.validFrom = validFrom;
    }

    @JsonProperty("valid_to")
    public String getValidTo() {
        return validTo;
    }

    @JsonProperty("valid_to")
    public void setValidTo(String validTo) {
        this.validTo = validTo;
    }

    @JsonProperty("content")
    public Content____ getContent() {
        return content;
    }

    @JsonProperty("content")
    public void setContent(Content____ content) {
        this.content = content;
    }

}
