package com.sap.c4p.rm.consultantprofile.utils;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("local-test")
public class LocalTenantTaskExecutor implements TenantTaskExecutor {

    @Override
    public void execute(String tenantId, Runnable task) {
        task.run();
    }
}
