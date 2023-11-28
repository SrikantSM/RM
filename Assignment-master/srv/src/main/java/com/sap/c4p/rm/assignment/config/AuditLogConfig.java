/**
 * 
 */
package com.sap.c4p.rm.assignment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sap.xs.audit.api.exception.AuditLogException;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.client.impl.v2.AuditLogMessageFactoryImpl;

/**
 * @author I310562
 *
 */
@Configuration
public class AuditLogConfig {

  @Bean
  AuditLogMessageFactory auditLogMessageFactory() throws AuditLogException {
    return new AuditLogMessageFactoryImpl();
  }

}
