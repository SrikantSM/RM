package com.sap.c4p.rm.cloudfoundry.service.destination.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DestinationResponse {

    @JsonProperty("destinationConfiguration")
    private DestinationConfiguration destinationConfiguration;
    @JsonProperty("authTokens")
    private List<AuthTokens> authTokens;

}
