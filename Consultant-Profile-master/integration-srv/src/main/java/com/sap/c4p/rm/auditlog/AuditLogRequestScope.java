package com.sap.c4p.rm.auditlog;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import com.sap.xs.audit.api.TransactionalAuditLogMessage;

@Component
@RequestScope
public class AuditLogRequestScope {

    private List<TransactionalAuditLogMessage> transactionalAuditLogMessages = new ArrayList<>();

    public List<TransactionalAuditLogMessage> getMessages() {
        return transactionalAuditLogMessages;
    }

    public void addMessage(TransactionalAuditLogMessage transactionalAuditLogMessage) {
        this.transactionalAuditLogMessages.add(transactionalAuditLogMessage);
    }
}
