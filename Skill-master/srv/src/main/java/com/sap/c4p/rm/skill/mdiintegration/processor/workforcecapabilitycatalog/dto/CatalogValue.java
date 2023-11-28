package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "instance", "event", "versionId" })
public class CatalogValue implements Serializable {

  @JsonProperty("instance")
  private WorkforceCapabilityCatalog instance;
  @JsonProperty("event")
  private String event;
  @JsonProperty("versionId")
  private String versionId;
  @JsonProperty("instanceId")
  private String instanceId;

  private static final long serialVersionUID = -1943050404843860021L;

  @JsonProperty("event")
  public String getEvent() {
    return event;
  }

  @JsonProperty("event")
  public void setEvent(String event) {
    this.event = event;
  }

  @JsonProperty("versionId")
  public String getVersionId() {
    return versionId;
  }

  @JsonProperty("versionId")
  public void setVersionId(String versionId) {
    this.versionId = versionId;
  }

  @JsonProperty("instanceId")
  public String getInstanceId() {
    return instanceId;
  }

  @JsonProperty("instanceId")
  public void setInstanceId(String instanceId) {
    this.instanceId = instanceId;
  }

  @JsonProperty("instance")
  public WorkforceCapabilityCatalog getInstance() {
    return instance;
  }

  @JsonProperty("instance")
  public void setInstance(WorkforceCapabilityCatalog instance) {
    this.instance = instance;
  }

}
