package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.authclient;

import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment.AbstractVCAPService;
import com.sap.c4p.rm.skill.mdiintegration.utils.Constants;

@Component
public class DestinationToken extends AbstractAuthClient {
  private final CacheManager cacheManager;

  @Autowired
  public DestinationToken(@Qualifier("cacheManager") CacheManager cacheManager,
      @Qualifier("destinationWebClient") final WebClient destinationWebClient) {
    this.cacheManager = cacheManager;
    this.webClient = destinationWebClient;
  }

  @Override
  @Cacheable(cacheManager = "cacheManager", cacheNames = Constants.DESTINATION_OAUTH_TOKEN_CACHE_NAME, key = "#subDomain", unless = "#result == null")
  public String getOAuthToken(final Marker loggingMarker, final AbstractVCAPService destinationVCAP,
      final String subDomain) {

    return this.fetchOAuthTokenUsingCertificateFromCloudFoundry(loggingMarker, destinationVCAP, subDomain)
        .map(OAuthTokenResponse::getAccessToken).orElse(null);
  }

  /**
   * the cached access_token will be cleaned at the regular interval of
   * {@value Constants#CACHE_CLEAN_INTERVAL}.
   */
  @Scheduled(fixedRate = Constants.CACHE_CLEAN_INTERVAL)
  public void removeDestinationAuthToken() {
    Cache cache = this.cacheManager.getCache(Constants.DESTINATION_OAUTH_TOKEN_CACHE_NAME);
    if (cache != null)
      cache.clear();
  }

}
