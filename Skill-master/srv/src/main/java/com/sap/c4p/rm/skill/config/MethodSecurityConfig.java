package com.sap.c4p.rm.skill.config;

import static com.sap.c4p.rm.skill.mdiintegration.utils.Constants.REPLICATION_ERROR_CODE_CACHE_NAME;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.util.concurrent.Executor;

import javax.net.ssl.KeyManagerFactory;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.vote.AffirmativeBased;
import org.springframework.security.access.vote.RoleVoter;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;
import org.springframework.web.reactive.function.client.WebClient;

import com.sap.cloud.security.config.ClientCertificate;
import com.sap.cloud.security.mtls.SSLContextFactory;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment.DestinationVCAP;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment.JobSchedulerVCAP;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment.MasterDataIntegrationVCAP;
import com.sap.c4p.rm.skill.mdiintegration.utils.Constants;

import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import reactor.netty.http.client.HttpClient;

/**
 * This configuration enables method level security checks with
 * {@link org.springframework.security.access.annotation.Secured} annotation to
 * be used within spring components. E.g. to check the Scope
 * 'XSAPPNAME.SkillAdmin', just use {@code @Secured('<Scope>')} on the method
 * (local scope name).
 *
 * Remark: Usually spring security prefixes all scope names with 'ROLE_'. To
 * make our configuration work locally and remotely in the same way, the prefix
 * was removed in this configuration.
 */
@Configuration
@EnableCaching
@EnableScheduling
@EnableAsync
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
class MethodSecurityConfig extends GlobalMethodSecurityConfiguration {

  protected static final String SUN_X509 = "SunX509";

  @Override
  protected AccessDecisionManager accessDecisionManager() {
    AffirmativeBased accessDecisionManager = (AffirmativeBased) super.accessDecisionManager();
    for (AccessDecisionVoter<?> voter : accessDecisionManager.getDecisionVoters()) {
      if (voter instanceof RoleVoter) {
        ((RoleVoter) voter).setRolePrefix("");
      }
    }
    return accessDecisionManager;
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
  public WebClient destinationWebClient(WebClient.Builder webClientBuilder, DestinationVCAP destinationVCAP)
      throws GeneralSecurityException, IOException {
    KeyStore keyStore = SSLContextFactory.getInstance().createKeyStore(new ClientCertificate(
        destinationVCAP.getCertificate(), destinationVCAP.getKey(), destinationVCAP.getClientId()));
    KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(SUN_X509);
    keyManagerFactory.init(keyStore, "".toCharArray());
    SslContext sslContext = SslContextBuilder.forClient().keyManager(keyManagerFactory).build();
    HttpClient httpClient = HttpClient.create().secure(sslProvider -> sslProvider.sslContext(sslContext));
    return webClientBuilder.clientConnector(new ReactorClientHttpConnector(httpClient)).build();
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
    executor.setThreadNamePrefix("MDI-Replication-");
    executor.initialize();
    return executor;
  }

  @Bean
  public CacheManager cacheManager() {
    return new ConcurrentMapCacheManager(Constants.JOB_SCHEDULER_OAUTH_TOKEN_CACHE_NAME,
        Constants.MDI_OAUTH_TOKEN_CACHE_NAME, REPLICATION_ERROR_CODE_CACHE_NAME,
        Constants.DESTINATION_OAUTH_TOKEN_CACHE_NAME);
  }

}
