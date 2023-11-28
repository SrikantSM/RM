package com.sap.c4p.rm.cloudfoundry.service.saasregistry.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Class to hold all subscription's information
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TenantSubscriptions {
    private List<Subscription> subscriptions;
}
