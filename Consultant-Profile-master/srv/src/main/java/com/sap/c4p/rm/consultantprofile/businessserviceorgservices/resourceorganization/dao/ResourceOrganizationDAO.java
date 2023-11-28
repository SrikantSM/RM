package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sap.resourcemanagement.config.ResourceOrganizationItems;
import com.sap.resourcemanagement.config.ResourceOrganizations;

@Component
public interface ResourceOrganizationDAO {

    public ResourceOrganizations getResourceOrganizationForServiceOrganization(String serviceOrganizationCode);

    public void upsertResourceOrganizations(List<ResourceOrganizations> resourceOrganizations);

    public void deleteResourceOrganizations(List<ResourceOrganizations> resourceOrganizations);

    public void deleteResourceOrganizationItems(List<ResourceOrganizationItems> resourceOrganizationItems);

    public void deleteResourceOrganizationItemsBasedOnCostCenter(
            List<ResourceOrganizationItems> resourceOrganizationItems);

    public List<ResourceOrganizationItems> readAllResourceOrganizationItems();

}
