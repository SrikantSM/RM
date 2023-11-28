package com.sap.c4p.rm.cloudfoundry.authclient;

import static com.sap.c4p.rm.TestConstants.ACCESS_TOKEN;
import static com.sap.c4p.rm.TestConstants.CONSUMER_DUMMY_OAUTH_TOKEN;
import static com.sap.c4p.rm.TestConstants.CONSUMER_SUB_DOMAIN;
import static com.sap.c4p.rm.TestConstants.HTTP_ERROR_RESPONSE_BODY;
import static com.sap.c4p.rm.TestConstants.SOMETHING_WENT_WRONG;
import static com.sap.c4p.rm.TestHelper.assertHttpClientError;
import static com.sap.c4p.rm.TestHelper.assertHttpServerError;
import static com.sap.c4p.rm.TestHelper.assertUnableProcureToken;
import static com.sap.c4p.rm.TestHelper.assertRequestingTokenWithCertificate;
import static com.sap.c4p.rm.cloudfoundry.authclient.AbstractAuthClient.CLIENT_ID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters.FormInserter;

import com.sap.c4p.rm.cloudfoundry.environment.SAASRegistryVCAP;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;

/**
 * Test Class to test working of {@link SAASRegistryToken}.
 */
public class SAASRegistryTokenTest extends AuthClientTestHelper {

    private final Logger logger = (Logger) LoggerFactory.getLogger(SAASRegistryToken.class);

    @Mock
    SAASRegistryVCAP saasRegistryVCAP;

    @Autowired
    @InjectMocks
    private SAASRegistryToken classUnderTest;

    @BeforeEach
    public void setUp() {
        when(saasRegistryVCAP.getClientId()).thenReturn(CLIENT_ID);
        when(saasRegistryVCAP.getCertificate()).thenReturn("cert");
        when(saasRegistryVCAP.getKey()).thenReturn("key");
        when(saasRegistryVCAP.getCertOAuthTokenUrl(CONSUMER_SUB_DOMAIN)).thenReturn(CONSUMER_DUMMY_OAUTH_TOKEN);
        this.listAppender.start();
        logger.addAppender(listAppender);
    }

    @Test
    @DisplayName("Test getOAuthToken when server return null response")
    public void testGetOAuthTokenIsReturnNull() {
        when(this.webClient.post()).thenReturn(requestBodyUriSpecMock);
        when(requestBodyUriSpecMock.uri(CONSUMER_DUMMY_OAUTH_TOKEN)).thenReturn(requestBodySpecMock1);
        when(requestBodySpecMock1.header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE))
                .thenReturn(requestBodySpecMock2);
        when(requestBodySpecMock2.body(any(FormInserter.class))).thenReturn(requestHeadersSpecMock);
        when(requestHeadersSpecMock.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.bodyToMono(OAuthTokenResponse.class)).thenReturn(postResponseBodymock);
        when(postResponseBodymock.blockOptional()).thenReturn(Optional.empty());

