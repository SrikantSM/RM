package com.sap.c4p.rm.cloudfoundry.service.saasregistry.service;

import static com.sap.c4p.rm.TestConstants.BEARER_TOKEN;
import static com.sap.c4p.rm.TestConstants.CONSUMER_DUMMY_OAUTH_TOKEN;
import static com.sap.c4p.rm.TestConstants.HTTP_ERROR_RESPONSE_BODY;
import static com.sap.c4p.rm.TestConstants.IDENTITY_ZONE;
import static com.sap.c4p.rm.TestConstants.SOMETHING_WENT_WRONG;
import static com.sap.c4p.rm.TestHelper.assertHttpClientError;
import static com.sap.c4p.rm.TestHelper.assertHttpServerError;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.function.Consumer;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.authclient.SAASRegistryToken;
import com.sap.c4p.rm.cloudfoundry.environment.AbstractVCAPService;
import com.sap.c4p.rm.cloudfoundry.environment.SAASRegistryVCAP;
import com.sap.c4p.rm.cloudfoundry.environment.XSUaaVCAP;
import com.sap.c4p.rm.cloudfoundry.service.saasregistry.model.TenantSubscriptions;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import reactor.core.publisher.Mono;

/**
 * Test Class to test working of {@link SaasRegistryService}.
 */
public class SaasRegistryServiceTest extends InitMocks {

    private final Logger logger = (Logger) LoggerFactory.getLogger(SaasRegistryServiceImpl.class);

    @Mock
    SAASRegistryVCAP saasRegistryVCAP;

    @Mock
    XSUaaVCAP xsUaaVCAP;

    @Mock
    Marker marker;

    @Mock
    SAASRegistryToken saasRegistryToken;

    @Mock
    WebClient webClient;

    @Mock
    WebClientResponseException webClientResponseException;

    @Mock
    WebClient.RequestHeadersUriSpec requestHeadersUriSpecMock;

    @Mock
    WebClient.RequestHeadersSpec requestHeadersSpecMock1;

    @Mock
    WebClient.RequestHeadersSpec requestHeadersSpecMock2;

    @Mock
    WebClient.ResponseSpec responseSpecMock;

    @Mock
    Mono<TenantSubscriptions> getResponseBodymock;

    private String getActiveSubscriptionUrl;

    private ListAppender<ILoggingEvent> listAppender;

    private SaasRegistryServiceImpl classUnderTest;

    private static final HttpHeaders requestHeaders = new HttpHeaders();

    @BeforeAll
    public static void setUpAll() {
        requestHeaders.setContentType(MediaType.APPLICATION_JSON);
        requestHeaders.setBearerAuth(BEARER_TOKEN);
    }

    @BeforeEach
    public void setUp() {
        when(this.saasRegistryVCAP.getServiceUrl()).thenReturn(CONSUMER_DUMMY_OAUTH_TOKEN);
        this.classUnderTest = new SaasRegistryServiceImpl(this.saasRegistryToken, this.saasRegistryVCAP, this.xsUaaVCAP,
                this.webClient);
        this.getActiveSubscriptionUrl = UriComponentsBuilder.fromUriString(this.saasRegistryVCAP.getServiceUrl())
                .pathSegment(SaasRegistryServiceImpl.GET_SUBSCRIPTION_URL)
                .queryParam(SaasRegistryServiceImpl.STATE, SaasRegistryServiceImpl.SUBSCRIBED).build().toString();
        this.listAppender = new ListAppender<>();
        this.listAppender.start();
        logger.addAppender(this.listAppender);
    }

