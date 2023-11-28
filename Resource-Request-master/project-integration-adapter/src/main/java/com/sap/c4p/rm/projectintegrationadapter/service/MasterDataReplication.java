package com.sap.c4p.rm.projectintegrationadapter.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.repository.DemandRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ProjectRepository;
import com.sap.c4p.rm.projectintegrationadapter.util.ProjectManagementS4Client;

import com.sap.resourcemanagement.project.BillingRoles;
import com.sap.resourcemanagement.project.Customers;

@Component
public class MasterDataReplication {

  private ProjectRepository projectRepository;
  private ProjectManagementS4Client s4Client;
  private DemandRepository demandRepository;

  private static final Logger logger = LoggerFactory.getLogger(MasterDataReplication.class);
  private static final Marker MARKER = LoggingMarker.REPLICATION_MASTER_DATA_REPLICATION_MARKER.getMarker();

  @Autowired
  public MasterDataReplication(ProjectRepository projectRepository, ProjectManagementS4Client s4Client,
      DemandRepository demandRepository) {
    this.projectRepository = projectRepository;
    this.s4Client = s4Client;
    this.demandRepository = demandRepository;
  }

  public void createCustomerIfNotPresent(String customerId) {
    try {

      logger.debug(MARKER, "Entered method createCustomerIfNotPresent, in MasterDataReplication class");
      Customers customer = projectRepository.getCustomerById(customerId);
      if (customer == null) {
        customer = Customers.create();
        customer.setName(s4Client.getCustomerDetails(customerId).getCustomerFullName());
        customer.setId(customerId);
        projectRepository.upsertCustomer(customer);
      }
    } catch (ServiceException e) {
      logger.debug(MARKER, "Error occured while creating customer masterdata.");
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while creating customer masterdata", e);
    }
  }

  public void createBillingIfNotPresent(String billingRoleId) {
    try {
      logger.debug(MARKER, "Entered method createBillingIfNotPresent, in MasterDataReplication class");
      BillingRoles billingRole = demandRepository.getBillingRoleById(billingRoleId);
      if (billingRole == null) {
        billingRole = BillingRoles.create();
        billingRole.setName(s4Client.getCostCenterActivityTypeText(billingRoleId).getCostCtrActivityTypeName());
        billingRole.setId(billingRoleId);
        demandRepository.upsertBillingRole(billingRole);
      }
    } catch (ServiceException e) {
      logger.debug(MARKER, "Error occured while creating billing-role masterdata.");
      // Error logged in callinf function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Error occured while creating billing-role masterdata", e);
    }
  }
}
