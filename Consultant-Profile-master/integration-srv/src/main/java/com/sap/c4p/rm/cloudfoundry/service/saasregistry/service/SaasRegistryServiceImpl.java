package com.sap.c4p.rm.cloudfoundry.service.saasregistry.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import com.sap.c4p.rm.cloudfoundry.authclient.SAASRegistryToken;
import com.sap.c4p.rm.cloudfoundry.environment.SAASRegistryVCAP;
import com.sap.c4p.rm.cloudfoundry.environment.XSUaaVCAP;
import com.sap.c4p.rm.cloudfoundry.service.saasregistry.model.TenantSubscriptions;

/**
 * Class to implement {@link SaasRegistryService} provide the generic
 * functionality to communicate to cloud foundry's saas-registry service.
 */
@Service
public class SaasRegistryServiceImpl implements SaasRegistryService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SaasRegistryServiceImpl.class);

    protected static final String GET_SUBSCRIPTION_URL = "saas-manager/v1/application/subscriptions";
    protected static final String STATE = "state";
    protected static final String SUBSCRIBED = "SUBSCRIBED";

    private final SAASRegistryToken saasRegistryToken;
    private final SAASRegistryVCAP saasRegistryVCAP;
    private final XSUaaVCAP xsUaaVCAP;
    private final WebClient webClient;
    private final UriComponentsBuilder saasRegistryBaseUriBuilder;

    @Autowired
    public SaasRegistryServiceImpl(final SAASRegistryToken saasRegistryToken, final SAASRegistryVCAP saasRegistryVCAP,
            final XSUaaVCAP xsUaaVCAP, final WebClient webClient) {
        this.saasRegistryToken = saasRegistryToken;
        this.saasRegistryVCAP = saasRegistryVCAP;
        this.xsUaaVCAP = xsUaaVCAP;
        this.webClient = webClient;
        this.saasRegistryBaseUriBuilder = UriComponentsBuilder.fromHttpUrl(saasRegistryVCAP.getServiceUrl());
    }

    @Override
    public TenantSubscriptions getActiveSubscriptions(final Marker loggingMarker) {
        String bearerToken = this.saasRegistryToken.getOAuthToken(loggingMarker, this.saasRegistryVCAP,
                xsUaaVCAP.getIdentityZone());
        if (bearerToken == null)
            return null;

        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.setContentType(MediaType.APPLICATION_JSON);
        requestHeaders.setBearerAuth(bearerToken);

        String subDomainAuthURL = this.saasRegistryBaseUriBuilder.cloneBuilder().pathSegment(GET_SUBSCRIPTION_URL)
                .queryParam(STATE, SUBSCRIBED).build().toString();

        try {
            return this.webClient.get().uri(subDomainAuthURL).headers(httpHeaders -> httpHeaders.addAll(requestHeaders))
                    .retrieve().bodyToMono(TenantSubscriptions.class).block();
        } catch (WebClientResponseException webClientResponseException) {
            LOGGER.error(loggingMarker, "{} {} returned error code {}. Response Body: {} Message: {}", HttpMethod.GET,
                    subDomainAuthURL, webClientResponseException.getRawStatusCode(),
                    webClientResponseException.getResponseBodyAsString(), webClientResponseException.getMessage(),
                    webClientResponseException);
            return null;
        }
    }

}
