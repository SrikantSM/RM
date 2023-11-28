package com.sap.c4p.rm.handlers;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;

public interface TimeDimensionJobs {

    /**
     * Method to submit the job to call the time dimension update procedure
     *
     */
    void submitForScheduleTimeDimension(final String subDomain, final JobSchedulerRunHeader jobSchedulerRun);

}
