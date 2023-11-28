package com.sap.c4p.rm.cloudfoundry.environment;

import static com.sap.c4p.rm.TestConstants.DUMMY_APPLICATION_URL;
import static com.sap.c4p.rm.TestConstants.DUMMY_SKILLS_URL;
import static com.sap.c4p.rm.cloudfoundry.environment.CFUserProvidedEnvironment.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.core.env.Environment;
import org.springframework.web.util.UriComponentsBuilder;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.utils.Constants;

public class CFUserProvidedEnvironmentTest extends InitMocks {

    @Mock
    Environment environment;

    @Test
    @DisplayName("test applicationUrl Read when not available at the user defined variable list")
    public void testApplicationUrlReadWhenNotAvailableAtTheUserDefinedVariableList() {
        when(this.environment.getProperty(APPLICATION_URL, String.class)).thenReturn(null);
        assertThrows(NullPointerException.class, () -> new CFUserProvidedEnvironment(this.environment));
    }

    @Test
    @DisplayName("test skillsUrl Read when not available at the user defined variable list")
    public void testSkillsUrlReadWhenNotAvailableAtTheUserDefinedVariableList() {
        when(this.environment.getProperty(SKILLS_URL, String.class)).thenReturn(null);
        assertThrows(NullPointerException.class, () -> new CFUserProvidedEnvironment(this.environment));
    }

    @Test
    @DisplayName("test applicationUrl Read when APPLICATION_URL is available at the user defined variable list")
    public void testApplicationUrlReadWhenApplicationUrlIsAvailableAtTheUserDefinedVariableList() {
        when(this.environment.getProperty(APPLICATION_URL, String.class)).thenReturn(DUMMY_APPLICATION_URL);
        CFUserProvidedEnvironment cfUserProvidedEnvironment = new CFUserProvidedEnvironment(this.environment);
        assertEquals(UriComponentsBuilder.newInstance().scheme(Constants.HTTPS).host(DUMMY_APPLICATION_URL).build()
                .toUriString(), cfUserProvidedEnvironment.getApplicationUri());
        assertEquals(DEFAULT_MDI_SERVICE_TIME_OUT, cfUserProvidedEnvironment.getMdiServiceTimeout());
        assertEquals(DEFAULT_MDI_SERVICE_RETRY_ATTEMPT, cfUserProvidedEnvironment.getMdiServiceRetryAttempt());
    }

    @Test
    @DisplayName("test When user provided values are available")
    public void testWhenUserProvidedValuesAreAvailable() {
        Integer timeOutValue = 1000;
        Integer retryAttempt = 2;
        when(this.environment.getProperty(APPLICATION_URL, String.class)).thenReturn(DUMMY_APPLICATION_URL);
        when(this.environment.getProperty(SKILLS_URL, String.class)).thenReturn(DUMMY_SKILLS_URL);
        when(this.environment.getProperty(MDI_SERVICE_TIMEOUT, Integer.class)).thenReturn(timeOutValue);
        when(this.environment.getProperty(MDI_SERVICE_RETRY_ATTEMPT, Integer.class)).thenReturn(retryAttempt);
        CFUserProvidedEnvironment cfUserProvidedEnvironment = new CFUserProvidedEnvironment(this.environment);
        assertEquals(UriComponentsBuilder.newInstance().scheme(Constants.HTTPS).host(DUMMY_APPLICATION_URL).build()
                .toUriString(), cfUserProvidedEnvironment.getApplicationUri());
        assertEquals(DUMMY_SKILLS_URL, cfUserProvidedEnvironment.getSkillsUri());
        assertEquals(timeOutValue, cfUserProvidedEnvironment.getMdiServiceTimeout());
        assertEquals(retryAttempt, cfUserProvidedEnvironment.getMdiServiceRetryAttempt());
    }

}
