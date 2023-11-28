package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import jakarta.annotation.PostConstruct;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Marker;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerInfo;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRun;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRuns;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerSchedule;

@Service
@Primary
@Profile({ "local-test" })
public class JobSchedulerServiceLocalImpl implements JobSchedulerService {

    Map<String, JobSchedulerSchedule> costCenterSchedulerSchedules = new HashMap<>();

    Map<String, JobSchedulerSchedule> workforcePersonSchedulerSchedules = new HashMap<>();

    Map<String, JobSchedulerSchedule> workforceCapabilitySchedulerSchedules = new HashMap<>();
    private static final String INTEGRATION_TEST = "integration-test";
    private static final String RESOURCES = "resources";
    private static final String JOBSCHEDULER = "JobScheduler";

    @PostConstruct
    void init() {
        String costCenterJson;
        String workforceJson;
        String worforceCapabilityJson;
        try {
            costCenterJson = new String(Files
                    .readAllBytes(Paths.get("src", INTEGRATION_TEST, RESOURCES, JOBSCHEDULER, "jobs_CS.json")));
            workforceJson = new String(Files
                    .readAllBytes(Paths.get("src", INTEGRATION_TEST, RESOURCES, JOBSCHEDULER, "jobs_WF.json")));
            worforceCapabilityJson = new String(Files
                .readAllBytes(Paths.get("src", INTEGRATION_TEST, RESOURCES, JOBSCHEDULER, "jobs_WC.json")));
        } catch (IOException e) {
            costCenterJson = "[]";
            workforceJson = "[]";
            worforceCapabilityJson = "[]";
        }
        JobSchedulerInfo jobSchedulerJobCS = new JobSchedulerInfo();
        jobSchedulerJobCS.fromJson(new JSONObject(costCenterJson));
        jobSchedulerJobCS.getSchedules().forEach(a -> costCenterSchedulerSchedules.put(a.getScheduleId(), a));
        JobSchedulerInfo jobSchedulerJobWF = new JobSchedulerInfo();
        jobSchedulerJobWF.fromJson(new JSONObject(workforceJson));
        jobSchedulerJobWF.getSchedules().forEach(a -> workforcePersonSchedulerSchedules.put(a.getScheduleId(), a));
        JobSchedulerInfo jobSchedulerJobWC = new JobSchedulerInfo();
        jobSchedulerJobWC.fromJson(new JSONObject(worforceCapabilityJson));
        jobSchedulerJobWC.getSchedules().forEach(a -> workforceCapabilitySchedulerSchedules.put(a.getScheduleId(), a));
    }

    @Override
    public JobSchedulerInfo getJob(Marker loggingMarker, String subDomain, String job) {
        return null;
    }

    @Override
    public JSONArray getJobsByTenantId(Marker loggingMarker, String subDomain, String tenantId) {
        return null;
    }

    @Override
    public String createJob(Marker loggingMarker, String subDomain, JobSchedulerInfo jobSchedulerJob) {
        return null;
    }

    @Override
    public String updateJob(Marker loggingMarker, String subDomain, JobSchedulerInfo jobSchedulerJob) {
        return null;
    }

    @Override
    public void updateJobRun(Marker loggingMarker, String subDomain, JobSchedulerRunHeader jobSchedulerRunHeader,
            JobScheduleRunPayload jobScheduleRunPayload) {
    }

    @Override
    public boolean deactivateAllJobSchedules(final Marker loggingMarker, final String subDomain, final String jobId) {
        return false;
    }

    @Override
    public CompletableFuture<List<JobSchedulerSchedule>> getJobSchedulesByName(final Marker loggingMarker,
            final String subDomain, final String jobName) {
        if (jobName.contains(JobSchedulerSymbols.COST_CENTER.getSymbol())) {
            costCenterSchedulerSchedules.values().forEach(schedule -> {
                schedule.setJobId(String.valueOf(206026));
                schedule.setJobName("CF_CS_1234");
            });
            if (costCenterSchedulerSchedules.isEmpty())
                return CompletableFuture.completedFuture(Collections.emptyList());
            else
                return CompletableFuture
                        .completedFuture(new ArrayList<JobSchedulerSchedule>(costCenterSchedulerSchedules.values()));
        } else if (jobName.contains(JobSchedulerSymbols.WORKFORCE_CAPABILITY.getSymbol())) {
            workforceCapabilitySchedulerSchedules.values().forEach(schedule -> {
                schedule.setJobId(String.valueOf(206026));
                schedule.setJobName("SKILLS_WC_1234");
            });
            if (workforceCapabilitySchedulerSchedules.isEmpty())
                return CompletableFuture.completedFuture(Collections.emptyList());
            else
                return CompletableFuture
                    .completedFuture(new ArrayList<JobSchedulerSchedule>(workforceCapabilitySchedulerSchedules.values()));
        } else {
            workforcePersonSchedulerSchedules.values().forEach(schedule -> {
                schedule.setJobId(String.valueOf(206025));
                schedule.setJobName("CF_WF_1234");
            });
            if (workforcePersonSchedulerSchedules.isEmpty())
                return CompletableFuture.completedFuture(Collections.emptyList());
            else
                return CompletableFuture.completedFuture(
                        new ArrayList<JobSchedulerSchedule>(workforcePersonSchedulerSchedules.values()));
        }
    }

