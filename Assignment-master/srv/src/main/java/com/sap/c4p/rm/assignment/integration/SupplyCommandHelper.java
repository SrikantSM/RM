package com.sap.c4p.rm.assignment.integration;

import java.util.List;

import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;
import com.sap.cloud.sdk.s4hana.datamodel.odata.services.DefaultCommercialProjectService;

public class SupplyCommandHelper {

  public UpdateSupplyCommand getUpdateSupplyCommand(HttpDestination httpDestination,
      DefaultCommercialProjectService commercialProjectService,
      List<EngmntProjRsceSupDistr> supplyDistributionListToInsert,
      List<EngmntProjRsceSupDistr> supplyDistributionListToUpdate,
      List<EngmntProjRsceSupDistr> supplyDistributionListToDelete, List<EngmntProjRsceSup> supplyListToCreate,
      List<EngmntProjRsceSup> supplyListToDelete) {
    return new UpdateSupplyCommand(httpDestination, commercialProjectService, supplyDistributionListToInsert,
        supplyDistributionListToUpdate, supplyDistributionListToDelete, supplyListToCreate, supplyListToDelete);
  }

}
