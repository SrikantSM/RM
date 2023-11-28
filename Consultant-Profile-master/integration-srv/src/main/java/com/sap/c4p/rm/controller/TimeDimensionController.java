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

import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;
import com.sap.hcp.cf.logging.common.LogContext;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.handlers.TimeDimensionJobs;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.c4p.rm.utils.StringFormatter;

@RestController
@PreAuthorize(HAS_JOB_SCHEDULER_AUTHORITY)
public class TimeDimensionController {

    public static final String TIME_DIMENSION_UPDATE = "timeDimensionUpdate";
    private static final String TIME_DIM_ID_INITIAL = "CP_TimeDimSchedule_ID-{0}";

    private final CdsRuntime cdsRuntime;
    private final TimeDimensionJobs timeDimensionJobs;
    private final XsuaaUserInfo xsuaaUserInfo;

    @Autowired
    public TimeDimensionController(final CdsRuntime cdsRuntime, final TimeDimensionJobs timeDimensionJobs,
            final XsuaaUserInfo xsuaaUserInfo) {
        this.cdsRuntime = cdsRuntime;
        this.timeDimensionJobs = timeDimensionJobs;
        this.xsuaaUserInfo = xsuaaUserInfo;
    }

    @PostMapping(path = "/" + TIME_DIMENSION_UPDATE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> scheduleTimeDimension(@RequestHeader(name = X_SAP_JOB_ID) final String jobId,
            @RequestHeader(name = X_SAP_JOB_SCHEDULE_ID) final String jobSchedulerId,
            @RequestHeader(name = X_SAP_JOB_RUN_ID) final String jobRunId,
            @RequestHeader(name = X_SAP_SCHEDULER_HOST) final String schedulerHost,
            @RequestHeader(name = X_SAP_RUN_AT) final String runAt) {
        String customerSubDomain = this.xsuaaUserInfo.getSubDomain();
        if (IsNullCheckUtils.isNullOrEmpty(customerSubDomain))
            return new ResponseEntity<>(
                    "Unable to find the customer. Hence the time dimension data can not be generated.",
                    HttpStatus.PRECONDITION_FAILED);

        JobSchedulerRunHeader jobSchedulerRunHeader = JobSchedulerRunHeader.builder().jobId(jobId)
                .schedulerId(jobSchedulerId).runId(jobRunId).host(schedulerHost).runAt(runAt).build();
        String correlationId = LogContext.getCorrelationId();
        String requestId = StringFormatter.format(TIME_DIM_ID_INITIAL, correlationId);
        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.set(X_CORRELATION_ID, correlationId);
        responseHeader.setContentType(MediaType.APPLICATION_JSON);
        RequestContextRunner requestContextRunner = this.cdsRuntime.requestContext().providedUser();
        Executors.newSingleThreadExecutor().submit(() -> requestContextRunner.run(requestContext -> {
            MDC.put(CORRELATION_ID, correlationId);
            this.timeDimensionJobs.submitForScheduleTimeDimension(customerSubDomain, jobSchedulerRunHeader);
        }));
        return new ResponseEntity<>(StringFormatter.format("Fill Time Dimension data request ID: {0}", requestId),
                responseHeader, HttpStatus.ACCEPTED);
    }
}
