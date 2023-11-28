package com.sap.c4p.rm.skill.utils;

import java.util.List;
import java.util.function.Consumer;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cds.services.mt.TenantProviderService;
import com.sap.cds.services.runtime.CdsRuntime;

@Component
@Profile("cloud")
public class CloudTenantTaskExecutor implements TenantTaskExecutor {

  private final CdsRuntime cdsRuntime;

  public CloudTenantTaskExecutor(CdsRuntime cdsRuntime) {
    this.cdsRuntime = cdsRuntime;
  }

  @Override
  public void execute(Runnable task) {
    this.execute(t -> task.run());
  }

  @Override
  public void execute(Consumer<String> task) {
    TenantProviderService tenantProvider = this.cdsRuntime.getServiceCatalog().getService(TenantProviderService.class,
        TenantProviderService.DEFAULT_NAME);
    List<String> tenants = tenantProvider.readTenants();
    tenants.forEach(tenant -> this.cdsRuntime.requestContext().privilegedUser()
        .modifyUser(user -> user.setTenant(tenant)).run(requestContext -> {
          this.cdsRuntime.changeSetContext().run(changeSetContext -> {
            task.accept(tenant);
          });
        }));
  }

  @Override
  public void execute(String tenant, Runnable task) {
    this.cdsRuntime.requestContext().privilegedUser().modifyUser(user -> user.setTenant(tenant)).run(requestContext -> {
      this.cdsRuntime.changeSetContext().run(changeSetContext -> {
        task.run();
      });
    });
  }
}
