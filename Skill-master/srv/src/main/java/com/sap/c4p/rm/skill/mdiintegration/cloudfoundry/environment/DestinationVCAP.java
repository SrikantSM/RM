package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.pivotal.cfenv.core.CfEnv;

@Component
public class DestinationVCAP extends AbstractVCAPService {

  private static final String SERVICE_LABEL_NAME = "destination";

  @Autowired
  public DestinationVCAP(final CfEnv cfEnv) {
    this.readServiceVCAP(SERVICE_LABEL_NAME, cfEnv, URI);
    this.prepareClientCredentials();
  }

  private void prepareClientCredentials() {
    this.clientId = cfCredentials.getString(CLIENT_ID);
    this.clientSecret = cfCredentials.getString(CLIENT_SECRET);
    this.uaaDomain = cfCredentials.getString(UAA_DOMAIN);
    this.xsAppName = cfCredentials.getString(XS_APP_NAME);
    this.identityZone = cfCredentials.getString(IDENTITY_ZONE);
    this.tenantId = cfCredentials.getString(TENANT_ID);
    this.certificate = cfCredentials.getString(CERT);
    this.certurl = cfCredentials.getString(CERT_URL);
    this.key = cfCredentials.getString(CERT_KEY);
  }

}
