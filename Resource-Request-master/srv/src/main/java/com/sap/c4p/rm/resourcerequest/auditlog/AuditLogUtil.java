package com.sap.c4p.rm.resourcerequest.auditlog;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cloud.security.xsuaa.token.SpringSecurityContext;
import com.sap.xs.audit.api.exception.AuditLogNotAvailableException;
import com.sap.xs.audit.api.exception.AuditLogWriteException;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.SecurityEventAuditMessage;

import com.sap.c4p.rm.resourcerequest.actions.utils.LoggingMarker;
import com.sap.c4p.rm.resourcerequest.utils.CfUtils;

@Profile("cloud")
@Component
public class AuditLogUtil {
  @Autowired
  protected AuditLogMessageFactory auditLogFactory;
  private CfUtils cfUtils;
  private static final Logger LOGGER = LoggerFactory.getLogger(AuditLogUtil.class);
  private static final Marker MARKER = LoggingMarker.AUDIT_LOG.getMarker();
  private static final String UNKNOWN_REMOTE_HOST = "unknown_remoteHost";
  private static final String AUDITLOG = "auditlog";

  public AuditLogUtil(final AuditLogMessageFactory auditLogFactory, CfUtils cfUtils) {
    this.auditLogFactory = auditLogFactory;
    this.cfUtils = cfUtils;
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

  protected String getRemoteHost() {
    final String remoteHost = HttpRequestHelper.getHttpRequest().getRemoteHost();
    return remoteHost != null ? remoteHost : UNKNOWN_REMOTE_HOST;
  }
}
