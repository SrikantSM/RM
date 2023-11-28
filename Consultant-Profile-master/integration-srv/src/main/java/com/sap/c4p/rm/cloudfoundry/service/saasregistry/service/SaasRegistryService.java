package com.sap.c4p.rm.cloudfoundry.service.saasregistry.service;

import org.slf4j.Marker;

import com.sap.c4p.rm.cloudfoundry.service.saasregistry.model.TenantSubscriptions;

/**
 * An Interface to provide the generic functionality to communicate to cloud
 * foundry's SAASRegistry service.
 */
public interface SaasRegistryService {

    /**
     * Method to fetch all the active subscriptions of Resource-Management
     *
     * @return an object of {@link TenantSubscriptions} containing the subscription
     *         information
     */
    TenantSubscriptions getActiveSubscriptions(final Marker loggingMarker);

}
