/**
 *
 */
package com.sap.c4p.rm.projectintegrationadapter.auditlog;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cloud.security.xsuaa.token.SpringSecurityContext;
import com.sap.xs.audit.api.exception.AuditLogNotAvailableException;
import com.sap.xs.audit.api.exception.AuditLogWriteException;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;
import com.sap.xs.audit.api.v2.AuditedObject;
import com.sap.xs.audit.api.v2.DataModificationAuditMessage;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.enums.AssignmentEvents;
import com.sap.c4p.rm.projectintegrationadapter.util.CfUtils;

import com.sap.resourcemanagement.assignment.AssignmentsView;

/**
 * @author I310562
 *
 */
@Component
public class AuditChangeLog {
  @Autowired
  AuditLogMessageFactory auditLogFactory;
  @Autowired
  AuditLogRequestScope auditLogRequestScope;

  private static final Logger LOGGER = LoggerFactory.getLogger(AuditChangeLog.class);
  private static final Marker MARKER = LoggingMarker.REPLICATION_AUDIT_LOG_MARKER.getMarker();
  private static final String AUDITLOG = "auditlog";

  private CfUtils cfUtils;

  public AuditChangeLog(final AuditLogMessageFactory auditLogFactory, CfUtils cfUtils) {
    this.auditLogFactory = auditLogFactory;
    this.cfUtils = cfUtils;
  }

  public void logDataModificationAuditMessage(String objectType, String serviceIdentifier, Result result,
      AssignmentEvents event) {

    DataModificationAuditMessage dataModificationAuditMessage = auditLogFactory.createDataModificationAuditMessage();
    dataModificationAuditMessage.setUser("$USER");
    dataModificationAuditMessage.setTenant("$SUBSCRIBER", getTokenIssuer());

    AuditedDataSubject dataSubject = auditLogFactory.createAuditedDataSubject();
    dataSubject.addIdentifier("service", serviceIdentifier);
    dataSubject.setRole("AssignmentDelete");
    dataSubject.setType(objectType);
    dataModificationAuditMessage.setDataSubject(dataSubject);
    AuditedObject auditedObject = auditLogFactory.createAuditedObject();
    auditedObject.setType(objectType);
    auditedObject.addIdentifier("Identifier", "AssignmentService");
    dataModificationAuditMessage.setObject(auditedObject);
    Map<String, String> auditEntity = prepareAuditLogEntity(result, event);
    auditEntity.entrySet().stream()
        .forEach(e -> dataModificationAuditMessage.addAttribute(e.getKey(), null, e.getValue()));
    try {
      dataModificationAuditMessage.logPrepare();
      dataModificationAuditMessage.log();
    } catch (AuditLogNotAvailableException e) {
      LOGGER.error(MARKER, "Audit log service not available:{} Exception: {}", e.getMessage(), e.toString());
    } catch (AuditLogWriteException e) {
      LOGGER.error(MARKER, "Unable to write auditlogs to the cloud foundry:{} Exception: {}", e.getMessage(),
          e.toString());
    }
    auditLogRequestScope.addMessage(dataModificationAuditMessage);
  }

  public synchronized Map<String, String> prepareAuditLogEntity(Result result, AssignmentEvents event) {
    int size = (int) result.rowCount();
    Map<String, String> auditAssignmentEntity = new LinkedHashMap<>(size);
    for (AssignmentsView assignment : result.listOf(AssignmentsView.class)) {
      auditAssignmentEntity.put("Event", event.toString());
      auditAssignmentEntity.put("ResourceId", assignment.getResourceId());
      auditAssignmentEntity.put("RequestID", assignment.getResourceRequestId());
      auditAssignmentEntity.put("AssignmentStartDate", assignment.getStartDate().toString());
      auditAssignmentEntity.put("AssignnmentEndDate", assignment.getEndDate().toString());
      auditAssignmentEntity.put("Assignment Duration", assignment.getBookedCapacityInHours().toString());
    }
    return auditAssignmentEntity;
  }

  String getTokenIssuer() {
    String uaaUrl = cfUtils.getCertUrlByServiceName(AUDITLOG);
    uaaUrl = uaaUrl.substring(uaaUrl.indexOf(".") + 1);
    return String.format("https://%s.%s", SpringSecurityContext.getToken().getSubdomain(), uaaUrl);
  }

}
