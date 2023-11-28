package com.sap.c4p.rm.skill.handlers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftCancelEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.services.SkillTextReplicationService;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;
import com.sap.c4p.rm.skill.utils.HttpStatus;

import skillservice.SkillService_;
import skillservice.Skills;
import skillservice.SkillsTexts;
import skillservice.SkillsTexts_;

@Component
@ServiceName(SkillService_.CDS_NAME)
public class SkillTextEventHandler implements EventHandler {

  private final EventHandlerUtility eventHandlerUtility;
  private final SkillTextReplicationService skillTextReplicationService;
  private final SkillRepository skillRepository;

  private static final String DELETED_TEXT_PARENTS = "DELETED_TEXT_PARENTS";

  @Autowired
  public SkillTextEventHandler(final EventHandlerUtility eventHandlerUtility,
      final SkillTextReplicationService skillTextReplicationService, final SkillRepository skillRepository) {
    this.eventHandlerUtility = eventHandlerUtility;
    this.skillTextReplicationService = skillTextReplicationService;
    this.skillRepository = skillRepository;
  }

  @Before(event = { CqnService.EVENT_CREATE, CqnService.EVENT_UPSERT, CqnService.EVENT_UPDATE,
      CqnService.EVENT_DELETE }, entity = SkillsTexts_.CDS_NAME)
  public void beforeModification() {
    throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ACTIVE_PATCH_NOT_ALLOWED);
  }

  /**
   * Called whenever a skill text draft is patched and then invokes
   * {@link SkillTextReplicationService#replicateDefaultTexts(List)} (List)} on
   * their parent {@link Skills}
   *
   * @param texts {@link List} of {@link SkillsTexts} to be used to get their
   *              parent {@link Skills}
   */
  @After(event = DraftService.EVENT_DRAFT_PATCH, entity = SkillsTexts_.CDS_NAME)
  public void afterDraftPatch(final List<SkillsTexts> texts) {
    List<Skills> expandedSkills = texts.stream().flatMap(text -> this.skillRepository.findBySkillText(text).stream())
        .collect(Collectors.toList());

    this.skillTextReplicationService.replicateDefaultTexts(this.eventHandlerUtility.dedupeSkillList(expandedSkills));
  }

  /**
   * Called before a skill text draft is deleted to get its parent {@link Skills},
   * storing it in the Event Context
   *
   * @param context CAP Event Context
   */
  @Before(event = DraftService.EVENT_DRAFT_CANCEL, entity = SkillsTexts_.CDS_NAME)
  public void beforeDraftCancel(final DraftCancelEventContext context) {
    SkillsTexts text = SkillsTexts.create();
    this.eventHandlerUtility.addKeyAttributesToEntity(context.getModel(), context.getCqn(), text);

    List<Skills> skills = this.skillRepository.findBySkillText(text);
    // at this point, the deleted text is still present, so we must remove it
    skills.forEach(skill -> this.removeDeletedText(skill, text));
    context.put(DELETED_TEXT_PARENTS, skills);
  }

  /**
   * Called whenever a skill text draft is deleted and then invokes
   * {@link SkillTextReplicationService#replicateDefaultTexts(List)} (List)} on
   * their parent {@link Skills}
   *
   * @param context CAP Event Context for Draft Cancel
   */
  @SuppressWarnings("unchecked") // to read list with generics from the context
  @After(event = DraftService.EVENT_DRAFT_CANCEL, entity = SkillsTexts_.CDS_NAME)
  public void afterDraftCancel(final DraftCancelEventContext context) {
    skillTextReplicationService.replicateDefaultTexts((List<Skills>) context.get(DELETED_TEXT_PARENTS));
  }

  void removeDeletedText(Skills skill, SkillsTexts deletedText) {
    skill.setTexts(skill.getTexts().stream().filter(t -> !deletedText.getIDTexts().equals(t.getIDTexts()))
        .collect(Collectors.toList()));
  }
}
