package com.sap.c4p.rm.skill.handlers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftCancelEventContext;
import com.sap.cds.services.draft.DraftPatchEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.ProficiencyLevelRepository;
import com.sap.c4p.rm.skill.services.ProficiencyLevelTextReplicationService;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;
import com.sap.c4p.rm.skill.utils.HttpStatus;

import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevelsTexts;
import proficiencyservice.ProficiencyLevelsTexts_;
import proficiencyservice.ProficiencyService_;

@Component
@ServiceName(ProficiencyService_.CDS_NAME)
public class ProficiencyLevelTextHandler implements EventHandler {

  private final ProficiencyLevelRepository proficiencyLevelRepository;
  private final ProficiencyLevelTextReplicationService proficiencyLevelTextReplicationService;
  private final EventHandlerUtility eventHandlerUtility;

  private static final String DELETED_TEXT_PARENTS = "DELETED_TEXT_PARENTS";

  public ProficiencyLevelTextHandler(final EventHandlerUtility eventHandlerUtility,
      final ProficiencyLevelTextReplicationService proficiencyLevelTextReplicationService,
      final ProficiencyLevelRepository proficiencyLevelRepository) {
    this.eventHandlerUtility = eventHandlerUtility;
    this.proficiencyLevelRepository = proficiencyLevelRepository;
    this.proficiencyLevelTextReplicationService = proficiencyLevelTextReplicationService;
  }

  @Before(event = { CqnService.EVENT_CREATE, CqnService.EVENT_UPSERT, CqnService.EVENT_UPDATE,
      CqnService.EVENT_DELETE }, entity = ProficiencyLevelsTexts_.CDS_NAME)
  public void beforeModification() {
    throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ACTIVE_PATCH_NOT_ALLOWED);
  }

  @After(event = DraftService.EVENT_DRAFT_PATCH, entity = ProficiencyLevelsTexts_.CDS_NAME)
  public void afterDraftPatch(final DraftPatchEventContext context, final List<ProficiencyLevelsTexts> texts) {
    final List<ProficiencyLevels> expandedProficiencyLevels = texts.stream()
        .flatMap(text -> this.proficiencyLevelRepository.findByProficiencyLevelText(text).stream())
        .collect(Collectors.toList());

    this.proficiencyLevelTextReplicationService
        .replicateDefaultTexts(this.eventHandlerUtility.dedupeProficiencyLevelList(expandedProficiencyLevels));
  }

  /**
   * Called before a proficiencyLevel text draft is deleted to get its parent
   * {@link ProficiencyLevels}, storing it in the Event Context
   *
   * @param context CAP Event Context
   */
  @Before(event = DraftService.EVENT_DRAFT_CANCEL, entity = ProficiencyLevelsTexts_.CDS_NAME)
  public void beforeDraftCancel(final DraftCancelEventContext context) {
    ProficiencyLevelsTexts text = ProficiencyLevelsTexts.create();
    this.eventHandlerUtility.addKeyAttributesToEntity(context.getModel(), context.getCqn(), text);

    List<ProficiencyLevels> levels = this.proficiencyLevelRepository.findByProficiencyLevelText(text);
    // at this point, the deleted text is still present, so we must remove it
    levels.forEach(level -> this.removeDeletedText(level, text));
    context.put(DELETED_TEXT_PARENTS, levels);
  }

  /**
   * Called whenever a proficiencyLevel text draft is deleted and then invokes
   * {@link ProficiencyLevelTextReplicationService#replicateDefaultTexts(List)}
   * (List)} on their parent {@link ProficiencyLevels}
   *
   * @param context CAP Event Context for Draft Cancel
   */
  @SuppressWarnings("unchecked") // to read list with generics from the context
  @After(event = DraftService.EVENT_DRAFT_CANCEL, entity = ProficiencyLevelsTexts_.CDS_NAME)
  public void afterDraftCancel(final DraftCancelEventContext context) {
    proficiencyLevelTextReplicationService
        .replicateDefaultTexts((List<ProficiencyLevels>) context.get(DELETED_TEXT_PARENTS));
  }

  void removeDeletedText(ProficiencyLevels level, ProficiencyLevelsTexts deletedText) {
    level.setTexts(level.getTexts().stream().filter(t -> !deletedText.getIDTexts().equals(t.getIDTexts()))
        .collect(Collectors.toList()));
  }
}
