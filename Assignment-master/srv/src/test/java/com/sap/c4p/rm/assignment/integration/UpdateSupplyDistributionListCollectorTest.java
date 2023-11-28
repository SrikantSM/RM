package com.sap.c4p.rm.assignment.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;

public class UpdateSupplyDistributionListCollectorTest {

  @Test
  public void addToInsert() {

    EngmntProjRsceSupDistr supplyDistribution = new EngmntProjRsceSupDistr();
    supplyDistribution.setWorkPackage("WP1");

    List<EngmntProjRsceSupDistr> supplyDistributionListToInsert = new ArrayList<>();
    supplyDistributionListToInsert.add(supplyDistribution);

    UpdateSupplyDistributionListCollector supplyDistributionListCollector = new UpdateSupplyDistributionListCollector();
    supplyDistributionListCollector.addSupplyDistributionListToInsert(supplyDistributionListToInsert);

    assertEquals(1, supplyDistributionListCollector.getSupplyDistributionListToInsert().size());

    supplyDistributionListCollector.addSupplyDistributionListToUpdate(supplyDistributionListToInsert);

    assertEquals(1, supplyDistributionListCollector.getSupplyDistributionListToUpdate().size());

    supplyDistributionListCollector.addSupplyDistributionListToDelete(supplyDistributionListToInsert);

    assertEquals(1, supplyDistributionListCollector.getSupplyDistributionListToDelete().size());

    supplyDistributionListCollector.clearAll();

    assertEquals(0, supplyDistributionListCollector.getSupplyDistributionListToInsert().size());
    assertEquals(0, supplyDistributionListCollector.getSupplyDistributionListToUpdate().size());
    assertEquals(0, supplyDistributionListCollector.getSupplyDistributionListToDelete().size());

  }
}
