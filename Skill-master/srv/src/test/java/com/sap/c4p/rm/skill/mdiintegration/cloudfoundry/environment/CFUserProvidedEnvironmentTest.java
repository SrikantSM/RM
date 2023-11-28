package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment;

import static com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment.CFUserProvidedEnvironment.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.core.env.Environment;

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;

public class CFUserProvidedEnvironmentTest extends InitMocks {

  @Mock
  Environment environment;

  @Test
  @DisplayName("test User defined variable list")
  public void testUserDefinedVariableList() {
    CFUserProvidedEnvironment cfUserProvidedEnvironment = new CFUserProvidedEnvironment(this.environment);
    assertEquals(DEFAULT_MDI_SERVICE_TIME_OUT, cfUserProvidedEnvironment.getMdiServiceTimeout());
    assertEquals(DEFAULT_MDI_SERVICE_RETRY_ATTEMPT, cfUserProvidedEnvironment.getMdiServiceRetryAttempt());
  }

  @Test
  @DisplayName("test When user provided values are available")
  public void testWhenUserProvidedValuesAreAvailable() {
    Integer timeOutValue = 1000;
    Integer retryAttempt = 2;
    when(this.environment.getProperty(MDI_SERVICE_TIMEOUT, Integer.class)).thenReturn(timeOutValue);
    when(this.environment.getProperty(MDI_SERVICE_RETRY_ATTEMPT, Integer.class)).thenReturn(retryAttempt);
    CFUserProvidedEnvironment cfUserProvidedEnvironment = new CFUserProvidedEnvironment(this.environment);
    assertEquals(timeOutValue, cfUserProvidedEnvironment.getMdiServiceTimeout());
    assertEquals(retryAttempt, cfUserProvidedEnvironment.getMdiServiceRetryAttempt());
  }

}
