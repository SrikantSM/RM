package com.sap.c4p.rm.cloudfoundry.service.saasregistry.model;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Test Class to test working of {@link TenantSubscriptions},
 * {@link Subscription} and {@link Dependency}.
 */
public class TenantSubscriptionsTest {

    private static final String APP_NAME = "appName";
    private static final String CONSUMER_TENANT_ID = UUID.randomUUID().toString();
    private static final String ERROR = "error";
    private static final String STATE = "state";
    private static final String SUB_DOMAIN = "subDomain";
    private static final String URL = "url";
    private static final String XS_APP_NAME = "xsAppName";

    @Test
    @DisplayName("test @NoArgConstructor and Getters")
    public void testDataAndNoArgsConstructorAnnotation() {
        Dependency dependency = new Dependency();
        assertNull(dependency.getAppName());
        assertNull(dependency.getXsappname());
        assertNull(dependency.getDependencies());

        Subscription subscription = new Subscription();
        assertNull(subscription.getAppName());
        assertNull(subscription.getConsumerTenantId());
        assertNull(subscription.getError());
        assertNull(subscription.getState());
        assertNull(subscription.getSubdomain());
        assertNull(subscription.getUrl());
        assertNull(subscription.getDependencies());

        TenantSubscriptions tenantSubscriptions = new TenantSubscriptions();
        assertNull(tenantSubscriptions.getSubscriptions());
    }

    @Test
    @DisplayName("test @AllArgsConstructor and Getters")
    public void testAllArgsConstructorAnnotation() {
        Dependency dependency = new Dependency(XS_APP_NAME, APP_NAME, Collections.singletonList(new Object()));
        Subscription subscription = new Subscription(URL, APP_NAME, SUB_DOMAIN, CONSUMER_TENANT_ID, STATE, ERROR,
                Collections.singletonList(dependency));
        TenantSubscriptions tenantSubscriptions = new TenantSubscriptions(Collections.singletonList(subscription));

        List<Subscription> subscriptions = tenantSubscriptions.getSubscriptions();
        assertEquals(1, subscriptions.size());
        Subscription assertSubscription = subscriptions.get(0);
        assertEquals(SUB_DOMAIN, assertSubscription.getSubdomain());
        assertEquals(CONSUMER_TENANT_ID, assertSubscription.getConsumerTenantId());
        assertEquals(APP_NAME, assertSubscription.getAppName());
        assertEquals(ERROR, assertSubscription.getError());
        assertEquals(STATE, assertSubscription.getState());
        assertEquals(URL, assertSubscription.getUrl());
        List<Dependency> dependencyList = assertSubscription.getDependencies();
        assertEquals(1, dependencyList.size());
        Dependency assertDependency = dependencyList.get(0);
        assertEquals(APP_NAME, assertDependency.getAppName());
        assertEquals(XS_APP_NAME, assertDependency.getXsappname());
        assertEquals(1, assertDependency.getDependencies().size());
    }

}
