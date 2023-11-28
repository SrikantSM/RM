/**
 * 
 */
package com.sap.c4p.rm.assignment.auditlog;

import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.EventContext;
import com.sap.cloud.security.xsuaa.token.SpringSecurityContext;
import com.sap.xs.audit.api.exception.AuditLogNotAvailableException;
import com.sap.xs.audit.api.exception.AuditLogWriteException;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;
import com.sap.xs.audit.api.v2.AuditedObject;
import com.sap.xs.audit.api.v2.DataModificationAuditMessage;

import com.sap.c4p.rm.assignment.config.LoggingMarker;
import com.sap.c4p.rm.assignment.enums.AssignmentEvents;
import com.sap.c4p.rm.assignment.utils.CfUtils;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;

/**
 * @author divya.munnuru@sap.com Description - Change Audit Log will prepare the
 *         details of attributes which gets modified during create/update/delete
 *         and prepares the log with the help of transactional Audit log
 *         interface . In this class we prepare the log with all relevant
 *         details .AuditChangeLog have respective methods for create ,delete
 *         events and gets executed accordingly
 */
@Component
public class AuditChangeLog {

  @Autowired
  AuditLogMessageFactory auditLogFactory;
  @Autowired
  AuditLogRequestScope auditLogRequestScope;
  @Autowired
  private AuditLogChangeListener auditLogChangeListener;

  private static final String AUDITLOG = "auditlog";

  private static final Logger LOGGER = LoggerFactory.getLogger(AuditChangeLog.class);
  private static final Marker AUDIT_MARKER = LoggingMarker.AUDIT_MARKER.getMarker();
  private CfUtils cfUtils;

  public AuditChangeLog(final AuditLogMessageFactory auditLogFactory, final CfUtils cfUtils) {
    this.cfUtils = cfUtils;
    this.auditLogFactory = auditLogFactory;
  }

  public void logDataModificationAuditMessage(EventContext context, String objectType, String serviceIdentifier,
      Assignments assignment, AssignmentEvents event) {
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
    Map<String, String> auditEntity = prepareAuditLogEntity(assignment, event);
    auditEntity.entrySet().stream()
        .forEach(e -> dataModificationAuditMessage.addAttribute(e.getKey(), null, e.getValue()));
    try {
      dataModificationAuditMessage.logPrepare();
    } catch (AuditLogNotAvailableException e) {
      LOGGER.error(AUDIT_MARKER, "Audit log service not available:{} Exception: {} ", e.getMessage(), e);
    } catch (AuditLogWriteException e) {
      LOGGER.error(AUDIT_MARKER, "Unable to write auditlogs to the cloud foundry:{} Exception: {} Errors: {}  ",
          e.getMessage(), e.getErrors(), e);

    }
    auditLogRequestScope.addMessage(dataModificationAuditMessage);
    context.getChangeSetContext().register(auditLogChangeListener);
  }

  public synchronized Map<String, String> prepareAuditLogEntity(Assignments assignment, AssignmentEvents event) {
    Integer assignmenthours = 0;
    List<AssignmentBuckets> listAssignmentBuckets = getAssignmentStartEndDate(assignment);
    int size = listAssignmentBuckets.size();
    assignmenthours = assignment.getBookedCapacityInMinutes() / 60;
    Map<String, String> auditAssignmentEntity = new LinkedHashMap<>();
    auditAssignmentEntity.put("Event", event.toString());
    auditAssignmentEntity.put("ResourceId", assignment.getResourceId());
    auditAssignmentEntity.put("RequestID", assignment.getResourceRequestId());
    auditAssignmentEntity.put("AssignmentStartDate", listAssignmentBuckets.get(0).getStartTime().toString());
    auditAssignmentEntity.put("AssignnmentEndDate", listAssignmentBuckets.get(size - 1).getStartTime().toString());
    auditAssignmentEntity.put("Assignment Duration", assignmenthours.toString());
    return auditAssignmentEntity;
  }

  private List<AssignmentBuckets> getAssignmentStartEndDate(Assignments assignmentRecord) {
    List<AssignmentBuckets> listAssignmentBuckets = assignmentRecord.getAssignmentBuckets().stream()
        .collect(Collectors.toList());

    Comparator<AssignmentBuckets> assignmentBucketsComparator = (o1, o2) -> o1.getStartTime()
        .compareTo(o2.getStartTime());

    Collections.sort(listAssignmentBuckets, assignmentBucketsComparator);
    return listAssignmentBuckets;

  }

  String getTokenIssuer() {
    String uaaUrl = cfUtils.getCertUrlByServiceName(AUDITLOG);
    uaaUrl = uaaUrl.substring(uaaUrl.indexOf(".") + 1);
    return String.format("https://%s.%s", SpringSecurityContext.getToken().getSubdomain(), uaaUrl);
  }

}
