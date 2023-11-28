package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service;

import org.slf4j.Marker;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.*;

/**
 * An Interface to provide the generic functionality to communicate to cloud
 * foundry's JobScheduler service.
 */
public interface JobSchedulerService {

  /**
   * Method to update the job run on behalf of tenant
   *
   * @param subDomain             : provides the tenant's subdomain for which the
   *                              job run needs to be updated
   * @param jobSchedulerRunHeader : Represents the object having the specific run
   *                              information
   * @param jobScheduleRunPayload : Provides an object of
   *                              {@link JobScheduleRunPayload} having the status
   *                              and message information.
   */
  void updateJobRun(final Marker loggingMarker, final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader, final JobScheduleRunPayload jobScheduleRunPayload);

  JobSchedulerRun getJobRun(final Marker loggingMarker, final String subDomain, final String jobId,
      final String scheduleId, final String runId);

  JobSchedulerRuns getJobScheduleRuns(Marker loggingMarker, String subDomain, String jobId, String scheduleId);

  JobSchedulerRuns getJobScheduleRuns(Marker loggingMarker, String subDomain, String jobId, String scheduleId,
      int pageSize, int offset);

  boolean ifPreviousRunComplete(final Marker loggingMarker, final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader);

}
