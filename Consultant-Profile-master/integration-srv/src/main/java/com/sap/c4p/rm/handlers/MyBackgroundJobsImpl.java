package com.sap.c4p.rm.handlers;

import static com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerInfo.KEY_NAME;
import static com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerTime.ISO8601_FORMAT_FOR_DATE_FORMATTING;
import static com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerTime.ISO8601_FORMAT_FOR_JOB_SCHEDULER;
import static com.sap.c4p.rm.controller.JobSchedulerController.CREATE_TENANT_JOB;
import static com.sap.c4p.rm.controller.ReplicationController.REPLICATE_COST_CENTER;
import static com.sap.c4p.rm.controller.ReplicationController.REPLICATE_WORK_FORCE;
import static com.sap.c4p.rm.controller.TimeDimensionController.TIME_DIMENSION_UPDATE;
import static com.sap.c4p.rm.utils.Constants.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.sap.c4p.rm.cloudfoundry.environment.CFUserProvidedEnvironment;
import com.sap.c4p.rm.cloudfoundry.environment.XSUaaVCAP;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.*;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerSymbols;
import com.sap.c4p.rm.cloudfoundry.service.saasregistry.model.Subscription;
import com.sap.c4p.rm.cloudfoundry.service.saasregistry.model.TenantSubscriptions;
import com.sap.c4p.rm.cloudfoundry.service.saasregistry.service.SaasRegistryService;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.c4p.rm.utils.StringFormatter;

/**
 * An implemented class of {@link MyBackgroundJobs} having the background jobs.
 */
@Component
public class MyBackgroundJobsImpl implements MyBackgroundJobs {

    private static final Logger LOGGER = LoggerFactory.getLogger(MyBackgroundJobsImpl.class);
    private static final Marker HOUSE_KEEPER_JOB_MARKER = LoggingMarker.HOUSE_KEEPER_JOB.getMarker();
    private static final Marker CREATE_TENANT_JOB_MARKER = LoggingMarker.CREATE_TENANT_JOBS.getMarker();

    protected static final String HOUSE_KEEPER_JOB = "ConsultantProfile_HouseKeeper";
    private static final String TENANT_SPECIFIC_JOB_NAME = "CP_{0}_{1}";
    private static final String SKILLS_DOMAIN_JOB_NAME = "SKILLS_{0}_{1}";
    public static final String WORKFORCE_PERSON = "workforcePerson";
    public static final String COST_CENTER = "costCenter";
    public static final String TIME_DIMENSION = "timeDimension";
    public static final String WORKFORCE_CAPABILITY = "workforceCapability";
    private static final String REPLICATE_WORKFORCE_CAPABILITY = "replicateWorkforceCapability";

    private final JobSchedulerService jobSchedulerService;
    private final SaasRegistryService saasRegistryService;
    private final UriComponentsBuilder integrationServiceBaseUriBuilder;
    private final String providerSubDomain;
    private final String providerTenantId;
    private final UriComponentsBuilder skillsUriBuilder;

    @Autowired
    public MyBackgroundJobsImpl(final CFUserProvidedEnvironment cfUserProvidedEnvironment,
            final JobSchedulerService jobSchedulerService, final SaasRegistryService saasRegistryService,
            final XSUaaVCAP xsUaaVCAP) {
        this.jobSchedulerService = jobSchedulerService;
        this.saasRegistryService = saasRegistryService;
        this.integrationServiceBaseUriBuilder = UriComponentsBuilder
                .fromUriString(cfUserProvidedEnvironment.getApplicationUri());
        this.providerSubDomain = xsUaaVCAP.getIdentityZone();
        this.providerTenantId = xsUaaVCAP.getTenantId();
        this.skillsUriBuilder = UriComponentsBuilder.fromUriString(cfUserProvidedEnvironment.getSkillsUri());
    }

