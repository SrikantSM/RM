package com.sap.c4p.rm.cloudfoundry.authclient;

import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.sap.c4p.rm.cloudfoundry.environment.AbstractVCAPService;
import com.sap.c4p.rm.utils.Constants;

/**
 * Class to fetch the authentication bearer token for cloud foundry XSUaa
 * service
 */
@Component
public class XSUaaToken extends AbstractAuthClient {

    private final CacheManager cacheManager;

    @Autowired
    public XSUaaToken(final CacheManager cacheManager,@Qualifier("xsuaaWebClient") final WebClient xsuaaWebClient) {
        this.cacheManager = cacheManager;
        this.webClient = xsuaaWebClient;
    }

    /**
     * Method to fetch the OAuth's access_token for XSUaa service on behalf of
     * tenant. Once the access_token is available, it will be cached to combination
     * of {@value Constants#XS_UAA_OAUTH_TOKEN_CACHE_NAME} and subDomain. So that
     * additional requests from the other tenant can also be cached.
     *
     * @param xsUaaVCAP: CF env variable details of bound XSUaa service instance.
     * @param subDomain: Tenants subDomain.
     * @return access_token fetched from the auth server of XSUaa Service.
     */
    @Override
    @Cacheable(cacheNames = Constants.XS_UAA_OAUTH_TOKEN_CACHE_NAME, key = "#subDomain", unless = "#result == null")
    public String getOAuthToken(final Marker loggingMarker, final AbstractVCAPService xsUaaVCAP,
            final String subDomain) {
        return this.fetchOAuthTokenUsingCertificateFromCloudFoundry(loggingMarker, xsUaaVCAP, subDomain)
                .map(OAuthTokenResponse::getAccessToken).orElse(null);
    }

    /**
     * the cached access_token will be cleaned at the regular interval of
     * {@value Constants#CACHE_CLEAN_INTERVAL}.
     */
    @Scheduled(fixedRate = Constants.CACHE_CLEAN_INTERVAL)
    public void removeXSUaaAuthToken() {
        Cache cache = this.cacheManager.getCache(Constants.XS_UAA_OAUTH_TOKEN_CACHE_NAME);
        if (cache != null)
            cache.clear();
    }

}
