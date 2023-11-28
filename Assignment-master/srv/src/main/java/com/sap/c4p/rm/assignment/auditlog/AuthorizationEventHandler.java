package com.sap.c4p.rm.assignment.auditlog;

import java.text.MessageFormat;
import java.util.Locale;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceAware;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cds.services.authorization.AuthorizationService;
import com.sap.cds.services.authorization.EntityAccessEventContext;
import com.sap.cds.services.authorization.ServiceAccessEventContext;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.assignment.config.LoggingMarker;

@Profile("cloud")
@Component
@ServiceName(AuthorizationService.DEFAULT_NAME)
public class AuthorizationEventHandler implements EventHandler, MessageSourceAware {

  @Autowired
  private AuditLogUtil auditLogUtil;
  private MessageSource messageSource;
  private static final String AUTHORIZATION_FAILURE_SERVICE = "AUTHORIZATION_FAILURE_SERVICE";
  private static final String AUTHORIZATION_SUCCESS_SERVICE = "AUTHORIZATION_SUCCESS_SERVICE";
  private static final String AUTHORIZATION_FAILURE_ENTITY = "AUTHORIZATION_FAILURE_ENTITY";
  private static final String AUTHORIZATION_SUCCESS_ENTITY = "AUTHORIZATION_SUCCESS_ENTITY";
  private static final String LOG_LEVEL_ERROR = "ERROR";
  private static final String LOG_LEVEL_INFO = "INFO";

  private static final Logger LOGGER = LoggerFactory.getLogger(AuthorizationEventHandler.class);
  private static final Marker AUDIT_MARKER = LoggingMarker.AUDIT_MARKER.getMarker();

  @After
  public void afterServiceAuthorization(ServiceAccessEventContext context) {
    String message = "";
    Boolean result = context.getResult();
    String correlationId = Optional.ofNullable(context.getParameterInfo().getCorrelationId()).orElse("");
    if (result != null && result.equals(Boolean.TRUE))
      message = buildLogMessage(AUTHORIZATION_SUCCESS_SERVICE, LOG_LEVEL_INFO, context.getAccessServiceName(),
          context.getAccessEventName(), correlationId);
    else
      message = buildLogMessage(AUTHORIZATION_FAILURE_SERVICE, LOG_LEVEL_ERROR, context.getAccessServiceName(),
          context.getAccessEventName(), correlationId);
    LOGGER.debug(AUDIT_MARKER, "Authorization event occured for service access: {} for the user: {},tenant: {}",
        message, context.getUserInfo().getName(), context.getUserInfo().getTenant());
    auditLogUtil.logSecurityEvent(message);
  }

  @After
  public void afterEntityAuthorization(EntityAccessEventContext context) {
    String message = "";
    Boolean result = context.getResult();
    String correlationId = Optional.ofNullable(context.getParameterInfo().getCorrelationId()).orElse("");
    if (result != null && result.equals(Boolean.TRUE))
      message = buildLogMessage(AUTHORIZATION_SUCCESS_ENTITY, LOG_LEVEL_INFO, context.getAccessEntityName(),
          context.getAccessEventName(), correlationId);
    else
      message = buildLogMessage(AUTHORIZATION_FAILURE_ENTITY, LOG_LEVEL_ERROR, context.getAccessEntityName(),
          context.getAccessEventName(), correlationId);
    LOGGER.debug(AUDIT_MARKER, "Authorization event occured for entity access: {} for the user: {},tenant: {}", message,
        context.getUserInfo().getName(), context.getUserInfo().getTenant());
    auditLogUtil.logSecurityEvent(message);
  }

  synchronized String buildLogMessage(String key, String logLevel, String resource, String event,
      String correlationId) {
    Locale locale = new Locale("en");
    String i18nMessage = this.messageSource.getMessage(key, null, locale);
    i18nMessage = MessageFormat.format(i18nMessage, resource, event, correlationId);
    return "{\"level\":" + "\"" + logLevel + "\",\"message:\"" + i18nMessage + "}";
  }

  @Override
  public synchronized void setMessageSource(MessageSource messageSource) {
    if (this.messageSource == null)
      this.messageSource = messageSource;
  }
}