    @Override
    public void submitForHouseKeeperJob() {
        LOGGER.info(HOUSE_KEEPER_JOB_MARKER, "Checking for houseKeeper Job");
        boolean isHouseKeeperExists = false;
        JSONArray houseKeeperJobs;

        if ((houseKeeperJobs = this.jobSchedulerService.getJobsByTenantId(HOUSE_KEEPER_JOB_MARKER,
                this.providerSubDomain, this.providerTenantId)) == null)
            this.createOrUpdateHouseKeeperJob(false);
        else {
            for (int i = 0; i < houseKeeperJobs.length(); i++) {
                JSONObject job = houseKeeperJobs.getJSONObject(i);
                if (HOUSE_KEEPER_JOB.equals(job.getString(KEY_NAME))) {
                    isHouseKeeperExists = true;
                    break;
                }
            }
            this.createOrUpdateHouseKeeperJob(isHouseKeeperExists);
        }
    }

    @Override
    public void submitForTenantJobs(final JobSchedulerRunHeader jobSchedulerRunHeader) {
        if (this.jobSchedulerService.ifPreviousRunComplete(CREATE_TENANT_JOB_MARKER, this.providerSubDomain,
                jobSchedulerRunHeader)) {
            TenantSubscriptions activeSubscriptions;
            if ((activeSubscriptions = this.saasRegistryService
                    .getActiveSubscriptions(CREATE_TENANT_JOB_MARKER)) == null) {
                JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(true,
                        "No Subscribed/Consumer tenant found");
                this.jobSchedulerService.updateJobRun(CREATE_TENANT_JOB_MARKER, this.providerSubDomain,
                        jobSchedulerRunHeader, jobScheduleRunPayload);
                LOGGER.error(CREATE_TENANT_JOB_MARKER, "No Subscribed/Consumer tenant found");
            } else {
                createTenantJobsForActiveSubscriptions(jobSchedulerRunHeader, activeSubscriptions);
            }
        }
    }

