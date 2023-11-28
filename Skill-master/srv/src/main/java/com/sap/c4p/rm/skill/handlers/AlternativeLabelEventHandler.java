package com.sap.c4p.rm.skill.handlers;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

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
import com.sap.c4p.rm.skill.repositories.AlternativeLabelRepository;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.services.CommaSeparatedAlternativeLabelsGenerator;
import com.sap.c4p.rm.skill.services.SkillTextReplicationService;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;
import com.sap.c4p.rm.skill.utils.HttpStatus;

import skillservice.AlternativeLabels;
import skillservice.AlternativeLabels_;
import skillservice.SkillService_;
import skillservice.Skills;

@Component
@ServiceName(SkillService_.CDS_NAME)
public class AlternativeLabelEventHandler implements EventHandler {

  private static final String SKILLID_CONTEXT_ATTRIBUTE = "skillIdOfDeletedAlternativeLabel";
  private final SkillRepository skillRepo;
  private final AlternativeLabelRepository alternativeLabelRepo;
  private final EventHandlerUtility eventHandlerUtility;
  private final SkillTextReplicationService skillTextReplicationService;
  private final CommaSeparatedAlternativeLabelsGenerator commaSeparatedAlternativeLabelsGenerator;

  @Autowired
  public AlternativeLabelEventHandler(SkillRepository skillRepo, AlternativeLabelRepository alternativeLabelRepo,
      EventHandlerUtility eventHandlerUtility, SkillTextReplicationService skillTextReplicationService,
      CommaSeparatedAlternativeLabelsGenerator commaSeparatedAlternativeLabelsGenerator) {
    this.skillRepo = skillRepo;
    this.alternativeLabelRepo = alternativeLabelRepo;
    this.eventHandlerUtility = eventHandlerUtility;
    this.skillTextReplicationService = skillTextReplicationService;
    this.commaSeparatedAlternativeLabelsGenerator = commaSeparatedAlternativeLabelsGenerator;
  }

  @Before(event = { CqnService.EVENT_CREATE, CqnService.EVENT_UPSERT, CqnService.EVENT_UPDATE,
      CqnService.EVENT_DELETE }, entity = AlternativeLabels_.CDS_NAME)
  public void beforeModification() {
    throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ACTIVE_PATCH_NOT_ALLOWED);
  }

  /**
   * Updates the alternative names of the {@link Skills} associated to the
   * {@link AlternativeLabels} that were created.
   *
   * @param alternativeLabels {@link List} of {@link AlternativeLabels} to be
   *                          passed on to
   *                          {@link AlternativeLabelEventHandler#updateTextsFromAlternativeLabels(List)}
   */
  @After(event = DraftService.EVENT_DRAFT_NEW, entity = AlternativeLabels_.CDS_NAME)
  public void afterDraftNew(final List<AlternativeLabels> alternativeLabels) {
    // Draft New on a sub-entity of the Draft Root is not creation of the draft, but
    // deletion of a sub-entity within the draft
    this.updateTextsFromAlternativeLabels(alternativeLabels);
  }

  /**
   * Make sure that attribute commaSeparatedAlternativeLabels of Skills entity
   * reflects the content of latest {@link AlternativeLabels}
   */
  @After(event = DraftService.EVENT_DRAFT_PATCH, entity = AlternativeLabels_.CDS_NAME)
  public void afterDraftPatch(final List<AlternativeLabels> alternativeLabels) {
    this.updateTextsFromAlternativeLabels(alternativeLabels);
  }

  /**
   * Updates the alternative names of the {@link Skills} associated to the
   * {@link AlternativeLabels} that were deleted. We must fetch the affected
   * {@link Skills} in @Before, as the select would be empty if we performed it
   * after the deletion of the {@link AlternativeLabels}.
   *
   * @param context {@link DraftCancelEventContext} to be passed on to
   *                {@link AlternativeLabelEventHandler#updateTextsFromSkills(List)}
   * @see AlternativeLabelEventHandler#beforeDraftCancel(DraftCancelEventContext)
   */
  @After(event = DraftService.EVENT_DRAFT_CANCEL, entity = AlternativeLabels_.CDS_NAME)
  public void afterDraftCancel(final DraftCancelEventContext context) {
    final AlternativeLabels alternativeLabel = AlternativeLabels.create();
    this.eventHandlerUtility.addKeyAttributesToEntity(context.getModel(), context.getCqn(), alternativeLabel);

    // retrieve ID of parent skill from EventContext
    final String parentSkillId = (String) context.get(AlternativeLabelEventHandler.SKILLID_CONTEXT_ATTRIBUTE);

    final Optional<Skills> parentSkill = this.skillRepo.findById(parentSkillId, Boolean.FALSE);
    List<Skills> skills = parentSkill.map(Collections::singletonList).orElseGet(Collections::emptyList);
    this.updateTextsFromSkills(skills);
  }

  /**
   * Store the ID of the skill, the deleted AlternativeLabel was attached to, in
   * the EventContext
   *
   * @param context {@link DraftCancelEventContext}
   * @see AlternativeLabelEventHandler#afterDraftCancel(DraftCancelEventContext)
   */
  @Before(event = DraftService.EVENT_DRAFT_CANCEL, entity = AlternativeLabels_.CDS_NAME)
  public void beforeDraftCancel(final DraftCancelEventContext context) {
    AlternativeLabels deletedLabel = AlternativeLabels.create();
    this.eventHandlerUtility.addKeyAttributesToEntity(context.getModel(), context.getCqn(), deletedLabel);

    // get parent skill of deleted AlternativeLabel
    final Optional<AlternativeLabels> row = this.alternativeLabelRepo.expandSkill(deletedLabel);

    if (row.isPresent()) {
      // remember ID of parent skill in EventContext
      final String parentSkillId = row.get().getSkill().getId();
      context.put(AlternativeLabelEventHandler.SKILLID_CONTEXT_ATTRIBUTE, parentSkillId);
    }
  }

  /**
   * Updates the skill texts of {@link Skills} associated with the given
   * {@link AlternativeLabels}. An update includes a replication of the default
   * language text to the skill entity and a generation of the comma-separated
   * alternative labels.
   *
   * @param labels {@link AlternativeLabels} whose parent {@link Skills} are
   *               updated
   */
  void updateTextsFromAlternativeLabels(List<AlternativeLabels> labels) {
    List<Skills> skills = this.skillRepo.findByAlternativeLabels(labels, Boolean.FALSE);
    this.updateTextsFromSkills(skills);
  }

  /**
   * Updates the skill texts of {@link Skills}. An update includes a replication
   * of the default language text to the skill entity and a generation of the
   * comma-separated alternative labels.
   *
   * @param skills {@link Skills} that are updated
   */
  void updateTextsFromSkills(List<Skills> skills) {
    List<Skills> dedupedSkills = this.eventHandlerUtility.dedupeSkillList(skills);
    this.commaSeparatedAlternativeLabelsGenerator.updateCommaSeparatedAlternativeLabels(dedupedSkills);
    this.skillTextReplicationService.replicateDefaultTexts(dedupedSkills);
  }
}