    @Override
    public JobSchedulerRuns getJobScheduleRuns(Marker loggingMarker, String subDomain, String jobId,
            String scheduleId) {
        return null;
    }

    @Override
    public JobSchedulerRuns getJobScheduleRuns(Marker loggingMarker, String subDomain, String jobId, String scheduleId,
            int pageSize, int offset) {
        return null;
    }

    @Override
    public JobSchedulerRun getJobRun(Marker loggingMarker, String subDomain, String jobId, String scheduleId,
            String runId) {
        return null;
    }

    @Override
    public boolean ifPreviousRunComplete(Marker loggingMarker, String subDomain,
            JobSchedulerRunHeader jobSchedulerRunHeader) {
        return false;
    }

    @Override
    public JobSchedulerSchedule getJobSchedule(Marker loggingMarker, String subDomain, String jobId,
            String scheduleId) {
        JobSchedulerSchedule scheduleCS = costCenterSchedulerSchedules.get(scheduleId);
        JobSchedulerSchedule scheduleWF = workforcePersonSchedulerSchedules.get(scheduleId);
        JobSchedulerSchedule scheduleWC = workforceCapabilitySchedulerSchedules.get(scheduleId);
        if (scheduleCS != null) {
            scheduleCS.setJobId(jobId);
            scheduleCS.setJobName("CF_CS_1234");
            return scheduleCS;
        } else if (scheduleWF != null) {
            scheduleWF.setJobId(jobId);
            scheduleWF.setJobName("CF_WF_1234");
            return scheduleWF;
        } else if(scheduleWC != null) {
            scheduleWC.setJobId(jobId);
            scheduleWC.setJobName("SKILLS_WC_1234");
            return scheduleWC;
        }
        return null;
    }

    @Override
    public JobSchedulerSchedule updateJobSchedule(Marker loggingMarker, String subDomain, String jobId,
            String scheduleId, JobSchedulerSchedule jobSchedulerSchedule) {
        JobSchedulerSchedule scheduleCS = costCenterSchedulerSchedules.get(scheduleId);
        JobSchedulerSchedule scheduleWF = workforcePersonSchedulerSchedules.get(scheduleId);
        JobSchedulerSchedule scheduleWC = workforceCapabilitySchedulerSchedules.get(scheduleId);
        ObjectMapper mapper = new ObjectMapper();
        JobSchedulerSchedule defaults;
        try {
            if (scheduleCS != null) {

                defaults = mapper.readValue(scheduleCS.toJson().toString(), JobSchedulerSchedule.class);
                ObjectReader updater = mapper.readerForUpdating(defaults);
                scheduleCS = updater.readValue(jobSchedulerSchedule.toJson().toString());
                scheduleCS.setJobId(jobId);
                scheduleCS.setJobName("CF_CS_1234");
                costCenterSchedulerSchedules.replace(scheduleCS.getScheduleId(), scheduleCS);
                return scheduleCS;
            } else if (scheduleWF != null) {

                defaults = mapper.readValue(scheduleWF.toJson().toString(), JobSchedulerSchedule.class);
                ObjectReader updater = mapper.readerForUpdating(defaults);
                scheduleWF = updater.readValue(jobSchedulerSchedule.toJson().toString());
                scheduleWF.setJobId(jobId);
                scheduleWF.setJobName("CF_WF_1234");
                workforcePersonSchedulerSchedules.replace(scheduleWF.getScheduleId(), scheduleWF);
                return scheduleWF;
            } else if (scheduleWC != null) {
                defaults = mapper.readValue(scheduleWC.toJson().toString(), JobSchedulerSchedule.class);
                ObjectReader updater = mapper.readerForUpdating(defaults);
                scheduleWC = updater.readValue(jobSchedulerSchedule.toJson().toString());
                scheduleWC.setJobId(jobId);
                scheduleWC.setJobName("SKILLD_WC_1234");
                workforceCapabilitySchedulerSchedules.replace(scheduleWC.getScheduleId(), scheduleWC);
                return scheduleWC;
            } else {
                return null;
            }
        } catch (JsonProcessingException | JSONException e) {
            return null;
        }
    }

}
