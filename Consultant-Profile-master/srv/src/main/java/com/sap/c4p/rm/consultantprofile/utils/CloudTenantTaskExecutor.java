package com.sap.c4p.rm.consultantprofile.utils;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cds.services.runtime.CdsRuntime;

@Component
@Profile("hana")
public class CloudTenantTaskExecutor implements TenantTaskExecutor {

    private CdsRuntime cdsRuntime;

    public CloudTenantTaskExecutor(final CdsRuntime cdsRuntime) {
        this.cdsRuntime = cdsRuntime;
    }

    public void execute(String tenantId, Runnable task) {
        this.cdsRuntime.requestContext().privilegedUser().modifyUser(user -> user.setTenant(tenantId)).run(context -> {
            task.run();
        });
    }
}
