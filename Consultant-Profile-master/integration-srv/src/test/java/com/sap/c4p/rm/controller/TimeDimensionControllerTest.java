package com.sap.c4p.rm.controller;

import static com.sap.c4p.rm.TestConstants.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;
import com.sap.hcp.cf.logging.common.LogContext;

import com.sap.c4p.rm.InitMocks;

public class TimeDimensionControllerTest extends InitMocks {

    private static final String X_SAP_JOB_ID = "x-sap-job-id";
    private static final String X_SAP_JOB_SCHEDULE_ID = "x-sap-job-schedule-id";
    private static final String X_SAP_JOB_RUN_ID = "x-sap-job-run-id";
    private static final String X_SAP_SCHEDULER_HOST = "x-sap-scheduler-host";
    private static final String X_SAP_RUN_AT = "x-sap-run-at";

    @Mock
    CdsRuntime cdsRuntime;

    @Mock
    RequestContextRunner requestContextRunner;

    @Mock
    XsuaaUserInfo xsuaaUserInfo;

    @Autowired
    @InjectMocks
    TimeDimensionController classUnderTest;

    @Test
    @DisplayName("Test scheduleTimeDimension with null subDomain.")
    public void testScheduleTimeDimensionWithNullSubDomain() {
        when(this.xsuaaUserInfo.getSubDomain()).thenReturn(null);
        when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
        when(this.requestContextRunner.providedUser()).thenReturn(requestContextRunner);
        ResponseEntity<String> responseEntity = this.classUnderTest.scheduleTimeDimension(X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID, X_SAP_SCHEDULER_HOST, X_SAP_RUN_AT);
        assertEquals(HttpStatus.PRECONDITION_FAILED, responseEntity.getStatusCode());
        assertEquals("Unable to find the customer. Hence the time dimension data can not be generated.",
                responseEntity.getBody());
    }

    @Test
    @DisplayName("Test scheduleTimeDimension with empty subDomain.")
    public void testScheduleTimeDimensionWithEmptySubDomain() {
        when(this.xsuaaUserInfo.getSubDomain()).thenReturn("");
        when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
        when(this.requestContextRunner.providedUser()).thenReturn(requestContextRunner);
        ResponseEntity<String> responseEntity = this.classUnderTest.scheduleTimeDimension(X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID, X_SAP_SCHEDULER_HOST, X_SAP_RUN_AT);
        assertEquals(HttpStatus.PRECONDITION_FAILED, responseEntity.getStatusCode());
        assertEquals("Unable to find the customer. Hence the time dimension data can not be generated.",
                responseEntity.getBody());
    }

    @Test
    @DisplayName("Test scheduleTimeDimension with subDomain.")
    public void testScheduleTimeDimensionWithSubDomain() {
        when(this.xsuaaUserInfo.getSubDomain()).thenReturn(CONSUMER_SUB_DOMAIN);
        when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
        when(this.requestContextRunner.providedUser()).thenReturn(requestContextRunner);
        ResponseEntity<String> responseEntity = this.classUnderTest.scheduleTimeDimension(X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID, X_SAP_SCHEDULER_HOST, X_SAP_RUN_AT);
        assertEquals(HttpStatus.ACCEPTED, responseEntity.getStatusCode());
        assertEquals("Fill Time Dimension data request ID: CP_TimeDimSchedule_ID-" + LogContext.getCorrelationId(),
                responseEntity.getBody());
    }

}
