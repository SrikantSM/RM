package com.sap.c4p.rm.assignment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.sap.c4p.rm.assignment.exception.HealthCheckException;

/**
 * enable HTTP Basic Auth for health check endpoint
 */
@EnableWebSecurity
@Configuration
@Order(1)
public class HealthSecurityConfig {

  /**
   * Permit any request going to /actuator/health
   */
  @Bean
  public SecurityFilterChain appFilterChain(HttpSecurity http) throws HealthCheckException {
    try {
      return http
        .securityMatcher(AntPathRequestMatcher.antMatcher("/actuator/health"))
        .csrf(c -> c.disable()) // don't insist on csrf tokens in put, post etc.
        .authorizeHttpRequests(r -> r.anyRequest().permitAll()).build();
    } catch (Exception e) {
      throw new HealthCheckException("Error while configuring security for health check end points", e);
    }
  }
}
