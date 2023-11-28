package com.sap.c4p.rm.cloudfoundry.service.destination.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AuthTokens {

    private String type;
    @JsonProperty("value")
    private String value;
    @JsonProperty("expires_in")
    private String expiresIn;
    @JsonProperty("error")
    private String error;
}
