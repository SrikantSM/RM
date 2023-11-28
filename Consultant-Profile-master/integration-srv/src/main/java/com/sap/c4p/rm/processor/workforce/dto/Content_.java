
package com.sap.c4p.rm.processor.workforce.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "scriptedProfileDetails" })
public class Content_ implements Serializable {

    @JsonProperty("scriptedProfileDetails")
    private List<ScriptedProfileDetail> scriptedProfileDetails = null;

    private static final long serialVersionUID = -3859931117342127177L;

    @JsonProperty("scriptedProfileDetails")
    public List<ScriptedProfileDetail> getScriptedProfileDetails() {
        return scriptedProfileDetails;
    }

    @JsonProperty("scriptedProfileDetails")
    public void setScriptedProfileDetails(List<ScriptedProfileDetail> scriptedProfileDetails) {
        this.scriptedProfileDetails = scriptedProfileDetails;
    }

}