        assertNull(this.classUnderTest.getOAuthToken(marker, saasRegistryVCAP, CONSUMER_SUB_DOMAIN));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(2, logsList.size());
        assertRequestingTokenWithCertificate(logsList.get(0));
    }

    @Test
    @DisplayName("Test getOAuthToken when server returns the response having access_token")
    public void testGetOAuthToken() {
        OAuthTokenResponse oAuthTokenResponse = new OAuthTokenResponse();
        oAuthTokenResponse.setAccessToken(ACCESS_TOKEN);
        Optional<OAuthTokenResponse> oAuthTokenResponseBody = Optional.of(oAuthTokenResponse);
        when(this.webClient.post()).thenReturn(requestBodyUriSpecMock);
        when(requestBodyUriSpecMock.uri(CONSUMER_DUMMY_OAUTH_TOKEN)).thenReturn(requestBodySpecMock1);
        when(requestBodySpecMock1.header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE))
                .thenReturn(requestBodySpecMock2);
        when(requestBodySpecMock2.body(any(FormInserter.class))).thenReturn(requestHeadersSpecMock);
        when(requestHeadersSpecMock.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.bodyToMono(OAuthTokenResponse.class)).thenReturn(postResponseBodymock);
        when(postResponseBodymock.blockOptional()).thenReturn(oAuthTokenResponseBody);

        assertEquals(oAuthTokenResponse.getAccessToken(),
                this.classUnderTest.getOAuthToken(marker, saasRegistryVCAP, CONSUMER_SUB_DOMAIN));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(2, logsList.size());
        assertRequestingTokenWithCertificate(logsList.get(0));
    }

    @Test
    @DisplayName("Test getOAuthToken when request to server raise webClientResponseException (client error).")
    public void getOAuthTokenWithRaisedHttpClientErrorException() {
        when(webClientResponseException.getRawStatusCode()).thenReturn(400);
        when(webClientResponseException.getResponseBodyAsString()).thenReturn(HTTP_ERROR_RESPONSE_BODY);
        when(webClientResponseException.getMessage()).thenReturn(SOMETHING_WENT_WRONG);

        when(this.webClient.post()).thenReturn(requestBodyUriSpecMock);
        when(requestBodyUriSpecMock.uri(CONSUMER_DUMMY_OAUTH_TOKEN)).thenReturn(requestBodySpecMock1);
        when(requestBodySpecMock1.header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE))
                .thenReturn(requestBodySpecMock2);
        when(requestBodySpecMock2.body(any(FormInserter.class))).thenReturn(requestHeadersSpecMock);
        when(requestHeadersSpecMock.retrieve()).thenThrow(webClientResponseException);

        assertEquals(Optional.empty(),
                this.classUnderTest.fetchOAuthTokenUsingCertificateFromCloudFoundry(marker, saasRegistryVCAP, CONSUMER_SUB_DOMAIN));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(3, logsList.size());
        assertRequestingTokenWithCertificate(logsList.get(0));
        assertHttpClientError(logsList.get(1), HttpMethod.POST, CONSUMER_DUMMY_OAUTH_TOKEN, "Error Response Body");
        assertUnableProcureToken(logsList.get(2), 400);
    }

    @Test
    @DisplayName("Test getOAuthToken when request to server raise webClientResponseException (server error).")
    public void getOAuthTokenWithRaisedHttpServerErrorException() {
        when(webClientResponseException.getRawStatusCode()).thenReturn(500);
        when(webClientResponseException.getResponseBodyAsString()).thenReturn(HTTP_ERROR_RESPONSE_BODY);
        when(webClientResponseException.getMessage()).thenReturn(SOMETHING_WENT_WRONG);

        when(this.webClient.post()).thenReturn(requestBodyUriSpecMock);
        when(requestBodyUriSpecMock.uri(CONSUMER_DUMMY_OAUTH_TOKEN)).thenReturn(requestBodySpecMock1);
        when(requestBodySpecMock1.header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE))
                .thenReturn(requestBodySpecMock2);
        when(requestBodySpecMock2.body(any(FormInserter.class))).thenReturn(requestHeadersSpecMock);
        when(requestHeadersSpecMock.retrieve()).thenThrow(webClientResponseException);

        assertEquals(Optional.empty(),
                this.classUnderTest.fetchOAuthTokenUsingCertificateFromCloudFoundry(marker, saasRegistryVCAP, CONSUMER_SUB_DOMAIN));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(3, logsList.size());
        assertRequestingTokenWithCertificate(logsList.get(0));
        assertHttpServerError(logsList.get(1), HttpMethod.POST, CONSUMER_DUMMY_OAUTH_TOKEN, "Error Response Body");
        assertUnableProcureToken(logsList.get(2), 500);
    }

    @Test
    @DisplayName("Test removeOneMDSAuthToken when there is no cache set")
    public void testRemoveOneMDSAuthTokenWithNoCache() {
        when(this.cacheManager.getCache(anyString())).thenReturn(null);
        this.classUnderTest.removeSAASRegistryAuthToken();
        verify(this.cache, times(0)).clear();
    }

    @Test
    @DisplayName("Test removeOneMDSAuthToken when there is a cache is set")
    public void testRemoveOneMDSAuthTokenWithCache() {
        when(this.cacheManager.getCache(anyString())).thenReturn(this.cache);
        this.classUnderTest.removeSAASRegistryAuthToken();
        verify(cache, times(1)).clear();
    }

}
