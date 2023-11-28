package com.sap.c4p.rm.projectintegrationadapter.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.organization.DeliveryOrganizations_;

@Repository
public class DeliveryOrganizationRepository {

  private final PersistenceService persistenceService;

  @Autowired
  DeliveryOrganizationRepository(final PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  public long checkIfDeliveryOrganizationExists(String deliveryOrgCode) {

    final CqnSelect select = Select.from(DeliveryOrganizations_.class)
        .where(deliveryOrganization -> deliveryOrganization.code().eq(deliveryOrgCode))
        .columns(DeliveryOrganizations_::code);

    return this.persistenceService.run(select).rowCount();
  }
}
