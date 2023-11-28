package com.sap.c4p.rm.skill.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sap.cloud.security.xsuaa.XsuaaServiceConfiguration;
import com.sap.cloud.security.xsuaa.XsuaaServiceConfigurationDefault;

@Configuration
public class XsuaaConfig {

  @Bean
  public XsuaaServiceConfiguration xsuaaServiceConfig() {
    return new XsuaaServiceConfigurationDefault();
  }
}
