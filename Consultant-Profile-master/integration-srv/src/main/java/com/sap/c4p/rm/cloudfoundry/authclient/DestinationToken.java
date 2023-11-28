package com.sap.c4p.rm.cloudfoundry.authclient;

import com.sap.c4p.rm.cloudfoundry.environment.AbstractVCAPService;
import com.sap.c4p.rm.utils.Constants;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;


/**
 * Class to fetch the authentication bearer token for cloud foundry destination
 * service
 */
@Component
public class DestinationToken extends AbstractAuthClient {

    private final CacheManager cacheManager;

    @Autowired
    public DestinationToken(final CacheManager cacheManager,
                            WebClient webClient) {
        this.cacheManager = cacheManager;
        this.webClient = webClient;
    }

    /**
     * Method to fetch the OAuth's access_token for destination service on behalf of
     * tenant. Once the access_token is available, it will be cached to combination
     * of {@value Constants#DESTINATION_OAUTH_TOKEN_CACHE_NAME} and subDomain. So
     * that additional requests from the other tenant can also be cached.
     *
     * @param destinationVCAP: CF env variable details of bound destination service
     *                         instance.
     * @param subDomain:       Tenants subDomain.
     * @return access_token fetched from the auth server of destination Service.
     */
    @Override
    @Cacheable(cacheNames = Constants.DESTINATION_OAUTH_TOKEN_CACHE_NAME, key = "#subDomain", unless = "#result == null")
    public String getOAuthToken(final Marker loggingMarker, final AbstractVCAPService destinationVCAP,
                                final String subDomain) {

        return this.fetchOAuthTokenFromCloudFoundry(loggingMarker,destinationVCAP,subDomain)
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
