package com.sap.c4p.rm.cloudfoundry.environment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.pivotal.cfenv.core.CfEnv;

@Component
public class AuditLogVCAP extends AbstractVCAPService {
    private static final String SERVICE_LABEL_NAME = "auditlog";

    @Autowired
    public AuditLogVCAP(final CfEnv cfEnv) {
        this.readServiceVCAP(SERVICE_LABEL_NAME, cfEnv, URI);
        this.prepareClientCredentialsWithX509Certificate();
    }
}
