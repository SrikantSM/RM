package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WorkforceCapabilityTypeCodes implements Serializable {

  @JsonProperty("code")
  private String code;

  @JsonProperty("code")
  public String getCode() {
    return code;
  }

  @JsonProperty("code")
  public void setCode(String code) {
    this.code = code;
  }
}
