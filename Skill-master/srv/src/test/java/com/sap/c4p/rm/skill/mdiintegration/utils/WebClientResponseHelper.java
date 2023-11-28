package com.sap.c4p.rm.skill.mdiintegration.utils;

import static org.mockito.Mockito.mock;

import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.authclient.JobSchedulerToken;

import reactor.core.publisher.Mono;

public abstract class WebClientResponseHelper<T> {
  protected Class<T> classType;
  protected WebClient webClient;
  protected WebClient.RequestBodyUriSpec requestBodyUriSpecMock;
  protected WebClient.RequestBodySpec requestBodySpec1;
  protected WebClient.RequestBodySpec requestBodySpec2;
  protected WebClient.RequestHeadersSpec requestHeadersSpecMock;
  protected WebClient.ResponseSpec responseSpecMock;
  protected Mono<ResponseEntity<T>> responseEntityMock;
  protected WebClientResponseException webClientResponseException;
  protected JobSchedulerToken jobSchedulerToken;

  protected WebClientResponseHelper(final WebClient webClient, final JobSchedulerToken jobSchedulerToken,
      final Mono<ResponseEntity<T>> responseEntityMock, final Class<T> classType) {
    this.webClient = webClient;
    this.jobSchedulerToken = jobSchedulerToken;
    this.classType = classType;
    this.responseEntityMock = responseEntityMock;
    requestBodyUriSpecMock = mock(WebClient.RequestBodyUriSpec.class);
    requestBodySpec1 = mock(WebClient.RequestBodySpec.class);
    requestBodySpec2 = mock(WebClient.RequestBodySpec.class);
    requestHeadersSpecMock = mock(WebClient.RequestHeadersSpec.class);
    responseSpecMock = mock(WebClient.ResponseSpec.class);
    webClientResponseException = mock(WebClientResponseException.class);
  }

  public abstract void setGetResponseWithMock(final String jobUrl, final ResponseEntity<T> emptyJobResponse);

  public abstract void setPostResponseWithMock(final String jobUrl, final ResponseEntity<T> emptyJobResponse);

  public abstract void setPutResponseWithMock(final String jobUrl, final ResponseEntity<T> emptyJobResponse);

  public abstract void setResponseMockWithException(final String jobUrl, final HttpMethod httpMethod,
      final HttpStatus expectedHttpStatus);

}
