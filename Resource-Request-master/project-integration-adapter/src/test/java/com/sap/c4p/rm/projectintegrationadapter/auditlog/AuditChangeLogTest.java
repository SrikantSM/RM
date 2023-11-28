/**
 * 
 */
package com.sap.c4p.rm.projectintegrationadapter.auditlog;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.sap.cds.Result;
import com.sap.cds.ResultBuilder;
import com.sap.cds.Struct;
import com.sap.cloud.security.xsuaa.token.Token;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;
import com.sap.xs.audit.api.v2.AuditedObject;
import com.sap.xs.audit.api.v2.DataModificationAuditMessage;

import com.sap.c4p.rm.projectintegrationadapter.enums.AssignmentEvents;
import com.sap.c4p.rm.projectintegrationadapter.util.CfUtils;

import com.sap.resourcemanagement.assignment.AssignmentsView;

/**
 * @author I310562
 *
 */
@DisplayName("Unit test for Audit Change Log")
public class AuditChangeLogTest {

  @Mock
  AuditLogMessageFactory mockAuditLogFactory;

  @Mock
  private DataModificationAuditMessage mockDataModificationAuditMessage;

  @Mock
  AuditLogRequestScope mockAuditLogRequestScope;

  @Mock
  AuditedObject mockAuditedObject;

  @Mock
  AuditedDataSubject mockdataSubject;

  @Mock
  private Token mockToken;

  @Mock
  private AuditLogMessageFactory mockAuditLogMessageFactory;

  @Mock
  private CfUtils mockCfUtils;

  @Mock
  Result result;

  AuditChangeLog mockAuditChangeLog;

  private static final String AssignmentObjectType = "Assignment";
  private static final String AssignmentServiceIdentifier = "AssignmentService";

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    this.mockAuditChangeLog = spy(new AuditChangeLog(this.mockAuditLogMessageFactory, this.mockCfUtils));
    doReturn("https://TENANT.authentication.sap.hana.ondemand.com").when(this.mockAuditChangeLog).getTokenIssuer();
    when(this.mockToken.getSubdomain()).thenReturn("TENANT");

    mockAuditChangeLog.auditLogFactory = mockAuditLogFactory;
    mockAuditChangeLog.auditLogRequestScope = mockAuditLogRequestScope;
    result = mock(Result.class);

  }

  @Test
  @DisplayName("Testing configuration method for create")
  void testdataModificationAuditMessageforCreate() {

    Instant startTime = Instant.parse("2020-11-10T10:37:30.00Z");
    LocalDate startDate = LocalDate.of(2020, 01, 05);
    LocalDate endDate = LocalDate.of(2020, 01, 03);

    List<AssignmentsView> assignmentList = new ArrayList<>();
    Map<String, String> auditAssignmentEntity = new LinkedHashMap<>();

    AssignmentsView assignment = Struct.create(AssignmentsView.class);
    assignment.setBookedCapacityInHours(360);
    assignment.setStartDate(startDate);
    assignment.setStartTime(startTime);
    assignment.setEndDate(endDate);
    assignment.setAssignmentId("aed678-345ert");
    assignment.setResourceId("rtg6590-678");
    assignment.setResourceRequestId("345-2ert");

    assignmentList.add(assignment);

    result = ResultBuilder.selectedRows(assignmentList).result();

    when(mockAuditLogFactory.createDataModificationAuditMessage()).thenReturn(mockDataModificationAuditMessage);
    when(mockAuditLogFactory.createAuditedObject()).thenReturn(mockAuditedObject);
    when(mockAuditLogFactory.createAuditedDataSubject()).thenReturn(mockdataSubject);

    mockAuditChangeLog.logDataModificationAuditMessage(AssignmentObjectType, AssignmentServiceIdentifier, result,
        AssignmentEvents.ASSIGNMENT_CREATION);

  }

  @Test
  @DisplayName("Test for prepare audit")
  void testPrepare() {
    LocalDate startDate = LocalDate.of(2020, 01, 05);
    LocalDate endDate = LocalDate.of(2020, 01, 03);
    List<AssignmentsView> assignmentList = new ArrayList<>();
    AssignmentsView assignment = Struct.create(AssignmentsView.class);
    assignment.setBookedCapacityInHours(360);
    assignment.setStartDate(startDate);
    assignment.setEndDate(endDate);
    assignment.setAssignmentId("aed678-345ert");
    assignment.setResourceId("rtg6590-678");
    assignment.setResourceRequestId("345-2ert");
    assignmentList.add(assignment);

    result = ResultBuilder.selectedRows(assignmentList).result();
    mockAuditChangeLog.prepareAuditLogEntity(result, AssignmentEvents.ASSIGNMENT_CREATION);

  }

}
