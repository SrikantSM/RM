package com.sap.c4p.rm.skill.handlers;

import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.mt.MtGetDependenciesEventContext;
import com.sap.cds.services.mt.MtSubscribeEventContext;
import com.sap.cds.services.mt.MtSubscriptionService;
import com.sap.cds.services.mt.MtUnsubscribeEventContext;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.services.DefaultProficiencySetService;

/**
 * Handler for the multitenancy service. Currently, there are no dependencies,
 * therefore return empty list. For the subscription endpoint, we rely on the
 * default behaviour (configuration via env variables)
 */
@Component
@ServiceName(MtSubscriptionService.DEFAULT_NAME)
public class MultitenancyHandler implements EventHandler {
  private final DefaultProficiencySetService defaultProficiencySetService;

  private static final Logger LOGGER = LoggerFactory.getLogger(MultitenancyHandler.class);
  private static final Marker MARKER = LoggingMarker.MULTITENANCY.getMarker();

  @Autowired
  public MultitenancyHandler(DefaultProficiencySetService defaultProficiencySetService) {
    this.defaultProficiencySetService = defaultProficiencySetService;
  }

  @After(event = MtSubscriptionService.EVENT_GET_DEPENDENCIES)
  public void afterGetDependencies(MtGetDependenciesEventContext context) {
    LOGGER.debug(MARKER, "@After({})", MtSubscriptionService.EVENT_GET_DEPENDENCIES);

    // no domain dependencies for skill right now. Therefore return empty list.
    context.setResult(Collections.emptyList());
  }

  @Before(event = MtSubscriptionService.EVENT_UNSUBSCRIBE)
  public void beforeUnsubscribe(MtUnsubscribeEventContext context) {
    LOGGER.debug(MARKER, "@Before({})", MtSubscriptionService.EVENT_UNSUBSCRIBE);

    // delete the database schema on unsubscription
    context.setDelete(true);
  }

  @After(event = MtSubscriptionService.EVENT_SUBSCRIBE)
  public void afterSubscribe(MtSubscribeEventContext context) {
    LOGGER.debug(MARKER, "@After({})", MtSubscriptionService.EVENT_SUBSCRIBE);

    this.defaultProficiencySetService.upsertDefaultProficiencySetForTenant(context.getTenantId());

    String tenantDelimiter = context.getCdsRuntime().getEnvironment().getProperty("TENANT_DELIMITER", String.class, "");
    String urlSuffix = context.getCdsRuntime().getEnvironment().getProperty("URL_SUFFIX", String.class, "");
    String protocol = context.getCdsRuntime().getEnvironment().getProperty("PROTOCOL", String.class, "");

    // Override the default tenantAppURL if the environment variables are set in the
    // mta ext files
    if (tenantDelimiter != null && !tenantDelimiter.isEmpty() && urlSuffix != null && !urlSuffix.isEmpty()) {
      String url = protocol + "://" + context.getSubscriptionPayload().subscribedSubdomain + tenantDelimiter
          + urlSuffix;
      context.setResult(url);
      LOGGER.info(MARKER, "Application URL is set to Common super domain suffix for Subdomain {}",
          context.getSubscriptionPayload().subscribedSubdomain);
    }

    context.setCompleted();
  }
}
