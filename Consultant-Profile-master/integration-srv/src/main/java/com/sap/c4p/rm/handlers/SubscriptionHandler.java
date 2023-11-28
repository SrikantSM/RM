package com.sap.c4p.rm.handlers;

import java.util.Arrays;
import java.util.List;

import com.sap.c4p.rm.cloudfoundry.environment.DestinationVCAP;
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

import com.sap.c4p.rm.cloudfoundry.environment.JobSchedulerVCAP;
import com.sap.c4p.rm.cloudfoundry.environment.MasterDataIntegrationVCAP;
import com.sap.c4p.rm.config.LoggingMarker;

import io.pivotal.cfenv.core.CfEnv;

/**
 * Class to handle the subscription related activities
 */
@Component
@ServiceName(MtSubscriptionService.DEFAULT_NAME)
public class SubscriptionHandler implements EventHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(SubscriptionHandler.class);
    private static final Marker GET_SUBSCRIPTION_DEPENDENCIES_MARKER = LoggingMarker.GET_SUBSCRIPTION_DEPENDENCIES
            .getMarker();

    private final JobSchedulerVCAP jobSchedulerVCAP;
    private final MasterDataIntegrationVCAP masterDataIntegrationVCAP;
    private final DestinationVCAP destinationVCAP;

    @Autowired
    public SubscriptionHandler(final JobSchedulerVCAP jobSchedulerVCAP, final CfEnv cfEnv, DestinationVCAP destinationVCAP) {
        this.jobSchedulerVCAP = jobSchedulerVCAP;
        this.masterDataIntegrationVCAP = new MasterDataIntegrationVCAP(cfEnv);
        this.destinationVCAP = destinationVCAP;
    }

    @Before(event = MtSubscriptionService.EVENT_UNSUBSCRIBE)
    public void beforeUnsubscribe(MtUnsubscribeEventContext mtUnsubscribeEventContext) {
        // always delete the subscription
        mtUnsubscribeEventContext.setDelete(true);
    }

    /**
     * Method to provide the dependency of cloud foundry services during the
     * subscriptions
     *
     * @param mtGetDependenciesEventContext: contain the context
     */
    @After(event = MtSubscriptionService.EVENT_GET_DEPENDENCIES)
    public void afterGetDependencies(MtGetDependenciesEventContext mtGetDependenciesEventContext) {

        LOGGER.info(GET_SUBSCRIPTION_DEPENDENCIES_MARKER, "@After ({})", MtSubscriptionService.EVENT_GET_DEPENDENCIES);

        String xsappNameJobScheduler = this.jobSchedulerVCAP.getXsAppName();
        LOGGER.info(GET_SUBSCRIPTION_DEPENDENCIES_MARKER, "JobScheduler XSAPPNAME : ({})", xsappNameJobScheduler);

        String xsappNameOneMDS = this.masterDataIntegrationVCAP.getXsAppName();
        LOGGER.info(GET_SUBSCRIPTION_DEPENDENCIES_MARKER, "OneMDS/MasterDataIntegration XSAPPNAME : ({})",
                xsappNameOneMDS);

        String xsappNameDestination = this.destinationVCAP.getXsAppName();
        LOGGER.info(GET_SUBSCRIPTION_DEPENDENCIES_MARKER, "Destination XSAPPNAME : ({})",xsappNameDestination);

        List<ApplicationDependency> dependencies = Arrays.asList(createDependency(xsappNameJobScheduler),
                createDependency(xsappNameOneMDS),createDependency(xsappNameDestination));

        mtGetDependenciesEventContext.setResult(dependencies);
        mtGetDependenciesEventContext.setCompleted();
    }

    private ApplicationDependency createDependency(String xsappname) {
        ApplicationDependency dependency = new ApplicationDependency();
        dependency.xsappname = xsappname;
        return dependency;
    }

}
