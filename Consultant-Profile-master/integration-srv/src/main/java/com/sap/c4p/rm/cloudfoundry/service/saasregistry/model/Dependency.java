package com.sap.c4p.rm.cloudfoundry.service.saasregistry.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Class to hold a subscription's dependency information
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Dependency {
    private String xsappname;
    private String appName;
    private List<Object> dependencies;
}
