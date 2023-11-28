package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WorkForceCapabilityProficiencyScaleLog implements Serializable {

  @JsonProperty("@odata.context")
  private String odataContext;
  @JsonProperty("value")
  private List<ProficiencyValue> value = null;
  @JsonProperty("@odata.deltaLink")
  private String deltaLink;
  @JsonProperty("@odata.nextLink")
  private String nextLink;

  @JsonProperty("@odata.context")
  public String getOdataContext() {
    return odataContext;
  }

  @JsonProperty("@odata.context")
  public void setOdataContext(String odataContext) {
    this.odataContext = odataContext;
  }

  @JsonProperty("value")
  public List<ProficiencyValue> getValue() {
    return value;
  }

  @JsonProperty("value")
  public void setValue(List<ProficiencyValue> value) {
    this.value = value;
  }

  @JsonProperty("@odata.deltaLink")
  public String getDeltaLink() {
    return deltaLink;
  }

  @JsonProperty("@odata.deltaLink")
  public void setDeltaLink(String deltaLink) {
    this.deltaLink = deltaLink;
  }

  @JsonProperty("@odata.nextLink")
  public String getNextLink() {
    return nextLink;
  }

  @JsonProperty("@odata.nextLink")
  public void setNextLink(String nextLink) {
    this.nextLink = nextLink;
  }

}
