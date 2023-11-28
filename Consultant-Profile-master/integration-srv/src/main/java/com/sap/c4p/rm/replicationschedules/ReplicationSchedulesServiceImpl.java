package com.sap.c4p.rm.replicationschedules;

import static com.sap.c4p.rm.utils.Constants.SKILLS_DOMAIN_JOB_NAME;
import static com.sap.c4p.rm.utils.Constants.TENANT_SPECIFIC_JOB_NAME;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.cloudfoundry.environment.XSUaaVCAP;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerInfo;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerSchedule;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerSymbols;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.gen.MessageKeys;
import com.sap.c4p.rm.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.c4p.rm.utils.StringFormatter;

@Service
public class ReplicationSchedulesServiceImpl implements ReplicationSchedulesService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ReplicationSchedulesServiceImpl.class);
    private static final Marker REPLICATION_SCHEDULES = LoggingMarker.REPLICATION_SCHEDULES.getMarker();
    private static final String RECURRING = "recurring";

    private final JobSchedulerService jobSchedulerService;
    private final OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO;
    private final XsuaaUserInfo xsUaaUserInfo;
    private final XSUaaVCAP xsUaaVCAP;

    @Autowired
    public ReplicationSchedulesServiceImpl(final JobSchedulerService jobSchedulerService,
            final OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO, final XsuaaUserInfo xsUaaUserInfo,
            final XSUaaVCAP xsUaaVCAP) {
        this.jobSchedulerService = jobSchedulerService;
        this.oneMDSReplicationDeltaTokenDAO = oneMDSReplicationDeltaTokenDAO;
        this.xsUaaUserInfo = xsUaaUserInfo;
        this.xsUaaVCAP = xsUaaVCAP;
    }

    @Override
    public List<JobSchedulerInfo> fetchJobs() {
        return this.fetchJobsAndReturn(this.xsUaaUserInfo.getTenant(), this.xsUaaUserInfo.getSubDomain());
    }

    @Override
    public List<JobSchedulerSchedule> fetchJobSchedules() {
        List<JobSchedulerSchedule> allSchedules = new ArrayList<>();
        String tenantId = this.xsUaaUserInfo.getTenant();
        String subDomainId = this.xsUaaUserInfo.getSubDomain();
        String workforceJobName = StringFormatter
                .format(TENANT_SPECIFIC_JOB_NAME, JobSchedulerSymbols.WORKFORCE_PERSON.getSymbol(), tenantId)
                .replace("-", "");
        String costCenterJobName = StringFormatter
                .format(TENANT_SPECIFIC_JOB_NAME, JobSchedulerSymbols.COST_CENTER.getSymbol(), tenantId)
                .replace("-", "");
        String workforceCapabilityJobName = StringFormatter
            .format(SKILLS_DOMAIN_JOB_NAME, JobSchedulerSymbols.WORKFORCE_CAPABILITY.getSymbol(), tenantId)
            .replace("-", "");
        CompletableFuture<List<JobSchedulerSchedule>> costCenterSchedulesFuture = jobSchedulerService
                .getJobSchedulesByName(REPLICATION_SCHEDULES, subDomainId, costCenterJobName);
        CompletableFuture<List<JobSchedulerSchedule>> workforceSchedulesFuture = jobSchedulerService
                .getJobSchedulesByName(REPLICATION_SCHEDULES, subDomainId, workforceJobName);
        CompletableFuture<List<JobSchedulerSchedule>> workforceCapabilitySchedulesFuture = jobSchedulerService
            .getJobSchedulesByName(REPLICATION_SCHEDULES, subDomainId, workforceCapabilityJobName);
        CompletableFuture.allOf(workforceSchedulesFuture, costCenterSchedulesFuture, workforceCapabilitySchedulesFuture).join();
        costCenterSchedulesFuture.whenComplete((completeResult, completeError) -> {
            if (completeError != null) {
                LOGGER.error("An exception occurred while fetching cost center replication schedules");
            } else if (completeResult != null) {
                completeResult.forEach(schedule -> schedule.setJobName(costCenterJobName));
                completeResult.sort(Comparator.comparing(JobSchedulerSchedule::getType));
                allSchedules.addAll(completeResult);
            }
        });

        workforceSchedulesFuture.whenComplete((completeResult, completeError) -> {
            if (completeError != null) {
                LOGGER.error("An exception occurred while fetching workforce persons replication schedules");
            } else if (completeResult != null) {
                completeResult.forEach(schedule -> schedule.setJobName(workforceJobName));
                completeResult.sort(Comparator.comparing(JobSchedulerSchedule::getType));
                allSchedules.addAll(completeResult);
            }
        });

        workforceCapabilitySchedulesFuture.whenComplete((completeResult, completeError) -> {
            if (completeError != null) {
                LOGGER.error("An exception occurred while fetching workforce capability replication schedules");
            } else if (completeResult != null) {
                completeResult.forEach(schedule -> schedule.setJobName(workforceCapabilityJobName));
                completeResult.sort(Comparator.comparing(JobSchedulerSchedule::getType));
                allSchedules.addAll(completeResult);
            }
        });

        return allSchedules;
    }

    @Override
    public JobSchedulerSchedule fetchJobSchedule(String jobId, String scheduleId, String subdomainId) {
        return jobSchedulerService.getJobSchedule(REPLICATION_SCHEDULES, subdomainId, jobId, scheduleId);
    }

    @Override
    public JobSchedulerSchedule activateJobSchedule(String jobId, String scheduleId) {
        JobSchedulerSchedule jobSchedulerSchedule = new JobSchedulerSchedule();
        jobSchedulerSchedule.setActive(Boolean.TRUE);
        return jobSchedulerService.updateJobSchedule(REPLICATION_SCHEDULES, this.xsUaaUserInfo.getSubDomain(), jobId,
                scheduleId, jobSchedulerSchedule);
    }

    @Override
    public JobSchedulerSchedule deactivateJobSchedule(String jobId, String scheduleId) {
        JobSchedulerSchedule jobSchedulerSchedule = new JobSchedulerSchedule();
        jobSchedulerSchedule.setActive(Boolean.FALSE);
        return jobSchedulerService.updateJobSchedule(REPLICATION_SCHEDULES, this.xsUaaUserInfo.getSubDomain(), jobId,
                scheduleId, jobSchedulerSchedule);
    }

    @Override
    public Boolean deactivateAllJobSchedules(String jobId) {
        String subDomain = this.xsUaaUserInfo.getSubDomain();
        return this.jobSchedulerService.deactivateAllJobSchedules(REPLICATION_SCHEDULES, subDomain, jobId);
    }

    @Override
    public JobSchedulerSchedule updateJobScheduleTime(String jobId, String scheduleId, Instant time) {
        JobSchedulerSchedule jobSchedulerSchedule = new JobSchedulerSchedule();
        jobSchedulerSchedule.setTime(time.toString());
        jobSchedulerSchedule.setActive(Boolean.TRUE);
        return jobSchedulerService.updateJobSchedule(REPLICATION_SCHEDULES, this.xsUaaUserInfo.getSubDomain(), jobId,
                scheduleId, jobSchedulerSchedule);
    }

    @Override
    public JobSchedulerSchedule updateJobScheduleRepeatInterval(String jobId, String scheduleId,
            Integer repeatInterval) {
        JobSchedulerSchedule jobSchedulerSchedule = new JobSchedulerSchedule();
        jobSchedulerSchedule.setRepeatInterval(repeatInterval.toString() + " minutes");
        jobSchedulerSchedule.setActive(Boolean.TRUE);
        return jobSchedulerService.updateJobSchedule(REPLICATION_SCHEDULES, this.xsUaaUserInfo.getSubDomain(), jobId,
                scheduleId, jobSchedulerSchedule);
    }

    @Override
    public boolean isInitialLoadComplete(final MDIEntities entity) {
        return this.oneMDSReplicationDeltaTokenDAO.getDeltaToken(entity).isPresent();
    }

    @Override
    public void validateCostCenterActivation(String jobId, String scheduleId) {
        JobSchedulerSchedule jobSchedule = jobSchedulerService.getJobSchedule(REPLICATION_SCHEDULES,
                this.xsUaaUserInfo.getSubDomain(), jobId, scheduleId);
        if (jobSchedule != null && jobSchedule.getType().equals(RECURRING)
                && !isInitialLoadComplete(MDIEntities.COST_CENTER)) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.DELTA_BEFORE_INITIAL_ERROR_CS);
        }
    }

    @Override
    public void validateWorkforceActivation(String jobId, String scheduleId) {
        JobSchedulerSchedule jobSchedule = jobSchedulerService.getJobSchedule(REPLICATION_SCHEDULES,
                this.xsUaaUserInfo.getSubDomain(), jobId, scheduleId);
        if (jobSchedule != null && !isInitialLoadComplete(MDIEntities.COST_CENTER)) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.WF_BEFORE_CS_ERROR);
        }
        if (jobSchedule != null && jobSchedule.getType().equals(RECURRING)
                && !isInitialLoadComplete(MDIEntities.WORKFORCE_PERSON)) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.DELTA_BEFORE_INITIAL_ERROR_WF);
        }
    }

    @Override
    public void validateWorkforceCapabilityOneTimeActivation(String jobId, String scheduleId) {
        JobSchedulerSchedule jobSchedule = jobSchedulerService.getJobSchedule(REPLICATION_SCHEDULES,
            this.xsUaaUserInfo.getSubDomain(), jobId, scheduleId);
        if (jobSchedule != null && jobSchedule.getType().equals(RECURRING)
            && !isInitialLoadComplete(MDIEntities.WORKFORCE_CAPABILITY)) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.DELTA_BEFORE_INITIAL_ERROR_WC);
        }
    }

    @Override
    public List<JobSchedulerInfo> fetchJobsWithProviderContext() {
        return this.fetchJobsAndReturn(this.xsUaaUserInfo.getTenant(), this.xsUaaVCAP.getIdentityZone());
    }

    @Override
    public Boolean deactivateAllJobSchedulesWithProviderContext(String jobId) {
        String subDomain = this.xsUaaVCAP.getIdentityZone();
        return this.jobSchedulerService.deactivateAllJobSchedules(REPLICATION_SCHEDULES, subDomain, jobId);
    }

    private List<JobSchedulerInfo> fetchJobsAndReturn(String tenantId, String subDomain) {
        List<JobSchedulerInfo> allJobs = new ArrayList<>();

        JSONArray jobArray;
        if ((jobArray = this.jobSchedulerService.getJobsByTenantId(REPLICATION_SCHEDULES, subDomain, tenantId)) != null)
            jobArray.forEach(job -> {
                JobSchedulerInfo jobInfo = new JobSchedulerInfo();
                jobInfo.fromJson((JSONObject) job);
                allJobs.add(jobInfo);
            });

        if (allJobs.isEmpty())
            return Collections.emptyList();
        else
            return allJobs;
    }
}
