package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.json.JSONArray;
import org.slf4j.Marker;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerInfo;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRun;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRuns;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerSchedule;

/**
 * An Interface to provide the generic functionality to communicate to cloud
 * foundry's JobScheduler service.
 */
public interface JobSchedulerService {

    /**
     * Method to get the job available at cloud foundry's JobScheduler Service.
     *
     * @param subDomain : provides the tenant's subdomain for which the job needs to
     *                  be fetched
     * @param job       : provides the jobId/jobName which needs to be fetched
     * @return an object of {@link JobSchedulerInfo} having the job related
     *         information
     */
    JobSchedulerInfo getJob(final Marker loggingMarker, final String subDomain, final String job);

    /**
     * Method to fetch all the jobs of tenant.
     *
     * @param subDomain : provides the tenant's subdomain for which the job needs to
     *                  be fetched
     * @param tenantId  : provides the tenantId for which the jobs need tobe fetched
     * @return an array of Jobs
     */
    JSONArray getJobsByTenantId(final Marker loggingMarker, final String subDomain, final String tenantId);

    /**
     * Method to create the job on behalf of tenant
     *
     * @param subDomain       : provides the tenant's subdomain for which the job
     *                        needs to be created
     * @param jobSchedulerJob : the payload of Job which needs to be created
     * @return an string indicating the success of creation
     */

    String createJob(final Marker loggingMarker, final String subDomain, final JobSchedulerInfo jobSchedulerJob);

    /**
     * Method to update the job on behalf of tenant
     *
     * @param subDomain       : provides the tenant's subdomain for which the job
     *                        needs to be updated
     * @param jobSchedulerJob : the payload of Job which needs to be updated
     * @return an string indicating the success of update
     */
    String updateJob(final Marker loggingMarker, final String subDomain, final JobSchedulerInfo jobSchedulerJob);

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

    boolean deactivateAllJobSchedules(final Marker loggingMarker, final String subDomain, final String jobId);

    CompletableFuture<List<JobSchedulerSchedule>> getJobSchedulesByName(final Marker loggingMarker,
            final String subDomain, final String jobName);

    JobSchedulerSchedule getJobSchedule(final Marker loggingMarker, final String subDomain, final String jobId,
            final String scheduleId);

    JobSchedulerSchedule updateJobSchedule(final Marker loggingMarker, final String subDomain, final String jobId,
            final String scheduleId, final JobSchedulerSchedule jobSchedulerSchedule);

    JobSchedulerRuns getJobScheduleRuns(final Marker loggingMarker, final String subDomain, final String jobId,
            final String scheduleId);

    JobSchedulerRuns getJobScheduleRuns(final Marker loggingMarker, final String subDomain, final String jobId,
            final String scheduleId, final int pageSize, final int offset);

    JobSchedulerRun getJobRun(final Marker loggingMarker, final String subDomain, final String jobId,
            final String scheduleId, final String runId);

    boolean ifPreviousRunComplete(final Marker loggingMarker, final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader);

}
