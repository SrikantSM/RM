package com.sap.c4p.rm.cloudfoundry.authclient;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Data Class to parse the response from authServer of cloud foundry Services
 */
public class OAuthTokenResponse {

    private String accessToken;
    private String tokenType;
    private String expiresIn;

    @JsonProperty("access_token")
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getAccessToken() {
        return accessToken;
    }

    @JsonProperty("token_type")
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getTokenType() {
        return tokenType;
    }

    @JsonProperty("expires_in")
    public void setExpiresIn(String expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getExpiresIn() {
        return expiresIn;
    }

}