    @Test
    @DisplayName("Test getActiveSubscriptions with no bearer Token.")
    public void testGetActiveSubscriptionsWithNoBearerToken() {
        when(this.saasRegistryToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
                .thenReturn(null);
        assertNull(this.classUnderTest.getActiveSubscriptions(marker));
    }

    @Test
    @DisplayName("Test getActiveSubscriptions with bearer Token when server communication throws webClientResponseException (client error).")
    public void testGetActiveSubscriptionsWithBearerTokenWithHttpClientErrorException() {
        HttpEntity<String> requestEntity = new HttpEntity<>(requestHeaders);
        when(this.xsUaaVCAP.getIdentityZone()).thenReturn(IDENTITY_ZONE);
        when(this.saasRegistryToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
                .thenReturn(BEARER_TOKEN);
        when(webClientResponseException.getRawStatusCode()).thenReturn(400);
        when(webClientResponseException.getResponseBodyAsString()).thenReturn(HTTP_ERROR_RESPONSE_BODY);
        when(webClientResponseException.getMessage()).thenReturn(SOMETHING_WENT_WRONG);

        when(this.webClient.get()).thenReturn(requestHeadersUriSpecMock);
        when(requestHeadersUriSpecMock.uri(this.getActiveSubscriptionUrl)).thenReturn(requestHeadersSpecMock1);
        when(requestHeadersSpecMock1.headers(any(Consumer.class))).thenReturn(requestHeadersSpecMock2);
        when(requestHeadersSpecMock2.retrieve()).thenThrow(webClientResponseException);

        assertNull(this.classUnderTest.getActiveSubscriptions(marker));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpClientError(logsList.get(0), HttpMethod.GET, this.getActiveSubscriptionUrl, "Error Response Body");
    }

    @Test
    @DisplayName("Test getActiveSubscriptions with bearer Token when server communication throws webClientResponseException (server error).")
    public void testGetJobWIthBearerTokenWithHttpServerErrorException() {
        HttpEntity<String> requestEntity = new HttpEntity<>(requestHeaders);
        when(this.xsUaaVCAP.getIdentityZone()).thenReturn(IDENTITY_ZONE);
        when(this.saasRegistryToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
                .thenReturn(BEARER_TOKEN);
        when(webClientResponseException.getRawStatusCode()).thenReturn(500);
        when(webClientResponseException.getResponseBodyAsString()).thenReturn(HTTP_ERROR_RESPONSE_BODY);
        when(webClientResponseException.getMessage()).thenReturn(SOMETHING_WENT_WRONG);

        when(this.webClient.get()).thenReturn(requestHeadersUriSpecMock);
        when(requestHeadersUriSpecMock.uri(this.getActiveSubscriptionUrl)).thenReturn(requestHeadersSpecMock1);
        when(requestHeadersSpecMock1.headers(any(Consumer.class))).thenReturn(requestHeadersSpecMock2);
        when(requestHeadersSpecMock2.retrieve()).thenThrow(webClientResponseException);

        assertNull(this.classUnderTest.getActiveSubscriptions(marker));
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(1, logsList.size());
        assertHttpServerError(logsList.get(0), HttpMethod.GET, this.getActiveSubscriptionUrl, "Error Response Body");
    }

    @Test
    @DisplayName("Test getActiveSubscriptions with bearer Token with No Job response from server.")
    public void testGetActiveSubscriptionsWithBearerTokenWithNoJob() {
        HttpEntity<String> requestEntity = new HttpEntity<>(requestHeaders);
        when(this.xsUaaVCAP.getIdentityZone()).thenReturn(IDENTITY_ZONE);
        when(this.saasRegistryToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
                .thenReturn(BEARER_TOKEN);

        when(this.webClient.get()).thenReturn(requestHeadersUriSpecMock);
        when(requestHeadersUriSpecMock.uri(this.getActiveSubscriptionUrl)).thenReturn(requestHeadersSpecMock1);
        when(requestHeadersSpecMock1.headers(any(Consumer.class))).thenReturn(requestHeadersSpecMock2);
        when(requestHeadersSpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.bodyToMono(TenantSubscriptions.class)).thenReturn(getResponseBodymock);
        when(getResponseBodymock.block()).thenReturn(null);

        assertNull(this.classUnderTest.getActiveSubscriptions(marker));
    }

    @Test
    @DisplayName("Test getActiveSubscriptions with bearer Token with Job response from server.")
    public void testGetActiveSubscriptionsWIthBearerTokenWithJob() {
        HttpEntity<String> requestEntity = new HttpEntity<>(requestHeaders);
        when(this.xsUaaVCAP.getIdentityZone()).thenReturn(IDENTITY_ZONE);
        when(this.saasRegistryToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
                .thenReturn(BEARER_TOKEN);
        TenantSubscriptions subscriptions = new TenantSubscriptions();
        when(this.webClient.get()).thenReturn(requestHeadersUriSpecMock);
        when(requestHeadersUriSpecMock.uri(this.getActiveSubscriptionUrl)).thenReturn(requestHeadersSpecMock1);
        when(requestHeadersSpecMock1.headers(any(Consumer.class))).thenReturn(requestHeadersSpecMock2);
        when(requestHeadersSpecMock2.retrieve()).thenReturn(responseSpecMock);
        when(responseSpecMock.bodyToMono(TenantSubscriptions.class)).thenReturn(getResponseBodymock);
        when(getResponseBodymock.block()).thenReturn(subscriptions);

        assertEquals(subscriptions, this.classUnderTest.getActiveSubscriptions(marker));
    }

}
