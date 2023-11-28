package com.sap.c4p.rm.assignment.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;

public class UpdateSupplyDistrListCollectorTest {

  private static final String ASSIGNMENT_ID = "30970700-0000-0000-0000-000000309707";

  @Test
  public void addToInsert() {

    EngmntProjRsceSupDistr supplyDistribution = new EngmntProjRsceSupDistr();
    supplyDistribution.setWorkPackage("WP1");

    UpdateSupplyDistrCollector updateSupplyDistrCollector = new UpdateSupplyDistrCollector();
    updateSupplyDistrCollector.addSupply(supplyDistribution, ASSIGNMENT_ID);

    assertEquals(1, updateSupplyDistrCollector.getSize());

    List<EngmntProjRsceSupDistr> supplyDistributionListToInsert = new ArrayList<>();
    supplyDistributionListToInsert.add(supplyDistribution);
    updateSupplyDistrCollector.addMapsForSupplyDistr(supplyDistributionListToInsert, ASSIGNMENT_ID);

    assertEquals(1, updateSupplyDistrCollector.getCreateSupplyMap().size());

    updateSupplyDistrCollector.clearAll();

    assertEquals(0, updateSupplyDistrCollector.updateSupplyDistrMap.size());

  }
}