package com.sap.c4p.rm.auditlog;

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

import com.sap.c4p.rm.config.LoggingMarker;

@Component
public class AuditLogChangeListener implements ChangeSetListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuditLogChangeListener.class);
    private static final Marker MARKER = LoggingMarker.AUDIT_LOG.getMarker();

    private AuditLogRequestScope auditLogRequestScope;

    @Autowired
    public AuditLogChangeListener(final AuditLogRequestScope auditLogRequestScope) {
        this.auditLogRequestScope = auditLogRequestScope;
    }

    @Override
    public void afterClose(boolean completed) {
        List<TransactionalAuditLogMessage> transactionalAuditLogMessages = auditLogRequestScope.getMessages();
        try {
            if (completed) {
                for (TransactionalAuditLogMessage transactionalAuditLogMessage : transactionalAuditLogMessages)
                    transactionalAuditLogMessage.logSuccess();
            } else {
                for (TransactionalAuditLogMessage transactionalAuditLogMessage : transactionalAuditLogMessages)
                    transactionalAuditLogMessage.logFailure();
            }
        } catch (AuditLogNotAvailableException auditLogNotAvailableException) {
            LOGGER.error(MARKER, "AuditLog service not available: {}", auditLogNotAvailableException.getMessage(),
                    auditLogNotAvailableException);
        } catch (AuditLogWriteException auditWriteException) {
            LOGGER.error(MARKER, "Could not write to Audit Log: {} Errors: {} ", auditWriteException.getMessage(),
                    auditWriteException.getErrors(), auditWriteException);
        }
    }
}
