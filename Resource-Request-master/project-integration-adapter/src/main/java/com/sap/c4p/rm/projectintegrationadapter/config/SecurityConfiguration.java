package com.sap.c4p.rm.projectintegrationadapter.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.SecurityFilterChain;

import com.sap.cloud.security.xsuaa.XsuaaServiceConfiguration;
import com.sap.cloud.security.xsuaa.token.TokenAuthenticationConverter;

import com.sap.c4p.rm.projectintegrationadapter.exceptions.HealthCheckException;
import org.springframework.security.web.access.expression.WebExpressionAuthorizationManager;

@Configuration
@EnableWebSecurity
@Order(2)
@Profile({ "cloud" })
public class SecurityConfiguration {

  private static final String REPLICATION_SCOPE = "Demand.Edit";

  @Autowired
  XsuaaServiceConfiguration xsuaaServiceConfiguration;

  protected SecurityFilterChain configure(HttpSecurity http) throws HealthCheckException {

    try {
        http.headers(header -> header.contentSecurityPolicy(contentSecurityPolicyConfig -> getCSPolicy()));

        http.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(r -> r.requestMatchers("/scheduleJob**").hasAuthority(REPLICATION_SCOPE).requestMatchers("/deleteProjects**")
                .access(new WebExpressionAuthorizationManager("hasAuthority('Demand.Edit') or hasAuthority('JobScheduler')"))
                .requestMatchers("/replicateS4ProjectsDelta**")
                .access(new WebExpressionAuthorizationManager("hasAuthority('Demand.Edit') or hasAuthority('JobScheduler')")))
                .oauth2ResourceServer(o -> o.jwt ( j-> j.jwtAuthenticationConverter(getJwtAuthoritiesConverter())));

      return http.build();
    } catch (Exception e) {
      throw new HealthCheckException("Error while configuring security for health check end points", e);
    }

  }

  Converter<Jwt, AbstractAuthenticationToken> getJwtAuthoritiesConverter() {
    TokenAuthenticationConverter converter = new TokenAuthenticationConverter(xsuaaServiceConfiguration);
    converter.setLocalScopeAsAuthorities(true); // not applicable in case of multiple xsuaa bindings!
    return converter;
  }

  private String getCSPolicy() {
    final StringBuilder sb = new StringBuilder();
    sb.append("default-src 'self' ");
    return sb.toString();
  }

}
