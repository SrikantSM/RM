package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.dao;

import java.util.List;
import java.util.Set;

import com.sap.resourcemanagement.organization.Details;
import com.sap.resourcemanagement.organization.Headers;

/**
 * Class is used to perform DB upsert opeartion to persist Service Org Headers
 * and Details
 */
public interface ServiceOrgDAO {

    /**
     * Updates or inserts new data {@link ServiceOrgs} for Headers and tries to save
     * it
     *
     * @param organizationHeaders will be used to perform DB operation
     */

    public void upsertNewServiceOrgHead(Set<Headers> organizationHeaders);

    /**
     * Updates or inserts new data {@link ServiceOrgs} for Details and tries to save
     * it
     *
     * @param organizationDetails will be used to perform DB operation
     */
    public void upsertNewServiceOrgDetails(Set<Details> organizationDetails);

    /**
     * Delete existing data {@link ServiceOrgs} for Header and tries to save it
     *
     * @param organizationHeaders will be used to perform DB operation
     */
    public void deleteServiceOrgHeader(Set<Headers> organizationHeaders);

    /**
     * Delete existing data {@link ServiceOrgs} for Details and tries to save it
     *
     * @param organizationDetails will be used to perform DB operation
     */
    public void deleteServiceOrgDetail(Set<Details> organizationDetails);

    public List<Details> readAllServiceOrganizationDetails();

}
