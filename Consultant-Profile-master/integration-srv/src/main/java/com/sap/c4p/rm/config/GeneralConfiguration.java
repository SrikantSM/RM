package com.sap.c4p.rm.config;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.util.concurrent.Executor;

import javax.net.ssl.KeyManagerFactory;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.Filter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.reactive.function.client.WebClient;

import com.sap.cloud.security.config.ClientCertificate;
import com.sap.cloud.security.mtls.SSLContextFactory;
import com.sap.cloud.security.xsuaa.token.SpringSecurityContext;
import com.sap.hcp.cf.logging.common.Fields;
import com.sap.hcp.cf.logging.common.LogContext;
import com.sap.hcp.cf.logging.servlet.filter.*;
import com.sap.xs.audit.api.exception.AuditLogException;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.client.impl.v2.AuditLogMessageFactoryImpl;

import com.sap.c4p.rm.cloudfoundry.environment.JobSchedulerVCAP;
import com.sap.c4p.rm.cloudfoundry.environment.MasterDataIntegrationVCAP;
import com.sap.c4p.rm.cloudfoundry.environment.SAASRegistryVCAP;
import com.sap.c4p.rm.cloudfoundry.environment.XSUaaVCAP;

import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.pivotal.cfenv.core.CfEnv;
import reactor.netty.http.client.HttpClient;

/**
 * Class to add general spring configuration as below
 *
 */
@Configuration
@EnableCaching
@EnableScheduling
@EnableAsync
@EnableMethodSecurity
public class GeneralConfiguration {
    private static final Logger LOGGER = LoggerFactory.getLogger(GeneralConfiguration.class);
    private static final Marker MARKER = LoggingMarker.LOGGING.getMarker();
    protected static final String SUN_X509 = "SunX509";

    @Bean
    public FilterRegistrationBean<BatchRequestFilter> nonBatchReqestFilter() {
        FilterRegistrationBean<BatchRequestFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new BatchRequestFilter());
        registrationBean.addUrlPatterns("/odata/v4/WorkforceAvailabilityService/*");
        return registrationBean;
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
    public WebClient jobSchedulerWebClient(WebClient.Builder webClientBuilder, JobSchedulerVCAP jobSchedulerVCAP)
            throws GeneralSecurityException, IOException {
        KeyStore keyStore = SSLContextFactory.getInstance().createKeyStore(new ClientCertificate(
                jobSchedulerVCAP.getCertificate(), jobSchedulerVCAP.getKey(), jobSchedulerVCAP.getClientId()));
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(SUN_X509);
        keyManagerFactory.init(keyStore, "".toCharArray());
        SslContext sslContext = SslContextBuilder.forClient().keyManager(keyManagerFactory).build();
        HttpClient httpClient = HttpClient.create().secure(sslProvider -> sslProvider.sslContext(sslContext));
        return webClientBuilder.clientConnector(new ReactorClientHttpConnector(httpClient)).build();
    }

    @Bean
    public WebClient masterDataIntegrationWebClient(WebClient.Builder webClientBuilder,
            MasterDataIntegrationVCAP masterDataIntegrationVCAP) throws GeneralSecurityException, IOException {
        KeyStore keyStore = SSLContextFactory.getInstance()
                .createKeyStore(new ClientCertificate(masterDataIntegrationVCAP.getCertificate(),
                        masterDataIntegrationVCAP.getKey(), masterDataIntegrationVCAP.getClientId()));
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(SUN_X509);
        keyManagerFactory.init(keyStore, "".toCharArray());
        SslContext sslContext = SslContextBuilder.forClient().keyManager(keyManagerFactory).build();
        HttpClient httpClient = HttpClient.create().secure(sslProvider -> sslProvider.sslContext(sslContext));
        return webClientBuilder.clientConnector(new ReactorClientHttpConnector(httpClient)).build();
    }

    @Bean
    public WebClient saasWebClient(WebClient.Builder webClientBuilder,
            SAASRegistryVCAP saasRegistryVCAP) throws GeneralSecurityException, IOException {
        KeyStore keyStore = SSLContextFactory.getInstance()
                .createKeyStore(new ClientCertificate(saasRegistryVCAP.getCertificate(),
                		saasRegistryVCAP.getKey(), saasRegistryVCAP.getClientId()));
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(SUN_X509);
        keyManagerFactory.init(keyStore, "".toCharArray());
        SslContext sslContext = SslContextBuilder.forClient().keyManager(keyManagerFactory).build();
        HttpClient httpClient = HttpClient.create().secure(sslProvider -> sslProvider.sslContext(sslContext));
        return webClientBuilder.clientConnector(new ReactorClientHttpConnector(httpClient)).build();
    }

    @Bean
    public WebClient xsuaaWebClient(WebClient.Builder webClientBuilder,
            XSUaaVCAP xsuaaVCAP) throws GeneralSecurityException, IOException {
        KeyStore keyStore = SSLContextFactory.getInstance()
                .createKeyStore(new ClientCertificate(xsuaaVCAP.getCertificate(),
                		xsuaaVCAP.getKey(), xsuaaVCAP.getClientId()));
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(SUN_X509);
        keyManagerFactory.init(keyStore, "".toCharArray());
        SslContext sslContext = SslContextBuilder.forClient().keyManager(keyManagerFactory).build();
        HttpClient httpClient = HttpClient.create().secure(sslProvider -> sslProvider.sslContext(sslContext));
        return webClientBuilder.clientConnector(new ReactorClientHttpConnector(httpClient)).build();
    }

    @Bean
    public CfEnv cfEnv() {
        return new CfEnv();
    }

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager();
    }

    /**
     * Defining the threadPoolExecutor and configuring them as the bean for async
     * method calls
     *
     * @return {@link Executor} for the invocation
     */
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("CP-Integration-");
        executor.initialize();
        return executor;
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
