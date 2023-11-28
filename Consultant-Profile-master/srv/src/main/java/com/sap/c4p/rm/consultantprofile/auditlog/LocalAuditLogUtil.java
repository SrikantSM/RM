package com.sap.c4p.rm.consultantprofile.auditlog;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.EventContext;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;

import com.sap.c4p.rm.consultantprofile.utils.CertificateUtils;

@Profile("!hana")
@Primary
@Qualifier("auditLogUtil")
@Component
public class LocalAuditLogUtil extends AuditLogUtil {

    private static final Logger LOGGER = LoggerFactory.getLogger(LocalAuditLogUtil.class);

    @Autowired
    public LocalAuditLogUtil(final AuditLogMessageFactory auditLogFactory,
            final AuditLogRequestScope auditLogRequestScope, final AuditLogChangeListener auditLogChangeListener,
            final CertificateUtils certificateUtils, final XsuaaUserInfo xsuaaUserInfo) {
        super(auditLogFactory, auditLogRequestScope, auditLogChangeListener, certificateUtils, xsuaaUserInfo);
    }

    @Override
    public void logSecurityEvent(String message) {
        LOGGER.trace("Invoked Audit log for Security");
    }

    @Override
    public void logDataModificationAuditMessage(EventContext context, String objectType, String serviceIdentifier,
            Map<String, String> currentEntity, Map<String, String> oldEntity, AuditedDataSubject dataSubject,
            String operation) {
        LOGGER.trace("Invoked Audit log for DataModification");
    }
}
