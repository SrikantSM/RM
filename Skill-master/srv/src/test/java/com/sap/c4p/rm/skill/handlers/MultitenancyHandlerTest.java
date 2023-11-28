package com.sap.c4p.rm.skill.handlers;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.environment.CdsEnvironment;
import com.sap.cds.services.mt.MtGetDependenciesEventContext;
import com.sap.cds.services.mt.MtSubscribeEventContext;
import com.sap.cds.services.mt.MtUnsubscribeEventContext;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cloud.mt.subscription.json.SubscriptionPayload;

import com.sap.c4p.rm.skill.services.DefaultProficiencySetService;

class MultitenancyHandlerTest {

  private static final String TEST_TENANT = "testTenant";
  private DefaultProficiencySetService mockDefaultProficiencySetService;
  private MultitenancyHandler cut;

  private CdsRuntime mockCdsRuntime;

  private CdsEnvironment mockCdsEnvironment;

  private SubscriptionPayload mockSubscriptionPayload;

  @BeforeEach
  void beforeEach() {
    this.mockDefaultProficiencySetService = mock(DefaultProficiencySetService.class);
    this.cut = new MultitenancyHandler(this.mockDefaultProficiencySetService);
  }

  @Test
  @DisplayName("verify that afterGetDependencies() invokes all expected methods")
  void afterGetDependencies() {
    MtGetDependenciesEventContext mockContext = mock(MtGetDependenciesEventContext.class);
    this.cut.afterGetDependencies(mockContext);
    verify(mockContext).setResult(Collections.emptyList());
  }

  @Test
  @DisplayName("verify that beforeUnsubscribe() invokes all expected methods")
  void beforeUnsubscribe() {
    MtUnsubscribeEventContext mockContext = mock(MtUnsubscribeEventContext.class);
    this.cut.beforeUnsubscribe(mockContext);
    verify(mockContext).setDelete(true);
  }

  @Test
  @DisplayName("verify that afterSubscribe() invokes all expected methods")
  void afterSubscribe() {
    this.mockCdsRuntime = mock(CdsRuntime.class);
    this.mockSubscriptionPayload = mock(SubscriptionPayload.class);
    this.mockCdsEnvironment = mock(CdsEnvironment.class);
    MtSubscribeEventContext mockContext = mock(MtSubscribeEventContext.class);
    when(mockContext.getTenantId()).thenReturn(TEST_TENANT);
    when(mockContext.getCdsRuntime()).thenReturn(mockCdsRuntime);
    when(mockCdsRuntime.getEnvironment()).thenReturn(mockCdsEnvironment);
    when(mockCdsEnvironment.getProperty("TENANT_DELIMITER", String.class, "")).thenReturn("-tenant-");
    when(mockCdsEnvironment.getProperty("PROTOCOL", String.class, "")).thenReturn("https");
    when(mockCdsEnvironment.getProperty("URL_SUFFIX", String.class, ""))
        .thenReturn("c4p-rm-bradbury-dev-6-rm-approuter.resourcemanagement-dev.cloud.sap");
    when(mockContext.getSubscriptionPayload()).thenReturn(mockSubscriptionPayload);
    mockSubscriptionPayload.subscribedSubdomain = "rm-bradbury";
    this.cut.afterSubscribe(mockContext);
    verify(this.mockDefaultProficiencySetService, times(1)).upsertDefaultProficiencySetForTenant(eq(TEST_TENANT));
    verify(mockContext, times(1))
        .setResult("https://rm-bradbury-tenant-c4p-rm-bradbury-dev-6-rm-approuter.resourcemanagement-dev.cloud.sap");
  }
}
