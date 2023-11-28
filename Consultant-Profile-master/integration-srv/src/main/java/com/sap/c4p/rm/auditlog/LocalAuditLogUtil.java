package com.sap.c4p.rm.auditlog;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.EventContext;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;
import com.sap.xs.audit.api.v2.DataModificationAuditMessage;

import com.sap.c4p.rm.cloudfoundry.environment.AuditLogVCAP;

@Profile("!hana")
@Primary
@Qualifier("auditLogUtil")
@Component
public class LocalAuditLogUtil extends AuditLogUtil {

    public LocalAuditLogUtil(AuditLogMessageFactory auditLogFactory, XsuaaUserInfo xsuaaUserInfo,
            AuditLogVCAP auditLogVCAP, AuditLogRequestScope auditLogRequestScope, AuditLogChangeListener auditLogChangeListener) {
        super(auditLogFactory, xsuaaUserInfo, auditLogVCAP, auditLogRequestScope, auditLogChangeListener);
    }

    private static final Logger LOGGER = LoggerFactory.getLogger(LocalAuditLogUtil.class);

    @Override
    public DataModificationAuditMessage prepareDataModificationAuditMessage(EventContext context, String objectType, String serviceIdentifier, String operation,
            Map<String, String> currentEntity, Map<String, String> oldEntity, AuditedDataSubject dataSubject) {
        LOGGER.trace("Prepare and invoke auditlog for data modification");
        return null;
    }

    @Override
    public void setDataModificationAuditMessageToFailure(DataModificationAuditMessage dataModificationAuditMessage) {
        LOGGER.trace("DataModification message is set to failure");
    }
}
