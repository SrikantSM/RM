
package com.sap.c4p.rm.processor.workforce.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "formOfAddress" })
public class Content implements Serializable {

    @JsonProperty("formOfAddress")
    private FormOfAddress formOfAddress;

    private static final long serialVersionUID = -8125666601815253207L;

    @JsonProperty("formOfAddress")
    public FormOfAddress getFormOfAddress() {
        return formOfAddress;
    }

    @JsonProperty("formOfAddress")
    public void setFormOfAddress(FormOfAddress formOfAddress) {
        this.formOfAddress = formOfAddress;
    }

}
