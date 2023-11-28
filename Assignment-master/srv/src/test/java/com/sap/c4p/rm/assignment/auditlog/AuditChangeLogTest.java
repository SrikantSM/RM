/**
 * 
 */
package com.sap.c4p.rm.assignment.auditlog;

import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.sap.cds.Struct;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cloud.security.xsuaa.token.Token;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;
import com.sap.xs.audit.api.v2.AuditedObject;
import com.sap.xs.audit.api.v2.DataModificationAuditMessage;

import com.sap.c4p.rm.assignment.enums.AssignmentEvents;
import com.sap.c4p.rm.assignment.utils.CfUtils;

import assignmentservice.Assignments;

/**
 * @author I310562
 *
 */
public class AuditChangeLogTest {

  @Mock
  AuditLogMessageFactory mockAuditLogFactory;

  @Mock
  AuditLogRequestScope mockAuditLogRequestScope;

  @Mock
  AuditLogChangeListener mockAuditLogChangeListener;

  AuditChangeLog mockAuditChangeLog;

  @Mock
  private AuditLogMessageFactory mockAuditLogMessageFactory;

  @Mock
  private CfUtils mockCfUtils;

  @Mock
  private DataModificationAuditMessage mockDataModificationAuditMessage;

  @Mock
  AuditedObject mockAuditedObject;

  @Mock
  AuditedDataSubject mockdataSubject;

  @Mock
  private Token mockToken;

  private static final String AssignmentObjectType = "Assignment";
  private static final String AssignmentServiceIdentifier = "AssignmentService";

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    this.mockAuditChangeLog = spy(new AuditChangeLog(this.mockAuditLogMessageFactory, this.mockCfUtils));
    doReturn("https://TENANT.authentication.sap.hana.ondemand.com").when(this.mockAuditChangeLog).getTokenIssuer();
    when(this.mockToken.getSubdomain()).thenReturn("TENANT");
    mockAuditChangeLog.auditLogFactory = mockAuditLogMessageFactory;
    mockAuditChangeLog.auditLogRequestScope = mockAuditLogRequestScope;

  }

  @Test
  @DisplayName("Testing configuration method for create")
  void testdataModificationAuditMessageforCreate() {

    Instant startTime = Instant.parse("2020-11-10T10:37:30.00Z");

    final CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class, RETURNS_DEEP_STUBS);
    assignmentservice.AssignmentBuckets assignmentBucketRecord = assignmentservice.AssignmentBuckets.create();
    assignmentBucketRecord.setAssignmentId("720ffec9-701b-40fb-b876-83fd55a7ff4c");
    assignmentBucketRecord.setBookedCapacityInMinutes(200);
    assignmentBucketRecord.setCreatedBy("tenantUser");
    assignmentBucketRecord.setStartTime(startTime);

    List<assignmentservice.AssignmentBuckets> assignmentBucket = new ArrayList<>();
    assignmentBucket.add(assignmentBucketRecord);
    Assignments assignment = Struct.create(Assignments.class);
    assignment.setAssignmentBuckets(assignmentBucket);
    assignment.setBookedCapacityInMinutes(1600);
    assignment.setResourceId("720ffec9-701b-40fb-b876-83fd55a7ff4c");
    assignment.setResourceRequestId("720ffec9-701b-40fb-b876-83fd55a7ff4c");

    when(mockContext.getUserInfo().getName()).thenReturn("TestUser");
    when(mockContext.getUserInfo().getTenant()).thenReturn("080622fc-180a-4591-85eb-46e1a186533d");
    when(mockAuditLogMessageFactory.createDataModificationAuditMessage()).thenReturn(mockDataModificationAuditMessage);
    when(mockAuditLogMessageFactory.createAuditedObject()).thenReturn(mockAuditedObject);
    when(mockAuditLogMessageFactory.createAuditedDataSubject()).thenReturn(mockdataSubject);
    mockAuditChangeLog.logDataModificationAuditMessage(mockContext, AssignmentObjectType, AssignmentServiceIdentifier,
        assignment, AssignmentEvents.ASSIGNMENT_CREATION);
  }

  @Test
  @DisplayName("Check for method Prepare audit log")
  public void testprepareAuditLogEntity() {
    Instant startTime = Instant.parse("2020-11-10T10:37:30.00Z");
    assignmentservice.AssignmentBuckets assignmentBucketRecord = assignmentservice.AssignmentBuckets.create();
    assignmentBucketRecord.setAssignmentId("720ffec9-701b-40fb-b876-83fd55a7ff4c");
    assignmentBucketRecord.setBookedCapacityInMinutes(200);
    assignmentBucketRecord.setCreatedBy("tenantUser");
    assignmentBucketRecord.setStartTime(startTime);

    List<assignmentservice.AssignmentBuckets> assignmentBucket = new ArrayList<>();
    assignmentBucket.add(assignmentBucketRecord);
    Assignments assignment = Struct.create(Assignments.class);
    assignment.setAssignmentBuckets(assignmentBucket);
    assignment.setBookedCapacityInMinutes(1600);
    mockAuditChangeLog.prepareAuditLogEntity(assignment, AssignmentEvents.ASSIGNMENT_CREATION);
  }

}
