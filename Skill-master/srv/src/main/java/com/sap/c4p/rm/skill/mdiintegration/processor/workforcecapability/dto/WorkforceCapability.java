package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "id", "name", "description", "proficiencyScale" })
public class WorkforceCapability implements Serializable {

  @JsonProperty("id")
  private String id;

  @JsonProperty("name")
  private List<Name> name;

  @JsonProperty("description")
  private List<Description> description;

  @JsonProperty("proficiencyScale")
  private WorkforceCapabilityProficiencyScale proficiencyScale;

  @JsonProperty("catalogAssignment")
  private List<WorkforceCapabilityCatalogAssignment> catalogAssignment;

  @JsonProperty("capabilityType")
  private WorkforceCapabilityTypeCodes capabilityType;

  @JsonProperty("status")
  private WorkforceCapabilityStatusCodes status;

  @JsonProperty("id")
  public String getid() {
    return id;
  }

  @JsonProperty("id")
  public void setid(String id) {
    this.id = id;
  }

  @JsonProperty("name")
  public List<Name> getName() {
    return name;
  }

  @JsonProperty("name")
  public void setName(List<Name> name) {
    this.name = name;
  }

  @JsonProperty("description")
  public List<Description> getDescription() {
    return description;
  }

  @JsonProperty("description")
  public void setDescription(List<Description> description) {
    this.description = description;
  }

  @JsonProperty("proficiencyScale")
  public WorkforceCapabilityProficiencyScale getProficiencyScale() {
    return proficiencyScale;
  }

  @JsonProperty("proficiencyScale")
  public void setProficiencyScale(WorkforceCapabilityProficiencyScale proficiencyScale) {
    this.proficiencyScale = proficiencyScale;
  }

  @JsonProperty("catalogAssignment")
  public List<WorkforceCapabilityCatalogAssignment> getCatalogAssignment() {
    return catalogAssignment;
  }

  @JsonProperty("catalogAssignment")
  public void setCatalogAssignment(List<WorkforceCapabilityCatalogAssignment> catalogAssignment) {
    this.catalogAssignment = catalogAssignment;
  }

  @JsonProperty("capabilityType")
  public WorkforceCapabilityTypeCodes getCapabilityType() {
    return capabilityType;
  }

  @JsonProperty("capabilityType")
  public void setCapabilityType(WorkforceCapabilityTypeCodes capabilityType) {
    this.capabilityType = capabilityType;
  }

  @JsonProperty("status")
  public WorkforceCapabilityStatusCodes getStatus() {
    return status;
  }

  @JsonProperty("status")
  public void setStatus(WorkforceCapabilityStatusCodes status) {
    this.status = status;
  }
}
