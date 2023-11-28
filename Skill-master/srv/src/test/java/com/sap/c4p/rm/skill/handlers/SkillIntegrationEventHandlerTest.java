package com.sap.c4p.rm.skill.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.c4p.rm.skill.services.validators.SingleSkillSourceValidator;

import skillintegrationservice.IsSkillMDIReplicationAllowedContext;

public class SkillIntegrationEventHandlerTest {

  private SkillIntegrationEventHandler cut;

  private SingleSkillSourceValidator mockSingleSkillSourceValidator;

  @BeforeEach
  void beforeEach() {
    this.mockSingleSkillSourceValidator = mock(SingleSkillSourceValidator.class);
    this.cut = new SkillIntegrationEventHandler(mockSingleSkillSourceValidator);
  }

  @Test
  @DisplayName("check skill replication is allowed when the pre-validation is passed")
  void checkSkillReplicationAllowedPositive() {
    final IsSkillMDIReplicationAllowedContext eventContext = IsSkillMDIReplicationAllowedContext.create();
    doReturn(Boolean.TRUE).when(mockSingleSkillSourceValidator).checkIfMDIReplicationAllowed();
    this.cut.checkSkillMDIReplicationAllowed(eventContext);
    assertEquals(Boolean.TRUE, eventContext.getResult());
  }

  @Test
  @DisplayName("check skill replication is NOT allowed when the pre-validation is passed")
  void checkSkillReplicationAllowedNegative() {
    final IsSkillMDIReplicationAllowedContext eventContext = IsSkillMDIReplicationAllowedContext.create();
    doReturn(Boolean.FALSE).when(mockSingleSkillSourceValidator).checkIfMDIReplicationAllowed();
    this.cut.checkSkillMDIReplicationAllowed(eventContext);
    assertEquals(Boolean.FALSE, eventContext.getResult());
  }
}
