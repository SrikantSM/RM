package com.sap.c4p.rm.consultantprofile.config;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.Filter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.core.annotation.Order;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.reactive.function.client.WebClient;

import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.request.UserInfo;
import com.sap.cds.services.runtime.UserInfoProvider;
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
import com.sap.xs.audit.api.exception.AuditLogException;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.client.impl.v2.AuditLogMessageFactoryImpl;

import com.sap.c4p.rm.consultantprofile.handlers.InitialReadFlag;

import io.pivotal.cfenv.core.CfEnv;

/**
 * Class to add general spring configuration as below
 *
 */
@Configuration
@EnableMethodSecurity
public class GeneralConfiguration {
    private static final Logger LOGGER = LoggerFactory.getLogger(GeneralConfiguration.class);
    private static final Marker MARKER = LoggingMarker.LOGGING.getMarker();

    @Bean
    public FilterRegistrationBean<BatchRequestFilter> nonBatchReqestFilter() {
        FilterRegistrationBean<BatchRequestFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new BatchRequestFilter());
        registrationBean.addUrlPatterns("/odata/v4/ProjectExperienceService/*");
        return registrationBean;
    }

    @Bean
    public CfEnv cfEnv() {
        return new CfEnv();
    }

    @Bean
    AuditLogMessageFactory auditLogMessageFactory() throws AuditLogException {
        return new AuditLogMessageFactoryImpl();
    }

    @Bean
    public WebClient webClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder.build();
    }

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager();
    }

    /**
     * This bean overrides the default UserInfoProvider which is use to fetch
     * UserInfo. The UserInfo bean now contains the email of the user in $user to
     * uniquely identify the user. This unifies the user identification irrespective
     * of the IdP used.
     *
     * @return UserInfoProvider
     */
    @Bean
    @Order(1)
    public UserInfoProvider appUserInfoProvider() {
        return new UserInfoProvider() {
            UserInfoProvider prev;

            @Override
            public UserInfo get() {
                UserInfo prevInfo = prev.get();

                if (prevInfo != null && !prevInfo.copy().getName().contains("@")) {
                    String email = prevInfo.as(XsuaaUserInfo.class).getEmail();
                    return prevInfo.copy().setName(email);
                }
                if (prevInfo != null && prevInfo.copy().getName().contains("@")) {
                    String name = prevInfo.getName();
                    return prevInfo.copy().setName(name.toLowerCase());
                }
                return prevInfo;
            }

            @Override
            public void setPrevious(UserInfoProvider prevProvider) {
                prev = prevProvider;
            }
        };
    }

    @Bean
    @Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
    public InitialReadFlag initialReadFlag() {
        return new InitialReadFlag();
    }

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
                    new CorrelationIdFilter(), new TenantIdFilter(), new DynamicLogLevelFilter(),
                    new GenerateRequestLogFilter());
        }
    }

}
