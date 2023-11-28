package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Test Class to test working of {@link JobSchedulerRunHeader}.
 */
public class JobSchedulerRunHeaderTest {

  private static final String HOST = "host";
  private static final String JOB_ID = "jobId";
  private static final String RUN_AT = "runAt";
  private static final String RUN_ID = "runId";
  private static final String SCHEDULER_ID = "schedulerId";

  @Test
  @DisplayName("test Builder and Getter")
  public void testBuilderAndGetter() {
    JobSchedulerRunHeader classUnderTest = JobSchedulerRunHeader.builder().jobId(JOB_ID).schedulerId(SCHEDULER_ID)
        .runId(RUN_ID).host(HOST).runAt(RUN_AT).build();
    assertEquals(JOB_ID, classUnderTest.getJobId());
    assertEquals(SCHEDULER_ID, classUnderTest.getSchedulerId());
    assertEquals(RUN_ID, classUnderTest.getRunId());
    assertEquals(RUN_AT, classUnderTest.getRunAt());
    assertEquals(HOST, classUnderTest.getHost());
  }

}
