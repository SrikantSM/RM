package com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.security.xsuaa.client.OAuth2TokenServiceConstants;
import com.sap.hcp.cf.logging.common.request.HttpHeaders;

import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.model.JobScheduler;
import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.model.OAuthTokenResponse;
import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;

@Component
public class JobSchedulerToken {

  private static final Logger LOGGER = LoggerFactory.getLogger(JobSchedulerToken.class);
  private static final Marker MARKER = LoggingMarker.REPLICATION_JOB_SCHEDULER_MARKER.getMarker();

  private final WebClient webClient;

  @Autowired
  public JobSchedulerToken(@Qualifier("jobSchedulerWebClient") final WebClient jobSchedulerWebClient) {
    this.webClient = jobSchedulerWebClient;
  }

  public String getCertificateBearerToken(JobScheduler envConfig, String subDomain) {
    LOGGER.debug(MARKER, "Fetching jwt token for authentication at jobscheduler");
    try {
      String certUrl = envConfig.getCertUrl();
      /*
       * Fetching token based on subdomain cert url is required as there should be
       * separate jobs for each tenant. Hence replace default subdomain with consumer
       * specific subdomain in cert url
       */
      String subDomainCertUrl = replaceCertUrlWithSubdomain(subDomain, certUrl);
      OAuthTokenResponse token = this.webClient.post().uri(subDomainCertUrl + "/oauth/token")
          .header(HttpHeaders.CONTENT_TYPE.getName(), MediaType.APPLICATION_FORM_URLENCODED_VALUE)
          .body(BodyInserters.fromFormData(OAuth2TokenServiceConstants.CLIENT_ID, envConfig.getClientId())
              .with(OAuth2TokenServiceConstants.GRANT_TYPE, OAuth2TokenServiceConstants.GRANT_TYPE_CLIENT_CREDENTIALS))
          .retrieve().bodyToMono(OAuthTokenResponse.class).block();

      if (token != null) {
        return token.getAccessToken();
      } else {
        LOGGER.warn("Token for job scheduler is null");
        return null;
      }

    } catch (WebClientResponseException e) {
      LOGGER.debug(MARKER, "Failed to get token for job scheduler.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed to get token for job scheduler", e);
    }

  }

  public String replaceCertUrlWithSubdomain(String tenantSubdomain, String certUrl) {
    return certUrl.replace(certUrl.substring("https://".length(), certUrl.indexOf('.')), tenantSubdomain);
  }

}
