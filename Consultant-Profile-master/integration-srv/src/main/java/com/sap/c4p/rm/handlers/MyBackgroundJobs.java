package com.sap.c4p.rm.handlers;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;

/**
 * An Interface having the background jobs skeletons
 */
public interface MyBackgroundJobs {

    /**
     * Method to create and update the HouseKeeperJob
     */
    void submitForHouseKeeperJob();

    /**
     * Method Signature to create the tenant specific jobs.
     *
     * @param jobSchedulerRunHeader : Holds the information of particular run, so
     *                              that the information can be provided to run.
     */
    void submitForTenantJobs(final JobSchedulerRunHeader jobSchedulerRunHeader);

}
