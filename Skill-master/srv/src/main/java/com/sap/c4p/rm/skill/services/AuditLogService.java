package com.sap.c4p.rm.skill.services;

import org.springframework.stereotype.Service;

@Service
public interface AuditLogService {

  public void logConfigurationChange(String objectKey, String objectValue, String attributeKey,
      String oldAttributeValue, String newAttributeValue, String type);

  public void logSecurityEvent(String message);
}
