package com.sap.c4p.rm.processor.costcenter.dao;

import java.util.List;

import com.sap.resourcemanagement.organization.CostCenters;

/**
 * An Interface to perform the DAO related operation for {@link CostCenters}
 */
public interface CostCenterDAO {
    /**
     * Method to save the document/record of costCenter
     *
     * @param costCenter: Represents a document/record.
     */
    void save(final CostCenters costCenter);

    List<CostCenters> readAll();

    void markBusinessPurposeComplete(List<CostCenters> costCenter);

}
