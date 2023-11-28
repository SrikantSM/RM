package com.sap.c4p.rm.cloudfoundry.service.masterdataintegration;

public enum MDIEntities {
    WORKFORCE_PERSON("sap.odm.workforce.WorkforcePerson", "WorkforcePerson"),
    COST_CENTER("sap.odm.finance.CostCenter", "CostCenter"),
    WORKFORCE_CAPABILITY("sap.odm.workforce.capability.WorkforceCapability", "WorkforceCapability");

    private final String name;
    private final String shortName;

    public String getName() {
        return this.name;
    }
    
    public String getShortName() {
        return this.shortName;
    }

    MDIEntities(String name, String shortName) {
        this.name = name;
        this.shortName = shortName;
    }

}
