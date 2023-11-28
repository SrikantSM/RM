package com.sap.c4p.rm.skill.utils;

import java.util.function.Consumer;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile({ "local", "integration-test" })
public class LocalTenantTaskExecutor implements TenantTaskExecutor {

  @Override
  public void execute(Runnable task) {
    task.run();
  }

  @Override
  public void execute(Consumer<String> task) {
    task.accept("LOCAL");
  }

  @Override
  public void execute(String tenant, Runnable task) {
    task.run();
  }
}
