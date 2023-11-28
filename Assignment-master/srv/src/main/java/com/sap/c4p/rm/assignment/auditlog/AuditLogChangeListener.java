/**
 * 
 */
package com.sap.c4p.rm.assignment.auditlog;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.changeset.ChangeSetListener;
import com.sap.xs.audit.api.TransactionalAuditLogMessage;
import com.sap.xs.audit.api.exception.AuditLogNotAvailableException;
import com.sap.xs.audit.api.exception.AuditLogWriteException;

import com.sap.c4p.rm.assignment.config.LoggingMarker;

/**
 * @author divya.munnuru@sap.com Description : AuditLogChangeListener will
 *         ensure that once the transaction is complete it will log the changes
 *         to the Cloud foundry.
 */
@Component
public class AuditLogChangeListener implements ChangeSetListener {

  private static final Logger LOGGER = LoggerFactory.getLogger(AuditLogChangeListener.class);
  private static final Marker AUDIT_MARKER = LoggingMarker.AUDIT_MARKER.getMarker();

  @Autowired
  AuditLogRequestScope auditLogRequestScope;

  @Override
  public void afterClose(boolean completed) {
    List<TransactionalAuditLogMessage> transactionalAuditLogMessages = auditLogRequestScope.getMessage();
    try {
      if (completed) {
        for (TransactionalAuditLogMessage transactionalAuditLogMessage : transactionalAuditLogMessages)
          transactionalAuditLogMessage.logSuccess();
      } else {
        for (TransactionalAuditLogMessage transactionalAuditLogMessage : transactionalAuditLogMessages)
          transactionalAuditLogMessage.logFailure();
      }
    } catch (AuditLogNotAvailableException e) {
      LOGGER.error(AUDIT_MARKER, "Audit log service not available:{}", e.getMessage());
    } catch (AuditLogWriteException e) {
      LOGGER.error(AUDIT_MARKER, "Unable to write auditlogs to the cloud foundry:{} Errors: {}", e.getMessage(),
          e.getErrors());

    }
  }

}
