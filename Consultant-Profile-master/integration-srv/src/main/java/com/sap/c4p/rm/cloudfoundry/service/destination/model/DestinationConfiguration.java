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
public class DestinationConfiguration {

    @JsonProperty("Name")
    private String name;
    @JsonProperty("Type")
    private String type;
    @JsonProperty("URL")
    private String url;
    @JsonProperty("Authentication")
    private String authentication;
    @JsonProperty("ProxyType")
    private String proxyType;
    @JsonProperty("tokenServiceURLType")
    private String tokenServiceURLType;
    @JsonProperty("clientId")
    private String clientId;
    @JsonProperty("clientSecret")
    private String clientSecret;
    @JsonProperty("tokenServiceURL")
    private String tokenServiceURL;

}
