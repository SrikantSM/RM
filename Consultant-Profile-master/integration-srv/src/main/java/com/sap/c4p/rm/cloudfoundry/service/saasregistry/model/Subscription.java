package com.sap.c4p.rm.cloudfoundry.service.saasregistry.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Class to hold a subscription's information
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Subscription {
    private String url;
    private String appName;
    private String subdomain;
    private String consumerTenantId;
    private String state;
    private String error;
    private List<Dependency> dependencies;
}
