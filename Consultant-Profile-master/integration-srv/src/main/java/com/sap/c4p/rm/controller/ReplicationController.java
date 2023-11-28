package com.sap.c4p.rm.controller;

import static com.sap.c4p.rm.utils.Constants.*;

import java.util.concurrent.Executors;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;
import com.sap.hcp.cf.logging.common.LogContext;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerSymbols;
import com.sap.c4p.rm.handlers.ReplicationJobs;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.c4p.rm.utils.StringFormatter;

/**
 * A {@link RestController} to expose an endpoint for JobScheduler service to
 * invoke the replication.
 */
@RestController
@PreAuthorize(HAS_JOB_SCHEDULER_AUTHORITY)
public class ReplicationController {
    public static final String REPLICATE_WORK_FORCE = "replicateWorkforce";
    public static final String REPLICATE_COST_CENTER = "replicateCostCenter";
    private static final String REPLICATION_ID_INITIAL = "CP_Replication_{0}_ID-{1}";

    private final CdsRuntime cdsRuntime;
    private final ReplicationJobs replicationJobs;
    private final XsuaaUserInfo xsuaaUserInfo;

    @Autowired
    public ReplicationController(final CdsRuntime cdsRuntime, final ReplicationJobs replicationJobs,
            final XsuaaUserInfo xsuaaUserInfo) {
        this.cdsRuntime = cdsRuntime;
        this.replicationJobs = replicationJobs;
        this.xsuaaUserInfo = xsuaaUserInfo;
    }

    /**
     * The JobScheduler's job invokes this endPoint/controller to initiate the
     * replication of workforce.
     *
     * @param jobId:          Request Header provides the JobId of workforce
     *                        replication job.
     * @param jobSchedulerId: Request Header provides the ScheduleId of workforce
     *                        replication job.
     * @param jobRunId:       Request Header provides the RunId of particular run.
     * @param schedulerHost:  Request Header provides the schedulerHost of workforce
     *                        replication job.
     * @param runAt:          Request Header provides the DateTime of specific run.
     * @return final status to the replication job run
     */
    @PostMapping(path = "/" + REPLICATE_WORK_FORCE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> replicateWorkforce(@RequestHeader(name = X_SAP_JOB_ID) final String jobId,
            @RequestHeader(name = X_SAP_JOB_SCHEDULE_ID) final String jobSchedulerId,
            @RequestHeader(name = X_SAP_JOB_RUN_ID) final String jobRunId,
            @RequestHeader(name = X_SAP_SCHEDULER_HOST) final String schedulerHost,
            @RequestHeader(name = X_SAP_RUN_AT) final String runAt) {
        String customerSubDomain = this.xsuaaUserInfo.getSubDomain();
        if (IsNullCheckUtils.isNullOrEmpty(customerSubDomain))
            return new ResponseEntity<>(
                    "Unable to find the customer. Hence the workforce/employee replication could not be triggered.",
                    HttpStatus.PRECONDITION_FAILED);

        JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(jobId)
                .schedulerId(jobSchedulerId).runId(jobRunId).host(schedulerHost).runAt(runAt).build();
        String correlationId = LogContext.getCorrelationId();
        String requestId = StringFormatter.format(REPLICATION_ID_INITIAL,
                JobSchedulerSymbols.WORKFORCE_PERSON.getSymbol(), correlationId);
        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.set(X_CORRELATION_ID, correlationId);
        responseHeader.setContentType(MediaType.APPLICATION_JSON);
        RequestContextRunner requestContextRunner = this.cdsRuntime.requestContext().providedUser();
        Executors.newSingleThreadExecutor().submit(() -> requestContextRunner.run(requestContext -> {
            MDC.put(CORRELATION_ID, correlationId);
            this.replicationJobs.submitForWorkforceReplication(customerSubDomain, jobSchedulerRunHeader);
        }));
        return new ResponseEntity<>(StringFormatter.format("Workforce Replication Correlation ID: {0}", requestId),
                responseHeader, HttpStatus.ACCEPTED);
    }

    /**
     * The JobScheduler's job invokes this endPoint/controller to initiate the
     * replication of cost centers.
     *
     * @param jobId:          Request Header provides the JobId of cost centers
     *                        replication job.
     * @param jobSchedulerId: Request Header provides the ScheduleId of cost center
     *                        replication job.
     * @param jobRunId:       Request Header provides the RunId of particular run.
     * @param schedulerHost:  Request Header provides the schedulerHost of cost
     *                        centers replication job.
     * @param runAt:          Request Header provides the DateTime of specific run.
     * @return final status to the replication job run
     */
    @PostMapping(path = "/" + REPLICATE_COST_CENTER, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> replicateCostCenter(@RequestHeader(name = X_SAP_JOB_ID) final String jobId,
            @RequestHeader(name = X_SAP_JOB_SCHEDULE_ID) final String jobSchedulerId,
            @RequestHeader(name = X_SAP_JOB_RUN_ID) final String jobRunId,
            @RequestHeader(name = X_SAP_SCHEDULER_HOST) final String schedulerHost,
            @RequestHeader(name = X_SAP_RUN_AT) final String runAt) {
        String customerSubDomain = this.xsuaaUserInfo.getSubDomain();
        if (IsNullCheckUtils.isNullOrEmpty(customerSubDomain))
            return new ResponseEntity<>(
                    "Unable to find the customer. Hence the cost center replication could not be triggered.",
                    HttpStatus.PRECONDITION_FAILED);

        JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(jobId)
                .schedulerId(jobSchedulerId).runId(jobRunId).host(schedulerHost).runAt(runAt).build();
        String correlationId = LogContext.getCorrelationId();
        String requestId = StringFormatter.format(REPLICATION_ID_INITIAL, JobSchedulerSymbols.COST_CENTER.getSymbol(),
                correlationId);
        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.set("X-CorrelationID", correlationId);
        responseHeader.setContentType(MediaType.APPLICATION_JSON);
        RequestContextRunner requestContextRunner = this.cdsRuntime.requestContext().providedUser();
        Executors.newSingleThreadExecutor().submit(() -> requestContextRunner.run(requestContext -> {
            MDC.put(CORRELATION_ID, correlationId);
            this.replicationJobs.submitForCostCenterReplication(customerSubDomain, jobSchedulerRunHeader);
        }));
        return new ResponseEntity<>(StringFormatter.format("CostCenter Replication Correlation ID: {0}", requestId),
                responseHeader, HttpStatus.ACCEPTED);
    }

}
