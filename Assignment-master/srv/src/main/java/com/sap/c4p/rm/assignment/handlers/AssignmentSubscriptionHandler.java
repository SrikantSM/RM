package com.sap.c4p.rm.assignment.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.stereotype.Component;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.mt.MtSubscriptionService;
import com.sap.cds.services.mt.MtUnsubscribeEventContext;

import com.sap.c4p.rm.assignment.config.LoggingMarker;

/**
 * Handler that implements subscription logic
 */
@Component
@ServiceName(MtSubscriptionService.DEFAULT_NAME)
public class AssignmentSubscriptionHandler implements EventHandler {

  private static final Logger logger = LoggerFactory.getLogger(AssignmentSubscriptionHandler.class);
  private static final Marker SUBSCRIPTION_MARKER = LoggingMarker.SUBSCRIPTION_MARKER.getMarker();

  @Before(event = MtSubscriptionService.EVENT_UNSUBSCRIBE)
  public void beforeUnsubscribe(MtUnsubscribeEventContext context) {
    logger.info(SUBSCRIPTION_MARKER, "@Before({})", MtSubscriptionService.EVENT_UNSUBSCRIBE);
    // always delete the subscription
    context.setDelete(true);
  }

}