package com.sap.c4p.rm.consultantprofile.utils;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class LocalTenantTaskExecutorTest {

    private static final String TEST_TENANT_ID = "testTenantId";
    private LocalTenantTaskExecutor cut;
    private Runnable mockRunnable;

    @BeforeEach
    public void setUp() {
        this.mockRunnable = mock(Runnable.class);
        this.cut = new LocalTenantTaskExecutor();
    }

    @Test
    @DisplayName("verify that execute() invokes all expected methods")
    public void execute() {
        this.cut.execute(TEST_TENANT_ID, mockRunnable);
        verify(mockRunnable, times(1)).run();
    }
}
