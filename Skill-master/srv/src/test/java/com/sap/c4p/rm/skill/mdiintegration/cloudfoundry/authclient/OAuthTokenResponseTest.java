package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.authclient;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Test Class to test working of {@link OAuthTokenResponse}.
 */
public class OAuthTokenResponseTest {

  private static final String ACCESS_TOKEN = "accessToken";
  private static final String EXPIRES_IN = "expiresIn";
  private static final String TOKEN_TYPE = "tokenType";

  @Test
  @DisplayName("Test OAuthTokenResponse Class")
  public void testOAuthTokenResponseObject() {
    OAuthTokenResponse oAuthTokenResponse = new OAuthTokenResponse();
    oAuthTokenResponse.setAccessToken(ACCESS_TOKEN);
    oAuthTokenResponse.setExpiresIn(EXPIRES_IN);
    oAuthTokenResponse.setTokenType(TOKEN_TYPE);
    assertEquals(ACCESS_TOKEN, oAuthTokenResponse.getAccessToken());
    assertEquals(EXPIRES_IN, oAuthTokenResponse.getExpiresIn());
    assertEquals(TOKEN_TYPE, oAuthTokenResponse.getTokenType());
  }
}
