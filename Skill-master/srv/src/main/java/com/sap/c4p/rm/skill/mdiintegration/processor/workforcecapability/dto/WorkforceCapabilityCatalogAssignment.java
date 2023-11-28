package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WorkforceCapabilityCatalogAssignment implements Serializable {

  @JsonProperty("catalog")
  private WorkforceCapabilityCatalog catalog;

  @JsonProperty("catalog")
  public WorkforceCapabilityCatalog getCatalog() {
    return catalog;
  }

  @JsonProperty("catalog")
  public void setCatalog(WorkforceCapabilityCatalog catalog) {
    this.catalog = catalog;
  }

}
