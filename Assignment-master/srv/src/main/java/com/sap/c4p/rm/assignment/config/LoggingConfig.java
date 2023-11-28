package com.sap.c4p.rm.assignment.config;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.Filter;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sap.hcp.cf.logging.servlet.filter.RequestLoggingFilter;

@Configuration
public class LoggingConfig {

  @Bean
  public FilterRegistrationBean<Filter> loggingFilter() {
    final FilterRegistrationBean<Filter> filterRegistrationBean = new FilterRegistrationBean<>();
    filterRegistrationBean.setFilter(new RequestLoggingFilter());
    filterRegistrationBean.setName("request-logging");
    filterRegistrationBean.addUrlPatterns("/*");
    filterRegistrationBean.setDispatcherTypes(DispatcherType.REQUEST);
    filterRegistrationBean.setOrder(Integer.MAX_VALUE);
    return filterRegistrationBean;
  }

}