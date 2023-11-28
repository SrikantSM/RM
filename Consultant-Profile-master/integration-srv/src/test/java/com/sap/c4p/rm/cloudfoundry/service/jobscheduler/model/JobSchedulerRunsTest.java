package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Collections;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class JobSchedulerRunsTest {

    private final static String RUN_ID = "runId";
    private final static String HTTP_STATUS = "httpStatus";
    private final static String EXECUTION_TIME_STAMP = "executionTimestamp";
    private final static String RUN_STATUS = "runStatus";
    private final static String RUN_STATE = "runState";
    private final static String STATUS_MESSAGE = "statusMessage";
    private final static String SCHEDULER_TIMESTAMP = "scheduleTimestamp";
    private final static String COMPLETION_TIMESTAMP = "completionTimestamp";
    private final static String RUN_TEXT = "runText";
    private final static long TOTAL = 15410;
    private final static boolean PAGINATION_ENABLED = true;
    private final static boolean RESTRICTED_RESULTS = true;
    private final static String PREV_URL = "http://www.prev_url.com";
    private final static String NEXT_URL = "http://www.next_url.com";

    @Test
    @DisplayName("test @NoArgConstructor and @Getters")
    void testNoArgConstructorAdnGetter() {
        JobSchedulerRun jobSchedulerRun = new JobSchedulerRun();
        assertNull(jobSchedulerRun.getRunId());
        assertNull(jobSchedulerRun.getHttpStatus());
        assertNull(jobSchedulerRun.getExecutionTimestamp());
        assertNull(jobSchedulerRun.getRunStatus());
        assertNull(jobSchedulerRun.getRunState());
        assertNull(jobSchedulerRun.getStatusMessage());
        assertNull(jobSchedulerRun.getScheduleTimestamp());
        assertNull(jobSchedulerRun.getCompletionTimestamp());
        assertNull(jobSchedulerRun.getRunText());

        JobSchedulerRuns jobSchedulerRuns = new JobSchedulerRuns();
        assertEquals(Long.valueOf(0), jobSchedulerRuns.getTotal());
        assertNull(jobSchedulerRuns.getResults());
        assertFalse(jobSchedulerRuns.isPaginationEnabled());
        assertFalse(jobSchedulerRuns.isRestrictedResults());
        assertNull(jobSchedulerRuns.getPrevURL());
        assertNull(jobSchedulerRuns.getNextURL());
    }

    @Test
    @DisplayName("test @AllArgsConstructor and @Getters")
    void testAllArgsConstructorAdnGetter() {
        JobSchedulerRun jobSchedulerRun = new JobSchedulerRun(RUN_ID, HTTP_STATUS, EXECUTION_TIME_STAMP, RUN_STATUS,
                RUN_STATE, STATUS_MESSAGE, SCHEDULER_TIMESTAMP, COMPLETION_TIMESTAMP, RUN_TEXT);
        assertEquals(RUN_ID, jobSchedulerRun.getRunId());
        assertEquals(HTTP_STATUS, jobSchedulerRun.getHttpStatus());
        assertEquals(EXECUTION_TIME_STAMP, jobSchedulerRun.getExecutionTimestamp());
        assertEquals(RUN_STATUS, jobSchedulerRun.getRunStatus());
        assertEquals(RUN_STATE, jobSchedulerRun.getRunState());
        assertEquals(STATUS_MESSAGE, jobSchedulerRun.getStatusMessage());
        assertEquals(SCHEDULER_TIMESTAMP, jobSchedulerRun.getScheduleTimestamp());
        assertEquals(COMPLETION_TIMESTAMP, jobSchedulerRun.getCompletionTimestamp());
        assertEquals(RUN_TEXT, jobSchedulerRun.getRunText());

        JobSchedulerRuns jobSchedulerRuns = new JobSchedulerRuns(TOTAL, Collections.singletonList(jobSchedulerRun),
                PAGINATION_ENABLED, RESTRICTED_RESULTS, PREV_URL, NEXT_URL);
        assertEquals(TOTAL, jobSchedulerRuns.getTotal());
        assertEquals(Collections.singletonList(jobSchedulerRun), jobSchedulerRuns.getResults());
        assertTrue(jobSchedulerRuns.isPaginationEnabled());
        assertTrue(jobSchedulerRuns.isRestrictedResults());
        assertEquals(PREV_URL, jobSchedulerRuns.getPrevURL());
        assertEquals(NEXT_URL, jobSchedulerRuns.getNextURL());
    }
}
