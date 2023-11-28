package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.destination.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