    private void createTenantJobsForActiveSubscriptions(final JobSchedulerRunHeader jobSchedulerRunHeader,
            TenantSubscriptions activeSubscriptions) {
        List<Subscription> subscriptions = activeSubscriptions.getSubscriptions();
        AtomicInteger totalJobsToBeCreated = new AtomicInteger(subscriptions.size() * TOTAL_NUMBER_OF_JOBS_PER_TENANT);
        AtomicInteger totalJobsCreated = new AtomicInteger();
        subscriptions.forEach(subscription -> {
            String subDomain = subscription.getSubdomain();
            String tenantId = subscription.getConsumerTenantId();
            AtomicReference<Boolean> isWorkforceReplicationJobExists = new AtomicReference<>(Boolean.FALSE);
            AtomicReference<Boolean> isCostCenterReplicationJobExists = new AtomicReference<>(Boolean.FALSE);
            AtomicReference<Boolean> isTimeDimensionUpdateJobExists = new AtomicReference<>(Boolean.FALSE);
            AtomicReference<Boolean> isWorkforceCapabilityReplicationJobExists = new AtomicReference<>(Boolean.FALSE);
            String workforceJobName = StringFormatter
                    .format(TENANT_SPECIFIC_JOB_NAME, JobSchedulerSymbols.WORKFORCE_PERSON.getSymbol(), tenantId)
                    .replace("-", "");
            String costCenterJobName = StringFormatter
                    .format(TENANT_SPECIFIC_JOB_NAME, JobSchedulerSymbols.COST_CENTER.getSymbol(), tenantId)
                    .replace("-", "");
            String timeDimensionJobName = StringFormatter
                    .format(TENANT_SPECIFIC_JOB_NAME, JobSchedulerSymbols.TIME_DIMENSION.getSymbol(), tenantId)
                    .replace("-", "");
            String wfCapabilityJobName = StringFormatter
                .format(SKILLS_DOMAIN_JOB_NAME, JobSchedulerSymbols.WORKFORCE_CAPABILITY.getSymbol(), tenantId)
                .replace("-", "");
            JSONArray tenantJobs;
            if ((tenantJobs = this.jobSchedulerService.getJobsByTenantId(CREATE_TENANT_JOB_MARKER,
                    this.providerSubDomain, tenantId)) != null && !tenantJobs.isEmpty()) {
                tenantJobs.forEach(jobItem -> {
                    JSONObject job = (JSONObject) jobItem;
                    String jobName = job.getString(KEY_NAME);
                    if (jobName.equals(workforceJobName)) {
                        isWorkforceReplicationJobExists.set(Boolean.TRUE);
                        totalJobsToBeCreated.getAndDecrement();
                    } else if (jobName.equals(costCenterJobName)) {
                        isCostCenterReplicationJobExists.set(Boolean.TRUE);
                        totalJobsToBeCreated.getAndDecrement();
                    } else if (jobName.equals(timeDimensionJobName)) {
                        isTimeDimensionUpdateJobExists.set(Boolean.TRUE);
                        totalJobsToBeCreated.getAndDecrement();
                    } else if (jobName.equals(wfCapabilityJobName)) {
                        isWorkforceCapabilityReplicationJobExists.set(Boolean.TRUE);
                        totalJobsToBeCreated.getAndDecrement();
                    }
                });
            }

            createTenantJob(isWorkforceReplicationJobExists.get(), subDomain, workforceJobName, WORKFORCE_PERSON,
                    jobSchedulerRunHeader, totalJobsCreated);
            createTenantJob(isCostCenterReplicationJobExists.get(), subDomain, costCenterJobName, COST_CENTER,
                    jobSchedulerRunHeader, totalJobsCreated);
            createTenantJob(isTimeDimensionUpdateJobExists.get(), subDomain, timeDimensionJobName,
                    TIME_DIMENSION, jobSchedulerRunHeader, totalJobsCreated);
            createTenantJob(isWorkforceCapabilityReplicationJobExists.get(), subDomain, wfCapabilityJobName, WORKFORCE_CAPABILITY,
                jobSchedulerRunHeader, totalJobsCreated);
        });
        if (totalJobsToBeCreated.get() == totalJobsCreated.get()) {
            JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(true,
                    "Tenant Specific Jobs has been created successfully.");
            this.jobSchedulerService.updateJobRun(CREATE_TENANT_JOB_MARKER, this.providerSubDomain,
                    jobSchedulerRunHeader, jobScheduleRunPayload);
            LOGGER.info(CREATE_TENANT_JOB_MARKER, "Tenant Specific Jobs has been created successfully.");
        } else {
            JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(false,
                    "Tenant Specific Jobs has been failed. Kindly check full history of run for further details");
            this.jobSchedulerService.updateJobRun(CREATE_TENANT_JOB_MARKER, this.providerSubDomain,
                    jobSchedulerRunHeader, jobScheduleRunPayload);
            LOGGER.error(CREATE_TENANT_JOB_MARKER,
                    "Tenant Specific Jobs creation has been failed. Kindly check full history of run for further details.");
        }
    }

