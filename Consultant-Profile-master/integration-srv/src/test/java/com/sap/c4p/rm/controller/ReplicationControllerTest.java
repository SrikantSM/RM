package com.sap.c4p.rm.controller;

import static com.sap.c4p.rm.TestConstants.CONSUMER_SUB_DOMAIN;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.util.function.Consumer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.handlers.ReplicationJobs;
import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.request.ModifiableUserInfo;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;
import com.sap.hcp.cf.logging.common.LogContext;

public class ReplicationControllerTest extends InitMocks {

    private static final String INVALID_SUB_DOMAIN = "invalidSubDomain";
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

	@Mock
	ReplicationJobs replicationJobs;


    @Autowired
    @InjectMocks
    ReplicationController classUnderTest;

    @BeforeEach
    public void setUp() {
        when(this.xsuaaUserInfo.getSubDomain()).thenReturn(CONSUMER_SUB_DOMAIN);
    }

    @Test
    @DisplayName("Test replicateWorkforce with null subDomain.")
    public void testReplicateWorkforceWithNullSubDomain() {
        when(this.xsuaaUserInfo.getSubDomain()).thenReturn(null);
        when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
        when(this.requestContextRunner.providedUser()).thenReturn(requestContextRunner);
        ResponseEntity<String> responseEntity = this.classUnderTest.replicateWorkforce(X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID, X_SAP_SCHEDULER_HOST, X_SAP_RUN_AT);
        assertEquals(HttpStatus.PRECONDITION_FAILED, responseEntity.getStatusCode());
        assertEquals("Unable to find the customer. Hence the workforce/employee replication could not be triggered.",
                responseEntity.getBody());
    }

    @Test
    @DisplayName("Test replicateWorkforce with empty subDomain.")
    public void testReplicateWorkforceWithEmptySubDomain() {
        when(this.xsuaaUserInfo.getSubDomain()).thenReturn("");
        when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
        when(this.requestContextRunner.providedUser()).thenReturn(requestContextRunner);
        ResponseEntity<String> responseEntity = this.classUnderTest.replicateWorkforce(X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID, X_SAP_SCHEDULER_HOST, X_SAP_RUN_AT);
        assertEquals(HttpStatus.PRECONDITION_FAILED, responseEntity.getStatusCode());
        assertEquals("Unable to find the customer. Hence the workforce/employee replication could not be triggered.",
                responseEntity.getBody());
    }

    @Test
    @DisplayName("Test replicateWorkforce with subDomain.")
    public void testReplicateWorkforceWithSubDomain() {
        when(this.xsuaaUserInfo.getSubDomain()).thenReturn(CONSUMER_SUB_DOMAIN);
        when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
        when(this.requestContextRunner.modifyUser(ArgumentMatchers.<Consumer<ModifiableUserInfo>>any())).thenReturn(requestContextRunner);
        doNothing().when(this.replicationJobs).submitForWorkforceReplication(eq(CONSUMER_SUB_DOMAIN), any());
        ResponseEntity<String> responseEntity = this.classUnderTest.replicateWorkforce(X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID, X_SAP_SCHEDULER_HOST, X_SAP_RUN_AT);
        assertEquals(HttpStatus.ACCEPTED, responseEntity.getStatusCode());
        assertEquals("Workforce Replication Correlation ID: CP_Replication_WF_ID-" + LogContext.getCorrelationId(),
                responseEntity.getBody());
    }

    @Test
    @DisplayName("Test replicateCostCenter with null subDomain.")
    public void testReplicateCostCenterWithNullSubDomain() {
        when(this.xsuaaUserInfo.getSubDomain()).thenReturn(null);
        when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
        when(this.requestContextRunner.providedUser()).thenReturn(requestContextRunner);
        ResponseEntity<String> responseEntity = this.classUnderTest.replicateCostCenter(X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID, X_SAP_SCHEDULER_HOST, X_SAP_RUN_AT);
        assertEquals(HttpStatus.PRECONDITION_FAILED, responseEntity.getStatusCode());
        assertEquals("Unable to find the customer. Hence the cost center replication could not be triggered.",
                responseEntity.getBody());
    }

    @Test
    @DisplayName("Test replicateCostCenter with empty subDomain.")
    public void testReplicateCostCenterWithEmptySubDomain() {
        when(this.xsuaaUserInfo.getSubDomain()).thenReturn("");
        when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
        when(this.requestContextRunner.providedUser()).thenReturn(requestContextRunner);
        ResponseEntity<String> responseEntity = this.classUnderTest.replicateCostCenter(X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID, X_SAP_SCHEDULER_HOST, X_SAP_RUN_AT);
        assertEquals(HttpStatus.PRECONDITION_FAILED, responseEntity.getStatusCode());
        assertEquals("Unable to find the customer. Hence the cost center replication could not be triggered.",
                responseEntity.getBody());
    }

    @Test
    @DisplayName("Test replicateCostCenter with subDomain.")
    public void testReplicateCostCenterWithSubDomain() {
        when(this.xsuaaUserInfo.getSubDomain()).thenReturn(CONSUMER_SUB_DOMAIN);
        when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
        when(this.requestContextRunner.providedUser()).thenReturn(requestContextRunner);
        ResponseEntity<String> responseEntity = this.classUnderTest.replicateCostCenter(X_SAP_JOB_ID,
                X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID, X_SAP_SCHEDULER_HOST, X_SAP_RUN_AT);
        assertEquals(HttpStatus.ACCEPTED, responseEntity.getStatusCode());
        assertEquals("CostCenter Replication Correlation ID: CP_Replication_CS_ID-" + LogContext.getCorrelationId(),
                responseEntity.getBody());
    }
}
