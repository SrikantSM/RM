package com.sap.c4p.rm.skill.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.context.annotation.Profile;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.sap.cloud.security.xsuaa.token.SpringSecurityContext;
import com.sap.xs.audit.api.exception.AuditLogNotAvailableException;
import com.sap.xs.audit.api.exception.AuditLogWriteException;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedObject;
import com.sap.xs.audit.api.v2.ConfigurationChangeAuditMessage;
import com.sap.xs.audit.api.v2.SecurityEventAuditMessage;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.utils.CfUtils;
import com.sap.c4p.rm.skill.utils.HttpRequestHelper;

@Profile("cloud")
@Service
public class CloudAuditLogService implements AuditLogService {
  private final AuditLogMessageFactory auditLogFactory;
  private final CfUtils cfUtils;

  private static final Logger LOGGER = LoggerFactory.getLogger(CloudAuditLogService.class);
  private static final Marker MARKER = LoggingMarker.AUDIT_LOG.getMarker();

  private static final String AUDITLOG = "auditlog";

  private static final String UNKNOWN_REMOTE_HOST = "unknown_remoteHost";

  public CloudAuditLogService(final AuditLogMessageFactory auditLogFactory, CfUtils cfUtils) {
    this.auditLogFactory = auditLogFactory;
    this.cfUtils = cfUtils;
  }

  public void logConfigurationChange(String objectKey, String objectValue, String attributeKey,
      String oldAttributeValue, String newAttributeValue, String type) {
    ConfigurationChangeAuditMessage configurationChangeAuditMessage = this.auditLogFactory
        .createConfigurationChangeAuditMessage();
    AuditedObject auditedObject = this.auditLogFactory.createAuditedObject();
    auditedObject.setType(type);
    auditedObject.addIdentifier(objectKey, objectValue);

    try {
      configurationChangeAuditMessage.setUser("$USER");
      configurationChangeAuditMessage.setTenant("$SUBSCRIBER", getTokenIssuer());
      configurationChangeAuditMessage.setObject(auditedObject);
      configurationChangeAuditMessage.addValue(attributeKey, oldAttributeValue, newAttributeValue);
      configurationChangeAuditMessage.logSuccess();
    } catch (final AccessDeniedException accessDeniedException) {
      LOGGER.error(MARKER, "Auth token not available: {}", accessDeniedException.getMessage());
    } catch (final AuditLogWriteException auditWriteException) {
      LOGGER.error(MARKER, "Could not write to Audit Log: {} Errors: {}", auditWriteException.getMessage(),
          auditWriteException.getErrors(), auditWriteException);
    } catch (final AuditLogNotAvailableException auditLogNotAvailableException) {
      LOGGER.error(MARKER, "AuditLog service not available: {}", auditLogNotAvailableException.getMessage(),
          auditLogNotAvailableException);
    }
  }

  public void logSecurityEvent(String message) {
    SecurityEventAuditMessage securityEventAuditMessage = auditLogFactory.createSecurityEventAuditMessage();
    try {
      securityEventAuditMessage.setUser("$USER");
      securityEventAuditMessage.setTenant("$SUBSCRIBER", getTokenIssuer());
      securityEventAuditMessage.setData(message);
      securityEventAuditMessage.setIp(this.getRemoteHost());
      securityEventAuditMessage.log();
    } catch (final AuditLogWriteException auditWriteException) {
      LOGGER.error(MARKER, "Could not write to Audit Log: {} Errors: {} Exception: {}",
          auditWriteException.getMessage(), auditWriteException.getErrors(), auditWriteException.toString());
    } catch (final AuditLogNotAvailableException auditLogNotAvailableException) {
      LOGGER.error(MARKER, "AuditLog service not available: {} Exception: {}",
          auditLogNotAvailableException.getMessage(), auditLogNotAvailableException.toString());
    }
  }

  String getTokenIssuer() {
    String uaaUrl = cfUtils.getCertUrlByServiceName(AUDITLOG);
    uaaUrl = uaaUrl.substring(uaaUrl.indexOf(".") + 1);
    return String.format("https://%s.%s", SpringSecurityContext.getToken().getSubdomain(), uaaUrl);
  }

  public String getRemoteHost() {
    final String remoteHost = HttpRequestHelper.getHttpRequest().getRemoteHost();
    return remoteHost != null ? remoteHost : UNKNOWN_REMOTE_HOST;
  }
}
