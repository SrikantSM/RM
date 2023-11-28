package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration;

public enum MDIEntities {
  WORKFORCE_CAPABILITY_REPLICATION("sap.odm.workforce.capability.WorkforceCapability"),
  WORKFORCE_CAPABILITY_CATALOG_REPLICATION("sap.odm.workforce.capability.WorkforceCapabilityCatalog"),
  WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION("sap.odm.workforce.capability.WorkforceCapabilityProficiencyScale");

  private final String name;

  public String getName() {
    return this.name;
  }

  MDIEntities(String name) {
    this.name = name;
  }

}
