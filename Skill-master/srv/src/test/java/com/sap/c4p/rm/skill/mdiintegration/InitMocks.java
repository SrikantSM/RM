package com.sap.c4p.rm.skill.mdiintegration;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.MockitoAnnotations;

public class InitMocks {

  private AutoCloseable autoCloseable;

  @BeforeEach
  public void openMocks() {
    autoCloseable = MockitoAnnotations.openMocks(this);
  }

  @AfterEach
  public void closeMocks() throws Exception {
    autoCloseable.close();
  }

}