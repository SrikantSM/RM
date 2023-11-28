package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.destination.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class DestinationResponseTest {

  private static final String NAME = "name";
  private static final String TYPE = "type";
  private static final String URL = "URL";
  private static final String AUTHENTICATION = "Authentication";
  private static final String PROXY_TYPE = "ProxyType";
  private static final String TOKEN_SERVICE_URL_TYPE = "tokenServiceURLType";
  private static final String TOKEN_SERVICE_URL = "tokenServiceURL";
  private static final String CLIENT_ID = "clientId";
  private static final String CLIENT_SECRET = "clientSecret";
  private static final String VALUE = "value";
  private static final String EXPIRES_IN = "expiresIn";
  private static final String ERROR = "error";

  @Test
  @DisplayName("test @NoArgConstructor and Getters")
  public void testNoArgConstructorAndGetters() {

    DestinationConfiguration configuration = new DestinationConfiguration();
    assertNull(configuration.getUrl());
    assertNull(configuration.getAuthentication());
    assertNull(configuration.getClientId());
    assertNull(configuration.getClientSecret());
    assertNull(configuration.getName());
    assertNull(configuration.getProxyType());
    assertNull(configuration.getTokenServiceURL());
    assertNull(configuration.getTokenServiceURLType());
    assertNull(configuration.getType());

    AuthTokens authTokens = new AuthTokens();
    assertNull(authTokens.getType());
    assertNull(authTokens.getValue());
    assertNull(authTokens.getExpiresIn());
    List<AuthTokens> authTokensList = new ArrayList<>();
    authTokensList.add(authTokens);

    DestinationResponse destinationResponse = new DestinationResponse();
    assertNull(destinationResponse.getDestinationConfiguration());
    assertNull(destinationResponse.getAuthTokens());
  }

  @Test
  @DisplayName("test @AllArgsConstructor and Getters")
  public void testAllArgsConstructorAnnotation() {

    DestinationConfiguration configuration = new DestinationConfiguration(NAME, TYPE, URL, AUTHENTICATION, PROXY_TYPE,
        TOKEN_SERVICE_URL_TYPE, CLIENT_ID, CLIENT_SECRET, TOKEN_SERVICE_URL);
    AuthTokens authTokens = new AuthTokens(TYPE, VALUE, EXPIRES_IN, ERROR);
    DestinationResponse destinationResponse = new DestinationResponse(configuration,
        Collections.singletonList(authTokens));

    DestinationResponse response = destinationResponse;
    assertEquals(URL, response.getDestinationConfiguration().getUrl());
    assertEquals(AUTHENTICATION, response.getDestinationConfiguration().getAuthentication());
    assertEquals(CLIENT_ID, response.getDestinationConfiguration().getClientId());
    assertEquals(CLIENT_SECRET, response.getDestinationConfiguration().getClientSecret());
    assertEquals(PROXY_TYPE, response.getDestinationConfiguration().getProxyType());
    assertEquals(TOKEN_SERVICE_URL, response.getDestinationConfiguration().getTokenServiceURL());
    assertEquals(TOKEN_SERVICE_URL_TYPE, response.getDestinationConfiguration().getTokenServiceURLType());
    assertEquals(NAME, response.getDestinationConfiguration().getName());
    assertEquals(TYPE, response.getDestinationConfiguration().getType());
    assertEquals(1, response.getAuthTokens().size());
    AuthTokens authTokensResponse = response.getAuthTokens().get(0);
    assertEquals(TYPE, authTokensResponse.getType());
    assertEquals(EXPIRES_IN, authTokensResponse.getExpiresIn());
    assertEquals(VALUE, authTokensResponse.getValue());

  }
}
