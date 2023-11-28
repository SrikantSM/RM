package com.sap.c4p.rm.projectintegrationadapter.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.config.ResourceOrganizations;
import com.sap.resourcemanagement.config.ResourceOrganizations_;

@Repository
public class ResourceOrganizationRespository {

  private final PersistenceService persistenceService;

  @Autowired
  public ResourceOrganizationRespository(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  /**
   * Method to retreive ResourceOrganizationDisplayId by using Delivery
   * Organization Code
   * 
   * @param deliveryOrganizationCode
   * @return
   */

  public String getResourceOrganizationForDeliveryOrganization(String deliveryOrganizationCode) {

    CqnSelect select = Select.from(ResourceOrganizations_.class)
        .where(resOrg -> resOrg.serviceOrganization_code().eq(deliveryOrganizationCode))
        .columns(ResourceOrganizations_::displayId);

    Result result = persistenceService.run(select);

    if (result.rowCount() > 0) {
      return result.single(ResourceOrganizations.class).getDisplayId();
    } else {
      return null;
    }
  }
}
