package com.sap.c4p.rm.skill.utils;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.function.Consumer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.services.changeset.ChangeSetContext;
import com.sap.cds.services.mt.TenantProviderService;
import com.sap.cds.services.request.RequestContext;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.ChangeSetContextRunner;
import com.sap.cds.services.runtime.RequestContextRunner;

public class CloudTenantTaskExecutorTest {

  private TenantProviderService mockTenantProviderService;
  private CdsRuntime mockCdsRuntime;
  private CloudTenantTaskExecutor cut;
  private Runnable mockRunnable;
  private Consumer<String> mockConsumer;
  private RequestContextRunner mockRequestContextRunner;
  private ChangeSetContextRunner mockChangeSetContextRunner;

  @SuppressWarnings("unchecked")
  @BeforeEach
  public void setUp() {
    this.mockCdsRuntime = mock(CdsRuntime.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockTenantProviderService = mock(TenantProviderService.class);
    this.mockRunnable = mock(Runnable.class);
    this.mockConsumer = mock(Consumer.class);
    this.mockRequestContextRunner = mock(RequestContextRunner.class);
    this.mockChangeSetContextRunner = mock(ChangeSetContextRunner.class);

    when(this.mockCdsRuntime.getServiceCatalog().getService(any(), anyString()))
        .thenReturn(this.mockTenantProviderService);
    when(this.mockCdsRuntime.requestContext().privilegedUser().modifyUser(any()))
        .thenReturn(this.mockRequestContextRunner);
    when(this.mockCdsRuntime.changeSetContext()).thenReturn(this.mockChangeSetContextRunner);
    when(this.mockTenantProviderService.readTenants()).thenReturn(Arrays.asList("testTenant1", "testTenant2"));

    doAnswer(i -> {
      Consumer<RequestContext> task = i.getArgument(0);
      task.accept(null);
      return null;
    }).when(this.mockRequestContextRunner).run(any(Consumer.class));

    doAnswer(i -> {
      Consumer<ChangeSetContext> task = i.getArgument(0);
      task.accept(null);
      return null;
    }).when(this.mockChangeSetContextRunner).run(any(Consumer.class));

    this.cut = new CloudTenantTaskExecutor(this.mockCdsRuntime);
  }

  @Test
  @DisplayName("verify that execute() invokes all expected methods")
  public void executeRunnable() {
    this.cut.execute(this.mockRunnable);
    verify(this.mockRunnable, times(2)).run();
  }

  @Test
  @DisplayName("verify that execute() invokes all expected methods")
  public void executeConsumer() {
    this.cut.execute(this.mockConsumer);
    verify(this.mockRequestContextRunner, times(2)).run(Mockito.<Consumer<RequestContext>>any());
    verify(this.mockConsumer, times(1)).accept("testTenant1");
    verify(this.mockConsumer, times(1)).accept("testTenant2");
  }
}
