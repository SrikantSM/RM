package com.sap.c4p.rm.assignment.integration;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;

public class UpdateSupplyDistrCollector {
  Map<EngmntProjRsceSupDistr, String> updateSupplyDistrMap;
  private static final Logger LOGGER = LoggerFactory.getLogger(SupplyErrorMessageParser.class);

  public UpdateSupplyDistrCollector() {
    updateSupplyDistrMap = new HashMap<>();
  }

  public void addSupply(EngmntProjRsceSupDistr supplyDistr, String assignmentId) {
    updateSupplyDistrMap.put(supplyDistr, assignmentId);
  }

  public Map<EngmntProjRsceSupDistr, String> getCreateSupplyMap() {
    return updateSupplyDistrMap;
  }

  public Map<EngmntProjRsceSupDistr, String> addMapsForSupplyDistr(List<EngmntProjRsceSupDistr> supply,
      String assignmentId) {

    for (EngmntProjRsceSupDistr supplyDistrRecord : supply) {
      String workPackageId = supplyDistrRecord.getWorkPackage();
      String resourceDemand = supplyDistrRecord.getResourceDemand();
      String resourceSupply = supplyDistrRecord.getResourceSupply();

      LOGGER.info(
          "Supply details are successfully retrieved for addMapsForSupplyDistr with workpackage {}, demand {} and resourceSupply {} for {} assignmentId",
          workPackageId, resourceDemand, resourceSupply, assignmentId);
      updateSupplyDistrMap.put(supplyDistrRecord, assignmentId);
    }
    return updateSupplyDistrMap;
  }

  public int getSize() {
    return updateSupplyDistrMap.size();
  }

  public void clearAll() {
    updateSupplyDistrMap.clear();
  }

}