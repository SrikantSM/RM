package com.sap.c4p.rm.controller;

import static com.sap.c4p.rm.utils.Constants.*;

import java.util.concurrent.Executors;

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

import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;
import com.sap.hcp.cf.logging.common.LogContext;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.handlers.MyBackgroundJobs;
import com.sap.c4p.rm.utils.StringFormatter;

/**
 * A {@link RestController} to expose an endpoint to JobScheduler service to
 * invoke the maintenance of tenant specific Replication Jobs
 */
@RestController
@PreAuthorize(HAS_JOB_SCHEDULER_AUTHORITY)
public class JobSchedulerController {

    public static final String CREATE_TENANT_JOB = "createTenantJobs";
    private static final String HOUSE_KEEPER_REQUEST_ID = "CP_HouseKeeper_ID-{0}";

    private final CdsRuntime cdsRuntime;
    private final MyBackgroundJobs myBackgroundJobs;

    @Autowired
    public JobSchedulerController(final CdsRuntime cdsRuntime, final MyBackgroundJobs myBackgroundJobs) {
        this.cdsRuntime = cdsRuntime;
        this.myBackgroundJobs = myBackgroundJobs;
    }

    /**
     * The House Keeper job invokes this endPoint/controller to create jobs for the
     * tenants.
     *
     * @param jobId:          Request Header provides the JobId of HouseKeeper job.
     * @param jobSchedulerId: Request Header provides the ScheduleId of HouseKeeper
     *                        job.
     * @param jobRunId:       Request Header provides the RunId of particular run.
     * @param schedulerHost:  Request Header provides the schedulerHost of
     *                        HouseKeeper job.
     * @param runAt:          Request Header provides the DateTime of specific run.
     * @return return the status to JobScheduler to inform that the job has been
     *         accepted
     */
    @PostMapping(path = CREATE_TENANT_JOB, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createTenantJobs(@RequestHeader(name = X_SAP_JOB_ID) final String jobId,
            @RequestHeader(name = X_SAP_JOB_SCHEDULE_ID) final String jobSchedulerId,
            @RequestHeader(name = X_SAP_JOB_RUN_ID) final String jobRunId,
            @RequestHeader(name = X_SAP_SCHEDULER_HOST) final String schedulerHost,
            @RequestHeader(name = X_SAP_RUN_AT) final String runAt) {
        JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(jobId)
                .schedulerId(jobSchedulerId).runId(jobRunId).host(schedulerHost).runAt(runAt).build();
        String correlationId = LogContext.getCorrelationId();
        String requestId = StringFormatter.format(HOUSE_KEEPER_REQUEST_ID, correlationId);
        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.set(X_CORRELATION_ID, correlationId);
        responseHeader.setContentType(MediaType.APPLICATION_JSON);
        RequestContextRunner requestContextRunner = this.cdsRuntime.requestContext().providedUser();
        Executors.newSingleThreadExecutor().submit(() -> requestContextRunner.run(requestContext -> {
            MDC.put(CORRELATION_ID, correlationId);
            this.myBackgroundJobs.submitForTenantJobs(jobSchedulerRunHeader);
        }));
        return new ResponseEntity<>(StringFormatter.format("The House Keeper job has been submitted: {0}", requestId),
                responseHeader, HttpStatus.ACCEPTED);
    }

}
