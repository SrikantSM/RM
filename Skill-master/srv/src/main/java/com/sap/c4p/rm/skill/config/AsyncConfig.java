package com.sap.c4p.rm.skill.config;

import java.util.Map;
import java.util.concurrent.Executor;

import org.slf4j.MDC;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

  private final CdsRuntime cdsRuntime;

  public AsyncConfig(CdsRuntime cdsRuntime) {
    this.cdsRuntime = cdsRuntime;
  }

  @Override
  public Executor getAsyncExecutor() {
    return this.getAsyncExecutor(this.cdsRuntime.requestContext());
  }

  /**
   * Define a custom asynchronous task executor which copies over the MDC context
   * so that it is present in any asynchronously executed methods
   */
  public Executor getAsyncExecutor(RequestContextRunner runner) {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setTaskDecorator(runnable -> {
      // (main) web thread context
      Map<String, String> contextMap = MDC.getCopyOfContextMap(); // logging (i.e. correlation id)
      final Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); // AuditLog
      final RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes(); // Request Context,
                                                                                                   // i.e. Spring
                                                                                                   // Injection
      return () -> {
        // @Async thread context
        try {
          SecurityContext ctx = SecurityContextHolder.createEmptyContext();
          ctx.setAuthentication(authentication);
          SecurityContextHolder.setContext(ctx);

          RequestContextHolder.setRequestAttributes(
              new ServletRequestAttributes(((ServletRequestAttributes) requestAttributes).getRequest(),
                  ((ServletRequestAttributes) requestAttributes).getResponse()));

          if (contextMap != null) {
            MDC.setContextMap(contextMap);
          }
          runner.run(threadContext -> {
            runnable.run();
          });
        } finally {
          if (contextMap != null) {
            MDC.clear();
          }
        }
      };
    });
    executor.initialize();
    return executor;
  }
}
