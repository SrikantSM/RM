package com.sap.c4p.rm.skill.utils;

import java.util.function.Consumer;

public interface TenantTaskExecutor {

  /**
   * Execute task in the context of all available tenants (sequentially)
   *
   * @param task Any task
   */
  void execute(Runnable task);

  /**
   * Execute task in the context of all available tenants (sequentially). The
   * consumer receives the tenant id of the currently processed tenant as a method
   * parameter.
   *
   * @param task Any task
   */
  void execute(Consumer<String> task);

  /**
   * Execute a task in the context of any given tenant
   *
   * @param tenant A tenant ID
   * @param task   Any task
   */
  void execute(String tenant, Runnable task);

}
