package com.sap.c4p.rm.resourcerequest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import com.sap.c4p.rm.resourcerequest.exceptions.HealthCheckException;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Profile("cloud")
@EnableWebSecurity
@Configuration
@Order(1)
public class HealthSecurityConfig {

  /**
   * Permit any request going to /actuator/health
   */
  @Bean
  protected SecurityFilterChain configure(final HttpSecurity security) throws HealthCheckException {

    try {

        return security.securityMatcher(AntPathRequestMatcher.antMatcher("/actuator/health")).csrf(c -> c.disable())
            .authorizeHttpRequests(r -> r.anyRequest().permitAll()).build();

    } catch (Exception e) {
      throw new HealthCheckException("Error while configuring security for health check end points", e);
    }
  }

}
