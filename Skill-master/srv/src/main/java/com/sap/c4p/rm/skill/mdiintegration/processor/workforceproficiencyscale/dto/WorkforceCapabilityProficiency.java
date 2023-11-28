package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WorkforceCapabilityProficiency {
  @JsonProperty("id")
  private String id;
  @JsonProperty("level")
  private Integer level;
  @JsonProperty("name")
  private List<Name> name;
  @JsonProperty("description")
  private List<Description> description;

  @JsonProperty("id")
  public String getId() {
    return id;
  }

  @JsonProperty("id")
  public void setId(String id) {
    this.id = id;
  }

  @JsonProperty("level")
  public Integer getLevel() {
    return level;
  }

  @JsonProperty("level")
  public void setLevel(Integer level) {
    this.level = level;
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
}
