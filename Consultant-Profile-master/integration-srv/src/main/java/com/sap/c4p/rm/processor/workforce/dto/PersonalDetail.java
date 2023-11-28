
package com.sap.c4p.rm.processor.workforce.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "valid_to", "valid_from", "content" })
public class PersonalDetail implements Serializable {

    @JsonProperty("valid_to")
    private String validTo;
    @JsonProperty("valid_from")
    private String validFrom;
    @JsonProperty("content")
    private Content content;

    private static final long serialVersionUID = -1402348951610807579L;

    @JsonProperty("valid_to")
    public String getValidTo() {
        return validTo;
    }

    @JsonProperty("valid_to")
    public void setValidTo(String validTo) {
        this.validTo = validTo;
    }

    @JsonProperty("valid_from")
    public String getValidFrom() {
        return validFrom;
    }

    @JsonProperty("valid_from")
    public void setValidFrom(String validFrom) {
        this.validFrom = validFrom;
    }

    @JsonProperty("content")
    public Content getContent() {
        return content;
    }

    @JsonProperty("content")
    public void setContent(Content content) {
        this.content = content;
    }

}
