package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.authclient;

import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.*;
import static com.sap.c4p.rm.skill.mdiintegration.TestHelper.*;
import static com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.authclient.AbstractAuthClient.CLIENT_ID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

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
import org.springframework.web.reactive.function.BodyInserters;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment.DestinationVCAP;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;

public class DestinationTokenTest extends AuthClientTestHelper {

  private final Logger logger = (Logger) LoggerFactory.getLogger(DestinationToken.class);

  @Mock
  DestinationVCAP destinationVCAP;

  @Autowired
  @InjectMocks
  private DestinationToken classUnderTest;

  @BeforeEach
  public void setUp() {
    when(destinationVCAP.getClientId()).thenReturn(CLIENT_ID);
    when(destinationVCAP.getCertificate()).thenReturn("cert");
    when(destinationVCAP.getKey()).thenReturn("key");
    when(destinationVCAP.getCertOAuthTokenUrl(CONSUMER_SUB_DOMAIN)).thenReturn(CONSUMER_DUMMY_OAUTH_TOKEN);
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
    when(requestBodySpecMock2.body(any(BodyInserters.FormInserter.class))).thenReturn(requestHeadersSpecMock);
    when(requestHeadersSpecMock.retrieve()).thenReturn(responseSpecMock);
    when(responseSpecMock.bodyToMono(OAuthTokenResponse.class)).thenReturn(postResponseBodymock);
    when(postResponseBodymock.blockOptional()).thenReturn(Optional.empty());

    assertNull(this.classUnderTest.getOAuthToken(marker, destinationVCAP, CONSUMER_SUB_DOMAIN));
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
    when(requestBodySpecMock2.body(any(BodyInserters.FormInserter.class))).thenReturn(requestHeadersSpecMock);
    when(requestHeadersSpecMock.retrieve()).thenReturn(responseSpecMock);
    when(responseSpecMock.bodyToMono(OAuthTokenResponse.class)).thenReturn(postResponseBodymock);
    when(postResponseBodymock.blockOptional()).thenReturn(oAuthTokenResponseBody);

    assertEquals(oAuthTokenResponse.getAccessToken(),
        this.classUnderTest.getOAuthToken(marker, destinationVCAP, CONSUMER_SUB_DOMAIN));
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
    when(requestBodySpecMock2.body(any(BodyInserters.FormInserter.class))).thenReturn(requestHeadersSpecMock);
    when(requestHeadersSpecMock.retrieve()).thenThrow(webClientResponseException);

    assertEquals(Optional.empty(), this.classUnderTest.fetchOAuthTokenUsingCertificateFromCloudFoundry(marker,
        destinationVCAP, CONSUMER_SUB_DOMAIN));
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
    when(requestBodySpecMock2.body(any(BodyInserters.FormInserter.class))).thenReturn(requestHeadersSpecMock);
    when(requestHeadersSpecMock.retrieve()).thenThrow(webClientResponseException);

    assertEquals(Optional.empty(), this.classUnderTest.fetchOAuthTokenUsingCertificateFromCloudFoundry(marker,
        destinationVCAP, CONSUMER_SUB_DOMAIN));
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
    this.classUnderTest.removeDestinationAuthToken();
    verify(this.cache, times(0)).clear();
  }

  @Test
  @DisplayName("Test removeOneMDSAuthToken when there is a cache is set")
  public void testRemoveOneMDSAuthTokenWithCache() {
    when(this.cacheManager.getCache(anyString())).thenReturn(this.cache);
    this.classUnderTest.removeDestinationAuthToken();
    verify(cache, times(1)).clear();
  }

}
