package com.sap.c4p.rm.replicationschedules;

import java.time.Instant;
import java.util.List;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerInfo;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerSchedule;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;

public interface ReplicationSchedulesService {

    List<JobSchedulerInfo> fetchJobs();

    /**
     * To be removed after 2101 release
     *
     * Method to fetch the Replication Jobs of a particular Tenant using Provider
     * tenant subdomain
     *
     * @return A list of Job Scheduler's Schedules
     */

    List<JobSchedulerInfo> fetchJobsWithProviderContext();

    /**
     * Method to fetch the Replication Job Schedules of a particular Tenant
     *
     * @return A list of Job Scheduler's Schedules
     */
    List<JobSchedulerSchedule> fetchJobSchedules();

    /**
     * Method to fetch the Replication Job Schedules based on the Job ID and
     * Schedule ID passed
     *
     * @param jobId      Job ID
     * @param scheduleId Schedule ID
     * @return Job Schedule
     */
    JobSchedulerSchedule fetchJobSchedule(String jobId, String scheduleId, String subdomainId);

    /**
     * Activate the Job Schedule based on the Job ID and Schedule ID
     *
     * @param jobId      Job ID of Cost Center or Workforce
     * @param scheduleId Schedule ID of Cost Center or Workforce
     * @return Job Schedule
     */
    JobSchedulerSchedule activateJobSchedule(String jobId, String scheduleId);

    /**
     *
     * Deactivate the Job Schedule based on the Job ID and Schedule ID
     *
     * @param jobId      Job ID of Cost Center or Workforce
     * @param scheduleId Schedule ID of Cost Center or Workforce
     * @return Job Schedule
     */
    JobSchedulerSchedule deactivateJobSchedule(String jobId, String scheduleId);

    Boolean deactivateAllJobSchedules(String jobId);

    /**
     * To be removed after 2101 release
     *
     * Deactivate all job schedules for specified Job ID
     *
     * @param jobId Job ID of Cost Center or Workforce
     * @return boolean value indicating success of operation
     *
     */
    Boolean deactivateAllJobSchedulesWithProviderContext(String jobId);

    /**
     *
     * Update the Job Schedule time based on the Job ID and Schedule ID
     *
     * @param jobId      Job ID of Cost Center or Workforce
     * @param scheduleId Schedule ID of Cost Center or Workforce
     * @return time New time
     */
    JobSchedulerSchedule updateJobScheduleTime(String jobId, String scheduleId, Instant time);

    /**
     *
     * Update the Job Schedule time based on the Job ID and Schedule ID
     *
     * @param jobId      Job ID of Cost Center or Workforce
     * @param scheduleId Schedule ID of Cost Center or Workforce
     * @return pattern CRON pattern passed
     */
    JobSchedulerSchedule updateJobScheduleRepeatInterval(String jobId, String scheduleId, Integer pattern);

    /**
     * Returns whether the Initial Load is completed or not
     *
     * @param entity: Represents the entity type
     * @return true on initial load complete else false
     */
    boolean isInitialLoadComplete(final MDIEntities entity);

    /**
     * Validations for Cost Center Activation
     *
     * @param jobId      Job ID
     * @param scheduleId Schedule ID
     */
    void validateCostCenterActivation(String jobId, String scheduleId);

    /**
     * Validations for Workforce Activation
     *
     * @param jobId      Job ID
     * @param scheduleId Schedule ID
     */
    void validateWorkforceActivation(String jobId, String scheduleId);

    void validateWorkforceCapabilityOneTimeActivation(String jobId, String scheduleId);
}
