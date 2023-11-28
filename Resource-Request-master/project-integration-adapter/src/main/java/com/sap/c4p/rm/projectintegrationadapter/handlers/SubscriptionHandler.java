package com.sap.c4p.rm.projectintegrationadapter.handlers;

import java.util.ArrayList;
import java.util.List;

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
import com.sap.cds.services.mt.MtSubscriptionService;
import com.sap.cds.services.mt.MtUnsubscribeEventContext;
import com.sap.cloud.mt.subscription.json.ApplicationDependency;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.util.CfUtils;

@Component
@ServiceName(MtSubscriptionService.DEFAULT_NAME)
public class SubscriptionHandler implements EventHandler {
  private static final String JOB_SCHEDULER = "jobscheduler";
  private static final String DESTINATION = "destination";
  private static final Logger logger = LoggerFactory.getLogger(SubscriptionHandler.class);
  private static final Marker MARKER = LoggingMarker.REPLICATION_SUBSCRIPTION_HANDLER_MARKER.getMarker();

  @Autowired
  CfUtils cfUtils;

  @Before(event = MtSubscriptionService.EVENT_UNSUBSCRIBE)
  public void beforeUnsubscribe(MtUnsubscribeEventContext context) {
    logger.debug(MARKER, "@Before Unsubscription({})", MtSubscriptionService.EVENT_UNSUBSCRIBE);
    // always delete the subscription
    context.setDelete(true);
  }

  @After(event = MtSubscriptionService.EVENT_GET_DEPENDENCIES)
  public void afterGetDependencies(MtGetDependenciesEventContext context) {
    logger.debug(MARKER, "@After({})", MtSubscriptionService.EVENT_GET_DEPENDENCIES);

    List<ApplicationDependency> dependencies = new ArrayList<>();
    String destinationXsappname = cfUtils.getXSAppName(DESTINATION);
    logger.debug(MARKER, "Destination XSAPPNAME : ({})", destinationXsappname);

    String jobSchedulerXsappname = cfUtils.getXSAppName(JOB_SCHEDULER);
    logger.debug(MARKER, "JobScheduler XSAPPNAME : ({})", jobSchedulerXsappname);

    dependencies.add(createDependency(destinationXsappname));
    dependencies.add(createDependency(jobSchedulerXsappname));

    context.setResult(dependencies);
    context.setCompleted();
  }

  private ApplicationDependency createDependency(String xsappname) {
    ApplicationDependency dependency = new ApplicationDependency();
    dependency.xsappname = xsappname;
    return dependency;
  }

}
