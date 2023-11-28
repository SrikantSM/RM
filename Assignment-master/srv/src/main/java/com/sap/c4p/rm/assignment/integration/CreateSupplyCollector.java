package com.sap.c4p.rm.assignment.integration;

import java.util.HashMap;
import java.util.Map;

import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;

public class CreateSupplyCollector {
  Map<String, EngmntProjRsceSup> createSupplyMap;

  public CreateSupplyCollector() {
    createSupplyMap = new HashMap<>();
  }

  public void addSupply(String assignmentId, EngmntProjRsceSup supply) {
    createSupplyMap.put(assignmentId, supply);
  }

  public Map<String, EngmntProjRsceSup> getCreateSupplyMap() {
    return createSupplyMap;
  }

  public int getSize() {
    return createSupplyMap.size();
  }

  public void clearAll() {
    createSupplyMap.clear();
  }
}
