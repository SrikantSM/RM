package com.sap.c4p.rm.skill.config;

import java.time.Clock;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import io.pivotal.cfenv.core.CfEnv;

@Configuration
public class UtilitiesConfig {

  /**
   * Provides the Clock configured as per UTC time.
   */
  @Bean
  public Clock clock() {
    return Clock.systemUTC();
  }

  @Bean
  public WebClient webClient(WebClient.Builder webClientBuilder) {
    return webClientBuilder.build();
  }

  @Bean
  public CfEnv cfEnv() {
    return new CfEnv();
  }
}
