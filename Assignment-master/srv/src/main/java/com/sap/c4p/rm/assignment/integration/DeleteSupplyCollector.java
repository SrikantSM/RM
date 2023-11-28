package com.sap.c4p.rm.assignment.integration;

import java.util.HashMap;
import java.util.Map;

import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;

public class DeleteSupplyCollector {
  Map<String, EngmntProjRsceSup> deleteSupplyMap;

  public DeleteSupplyCollector() {
    deleteSupplyMap = new HashMap<>();
  }

  public void addSupply(String assignmentId, EngmntProjRsceSup supply) {
    deleteSupplyMap.put(assignmentId, supply);
  }

  public Map<String, EngmntProjRsceSup> getDeleteSupplyMap() {
    return deleteSupplyMap;
  }

  public int getSize() {
    return deleteSupplyMap.size();
  }

  public void clearAll() {
    deleteSupplyMap.clear();
  }
}
