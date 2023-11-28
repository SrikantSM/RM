package com.sap.c4p.rm.skill.config;

import com.sap.c4p.rm.skill.exceptions.HealthCheckException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

/**
 * enable HTTP Basic Auth for health check endpoint
 */
@EnableWebSecurity
@Configuration
@Order(1)
public class HealthSecurityConfig {

  @Bean
  protected SecurityFilterChain configure(final HttpSecurity security) throws HealthCheckException {
    try {
      return security.securityMatcher(AntPathRequestMatcher.antMatcher("/actuator/health")).csrf(c -> c.disable()) // don't insist on csrf tokens in put, post etc.
        .authorizeHttpRequests(r -> r.anyRequest().permitAll()).build();
    } catch (Exception e) {
      throw new HealthCheckException("Error while configuring security for health check end points", e);
    }
  }

}
