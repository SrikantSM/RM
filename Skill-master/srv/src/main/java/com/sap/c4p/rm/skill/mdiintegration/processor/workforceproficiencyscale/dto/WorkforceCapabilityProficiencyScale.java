package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.io.Serializable;
import java.util.List;

@JsonPropertyOrder({ "id", "name", "description", "proficiency", "min", "max", "inverse" })
public class WorkforceCapabilityProficiencyScale implements Serializable {
  @JsonProperty("id")
  private String id;
  @JsonProperty("name")
  private List<Name> name;
  @JsonProperty("description")
  private List<Description> description;

  @JsonProperty("proficiency")
  private transient List<WorkforceCapabilityProficiency> proficiencyLevel;
  @JsonProperty("min")
  private Integer min;
  @JsonProperty("max")
  private Integer max;
  @JsonProperty("inverse")
  private Boolean inverse;

  @JsonProperty("status")
  private WorkforceCapabilityProficiencyScaleStatusCodes status;

  @JsonProperty("id")
  public String getId() {
    return id;
  }

  @JsonProperty("id")
  public void setId(String id) {
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

  @JsonProperty("proficiency")
  public List<WorkforceCapabilityProficiency> getProficiencyLevel() {
    return proficiencyLevel;
  }

  @JsonProperty("proficiency")
  public void setProficiencyLevel(List<WorkforceCapabilityProficiency> proficiencyLevel) {
    this.proficiencyLevel = proficiencyLevel;
  }

  @JsonProperty("min")
  public void setMin(Integer min) {
    this.min = min;
  }

  @JsonProperty("min")
  public Integer getMin() {
    return min;
  }

  @JsonProperty("max")
  public void setMax(Integer max) {
    this.max = max;
  }

  @JsonProperty("max")
  public Integer getMax() {
    return max;
  }

  @JsonProperty("inverse")
  public void setInverse(Boolean inverse) {
    this.inverse = inverse;
  }

  @JsonProperty("inverse")
  public Boolean getInverse() {
    return inverse;
  }

  @JsonProperty("status")
  public WorkforceCapabilityProficiencyScaleStatusCodes getStatus() {
    return status;
  }

  @JsonProperty("status")
  public void setStatus(WorkforceCapabilityProficiencyScaleStatusCodes status) {
    this.status = status;
  }
}
