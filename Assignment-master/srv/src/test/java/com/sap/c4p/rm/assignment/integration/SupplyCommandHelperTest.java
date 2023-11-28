package com.sap.c4p.rm.assignment.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;
import com.sap.cloud.sdk.s4hana.datamodel.odata.services.DefaultCommercialProjectService;

public class SupplyCommandHelperTest {

  private HttpDestination httpDestination = null;
  private DefaultCommercialProjectService service = null;
  private List<EngmntProjRsceSupDistr> supplyDistributionListToInsert = null;
  private List<EngmntProjRsceSupDistr> supplyDistributionListToUpdate = null;
  private List<EngmntProjRsceSupDistr> supplyDistributionListToDelete = null;
  private List<EngmntProjRsceSup> supplyListToCreate = null;
  private List<EngmntProjRsceSup> supplyListToDelete = null;

  @Test
  void returnsUpdateSupplyCommandObject() {
    assertEquals(UpdateSupplyCommand.class,
        new SupplyCommandHelper()
            .getUpdateSupplyCommand(httpDestination, service, supplyDistributionListToInsert,
                supplyDistributionListToUpdate, supplyDistributionListToDelete, supplyListToCreate, supplyListToDelete)
            .getClass());
  }
}
