package com.sap.c4p.rm.skill.handlers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftSaveEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.skill.repositories.ProficiencyLevelTextRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;
import com.sap.c4p.rm.skill.services.ProficiencyLevelTextReplicationService;
import com.sap.c4p.rm.skill.services.validators.ProficiencySetValidator;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;

import proficiencyservice.CreateProficiencySetWithDialogContext;
import proficiencyservice.ProficiencyService_;
import proficiencyservice.ProficiencySets;
import proficiencyservice.ProficiencySets_;

@Component
@ServiceName(ProficiencyService_.CDS_NAME)
public class ProficiencySetHandler implements EventHandler {

  private final ProficiencySetRepository proficiencySetRepo;
  private final ProficiencyLevelTextRepository proficiencyLevelTextRepo;
  private final ProficiencySetValidator proficiencySetValidator;
  private final ProficiencyLevelTextReplicationService proficiencyLevelTextReplicationService;
  private final EventHandlerUtility eventHandlerUtility;

  @Autowired
  public ProficiencySetHandler(final ProficiencySetRepository proficiencySetRepo,
      final ProficiencyLevelTextRepository proficiencyLevelTextRepo,
      final ProficiencySetValidator proficiencySetValidator,
      final ProficiencyLevelTextReplicationService proficiencyLevelTextReplicationService,
      final EventHandlerUtility eventHandlerUtility) {
    this.proficiencySetRepo = proficiencySetRepo;
    this.proficiencyLevelTextRepo = proficiencyLevelTextRepo;
    this.proficiencySetValidator = proficiencySetValidator;
    this.proficiencyLevelTextReplicationService = proficiencyLevelTextReplicationService;
    this.eventHandlerUtility = eventHandlerUtility;
  }

  @On(event = CreateProficiencySetWithDialogContext.CDS_NAME, entity = ProficiencySets_.CDS_NAME)
  public void onCreateProficiencySetWithDialogAction(final CreateProficiencySetWithDialogContext context) {
    final ProficiencySets newProficiencyLevelSet = ProficiencySets.create();
    newProficiencyLevelSet.setDescription(context.getDescription());
    newProficiencyLevelSet.setName(context.getName());

    final ProficiencySets draftProficiencySet = this.proficiencySetRepo.createDraft(newProficiencyLevelSet);

    context.setResult(draftProficiencySet);
  }

  @After(event = { DraftService.EVENT_DRAFT_EDIT }, entity = ProficiencySets_.CDS_NAME)
  public void afterDraftEdit(final ProficiencySets proficiencySet) {
    this.proficiencySetValidator.validateIfDefaultProficiencySet(proficiencySet);
  }

  @Before(event = { CqnService.EVENT_CREATE, CqnService.EVENT_UPSERT,
      CqnService.EVENT_UPDATE }, entity = ProficiencySets_.CDS_NAME)
  public void beforeModification(final ProficiencySets proficiencySet) {
    this.proficiencySetValidator.validate(proficiencySet);
  }

  @After(event = { CqnService.EVENT_CREATE, CqnService.EVENT_UPSERT,
      CqnService.EVENT_UPDATE }, entity = ProficiencySets_.CDS_NAME)
  public void afterModification(final ProficiencySets proficiencySet) {
    this.proficiencyLevelTextReplicationService.replicateDefaultTexts(proficiencySet);
  }

  /**
   * Workaround for
   * https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/767
   *
   * Remove once the issue is fixed
   *
   * @param context {@link DraftSaveEventContext}
   */
  @Before(event = DraftService.EVENT_DRAFT_SAVE, entity = ProficiencySets_.CDS_NAME)
  public void beforeDraftSaveLocaleBugWorkaround(final DraftSaveEventContext context) {
    final ProficiencySets proficiencySet = ProficiencySets.create();
    this.eventHandlerUtility.addKeyAttributesToEntity(context.getModel(), context.getCqn(), proficiencySet);

    Optional<ProficiencySets> result = this.proficiencySetRepo.expandCompositions(proficiencySet);

    result.map(ProficiencySets::getProficiencyLevels)
        .ifPresent(this.proficiencyLevelTextRepo::deleteActiveTextsOfLevels);
  }
}
