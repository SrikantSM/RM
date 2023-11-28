package com.sap.c4p.rm.consultantprofile.utils;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.function.Consumer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.services.request.RequestContext;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

public class CloudTenantTaskExecutorTest {

    private static final String TEST_TENANT_ID = "testTenantId";
    private CdsRuntime mockCdsRuntime;
    private CloudTenantTaskExecutor cut;
    private Runnable mockRunnable;
    private RequestContextRunner mockRequestContextRunner;

    @BeforeEach
    public void setUp() {
        this.mockCdsRuntime = mock(CdsRuntime.class, Mockito.RETURNS_DEEP_STUBS);
        this.mockRunnable = mock(Runnable.class);
        this.mockRequestContextRunner = mock(RequestContextRunner.class);
        when(this.mockCdsRuntime.requestContext().privilegedUser().modifyUser(any()))
                .thenReturn(mockRequestContextRunner);
        doAnswer(i -> {
            Consumer<RequestContext> task = i.getArgument(0);
            task.accept(null);
            return null;
        }).when(this.mockRequestContextRunner).run(any(Consumer.class));
        this.cut = new CloudTenantTaskExecutor(mockCdsRuntime);
    }

    @Test
    @DisplayName("verify that execute() invokes all expected methods")
    public void execute() {
        this.cut.execute(TEST_TENANT_ID, mockRunnable);
        verify(this.mockRequestContextRunner, times(1)).run(Mockito.<Consumer<RequestContext>>any());
        verify(this.mockRunnable, times(1)).run();
    }
}
