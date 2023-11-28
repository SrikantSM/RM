package com.sap.c4p.rm.consultantprofile.auditlog;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.EventContext;
import com.sap.xs.audit.api.exception.AuditLogNotAvailableException;
import com.sap.xs.audit.api.exception.AuditLogWriteException;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;
import com.sap.xs.audit.api.v2.AuditedObject;
import com.sap.xs.audit.api.v2.DataModificationAuditMessage;
import com.sap.xs.audit.api.v2.SecurityEventAuditMessage;

import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.utils.CertificateUtils;

@Component
public class AuditLogUtil {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuditLogUtil.class);
    private static final Marker MARKER = LoggingMarker.AUDIT_LOGGING.getMarker();

    public static final String CREATE_OPERATION = "create";
    public static final String UPDATE_OPERATION = "update";
    public static final String DELETE_OPERATION = "delete";

    private final AuditLogMessageFactory auditLogFactory;
    private final AuditLogRequestScope auditLogRequestScope;
    private final AuditLogChangeListener auditLogChangeListener;
    private final CertificateUtils certificateUtils;
    private final XsuaaUserInfo xsuaaUserInfo;

    @Autowired
    public AuditLogUtil(final AuditLogMessageFactory auditLogFactory, final AuditLogRequestScope auditLogRequestScope,
            final AuditLogChangeListener auditLogChangeListener, final CertificateUtils certificateUtils,
            final XsuaaUserInfo xsuaaUserInfo) {
        this.auditLogFactory = auditLogFactory;
        this.auditLogRequestScope = auditLogRequestScope;
        this.auditLogChangeListener = auditLogChangeListener;
        this.certificateUtils = certificateUtils;
        this.xsuaaUserInfo = xsuaaUserInfo;
    }

    public void logSecurityEvent(String message) {
        SecurityEventAuditMessage securityEventAuditMessage = auditLogFactory.createSecurityEventAuditMessage();
        try {
            securityEventAuditMessage.setUser("$USER");
            securityEventAuditMessage.setTenant("$SUBSCRIBER", getTokenIssuer());
            securityEventAuditMessage.setData(message);
            String remoteAddress = this.getRemoteAddress();
            if (remoteAddress != null) {
                securityEventAuditMessage.setIp(remoteAddress);
            }
            securityEventAuditMessage.log();
        } catch (final AuditLogWriteException auditWriteException) {
            LOGGER.error(MARKER, "Could not write to Audit Log: {} Errors: {} ", auditWriteException.getMessage(),
                    auditWriteException.getErrors(), auditWriteException);
        } catch (final AuditLogNotAvailableException auditLogNotAvailableException) {
            LOGGER.error(MARKER, "AuditLog service not available: {}", auditLogNotAvailableException.getMessage(),
                    auditLogNotAvailableException);
        }
    }

    public void logDataModificationAuditMessage(EventContext context, String objectType, String serviceIdentifier,
            Map<String, String> currentEntity, Map<String, String> oldEntity, AuditedDataSubject dataSubject,
            String operation) {
        DataModificationAuditMessage dataModificationAuditMessage = auditLogFactory
                .createDataModificationAuditMessage();
        dataModificationAuditMessage.setUser("$USER");
        dataModificationAuditMessage.setTenant("$SUBSCRIBER", getTokenIssuer());
        AuditedObject auditedObject = auditLogFactory.createAuditedObject();
        auditedObject.setType(objectType);
        auditedObject.addIdentifier("service", serviceIdentifier);
        dataModificationAuditMessage.setObject(auditedObject);
        dataModificationAuditMessage.setDataSubject(dataSubject);
        if (CREATE_OPERATION.equals(operation))
            currentEntity.forEach((key, value) -> dataModificationAuditMessage.addAttribute(key, null, value));
        if (UPDATE_OPERATION.equals(operation))
            Stream.concat(oldEntity.keySet().stream(), currentEntity.keySet().stream()).collect(Collectors.toSet())
                    .forEach(key -> dataModificationAuditMessage.addAttribute(key, oldEntity.get(key),
                            currentEntity.get(key)));
        if (DELETE_OPERATION.equals(operation))
            currentEntity.forEach((key, value) -> dataModificationAuditMessage.addAttribute(key, value, null));
        try {
            dataModificationAuditMessage.logPrepare();
        } catch (AuditLogNotAvailableException auditLogNotAvailableException) {
            LOGGER.error(MARKER, "AuditLog service not available: {}", auditLogNotAvailableException.getMessage(),
                    auditLogNotAvailableException);
        } catch (AuditLogWriteException auditWriteException) {
            LOGGER.error(MARKER, "Could not write to Audit Log: {} Errors: {} ", auditWriteException.getMessage(),
                    auditWriteException.getErrors(), auditWriteException);
        }
        auditLogRequestScope.addMessage(dataModificationAuditMessage);
        context.getChangeSetContext().register(auditLogChangeListener);
    }

    protected String getRemoteAddress() {
        return HttpRequestHelper.getHttpRequest().getRemoteAddr();
    }

    String getTokenIssuer() {
        String certUrl = certificateUtils.getCertUrlByServiceName("auditlog");
        certUrl = certUrl.substring(certUrl.indexOf(".") + 1);
        return String.format("https://%s.%s", xsuaaUserInfo.getSubDomain(), certUrl);
    }

}
