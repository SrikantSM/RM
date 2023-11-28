package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public class WorkforceCapabilityProficiencyScaleStatusCodes implements Serializable {

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
