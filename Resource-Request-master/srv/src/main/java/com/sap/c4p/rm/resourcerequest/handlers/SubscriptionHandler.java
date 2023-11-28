package com.sap.c4p.rm.resourcerequest.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.stereotype.Component;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.mt.MtSubscriptionService;
import com.sap.cds.services.mt.MtUnsubscribeEventContext;

import com.sap.c4p.rm.resourcerequest.actions.utils.LoggingMarker;

/** Handler that implements subscription logic */

@Component
@ServiceName(MtSubscriptionService.DEFAULT_NAME)
public class SubscriptionHandler implements EventHandler {

  private static final Logger logger = LoggerFactory.getLogger(SubscriptionHandler.class);
  private static final Marker MARKER = LoggingMarker.SUBSCRIPTION_HANDLER.getMarker();

  // -----------------------------------------------------------------------------------------------------------
  // UnSubscribe
  // -----------------------------------------------------------------------------------------------------------
  @Before(event = MtSubscriptionService.EVENT_UNSUBSCRIBE)
  public void beforeUnsubscribe(MtUnsubscribeEventContext context) {
    logger.debug(MARKER, "@Before Unsubscription({})", MtSubscriptionService.EVENT_UNSUBSCRIBE);

    // always delete the subscription
    context.setDelete(true);
  }
}