package com.sap.c4p.rm.handlers;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;

/**
 * An Interface to initiate the internal jobs of replication.
 */
public interface ReplicationJobs {

    /**
     * Method to submit the job to initiate the workforce replication
     *
     * @param subDomain:             Tenant's subDomain
     * @param jobSchedulerRunHeader: An Object of {@link JobSchedulerRunHeader}
     *                               having the information of job run that needs to
     *                               be updated.
     */
    void submitForWorkforceReplication(final String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader);

    /**
     * Method to submit the job to initiate the costCenter replication
     *
     * @param subDomain:             Tenant's subDomain
     * @param jobSchedulerRunHeader: An Object of {@link JobSchedulerRunHeader}
     *                               having the information of job run that needs to
     *                               be updated.
     */
    void submitForCostCenterReplication(final String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader);

}
