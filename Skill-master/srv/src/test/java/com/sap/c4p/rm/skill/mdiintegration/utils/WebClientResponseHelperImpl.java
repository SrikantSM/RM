package com.sap.c4p.rm.skill.mdiintegration.utils;

import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.BEARER_TOKEN;
import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.HTTP_ERROR_RESPONSE_BODY;
import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.SOMETHING_WENT_WRONG;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.function.Consumer;

import org.slf4j.Marker;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.authclient.JobSchedulerToken;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment.AbstractVCAPService;

import reactor.core.publisher.Mono;

public class WebClientResponseHelperImpl<T> extends WebClientResponseHelper<T> {
  public WebClientResponseHelperImpl(final Class<T> classType, final JobSchedulerToken jobSchedulerToken,
      final WebClient webClient, Mono<ResponseEntity<T>> responseEntityMock) {
    super(webClient, jobSchedulerToken, responseEntityMock, classType);
  }

  @Override
  public void setGetResponseWithMock(final String jobUrl, final ResponseEntity<T> emptyJobResponse) {
    when(this.jobSchedulerToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
        .thenReturn(BEARER_TOKEN);
    when(this.webClient.method(HttpMethod.GET)).thenReturn(requestBodyUriSpecMock);
    when(requestBodyUriSpecMock.uri(jobUrl)).thenReturn(requestBodySpec1);
    when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
    when(requestBodySpec2.retrieve()).thenReturn(responseSpecMock);
    when(responseSpecMock.toEntity(this.classType)).thenReturn(responseEntityMock);
    when(responseEntityMock.block()).thenReturn(emptyJobResponse);
  }

  @Override
  public void setPostResponseWithMock(final String jobUrl, final ResponseEntity<T> emptyJobResponse) {
    when(this.jobSchedulerToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
        .thenReturn(BEARER_TOKEN);
    when(this.webClient.method(HttpMethod.POST)).thenReturn(requestBodyUriSpecMock);
    when(requestBodyUriSpecMock.uri(jobUrl)).thenReturn(requestBodySpec1);
    when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
    when(requestBodySpec2.bodyValue(any(String.class))).thenReturn(requestHeadersSpecMock);
    when(requestHeadersSpecMock.retrieve()).thenReturn(responseSpecMock);
    when(responseSpecMock.toEntity(this.classType)).thenReturn(this.responseEntityMock);
    when(responseEntityMock.block()).thenReturn(emptyJobResponse);
  }

  @Override
  public void setPutResponseWithMock(final String jobUrl, final ResponseEntity<T> emptyJobResponse) {
    when(this.jobSchedulerToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
        .thenReturn(BEARER_TOKEN);
    when(this.webClient.method(HttpMethod.PUT)).thenReturn(requestBodyUriSpecMock);
    when(requestBodyUriSpecMock.uri(jobUrl)).thenReturn(requestBodySpec1);
    when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
    when(requestBodySpec2.bodyValue(any(String.class))).thenReturn(requestHeadersSpecMock);
    when(requestHeadersSpecMock.retrieve()).thenReturn(responseSpecMock);
    when(responseSpecMock.toEntity(this.classType)).thenReturn(this.responseEntityMock);
    when(responseEntityMock.block()).thenReturn(emptyJobResponse);
  }

  @Override
  public void setResponseMockWithException(String jobUrl, HttpMethod httpMethod, HttpStatus expectedHttpStatus) {
    when(this.jobSchedulerToken.getOAuthToken(any(Marker.class), any(AbstractVCAPService.class), anyString()))
        .thenReturn(BEARER_TOKEN);
    when(this.webClient.method(httpMethod)).thenReturn(requestBodyUriSpecMock);
    when(requestBodyUriSpecMock.uri(jobUrl)).thenReturn(requestBodySpec1);
    if (httpMethod.equals(HttpMethod.GET)) {
      when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
      when(requestBodySpec2.retrieve()).thenThrow(webClientResponseException);
    } else {
      when(requestBodySpec1.headers(any(Consumer.class))).thenReturn(requestBodySpec2);
      when(requestBodySpec2.bodyValue(any(this.classType))).thenReturn(requestHeadersSpecMock);
      when(requestHeadersSpecMock.retrieve()).thenThrow(webClientResponseException);
    }

    when(this.webClientResponseException.getRawStatusCode()).thenReturn(expectedHttpStatus.value());
    when(this.webClientResponseException.getResponseBodyAsString()).thenReturn(HTTP_ERROR_RESPONSE_BODY);
    when(this.webClientResponseException.getMessage()).thenReturn(SOMETHING_WENT_WRONG);
  }
}
