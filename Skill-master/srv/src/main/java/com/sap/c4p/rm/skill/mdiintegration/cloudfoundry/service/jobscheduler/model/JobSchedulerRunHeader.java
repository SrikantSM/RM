package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model;

import lombok.Builder;
import lombok.Getter;

/**
 * A POJO class to create the payload and parse the response of JobScheduler
 * Action calls to application This class holds the Job's run header information
 */
@Getter
@Builder
public class JobSchedulerRunHeader {
  private final String jobId;
  private final String schedulerId;
  private final String runId;
  private final String host;
  private final String runAt;
}
