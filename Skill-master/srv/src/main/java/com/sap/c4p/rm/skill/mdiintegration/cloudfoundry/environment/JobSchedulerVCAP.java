package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.pivotal.cfenv.core.CfEnv;

/**
 * Class to provide the integration-srv VCAP_SERVICES environment variables for
 * JobScheduler service information.
 */
@Component
public class JobSchedulerVCAP extends AbstractVCAPService {

  private static final String SERVICE_LABEL_NAME = "jobscheduler";

  @Autowired
  public JobSchedulerVCAP(final CfEnv cfEnv) {
    this.readServiceVCAP(SERVICE_LABEL_NAME, cfEnv, URL);
    this.prepareClientCredentialsWithX509Certificate();
  }

}
