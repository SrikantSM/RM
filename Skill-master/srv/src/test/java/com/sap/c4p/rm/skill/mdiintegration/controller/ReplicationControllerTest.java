package com.sap.c4p.rm.skill.mdiintegration.controller;

import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
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

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.services.validators.SingleSkillSourceValidator;

class ReplicationControllerTest extends InitMocks {

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
  private SingleSkillSourceValidator singleSkillSourceValidator;

  @Autowired
  @InjectMocks
  ReplicationController classUnderTest;

  @BeforeEach
  public void setUp() {
    when(this.xsuaaUserInfo.getSubDomain()).thenReturn(CONSUMER_SUB_DOMAIN);
  }

  @Test
  @DisplayName("Test replicateWorkforceCapability with null subDomain.")
  void testReplicateWorkforceCapabilityWithNullSubDomain() {
    when(this.xsuaaUserInfo.getSubDomain()).thenReturn(null);
    when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
    when(this.requestContextRunner.providedUser()).thenReturn(requestContextRunner);
    ResponseEntity<String> responseEntity = this.classUnderTest.replicateWorkforceCapability(X_SAP_JOB_ID,
        X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID, X_SAP_SCHEDULER_HOST, X_SAP_RUN_AT);
    assertEquals(HttpStatus.PRECONDITION_FAILED, responseEntity.getStatusCode());
    assertEquals("Unable to find the customer. Hence the workforce capability replication could not be triggered.",
        responseEntity.getBody());
  }

  @Test
  @DisplayName("Test replicateWorkforce with empty subDomain.")
  void testReplicateWorkforceWithEmptySubDomain() {
    when(this.xsuaaUserInfo.getSubDomain()).thenReturn("");
    when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
    when(this.requestContextRunner.providedUser()).thenReturn(requestContextRunner);
    ResponseEntity<String> responseEntity = this.classUnderTest.replicateWorkforceCapability(X_SAP_JOB_ID,
        X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID, X_SAP_SCHEDULER_HOST, X_SAP_RUN_AT);
    assertEquals(HttpStatus.PRECONDITION_FAILED, responseEntity.getStatusCode());
    assertEquals("Unable to find the customer. Hence the workforce capability replication could not be triggered.",
        responseEntity.getBody());
  }

  @Test
  @DisplayName("Test replicateWorkforce with subDomain.")
  void testReplicateWorkforceWithSubDomain() {
    when(this.xsuaaUserInfo.getSubDomain()).thenReturn(CONSUMER_SUB_DOMAIN);
    when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
    when(this.requestContextRunner.providedUser()).thenReturn(requestContextRunner);
    when(this.singleSkillSourceValidator.checkIfMDIReplicationAllowed()).thenReturn(Boolean.TRUE);
    ResponseEntity<String> responseEntity = this.classUnderTest.replicateWorkforceCapability(X_SAP_JOB_ID,
        X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_RUN_ID, X_SAP_SCHEDULER_HOST, X_SAP_RUN_AT);
    assertEquals(HttpStatus.ACCEPTED, responseEntity.getStatusCode());
    assertEquals(
        "Workforce Capability Replication Correlation ID: Skill_Replication_WC_ID-" + LogContext.getCorrelationId(),
        responseEntity.getBody());
  }

}
