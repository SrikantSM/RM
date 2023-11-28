package com.sap.c4p.rm.skill.handlers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.EmptyResultException;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;
import com.sap.c4p.rm.skill.utils.HttpStatus;
import com.sap.c4p.rm.skill.utils.LifecycleStatusCode;

import skillservice.RemoveRestrictionContext;
import skillservice.RestrictContext;
import skillservice.SkillService_;
import skillservice.Skills;
import skillservice.Skills_;

@Component
@ServiceName(SkillService_.CDS_NAME)
public class RestrictionHandler implements EventHandler {

  private final EventHandlerUtility eventHandlerUtility;
  private final SkillRepository skillRepository;

  @Autowired
  public RestrictionHandler(final EventHandlerUtility eventHandlerUtility, final SkillRepository skillRepository) {
    this.eventHandlerUtility = eventHandlerUtility;
    this.skillRepository = skillRepository;
  }

  /**
   * This method is called when a {@link Skills} is restricted. It validates the
   * request and sets the lifecycle status accordingly.
   *
   * @param context {@link RestrictContext}
   */
  @On(event = RestrictContext.CDS_NAME, entity = Skills_.CDS_NAME)
  public void onRestrict(final RestrictContext context) {
    Skills skill = Skills.create();

    this.eventHandlerUtility.addKeyAttributesToEntity(context.getModel(), context.getCqn(), skill);
    skill = this.skillRepository.findById(skill.getId(), skill.getIsActiveEntity())
        .orElseThrow(() -> new EmptyResultException("Result is empty"));

    if (skill.getOid() != null) {
      throw new ServiceException(HttpStatus.CONFLICT, MessageKeys.SKILL_FROM_MDICANNOT_RESTRICT);
    }

    if (Boolean.FALSE.equals(skill.getIsActiveEntity())) {
      throw new ServiceException(HttpStatus.CONFLICT, MessageKeys.SKILL_IN_DRAFT_NO_RESTRICT);
    }
    Integer lifecycleStatusCode = Optional.ofNullable(skill.getLifecycleStatusCode()).orElse(0);
    if (lifecycleStatusCode.equals(LifecycleStatusCode.RESTRICTED.getCode())) {
      throw new ServiceException(HttpStatus.CONFLICT, MessageKeys.SKILL_ALREADY_RESTRICTED);
    }
    skill.setLifecycleStatusCode(LifecycleStatusCode.RESTRICTED.getCode());

    Skills shallowSkill = Skills.create();
    shallowSkill.setId(skill.getId());
    shallowSkill.setLifecycleStatusCode(skill.getLifecycleStatusCode());
    this.skillRepository.updateActiveEntity(shallowSkill);

    context.getMessages().success(MessageKeys.SKILL_IS_RESTRICTED);
    context.setResult(skill);
  }

  /**
   * This method is called when a {@link Skills} is unrestricted. It validates the
   * request and sets the lifecycle status accordingly.
   *
   * @param context {@link RestrictContext}
   */
  @On(event = RemoveRestrictionContext.CDS_NAME, entity = Skills_.CDS_NAME)
  public void onRemoveRestriction(final RemoveRestrictionContext context) {
    Skills skill = Skills.create();

    this.eventHandlerUtility.addKeyAttributesToEntity(context.getModel(), context.getCqn(), skill);
    skill = this.skillRepository.findById(skill.getId(), skill.getIsActiveEntity())
        .orElseThrow(() -> new EmptyResultException("Result is empty"));

    if (skill.getOid() != null) {
      throw new ServiceException(HttpStatus.CONFLICT, MessageKeys.SKILL_FROM_MDICANNOT_REMOVE_RESTRICT);
    }
    if (Boolean.FALSE.equals(skill.getIsActiveEntity())) {
      throw new ServiceException(HttpStatus.CONFLICT, MessageKeys.SKILL_IN_DRAFT_NO_REMOVE_RESTRICTION);
    }
    Integer lifecycleStatusCode = Optional.ofNullable(skill.getLifecycleStatusCode()).orElse(1);
    if (lifecycleStatusCode.equals(LifecycleStatusCode.UNRESTRICTED.getCode())) {
      throw new ServiceException(HttpStatus.CONFLICT, MessageKeys.SKILL_NOT_RESTRICTED);
    }
    skill.setLifecycleStatusCode(LifecycleStatusCode.UNRESTRICTED.getCode());

    Skills shallowSkill = Skills.create();
    shallowSkill.setId(skill.getId());
    shallowSkill.setLifecycleStatusCode(skill.getLifecycleStatusCode());
    this.skillRepository.updateActiveEntity(shallowSkill);

    context.getMessages().success(MessageKeys.SKILL_IS_UNRESTRICTED);
    context.setResult(skill);
  }
}
