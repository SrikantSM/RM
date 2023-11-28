package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class JobSchedulerRun {
    private String runId;
    private String httpStatus;
    private String executionTimestamp;
    private String runStatus;
    private String runState;
    private String statusMessage;
    private String scheduleTimestamp;
    private String completionTimestamp;
    private String runText;
}
