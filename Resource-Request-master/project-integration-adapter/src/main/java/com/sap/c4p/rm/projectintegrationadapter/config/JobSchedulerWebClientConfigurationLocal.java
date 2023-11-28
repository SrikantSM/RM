package com.sap.c4p.rm.projectintegrationadapter.config;

import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component("jobSchedulerWebClient")
@Profile({ "default" })
public class JobSchedulerWebClientConfigurationLocal implements WebClient {

  @Override
  public RequestHeadersUriSpec<?> get() {
    // Kept blank as in local run, implementation is not required
    return null;
  }

  @Override
  public RequestHeadersUriSpec<?> head() {
    // Kept blank as in local run, implementation is not required
    return null;
  }

  @Override
  public RequestBodyUriSpec post() {
    // Kept blank as in local run, implementation is not required
    return null;
  }

  @Override
  public RequestBodyUriSpec put() {
    // Kept blank as in local run, implementation is not required
    return null;
  }

  @Override
  public RequestBodyUriSpec patch() {
    // Kept blank as in local run, implementation is not required
    return null;
  }

  @Override
  public RequestHeadersUriSpec<?> delete() {
    // Kept blank as in local run, implementation is not required
    return null;
  }

  @Override
  public RequestHeadersUriSpec<?> options() {
    // Kept blank as in local run, implementation is not required
    return null;
  }

  @Override
  public RequestBodyUriSpec method(HttpMethod method) {
    // Kept blank as in local run, implementation is not required
    return null;
  }

  @Override
  public Builder mutate() {
    // Kept blank as in local run, implementation is not required
    return null;
  }

}
