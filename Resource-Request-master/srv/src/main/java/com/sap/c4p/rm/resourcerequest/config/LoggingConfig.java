package com.sap.c4p.rm.resourcerequest.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.AccessDeniedException;

import com.sap.cloud.security.xsuaa.token.SpringSecurityContext;
import com.sap.hcp.cf.logging.common.Fields;
import com.sap.hcp.cf.logging.common.LogContext;
import com.sap.hcp.cf.logging.servlet.filter.AbstractLoggingFilter;
import com.sap.hcp.cf.logging.servlet.filter.AddHttpHeadersToLogContextFilter;
import com.sap.hcp.cf.logging.servlet.filter.AddVcapEnvironmentToLogContextFilter;
import com.sap.hcp.cf.logging.servlet.filter.CompositeFilter;
import com.sap.hcp.cf.logging.servlet.filter.CorrelationIdFilter;
import com.sap.hcp.cf.logging.servlet.filter.DynamicLogLevelFilter;
import com.sap.hcp.cf.logging.servlet.filter.GenerateRequestLogFilter;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.Filter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
class LoggingConfig {

  private static final Logger LOGGER = LoggerFactory.getLogger(LoggingConfig.class);
  private static final Marker MARKER = LoggingMarker.LOGGING.getMarker();

  /**
   * Adds a servlet filter which extracts the correlation id from the request
   * header and adds it to the log context. Filter is set to be applied last
   * (after spring security filter chain)
   */
  @Bean
  public FilterRegistrationBean<Filter> loggingFilter() {
    final FilterRegistrationBean<Filter> filterRegistrationBean = new FilterRegistrationBean<>();
    filterRegistrationBean.setFilter(new LoggingFilter());
    filterRegistrationBean.setName("request-logging");
    filterRegistrationBean.addUrlPatterns("/*");
    filterRegistrationBean.setDispatcherTypes(DispatcherType.REQUEST);
    filterRegistrationBean.setOrder(Integer.MAX_VALUE);
    return filterRegistrationBean;
  }

  private static class TenantIdFilter extends AbstractLoggingFilter {
    @Override
    protected void beforeFilter(HttpServletRequest request, HttpServletResponse response) {
      try {
        final String tenantId = SpringSecurityContext.getToken().getZoneId();
        LogContext.add(Fields.TENANT_ID, tenantId);
      } catch (AccessDeniedException ade) {
        LOGGER.debug(MARKER, "tenant_id not available, so not written to log context: {}", ade.getMessage());
      }
    }

    @Override
    protected void cleanup(HttpServletRequest request, HttpServletResponse response) {
      LogContext.remove(Fields.TENANT_ID);
    }
  }

  private static class LoggingFilter extends CompositeFilter {
    public LoggingFilter() {
      super(new AddVcapEnvironmentToLogContextFilter(), new AddHttpHeadersToLogContextFilter(),
          new CorrelationIdFilter(), new TenantIdFilter(), new DynamicLogLevelFilter(), new GenerateRequestLogFilter());
    }
  }
}
