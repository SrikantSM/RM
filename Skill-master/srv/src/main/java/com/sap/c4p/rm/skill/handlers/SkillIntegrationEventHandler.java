package com.sap.c4p.rm.skill.handlers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.skill.services.validators.SingleSkillSourceValidator;

import skillintegrationservice.IsSkillMDIReplicationAllowedContext;
import skillintegrationservice.SkillIntegrationService_;

/**
 * Skill-integration service Event Handler
 */
@Component
@ServiceName(SkillIntegrationService_.CDS_NAME)
public class SkillIntegrationEventHandler implements EventHandler {

  private final SingleSkillSourceValidator singleSkillSourceValidator;

  @Autowired
  public SkillIntegrationEventHandler(SingleSkillSourceValidator singleSkillSourceValidator) {
    this.singleSkillSourceValidator = singleSkillSourceValidator;
  }

  /**
   * Check if MDI Replication is allowed
   * 
   * @param context - IsSkillMDIReplicationAllowedContext function Event Context
   */
  @On(event = IsSkillMDIReplicationAllowedContext.CDS_NAME)
  public void checkSkillMDIReplicationAllowed(final IsSkillMDIReplicationAllowedContext context) {
    context.setResult(singleSkillSourceValidator.checkIfMDIReplicationAllowed());
  }

}