    /**
     * Method to crate the tenant specific jobs
     *
     * @param isReplicationJobExists : Represent if a job already exists.
     * @param subDomain              : represent the subDomain/identity of tenant
     *                               for which the job needs to be created
     * @param jobName                : jobName with which a job is supposed to be
     *                               created
     * @param replicationObject      : action endPoint which must triggered by job
     *                               run.
     * @param jobSchedulerRunHeader  : holds the information of jobSchedulerRun.
     * @param totalJobsCreated       : a counter to provide the information to check
     *                               if the job has succeeded or not.
     */
    private void createTenantJob(boolean isReplicationJobExists, String subDomain, String jobName,
            String replicationObject, JobSchedulerRunHeader jobSchedulerRunHeader, AtomicInteger totalJobsCreated) {
        JobSchedulerInfo tenantJobSchedulerInfo = this.prepareTenantJob(jobName, replicationObject);
        if (Boolean.FALSE.equals(isReplicationJobExists)) {
            if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(
                    this.jobSchedulerService.createJob(CREATE_TENANT_JOB_MARKER, subDomain, tenantJobSchedulerInfo)))) {
                JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(false,
                        StringFormatter.format("{0} has not been created with subDomain {1}", jobName, subDomain));
                this.jobSchedulerService.updateJobRun(CREATE_TENANT_JOB_MARKER, this.providerSubDomain,
                        jobSchedulerRunHeader, jobScheduleRunPayload);
                LOGGER.error(CREATE_TENANT_JOB_MARKER, "{} has not been created for subDomain {}", jobName, subDomain);
            } else {
                totalJobsCreated.getAndIncrement();
                JobScheduleRunPayload jobScheduleRunPayload = new JobScheduleRunPayload(true,
                        StringFormatter.format("{0} has been created with subDomain {1}", jobName, subDomain));
                this.jobSchedulerService.updateJobRun(CREATE_TENANT_JOB_MARKER, this.providerSubDomain,
                        jobSchedulerRunHeader, jobScheduleRunPayload);
                LOGGER.info(CREATE_TENANT_JOB_MARKER, "{} has been created for subDomain {}", jobName, subDomain);
            }
        }
    }

    /**
     * Method to create or update houseKeeper job
     *
     * @param isHouseKeeperExists : Represents if the houseKeeper job already exists
     *                            or not.
     */
    private void createOrUpdateHouseKeeperJob(boolean isHouseKeeperExists) {
        String subDomain = this.providerSubDomain;
        JobSchedulerInfo houseKeeperJob = this.prepareHouseKeeperJobPayload();
        if (isHouseKeeperExists) {
            if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(
                    this.jobSchedulerService.updateJob(HOUSE_KEEPER_JOB_MARKER, subDomain, houseKeeperJob))))
                LOGGER.error(HOUSE_KEEPER_JOB_MARKER, "HouseKeeper job has not been updated");
            else
                LOGGER.info(HOUSE_KEEPER_JOB_MARKER, "HouseKeeper job has been updated");
        } else {
            if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(
                    this.jobSchedulerService.createJob(HOUSE_KEEPER_JOB_MARKER, subDomain, houseKeeperJob))))
                LOGGER.error(HOUSE_KEEPER_JOB_MARKER, "HouseKeeper job has not been created");
            else
                LOGGER.info(HOUSE_KEEPER_JOB_MARKER, "HouseKeeper job has been created");
        }
    }

    /**
     * Method to prepare the houseKeeper job info
     *
     * @return : An Object of {@link JobSchedulerInfo} having housekeeper job
     *         information
     */
    private JobSchedulerInfo prepareHouseKeeperJobPayload() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(ISO8601_FORMAT_FOR_DATE_FORMATTING);
        String startDate = simpleDateFormat.format(new Date());

        JobSchedulerTime jobSchedulerStartTime = new JobSchedulerTime();
        jobSchedulerStartTime.setDate(startDate);
        jobSchedulerStartTime.setFormat(ISO8601_FORMAT_FOR_JOB_SCHEDULER);

        JSONObject jsonObject = new JSONObject();

        JobSchedulerSchedule jobSchedulerSchedule = createRecurringJobSchedule(REPEAT_INTERVAL_FOR_HOUSE_KEEPER, "Schedule to checks and create/update the tenants specific jobs (Cost Center replication, Fill time dimension, Workforce person and Workforce capability replication).", true, jobSchedulerStartTime);
        jobSchedulerSchedule.setData(jsonObject);

        List<JobSchedulerSchedule> jobSchedulerSchedules = new ArrayList<>();
        jobSchedulerSchedules.add(jobSchedulerSchedule);

        JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
        jobSchedulerJob.setName(HOUSE_KEEPER_JOB);
        jobSchedulerJob.setDescription(
                "Job to checks and create/update the tenants specific jobs (Cost Center replication, Fill time dimension, Workforce Person and Workforce Capability replication).");
        jobSchedulerJob.setAction(
                this.integrationServiceBaseUriBuilder.cloneBuilder().pathSegment(CREATE_TENANT_JOB).build().toString());
        jobSchedulerJob.setActive(true);
        jobSchedulerJob.setHttpMethod(HttpMethod.POST.toString());
        jobSchedulerJob.setSchedules(jobSchedulerSchedules);

        return jobSchedulerJob;
    }

    /**
     * Method to prepare the houseKeeper job info
     *
     * @return : An Object of {@link JobSchedulerInfo} having tenant specific job
     *         information
     */
    private JobSchedulerInfo prepareTenantJob(String jobName, String replicationObject) {
        String jobDescription = "";
        boolean jobActiveStatus = false;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(ISO8601_FORMAT_FOR_DATE_FORMATTING);
        String startDate = simpleDateFormat.format(new Date());
        JobSchedulerTime jobSchedulerStartTime = new JobSchedulerTime();
        jobSchedulerStartTime.setDate(startDate);
        jobSchedulerStartTime.setFormat(ISO8601_FORMAT_FOR_JOB_SCHEDULER);
        List<JobSchedulerSchedule> jobSchedulerSchedules = new ArrayList<>();
        JobSchedulerInfo jobSchedulerJob = new JobSchedulerInfo();
        jobSchedulerJob.setName(jobName);
        jobSchedulerJob.setHttpMethod(HttpMethod.POST.toString());
        jobSchedulerJob.setSchedules(jobSchedulerSchedules);
        switch (replicationObject) {
            case TIME_DIMENSION: {
                jobDescription = "Job to generate/populate the time dimension data in data base.";
                jobActiveStatus = true;
                JobSchedulerSchedule jobSchedulerSchedule = new JobSchedulerSchedule();
                jobSchedulerSchedule.setCron(CRON_JOB_PATTERN_FOR_TIME_DIMENSION);
                jobSchedulerSchedule
                    .setDescription("Schedule to trigger the time dimension job with frequency of every year.");
                jobSchedulerSchedule.setActive(true);
                jobSchedulerSchedule.setStartTime(jobSchedulerStartTime);
                JobSchedulerSchedule jobSchedulerSchedule2 = createOneTimeJobSchedule(FIRST_TIME_TIME_DIMENSION_JOB_RUN, "Schedule to trigger the time dimension job for immediate fill after the successful subscription.", true, jobSchedulerStartTime);
                jobSchedulerSchedules.add(jobSchedulerSchedule);
                jobSchedulerSchedules.add(jobSchedulerSchedule2);
                jobSchedulerJob.setAction(this.integrationServiceBaseUriBuilder.cloneBuilder().pathSegment(TIME_DIMENSION_UPDATE).build().toString());
                jobSchedulerJob.setDescription(jobDescription);
                jobSchedulerJob.setActive(jobActiveStatus);
                break;
            }
            case WORKFORCE_PERSON: {
                jobDescription = "Job to replicate the workforce data from MDI system.";
                jobActiveStatus = true;
                JobSchedulerSchedule oneTimeJobSchedule = createOneTimeJobSchedule(SCHEDULE_TIME_NOW, "Schedule to trigger the initial workforce person data replication from the MDI system.", false, jobSchedulerStartTime);
                jobSchedulerSchedules.add(oneTimeJobSchedule);
                JobSchedulerSchedule recurringJobSchedule = createRecurringJobSchedule(REPEAT_INTERVAL_FOR_WORKFORCE_REPLICATION, "Schedule to trigger the periodic workforce person data replication from the MDI system.", false, jobSchedulerStartTime);
                jobSchedulerSchedules.add(recurringJobSchedule);
                jobSchedulerJob.setAction(this.integrationServiceBaseUriBuilder.cloneBuilder().pathSegment(REPLICATE_WORK_FORCE).build().toString());
                jobSchedulerJob.setDescription(jobDescription);
                jobSchedulerJob.setActive(jobActiveStatus);
                break;
            }

            case COST_CENTER: {
                jobDescription = "Job to replicate the cost center data from MDI system.";
                jobActiveStatus = true;
                JobSchedulerSchedule oneTimeJobSchedule = createOneTimeJobSchedule(SCHEDULE_TIME_NOW, "Schedule to trigger the initial cost center data replication from the MDI system.", false, jobSchedulerStartTime);
                jobSchedulerSchedules.add(oneTimeJobSchedule);
                JobSchedulerSchedule recurringJobSchedule = createRecurringJobSchedule(REPEAT_INTERVAL_FOR_COST_CENTER_REPLICATION, "Schedule to trigger the periodic cost center data replication from the MDI system.", false, jobSchedulerStartTime);
                jobSchedulerSchedules.add(recurringJobSchedule);
                jobSchedulerJob.setAction(this.integrationServiceBaseUriBuilder.cloneBuilder().pathSegment(REPLICATE_COST_CENTER).build().toString());
                jobSchedulerJob.setDescription(jobDescription);
                jobSchedulerJob.setActive(jobActiveStatus);
                break;
            }
            case WORKFORCE_CAPABILITY: {
                jobDescription = "Job to replicate the workforce capability from MDI system.";
                jobActiveStatus = true;
                JobSchedulerSchedule oneTimeJobSchedule = createOneTimeJobSchedule(SCHEDULE_TIME_NOW, "Schedule to trigger the workforce capability replication from the MDI system.", false, jobSchedulerStartTime);
                jobSchedulerSchedules.add(oneTimeJobSchedule);
                JobSchedulerSchedule recurringJobSchedule = createRecurringJobSchedule(REPEAT_INTERVAL_FOR_WORKFORCE_CAPABILITY_REPLICATION, "Schedule to trigger the periodic workforce capability data replication from the MDI system.", false, jobSchedulerStartTime);
                jobSchedulerSchedules.add(recurringJobSchedule);
                jobSchedulerJob.setAction(this.skillsUriBuilder.cloneBuilder().pathSegment(REPLICATE_WORKFORCE_CAPABILITY).build().toString());
                jobSchedulerJob.setDescription(jobDescription);
                jobSchedulerJob.setActive(jobActiveStatus);
                break;
            }
            default: {
                LOGGER.info("Invalid replication endpoint");
            }
        }
        return jobSchedulerJob;
    }

    private JobSchedulerSchedule createRecurringJobSchedule(String repeatIntervalForWorkforceReplication, String description, boolean active, JobSchedulerTime jobSchedulerStartTime) {
        JobSchedulerSchedule jobSchedulerSchedule2 = new JobSchedulerSchedule();
        jobSchedulerSchedule2.setRepeatInterval(repeatIntervalForWorkforceReplication);
        jobSchedulerSchedule2.setDescription(
            description);
        jobSchedulerSchedule2.setActive(active);
        jobSchedulerSchedule2.setStartTime(jobSchedulerStartTime);
        return jobSchedulerSchedule2;
    }

    private JobSchedulerSchedule createOneTimeJobSchedule(String scheduleTimeNow, String description,
                                                          boolean active, JobSchedulerTime jobSchedulerStartTime) {
        JobSchedulerSchedule oneTimeJobSchedule = new JobSchedulerSchedule();
        oneTimeJobSchedule.setTime(scheduleTimeNow);
        oneTimeJobSchedule.setDescription(
            description);
        oneTimeJobSchedule.setActive(active);
        oneTimeJobSchedule.setStartTime(jobSchedulerStartTime);
        return oneTimeJobSchedule;
    }

}
