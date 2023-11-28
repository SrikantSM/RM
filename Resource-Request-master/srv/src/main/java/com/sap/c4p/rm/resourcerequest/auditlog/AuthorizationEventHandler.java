package com.sap.c4p.rm.resourcerequest.auditlog;

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

import com.sap.c4p.rm.resourcerequest.actions.utils.LoggingMarker;
import com.sap.c4p.rm.resourcerequest.utils.Constants;

@Profile("cloud")
@Component
@ServiceName(AuthorizationService.DEFAULT_NAME)
public class AuthorizationEventHandler implements EventHandler, MessageSourceAware {
  @Autowired
  private AuditLogUtil auditLogUtil;
  private MessageSource messageSource;

  private static final Logger LOGGER = LoggerFactory.getLogger(AuthorizationEventHandler.class);
  private static final Marker MARKER = LoggingMarker.AUTHORIZATION_EVENT.getMarker();

  @After
  public void afterServiceAuthorization(ServiceAccessEventContext context) {
    LOGGER.debug(MARKER, "Authorization event occured for service access");
    String message = "";
    if (Boolean.TRUE.equals(context.getResult()))
      message = buildLogMessage(Constants.AUTHORIZATION_SUCCESS_SERVICE, Constants.LOG_LEVEL_INFO,
          context.getAccessServiceName(), context.getAccessEventName(),
          Optional.ofNullable(context.getParameterInfo().getCorrelationId()).orElse(""));
    else
      message = buildLogMessage(Constants.AUTHORIZATION_FAILURE_SERVICE, Constants.LOG_LEVEL_ERROR,
          context.getAccessServiceName(), context.getAccessEventName(),
          Optional.ofNullable(context.getParameterInfo().getCorrelationId()).orElse(""));
    LOGGER.debug(MARKER,
        "Authorization event occured for service access: {} for the user: {},tenant: {}, CorrelationId: {}", message,
        context.getUserInfo().getName(), context.getUserInfo().getTenant(),
        Optional.ofNullable(context.getParameterInfo().getCorrelationId()).orElse(""));
    auditLogUtil.logSecurityEvent(message);
  }

  @After
  public void afterEntityAuthorization(EntityAccessEventContext context) {
    LOGGER.debug(MARKER, "Authorization event occured for entity access");
    String message = "";
    if (Boolean.TRUE.equals(context.getResult()))
      message = buildLogMessage(Constants.AUTHORIZATION_SUCCESS_ENTITY, Constants.LOG_LEVEL_INFO,
          context.getAccessEntityName(), context.getAccessEventName(),
          Optional.ofNullable(context.getParameterInfo().getCorrelationId()).orElse(""));
    else
      message = buildLogMessage(Constants.AUTHORIZATION_FAILURE_ENTITY, Constants.LOG_LEVEL_ERROR,
          context.getAccessEntityName(), context.getAccessEventName(),
          Optional.ofNullable(context.getParameterInfo().getCorrelationId()).orElse(""));
    LOGGER.debug(MARKER,
        "Authorization event occured for entity access: {} for the user: {},tenant: {}, CorrelationId: {}", message,
        context.getUserInfo().getName(), context.getUserInfo().getTenant(),
        Optional.ofNullable(context.getParameterInfo().getCorrelationId()).orElse(""));
    auditLogUtil.logSecurityEvent(message);
  }

  synchronized String buildLogMessage(String key, String logLevel, String resource, String event,
      String correlationId) {
    LOGGER.debug(MARKER, "In message builder");
    Locale locale = new Locale("en");
    String i18nMessage = this.messageSource.getMessage(key, null, locale);
    i18nMessage = MessageFormat.format(i18nMessage, resource, event, correlationId);
    String message = "{\"level\":" + "\"" + logLevel + "\",\"message:\"" + i18nMessage + "}";
    LOGGER.debug(MARKER, "audit message built: {}", message);
    return message;
  }

  @Override
  public synchronized void setMessageSource(MessageSource messageSource) {
    if (this.messageSource == null)
      this.messageSource = messageSource;
  }
}
