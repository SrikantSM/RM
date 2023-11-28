package com.sap.c4p.rm.processor.costcenter.dao;

import com.sap.resourcemanagement.consultantprofile.integration.ReplicationFailures;
import com.sap.resourcemanagement.organization.CostCenters;

public interface CostCenterReplicationDAO {

    /**
     * Method to save the qualified {@link CostCenters} as a single DB transaction
     *
     * @param costCenter: An Object of {@link CostCenters}
     */
    void save(final CostCenters costCenter);

    /**
     * Method to save the qualified {@link CostCenters} as a single DB transaction
     *
     * @param costCenter:          An Object of {@link CostCenters}
     * @param replicationFailures: An Object of {@link ReplicationFailures}.
     */
    void save(final CostCenters costCenter, final ReplicationFailures replicationFailures);
}
