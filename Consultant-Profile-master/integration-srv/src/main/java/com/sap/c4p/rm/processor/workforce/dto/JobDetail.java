
package com.sap.c4p.rm.processor.workforce.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "valid_to", "valid_from", "content" })
public class JobDetail implements Serializable {

    @JsonProperty("valid_to")
    private String validTo;
    @JsonProperty("valid_from")
    private String validFrom;
    @JsonProperty("content")
    private List<Content___> content = null;

    private static final long serialVersionUID = -1110757455208529605L;

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
    public List<Content___> getContent() {
        return content;
    }

    @JsonProperty("content")
    public void setContent(List<Content___> content) {
        this.content = content;
    }

}
