package com.sap.c4p.rm.consultantprofile.utils;

public interface TenantTaskExecutor {
    public void execute(String tenantId, Runnable runnable);
}
