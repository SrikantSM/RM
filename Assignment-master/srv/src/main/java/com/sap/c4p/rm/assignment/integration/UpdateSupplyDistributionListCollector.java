package com.sap.c4p.rm.assignment.integration;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;

@Component
public class UpdateSupplyDistributionListCollector {
  List<EngmntProjRsceSupDistr> supplyDistributionListToInsert;
  List<EngmntProjRsceSupDistr> supplyDistributionListToUpdate;
  List<EngmntProjRsceSupDistr> supplyDistributionListToDelete;

  public UpdateSupplyDistributionListCollector() {
    supplyDistributionListToInsert = new ArrayList<>();
    supplyDistributionListToUpdate = new ArrayList<>();
    supplyDistributionListToDelete = new ArrayList<>();
  }

  public void addSupplyDistributionListToInsert(List<EngmntProjRsceSupDistr> supplyDistributionListToInsert) {
    this.supplyDistributionListToInsert.addAll(supplyDistributionListToInsert);
  }

  public void addSupplyDistributionListToUpdate(List<EngmntProjRsceSupDistr> supplyDistributionListToUpdate) {
    this.supplyDistributionListToUpdate.addAll(supplyDistributionListToUpdate);
  }

  public void addSupplyDistributionListToDelete(List<EngmntProjRsceSupDistr> supplyDistributionListToDelete) {
    this.supplyDistributionListToDelete.addAll(supplyDistributionListToDelete);
  }

  public List<EngmntProjRsceSupDistr> getSupplyDistributionListToInsert() {
    return this.supplyDistributionListToInsert;
  }

  public List<EngmntProjRsceSupDistr> getSupplyDistributionListToUpdate() {
    return this.supplyDistributionListToUpdate;
  }

  public List<EngmntProjRsceSupDistr> getSupplyDistributionListToDelete() {
    return this.supplyDistributionListToDelete;
  }

  public void clearAll() {
    this.supplyDistributionListToInsert.clear();
    this.supplyDistributionListToUpdate.clear();
    this.supplyDistributionListToDelete.clear();
  }

}
