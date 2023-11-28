package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "@odata.context", "value", "@odata.deltaLink", "@odata.nextLink" })
public class WorkforceCapabilityLog implements Serializable {

  @JsonProperty("value")
  private List<CapabilityValue> value = null;

  @JsonProperty("@odata.context")
  private String oDataContext;

  @JsonProperty("@odata.deltaLink")
  private String deltaLink;

  @JsonProperty("@odata.nextLink")
  private String nextLink;

  private static final long serialVersionUID = -5209776673080554440L;

  @JsonProperty("value")
  public List<CapabilityValue> getValue() {
    return value;
  }

  @JsonProperty("value")
  public void setValue(List<CapabilityValue> value) {
    this.value = value;
  }

  @JsonProperty("oDataContext")
  public String getODataContext() {
    return oDataContext;
  }

  @JsonProperty("oDataContext")
  public void setODataContext(String oDataContext) {
    this.oDataContext = oDataContext;
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
