package com.sap.c4p.rm.skill.mdiintegration.controller;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service.JobSchedulerSymbols;
import com.sap.c4p.rm.skill.mdiintegration.handlers.ReplicationJobs;
import com.sap.c4p.rm.skill.mdiintegration.handlers.ReplicationJobsImpl;
import com.sap.c4p.rm.skill.mdiintegration.utils.Constants;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;
import com.sap.c4p.rm.skill.mdiintegration.utils.StringFormatter;
import com.sap.c4p.rm.skill.services.validators.SingleSkillSourceValidator;
import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;
import com.sap.hcp.cf.logging.common.LogContext;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.Executors;

import static com.sap.c4p.rm.skill.mdiintegration.utils.Constants.*;

@RestController
@PreAuthorize(HAS_JOB_SCHEDULER_AUTHORITY)
public class ReplicationController {

  private static final String REPLICATION_ID_INITIAL = "Skill_Replication_{0}_ID-{1}";
  public static final String REPLICATE_WORK_FORCE_CAPABILITY = "replicateWorkforceCapability";

  private final CdsRuntime cdsRuntime;
  private final ReplicationJobs replicationJobs;
  private final XsuaaUserInfo xsuaaUserInfo;

  private final SingleSkillSourceValidator singleSkillSourceValidator;

  @Autowired
  public ReplicationController(final CdsRuntime cdsRuntime, final ReplicationJobsImpl replicationJobs,
      final XsuaaUserInfo xsuaaUserInfo, SingleSkillSourceValidator singleSkillSourceValidator) {
    this.cdsRuntime = cdsRuntime;
    this.replicationJobs = replicationJobs;
    this.xsuaaUserInfo = xsuaaUserInfo;
    this.singleSkillSourceValidator = singleSkillSourceValidator;
  }

  /**
   * The JobScheduler's job invokes this endPoint/controller to initiate the
   * replication of workforce.
   *
   * @param jobId:          Request Header provides the JobId of workforce
   *                        capability replication job.
   * @param jobSchedulerId: Request Header provides the ScheduleId of workforce
   *                        capability replication job.
   * @param jobRunId:       Request Header provides the RunId of particular run.
   * @param schedulerHost:  Request Header provides the schedulerHost of workforce
   *                        capability replication job.
   * @param runAt:          Request Header provides the DateTime of specific run.
   * @return final status to the replication job run
   */
  @PostMapping(path = "/" + REPLICATE_WORK_FORCE_CAPABILITY, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> replicateWorkforceCapability(@RequestHeader(name = X_SAP_JOB_ID) final String jobId,
      @RequestHeader(name = X_SAP_JOB_SCHEDULE_ID) final String jobSchedulerId,
      @RequestHeader(name = X_SAP_JOB_RUN_ID) final String jobRunId,
      @RequestHeader(name = X_SAP_SCHEDULER_HOST) final String schedulerHost,
      @RequestHeader(name = X_SAP_RUN_AT) final String runAt) {
    String customerSubDomain = this.xsuaaUserInfo.getSubDomain();

    if (IsNullCheckUtils.isNullOrEmpty(customerSubDomain))
      return new ResponseEntity<>(
          "Unable to find the customer. Hence the workforce capability replication could not be triggered.",
          HttpStatus.PRECONDITION_FAILED);
    if (singleSkillSourceValidator.checkIfMDIReplicationAllowed().equals(Boolean.FALSE))
      return new ResponseEntity<>(
          "Replication of workforce capability data failed, since there are skills, "
              + "catalogs, and proficiencies originally created in resource management ",
          HttpStatus.PRECONDITION_FAILED);

    JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(jobId)
        .schedulerId(jobSchedulerId).runId(jobRunId).host(schedulerHost).runAt(runAt).build();

    String correlationId = LogContext.getCorrelationId();
    String requestId = StringFormatter.format(REPLICATION_ID_INITIAL,
        JobSchedulerSymbols.WORKFORCE_CAPABILITY.getSymbol(), correlationId);
    HttpHeaders responseHeader = new HttpHeaders();
    responseHeader.set(Constants.X_CORRELATION_ID, correlationId);
    responseHeader.setContentType(MediaType.APPLICATION_JSON);
    RequestContextRunner requestContextRunner = this.cdsRuntime.requestContext().providedUser();

    Executors.newSingleThreadExecutor().submit(() -> requestContextRunner.run(requestContext -> {
      MDC.put(Constants.CORRELATION_ID, correlationId);
     this.replicationJobs.submitForWorkforceCapabilityObjectsReplication(customerSubDomain, jobSchedulerRunHeader);
     }));
    return new ResponseEntity<>(
        StringFormatter.format("Workforce Capability Replication Correlation ID: {0}", requestId), responseHeader,
        HttpStatus.ACCEPTED);
  }

}
