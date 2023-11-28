package com.sap.c4p.rm.resourcerequest.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.integration.SupplySync;
import com.sap.resourcemanagement.integration.SupplySync_;

@Component
public class SupplySyncRepository {

  private PersistenceService persistenceService;

  @Autowired
  public SupplySyncRepository(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  public void insertDemand(String demand) {

    SupplySync supplySync = SupplySync.create();
    supplySync.setDemand(demand);

    CqnInsert insert = Insert.into(SupplySync_.class).entry(supplySync);
    persistenceService.run(insert);

  }

  public void deleteDemand(String demand) {

    CqnDelete delete = Delete.from(SupplySync_.class).where(b -> b.demand().eq(demand));
    persistenceService.run(delete);

  }

}
