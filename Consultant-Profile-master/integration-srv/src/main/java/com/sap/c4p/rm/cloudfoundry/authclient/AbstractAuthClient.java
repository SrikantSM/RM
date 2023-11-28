package com.sap.c4p.rm.cloudfoundry.authclient;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.sap.c4p.rm.cloudfoundry.environment.AbstractVCAPService;
import com.sap.c4p.rm.utils.Constants;

/**
 * Abstract class to provide generic implementation to fetch the access_token
 */
public abstract class AbstractAuthClient {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    protected static final String CLIENT_CREDENTIALS = "client_credentials";
    protected static final String CLIENT_ID = "client_id";
    protected static final String CLIENT_SECRET = "client_secret";
    protected static final String GRANT_TYPE = "grant_type";
    protected static final String RESPONSE = "RESPONSE";
    protected WebClient webClient;

    /**
     * Method request to cloud foundry services to obtain the authentication
     * access_token.
     *
     * @param subDomain: represents the tenant's subDomain to obtain the
     *                   access_token on behalf of tenant from the cloud foundry
     *                   services.
     * @return access_token fetched from the auth server of cloud foundry service.
     */
    public abstract String getOAuthToken(final Marker loggingMarker, final AbstractVCAPService cfServiceVCAP,
            final String subDomain);

    /**
     * Request to authServer on behalf of tenant to fetch the OAuth Object
     *
     * @param cfServiceEnvironment: represents {@link AbstractVCAPService} to
     *                              provide the client credential details of cloud
     *                              foundry service.
     * @param subDomain:            Represents the tenant's subDomain.
     * @return an object of {@link OAuthTokenResponse} having the access_token,
     *         expiryTime.
     */
    protected Optional<OAuthTokenResponse> fetchOAuthTokenFromCloudFoundry(final Marker loggingMarker,
            final AbstractVCAPService cfServiceEnvironment, final String subDomain) {
        logger.info(loggingMarker, "Requesting the access token to the auth server");
        MultiValueMap<String, String> headerMap = new LinkedMultiValueMap<>();
        headerMap.add(CLIENT_ID, cfServiceEnvironment.getClientId());
        headerMap.add(CLIENT_SECRET, cfServiceEnvironment.getClientSecret());
        headerMap.add(GRANT_TYPE, CLIENT_CREDENTIALS);
        headerMap.add(RESPONSE, Constants.TOKEN);

        try {
            return this.webClient.post().uri(cfServiceEnvironment.getOAuthTokenUrl(subDomain))
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                    .body(BodyInserters.fromFormData(headerMap)).retrieve().bodyToMono(OAuthTokenResponse.class)
                    .blockOptional();
        } catch (WebClientResponseException webClientResponseException) {
            logger.error(loggingMarker, "{} {} returned error code {}. Response Body: {} Message: {}", HttpMethod.POST,
                    cfServiceEnvironment.getOAuthTokenUrl(subDomain), webClientResponseException.getRawStatusCode(),
                    webClientResponseException.getResponseBodyAsString(), webClientResponseException.getMessage());
            logger.error(loggingMarker, "Unable to procure credentials token, and the HttpStatus: {}",
                    webClientResponseException.getRawStatusCode(), webClientResponseException);
            return Optional.empty();
        }
    }

    /**
     * Requests the authorization server on behalf of tenant for the OAuth access
     * token. mTLS X.509 certificate based authentication is used between OAuth
     * server and client here.
     *
     * @param loggingMarker        Logging marker indicating the business process
     *                             for which the token is fetched
     * @param cfServiceEnvironment Represents {@link AbstractVCAPService} to provide
     *                             the client credential details of cloud foundry
     *                             service.
     * @param subDomain            Represents the tenant's subDomain.
     * @return an object of {@link OAuthTokenResponse} having the access_token,
     *         expiryTime.
     */
    protected Optional<OAuthTokenResponse> fetchOAuthTokenUsingCertificateFromCloudFoundry(final Marker loggingMarker,
            final AbstractVCAPService cfServiceEnvironment, final String subDomain) {
        logger.info(loggingMarker, "Requesting the access token from the auth server using X.509 certificate");
        MultiValueMap<String, String> headerMap = new LinkedMultiValueMap<>();
        headerMap.add(CLIENT_ID, cfServiceEnvironment.getClientId());
        headerMap.add(GRANT_TYPE, CLIENT_CREDENTIALS);
        try {
            Optional<OAuthTokenResponse> resultOAuthTokenResponse = this.webClient.post()
                    .uri(cfServiceEnvironment.getCertOAuthTokenUrl(subDomain))
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                    .body(BodyInserters.fromFormData(headerMap)).retrieve().bodyToMono(OAuthTokenResponse.class)
                    .blockOptional();
            logger.info(loggingMarker, "Succeessfully retrieved access token from auth server using X.509 certificate");
            return resultOAuthTokenResponse;
        } catch (WebClientResponseException webClientResponseException) {
            logger.error(loggingMarker, "{} {} returned error code {}. Response Body: {} Message: {}", HttpMethod.POST,
                    cfServiceEnvironment.getCertOAuthTokenUrl(subDomain), webClientResponseException.getRawStatusCode(),
                    webClientResponseException.getResponseBodyAsString(), webClientResponseException.getMessage());
            logger.error(loggingMarker, "Unable to procure credentials token, and the HttpStatus: {}",
                    webClientResponseException.getRawStatusCode(), webClientResponseException);
            return Optional.empty();
        }
    }

}
