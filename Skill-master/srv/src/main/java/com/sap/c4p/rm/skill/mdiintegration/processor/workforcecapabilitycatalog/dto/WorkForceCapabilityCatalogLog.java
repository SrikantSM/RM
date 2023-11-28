package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "@odata.context", "value", "@odata.deltalink", "@odata.nextLink" })
public class WorkForceCapabilityCatalogLog implements Serializable {

  @JsonProperty("@odata.context")
  private String odataContext;
  @JsonProperty("value")
  private List<CatalogValue> value = null;
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
  public List<CatalogValue> getValue() {
    return value;
  }

  @JsonProperty("value")
  public void setValue(List<CatalogValue> value) {
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
