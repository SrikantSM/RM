package com.sap.c4p.rm.projectintegrationadapter.cf.jobScheduler.util;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.reactive.function.BodyInserters.FormInserter;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.model.JobScheduler;
import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.model.OAuthTokenResponse;
import com.sap.c4p.rm.projectintegrationadapter.cf.jobscheduler.util.JobSchedulerToken;

import reactor.core.publisher.Mono;

public class JobSchedulerTokenTest {

  public JobSchedulerToken cut;

  private JobScheduler jobScheduler;
  private WebClient mockWebClient;
  private WebClientResponseException webClientResponseException;

  private WebClient.RequestBodyUriSpec mockRequestBodyUriSpec;
  private WebClient.RequestBodySpec mockRequestBodySpec;
  private WebClient.RequestHeadersSpec mockRequestHeadersSpec;
  private WebClient.ResponseSpec mockResponseSpec;
  private Mono<OAuthTokenResponse> mockPostResponseBody;
  private FormInserter mockFormInserter;

  @BeforeEach
  public void setUp() {

    mockWebClient = Mockito.mock(WebClient.class);
    webClientResponseException = Mockito.mock(WebClientResponseException.class);

    jobScheduler = new JobScheduler();
    jobScheduler.setClientId("clientId");
    jobScheduler.setClientSecret("clientSecret");
    jobScheduler.setSchedulerUrl("https://triggerJobs");
    jobScheduler.setUaaUrl("https://authenticate/oaut/token");
    jobScheduler.setCertUrl("https://rm-bradbury.authentication.cert.sap.hana.ondemand.com");

    mockRequestBodyUriSpec = mock(WebClient.RequestBodyUriSpec.class);
    mockRequestBodySpec = mock(WebClient.RequestBodySpec.class);
    mockRequestHeadersSpec = mock(WebClient.RequestHeadersSpec.class);
    mockResponseSpec = mock(WebClient.ResponseSpec.class);
    mockFormInserter = mock(FormInserter.class);
    mockPostResponseBody = mock(Mono.class);

    cut = new JobSchedulerToken(mockWebClient);
  }

  @Test
  @DisplayName("Test getCertificateBearerToken when server returns the response having access_token")
  public void testGetCertificateBearerTokenSuccessful() {

    OAuthTokenResponse token = new OAuthTokenResponse();
    token.setAccessToken("BearerToken");
    when(mockWebClient.post()).thenReturn(mockRequestBodyUriSpec);
    when(mockRequestBodyUriSpec.uri(anyString())).thenReturn(mockRequestBodySpec);
    when(mockRequestBodySpec.header(any(), any())).thenReturn(mockRequestBodySpec);

    when(mockRequestBodySpec.body(any())).thenReturn(mockRequestHeadersSpec);
    when(mockFormInserter.with(any(), any())).thenReturn(mockFormInserter);
    when(mockRequestHeadersSpec.retrieve()).thenReturn(mockResponseSpec);
    when(mockResponseSpec.bodyToMono(OAuthTokenResponse.class)).thenReturn(mockPostResponseBody);
    when((mockPostResponseBody).block()).thenReturn(token);

    JobSchedulerToken spy = Mockito.spy(cut);

    String response = spy.getCertificateBearerToken(jobScheduler, "");
    assertEquals(token.getAccessToken(), response);
  }

  @Test
  @DisplayName("Test getCertificateBearerToken when server return null response")
  public void testGetCertificateBearerTokenIsReturnNull() {

    OAuthTokenResponse token = new OAuthTokenResponse();
    when(mockWebClient.post()).thenReturn(mockRequestBodyUriSpec);
    when(mockRequestBodyUriSpec.uri(anyString())).thenReturn(mockRequestBodySpec);
    when(mockRequestBodySpec.header(any(), any())).thenReturn(mockRequestBodySpec);

    when(mockRequestBodySpec.body(any())).thenReturn(mockRequestHeadersSpec);
    when(mockFormInserter.with(any(), any())).thenReturn(mockFormInserter);
    when(mockRequestHeadersSpec.retrieve()).thenReturn(mockResponseSpec);
    when(mockResponseSpec.bodyToMono(OAuthTokenResponse.class)).thenReturn(mockPostResponseBody);
    when((mockPostResponseBody).block()).thenReturn(token);

    JobSchedulerToken spy = Mockito.spy(cut);

    assertNull(spy.getCertificateBearerToken(jobScheduler, ""));
  }

  @Test
  @DisplayName("Test getCertificateBearerToken when request to server raises webClientResponseException")
  public void getCertificateBearerTokenWithWebClientResponseException() {

    ServiceException e = new ServiceException("Failed to get token for job scheduler");

    JobSchedulerToken spy = Mockito.spy(cut);

    when(mockWebClient.post()).thenReturn(mockRequestBodyUriSpec);
    when(mockRequestBodyUriSpec.uri(anyString())).thenReturn(mockRequestBodySpec);
    when(mockRequestBodySpec.header(any(), any())).thenReturn(mockRequestBodySpec);

    when(mockRequestBodySpec.body(any())).thenReturn(mockRequestHeadersSpec);
    when(mockFormInserter.with(any(), any())).thenReturn(mockFormInserter);
    when(mockRequestHeadersSpec.retrieve()).thenThrow(webClientResponseException);

    final ServiceException exception = assertThrows(ServiceException.class,
        () -> spy.getCertificateBearerToken(jobScheduler, ""));
    assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

  }

  @Test
  @DisplayName("Test replaceCertUrlWithSubdomain")
  public void testReplaceCertUrlWithSubdomain() {
    JobSchedulerToken spy = Mockito.spy(cut);
    String certUrl = "https://rm-bradbury.authentication.cert.sap.hana.ondemand.com";
    String tenantSubdomain = "rm-bradbury-consumer";
    String result = spy.replaceCertUrlWithSubdomain(tenantSubdomain, certUrl);
    String expected = "https://rm-bradbury-consumer.authentication.cert.sap.hana.ondemand.com";
    assertEquals(expected, result);
  }

}
