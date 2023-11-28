package com.sap.c4p.rm.assignment.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import jakarta.servlet.Filter;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.web.servlet.FilterRegistrationBean;

public class LoggingConfigTest {

  private LoggingConfig loggingConfig;

  @BeforeEach
  public void createObject() {
    loggingConfig = new LoggingConfig();
  }

  @Test

  public void validateLoggingFilter() {
    String mockUrlPattern = "[/*]";

    // Check whether filter registration bean is returned..
    FilterRegistrationBean<Filter> mockFilterRegistrationBean = loggingConfig.loggingFilter();
    assertNotNull(mockFilterRegistrationBean);
    // Check for url patterns
    assertEquals(mockFilterRegistrationBean.getUrlPatterns().toString(), mockUrlPattern);

  }

}
