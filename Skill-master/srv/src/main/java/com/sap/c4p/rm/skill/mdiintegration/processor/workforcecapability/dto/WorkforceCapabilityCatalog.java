package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)

public class WorkforceCapabilityCatalog implements Serializable {

  @JsonProperty("id")
  private String id;

  @JsonProperty("id")
  public String getID() {
    return id;
  }

  @JsonProperty("id")
  public void setID(String id) {
    this.id = id;
  }
}
