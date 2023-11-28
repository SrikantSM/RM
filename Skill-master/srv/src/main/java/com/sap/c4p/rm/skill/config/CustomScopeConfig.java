package com.sap.c4p.rm.skill.config;

import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CustomScopeConfig {
  CustomScopeConfig() {
  }

  @Bean
  public static BeanFactoryPostProcessor beanFactoryPostProcessor() {
    return new CustomBeanFactoryPostProcessor();
  }
}
