package com.sap.c4p.rm.cloudfoundry.environment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.pivotal.cfenv.core.CfEnv;

/**
 * Class to provide the integration-srv VCAP_SERVICES environment variables for
 * SAAS-Registry service information.
 */
@Component
public class SAASRegistryVCAP extends AbstractVCAPService {

    private static final String SERVICE_LABEL_NAME = "saas-registry";
    private static final String SAAS_REGISTRY_URL = "saas_registry_url";

    @Autowired
    public SAASRegistryVCAP(final CfEnv cfEnv) {
        this.readServiceVCAP(SERVICE_LABEL_NAME, cfEnv, SAAS_REGISTRY_URL);
        this.prepareClientCredentials();
    }

    private void prepareClientCredentials() {
        this.clientId = cfCredentials.getString(CLIENT_ID);
        this.clientSecret = cfCredentials.getString(CLIENT_SECRET);
        this.uaaDomain = cfCredentials.getString(UAA_DOMAIN);
        this.xsAppName = cfCredentials.getString(XS_APP_NAME);
        this.identityZone = cfCredentials.getString(IDENTITY_ZONE);
        this.tenantId = cfCredentials.getString(TENANT_ID);
        this.certificate = cfCredentials.getString(CERTIFICATE);
        this.certurl = cfCredentials.getString(CERT_URL);
        this.key = cfCredentials.getString(KEY);
    }

}
