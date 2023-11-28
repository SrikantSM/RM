package com.sap.c4p.rm.auditlog;

import static com.sap.c4p.rm.utils.Constants.CREATE_OPERATION;
import static com.sap.c4p.rm.utils.Constants.INCLUDE_OPERATION;
import static com.sap.c4p.rm.utils.Constants.UPDATE_OPERATION;

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

import com.sap.c4p.rm.cloudfoundry.environment.AuditLogVCAP;
import com.sap.c4p.rm.config.LoggingMarker;

@Component
public class AuditLogUtil {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuditLogUtil.class);
    private static final Marker AUDIT_LOG_MARKER = LoggingMarker.AUDIT_LOG.getMarker();
    private Boolean isRequestFromCAP = false;

    private final AuditLogMessageFactory auditLogFactory;
    private final AuditLogVCAP auditLogVCAP;
    private final XsuaaUserInfo xsuaaUserInfo;
    private final AuditLogRequestScope auditLogRequestScope;
    private final AuditLogChangeListener auditLogChangeListener;

    @Autowired
    public AuditLogUtil(final AuditLogMessageFactory auditLogFactory, final XsuaaUserInfo xsuaaUserInfo,
            final AuditLogVCAP auditLogVCAP, AuditLogRequestScope auditLogRequestScope, AuditLogChangeListener auditLogChangeListener) {
        this.auditLogFactory = auditLogFactory;
        this.xsuaaUserInfo = xsuaaUserInfo;
        this.auditLogVCAP = auditLogVCAP;
		this.auditLogRequestScope = auditLogRequestScope;
		this.auditLogChangeListener = auditLogChangeListener;
    }

    public DataModificationAuditMessage prepareDataModificationAuditMessage(EventContext context, String objectType, String serviceIdentifier, String operation,
            Map<String, String> currentEntity, Map<String, String> oldEntity, AuditedDataSubject dataSubject) {
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
        if (UPDATE_OPERATION.equals(operation) || INCLUDE_OPERATION.equals(operation))
        	Stream.concat(oldEntity.keySet().stream(), currentEntity.keySet().stream()).collect(Collectors.toSet())
            		.forEach(key -> dataModificationAuditMessage.addAttribute(key, oldEntity.get(key),
            				currentEntity.get(key)));
        try {
            dataModificationAuditMessage.logPrepare();
        } catch (AuditLogNotAvailableException auditLogNotAvailableException) {
            LOGGER.error(AUDIT_LOG_MARKER, "AuditLog service not available: {}",
                    auditLogNotAvailableException.getMessage(), auditLogNotAvailableException);
        } catch (AuditLogWriteException auditWriteException) {
            LOGGER.error(AUDIT_LOG_MARKER, "Could not write to Audit Log: {} Errors: {} ",
                    auditWriteException.getMessage(), auditWriteException.getErrors(), auditWriteException);
        }
        if (isRequestFromCAP.equals(Boolean.TRUE)) {
            auditLogRequestScope.addMessage(dataModificationAuditMessage);
            context.getChangeSetContext().register(auditLogChangeListener);
        }
        return dataModificationAuditMessage;
    }

    public void setDataModificationAuditMessageToFailure(DataModificationAuditMessage dataModificationAuditMessage) {
        try {
            dataModificationAuditMessage.logFailure();
        } catch (AuditLogNotAvailableException auditLogNotAvailableException) {
            LOGGER.error(AUDIT_LOG_MARKER, "AuditLog service not available: {}",
                    auditLogNotAvailableException.getMessage(), auditLogNotAvailableException);
        } catch (AuditLogWriteException auditWriteException) {
            LOGGER.error(AUDIT_LOG_MARKER, "Could not write to Audit Log: {} Errors: {} ",
                    auditWriteException.getMessage(), auditWriteException.getErrors(), auditWriteException);
        }
    }

    String getTokenIssuer() {
        String certUrl = auditLogVCAP.getCerturl();
        certUrl = certUrl.substring(certUrl.indexOf(".") + 1);
        return String.format("https://%s.%s", xsuaaUserInfo.getSubDomain(), certUrl);
    }

	public void setIsRequestFromCAP(Boolean isRequestFromCAP) {
		this.isRequestFromCAP = isRequestFromCAP;
	}
}
