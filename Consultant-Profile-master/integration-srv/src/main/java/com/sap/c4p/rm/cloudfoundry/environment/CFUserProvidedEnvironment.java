package com.sap.c4p.rm.cloudfoundry.environment;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.sap.c4p.rm.utils.Constants;

@Component
public class CFUserProvidedEnvironment {

    protected static final String APPLICATION_URL = "APPLICATION_URL";
    protected static final String MDI_SERVICE_TIMEOUT = "MDI_SERVICE_TIMEOUT";
    protected static final String MDI_SERVICE_RETRY_ATTEMPT = "MDI_SERVICE_RETRY_ATTEMPT";
    protected static final Integer DEFAULT_MDI_SERVICE_TIME_OUT = 120000; // In Miliseconds
    protected static final Integer DEFAULT_MDI_SERVICE_RETRY_ATTEMPT = 2;
    protected static final String SKILLS_URL = "SKILLS_URL";

    private final String applicationUri;
    private final Integer mdiServiceTimeout;
    private final Integer mdiServiceRetryAttempt;
    private final String skillsUri;

    @Autowired
    public CFUserProvidedEnvironment(final Environment environment) {
        Integer mdiServiceTimeoutFromEnv;
        Integer mdiServiceRetryAttemptFromEnv;
        this.applicationUri = UriComponentsBuilder.newInstance().scheme(Constants.HTTPS)
                .host(Objects.requireNonNull(environment.getProperty(APPLICATION_URL, String.class))).build()
                .toUriString();
        this.skillsUri = environment.getProperty(SKILLS_URL, String.class);
        if ((mdiServiceRetryAttemptFromEnv = environment.getProperty(MDI_SERVICE_RETRY_ATTEMPT, Integer.class)) == null)
            mdiServiceRetryAttemptFromEnv = DEFAULT_MDI_SERVICE_RETRY_ATTEMPT;
        if ((mdiServiceTimeoutFromEnv = environment.getProperty(MDI_SERVICE_TIMEOUT, Integer.class)) == null)
            mdiServiceTimeoutFromEnv = DEFAULT_MDI_SERVICE_TIME_OUT;
        this.mdiServiceRetryAttempt = mdiServiceRetryAttemptFromEnv;
        this.mdiServiceTimeout = mdiServiceTimeoutFromEnv;
    }

    public String getSkillsUri() {
        return skillsUri;
    }

    public String getApplicationUri() {
        return applicationUri;
    }

    public Integer getMdiServiceTimeout() {
        return this.mdiServiceTimeout;
    }

    public Integer getMdiServiceRetryAttempt() {
        return this.mdiServiceRetryAttempt;
    }

}
