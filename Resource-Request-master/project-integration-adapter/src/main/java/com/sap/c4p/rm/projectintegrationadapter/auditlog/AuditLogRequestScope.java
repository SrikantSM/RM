/**
 * 
 */
package com.sap.c4p.rm.projectintegrationadapter.auditlog;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import com.sap.xs.audit.api.TransactionalAuditLogMessage;

/**
 * @author I310562
 *
 */
@Component
@RequestScope
public class AuditLogRequestScope {

  private List<TransactionalAuditLogMessage> transactionalAuditLogMessages = new ArrayList<>();

  public List<TransactionalAuditLogMessage> getMessage() {
    return transactionalAuditLogMessages;
  }

  public void addMessage(TransactionalAuditLogMessage transactionalAuditLogMessage) {
    this.transactionalAuditLogMessages.add(transactionalAuditLogMessage);
  }

}
