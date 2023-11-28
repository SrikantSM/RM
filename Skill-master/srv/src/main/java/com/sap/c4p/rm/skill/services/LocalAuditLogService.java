package com.sap.c4p.rm.skill.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Profile({ "local", "integration-test" })
@Service
public class LocalAuditLogService implements AuditLogService {

  private static final Logger LOGGER = LoggerFactory.getLogger(LocalAuditLogService.class);

  public void logConfigurationChange(String objectKey, String objectValue, String attributeKey,
      String oldAttributeValue, String newAttributeValue, String type) {
    LOGGER.trace("Run audit log with local profile");
  }

  public void logSecurityEvent(String message) {
    LOGGER.trace("Security event logged for local profile {} ", message);
  }
}
