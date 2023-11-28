package com.sap.c4p.rm.cloudfoundry.environment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.pivotal.cfenv.core.CfEnv;

/**
 * Class to provide the integration-srv VCAP_SERVICES environment variables for
 * MasterDataIntegration/OneMDS service information.
 */
@Component
public class MasterDataIntegrationVCAP extends AbstractVCAPService {

    private static final String SERVICE_LABEL_NAME = "one-mds";

    @Autowired
    public MasterDataIntegrationVCAP(final CfEnv cfEnv) {
        this.readServiceVCAP(SERVICE_LABEL_NAME, cfEnv, URI);
        this.prepareClientCredentialsWithX509Certificate();
    }

}
