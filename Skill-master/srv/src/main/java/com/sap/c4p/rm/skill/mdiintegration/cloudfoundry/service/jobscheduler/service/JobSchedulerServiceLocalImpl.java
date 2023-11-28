package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.*;
import jakarta.annotation.PostConstruct;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Service
@Primary
@Profile({ "local" })
public class JobSchedulerServiceLocalImpl implements JobSchedulerService {

  private static final Logger LOGGER = LoggerFactory.getLogger(JobSchedulerServiceLocalImpl.class);

  Map<String, JobSchedulerSchedule> wfCapabilitySchedulerSchedules = new HashMap<>();

  @PostConstruct
  void init() {
    String workforceCapabilityJson;
    try {
      workforceCapabilityJson = new String(
          Files.readAllBytes(Paths.get("src", "integration-test", "resources", "JobScheduler", "jobs_WC.json")));
    } catch (IOException e) {
      workforceCapabilityJson = "[]";
    }
    JobSchedulerInfo jobSchedulerJobWC = new JobSchedulerInfo();
    jobSchedulerJobWC.fromJson(new JSONObject(workforceCapabilityJson));
    jobSchedulerJobWC.getSchedules().forEach(a -> wfCapabilitySchedulerSchedules.put(a.getScheduleId(), a));
  }

  @Override
  public void updateJobRun(Marker loggingMarker, String subDomain, JobSchedulerRunHeader jobSchedulerRunHeader,
      JobScheduleRunPayload jobScheduleRunPayload) {
    // Do nothing as this would be executed locally.
  }

  @Override
  public boolean ifPreviousRunComplete(Marker loggingMarker, String subDomain,
      JobSchedulerRunHeader jobSchedulerRunHeader) {
    LOGGER.info("Reached Local implementation of JobScheduler, returning false");
    return false;
  }

  @Override
  public JobSchedulerRuns getJobScheduleRuns(Marker loggingMarker, String subDomain, String jobId, String scheduleId) {
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

}
