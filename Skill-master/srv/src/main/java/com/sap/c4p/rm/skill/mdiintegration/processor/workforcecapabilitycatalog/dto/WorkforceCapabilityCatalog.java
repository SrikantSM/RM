package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "id", "name", "description" })
public class WorkforceCapabilityCatalog implements Serializable {

  @JsonProperty("id")
  private String id;
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
