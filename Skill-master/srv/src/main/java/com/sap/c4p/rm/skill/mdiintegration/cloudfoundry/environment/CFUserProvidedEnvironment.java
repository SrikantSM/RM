package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class CFUserProvidedEnvironment {

  protected static final String MDI_SERVICE_TIMEOUT = "MDI_SERVICE_TIMEOUT";
  protected static final String MDI_SERVICE_RETRY_ATTEMPT = "MDI_SERVICE_RETRY_ATTEMPT";
  protected static final Integer DEFAULT_MDI_SERVICE_TIME_OUT = 120000; // In Miliseconds
  protected static final Integer DEFAULT_MDI_SERVICE_RETRY_ATTEMPT = 2;

  private final Integer mdiServiceTimeout;
  private final Integer mdiServiceRetryAttempt;

  @Autowired
  public CFUserProvidedEnvironment(final Environment environment) {
    Integer mdiServiceTimeoutFromEnv;
    Integer mdiServiceRetryAttemptFromEnv;
    if ((mdiServiceRetryAttemptFromEnv = environment.getProperty(MDI_SERVICE_RETRY_ATTEMPT, Integer.class)) == null)
      mdiServiceRetryAttemptFromEnv = DEFAULT_MDI_SERVICE_RETRY_ATTEMPT;
    if ((mdiServiceTimeoutFromEnv = environment.getProperty(MDI_SERVICE_TIMEOUT, Integer.class)) == null)
      mdiServiceTimeoutFromEnv = DEFAULT_MDI_SERVICE_TIME_OUT;
    this.mdiServiceRetryAttempt = mdiServiceRetryAttemptFromEnv;
    this.mdiServiceTimeout = mdiServiceTimeoutFromEnv;
  }

  public Integer getMdiServiceTimeout() {
    return this.mdiServiceTimeout;
  }

  public Integer getMdiServiceRetryAttempt() {
    return this.mdiServiceRetryAttempt;
  }

}
