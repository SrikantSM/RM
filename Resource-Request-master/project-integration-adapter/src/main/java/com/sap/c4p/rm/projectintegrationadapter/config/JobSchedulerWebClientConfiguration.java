package com.sap.c4p.rm.projectintegrationadapter.config;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.KeyStore;

import javax.net.ssl.KeyManagerFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.security.config.ClientCertificate;
import com.sap.cloud.security.mtls.SSLContextFactory;

import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.model.JobScheduler;
import com.sap.c4p.rm.projectintegrationadapter.util.CfUtils;

import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import reactor.netty.http.client.HttpClient;

@Profile({ "cloud" })
@Component
public class JobSchedulerWebClientConfiguration {
  private static final Logger LOGGER = LoggerFactory.getLogger(JobSchedulerWebClientConfiguration.class);

  JobScheduler envConfig;

  @Qualifier("jobSchedulerWebClient")
  @Bean
  public WebClient jobSchedulerWebClient(WebClient.Builder webClientBuilder, CfUtils cfUtil) {
    this.envConfig = cfUtil.getServiceForJobSceduler();
    HttpClient httpClient = HttpClient.create().secure(sslProvider -> sslProvider.sslContext(getSSlContext()));
    return webClientBuilder.clientConnector(new ReactorClientHttpConnector(httpClient)).build();
  }

  private SslContext getSSlContext() {
    try {
      SslContextBuilder sslBuilder = SslContextBuilder.forClient();
      if (StringUtils.hasLength(this.envConfig.getCertificate()) && StringUtils.hasLength(this.envConfig.getKey())) {
        KeyStore keyStore = SSLContextFactory.getInstance().createKeyStore(new ClientCertificate(
            this.envConfig.getCertificate(), this.envConfig.getKey(), this.envConfig.getClientId()));
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance("SunX509");
        keyManagerFactory.init(keyStore, "".toCharArray());
        sslBuilder.keyManager(keyManagerFactory);
      } else {
        LOGGER.warn("No jobscheduler certificate and private key configured. Skipping mTLS client configuration");
      }
      return sslBuilder.build();
    } catch (GeneralSecurityException | IOException e) {
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed to get SSLContext", e);
    }
  }

}
