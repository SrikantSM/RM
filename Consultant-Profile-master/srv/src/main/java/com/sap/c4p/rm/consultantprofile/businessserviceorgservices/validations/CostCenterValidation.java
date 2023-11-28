package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.validations;

import java.util.List;

import org.apache.commons.csv.CSVRecord;

import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResultBuilder;

import com.sap.resourcemanagement.organization.Details;

/**
 * This class validate costcenterID during upload CSV functinality from Service
 * Org App
 */
public interface CostCenterValidation {

    /**
     * {@link ServiceOrgs} CHecks the functional Correctness of CostCenters {
     * Entered costCenter must exist in DB to process Service Org} exceptions thown
     * if not as per the functional correctness
     *
     * @param csvRecord
     */
    public void validateAllCostCenter(final CSVRecord csvRecord);

    /**
     *
     * @param costCenterDetails
     * @return
     * @return
     *
     *         Read the data for the cost centers from the DB once and populate the
     *         buffers to be used in the other methods
     */

    public List<Details> validateInitialCostCenterData(List<Details> costCenterDetails, ImportResultBuilder result);

    public List<Details> validateCostCenterData(List<Details> costCenterDetails, ImportResultBuilder result);

    /**
     * Check for duplicate cost center assignment to different service org in the
     * csv content
     *
     * @param details
     */

    public void validateDuplicateCostCenterForInputData(Details details);

    /**
     * {@link ServiceOrgs} CHecks the functional Correctness of COstCenters {A
     * costCenter can be associated with only one Service Org} code separated to
     * avoid same code segment for comparing with the existing default costCenters
     * in the csv exceptions thown if not as per the functional correctness
     *
     * @param details
     * @param dbCostCenters
     */

    public Details validateDuplicateCostCenterForDBData(Details details, List<Details> dbCostCenters);

    public void validateCostCenterForResourceRequestData(Details details, List<Details> dbCostCenters);

}
