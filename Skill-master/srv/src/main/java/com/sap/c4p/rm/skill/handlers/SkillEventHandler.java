package com.sap.c4p.rm.skill.handlers;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.EmptyResultException;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftEditEventContext;
import com.sap.cds.services.draft.DraftNewEventContext;
import com.sap.cds.services.draft.DraftSaveEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;
import com.sap.c4p.rm.skill.repositories.Catalogs2SkillsRepository;
import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.repositories.SkillTextRepository;
import com.sap.c4p.rm.skill.services.CommaSeparatedAlternativeLabelsGenerator;
import com.sap.c4p.rm.skill.services.SkillTextReplicationService;
import com.sap.c4p.rm.skill.services.SkillUriGenerator;
import com.sap.c4p.rm.skill.services.validators.SkillValidator;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;
import com.sap.c4p.rm.skill.utils.HttpStatus;
import com.sap.c4p.rm.skill.utils.LifecycleStatusCode;

import com.sap.resourcemanagement.config.DefaultLanguages;

import catalogservice.Catalogs2Skills;
import skillservice.AssignCatalogsContext;
import skillservice.CreateSkillWithDialogContext;
import skillservice.SkillService_;
import skillservice.Skills;
import skillservice.SkillsTexts;
import skillservice.Skills_;
import skillservice.UnassignCatalogsContext;

/**
 * Class to define event handlers for CDS events of the service "SkillService"
 */
@Component
@ServiceName(SkillService_.CDS_NAME)
class SkillEventHandler implements EventHandler {

  private final SkillValidator skillValidator;
  private final SkillRepository skillRepo;
  private final DefaultLanguageRepository defaultLanguageRepo;
  private final EventHandlerUtility eventHandlerUtility;
  private final SkillUriGenerator skillUriGenerator;
  private final SkillTextReplicationService skillTextReplicationService;
  private final CommaSeparatedAlternativeLabelsGenerator commaSeparatedAlternativeLabelsGenerator;
  private final Catalogs2SkillsRepository catalogs2SkillsRepository;
  private final SkillTextRepository skillTextRepo;

  @Autowired
  public SkillEventHandler(final SkillRepository skillRepo, final SkillTextRepository skillTextRepo,
      final DefaultLanguageRepository defaultLanguageRepo, final SkillValidator skillValidator,
      final EventHandlerUtility eventHandlerUtility, final SkillUriGenerator skillUriGenerator,
      final SkillTextReplicationService skillTextReplicationService,
      final CommaSeparatedAlternativeLabelsGenerator commaSeparatedAlternativeLabelsGenerator,
      final Catalogs2SkillsRepository catalogs2SkillsRepository) {
    this.skillValidator = skillValidator;
    this.skillRepo = skillRepo;
    this.skillTextRepo = skillTextRepo;
    this.defaultLanguageRepo = defaultLanguageRepo;
    this.eventHandlerUtility = eventHandlerUtility;
    this.skillUriGenerator = skillUriGenerator;
    this.skillTextReplicationService = skillTextReplicationService;
    this.commaSeparatedAlternativeLabelsGenerator = commaSeparatedAlternativeLabelsGenerator;
    this.catalogs2SkillsRepository = catalogs2SkillsRepository;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Input Validation
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Executes validations before a modification to skills is saved
   *
   * @param skills {@link List} of {@link Skills}
   */
  @Before(event = { CqnService.EVENT_CREATE, CqnService.EVENT_UPSERT,
      CqnService.EVENT_UPDATE }, entity = Skills_.CDS_NAME)
  public void beforeModification(final List<Skills> skills) {
    for (final Skills skill : skills) {
      if (skill.getLifecycleStatusCode() == null) {
        skill.setLifecycleStatusCode(LifecycleStatusCode.UNRESTRICTED.getCode());
      }
    }
    for (final Skills skill : skills) {
      this.skillValidator.validate(skill);
    }
  }

  /**
   * Updates name, description and commaSeparatedAlternativeLabels of the
   * {@link Skills} that was modified.
   *
   * @param context {@link DraftSaveEventContext}
   * @param skills  {@link List} of {@link Skills}
   */
  @After(event = { CqnService.EVENT_CREATE, CqnService.EVENT_UPSERT,
      CqnService.EVENT_UPDATE }, entity = Skills_.CDS_NAME)
  public void afterModification(final EventContext context, final List<Skills> skills) {
    List<Skills> changedSkills = skills;
    changedSkills = this.commaSeparatedAlternativeLabelsGenerator.updateCommaSeparatedAlternativeLabels(changedSkills);
    changedSkills = this.skillTextReplicationService.replicateDefaultTexts(changedSkills);

    this.eventHandlerUtility.enhanceSkillResult(eventHandlerUtility.getResultFromEventContext(context), changedSkills);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Skill Creation
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * This method is called when a new {@link Skills} should be created via the
   * NewAction bound to the "Create" button on the Fiori Elements List Report. The
   * NewAction is a custom action bound to the collection it is supposed to
   * create, returning the created Skill draft.
   *
   * @param context {@link CreateSkillWithDialogContext}
   */
  @On(event = CreateSkillWithDialogContext.CDS_NAME, entity = Skills_.CDS_NAME)
  public void onCreateSkillWithDialogAction(final CreateSkillWithDialogContext context) {
    DefaultLanguages defaultLanguage = this.defaultLanguageRepo.findActiveEntityByRank(0)
        .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_DEFAULT_LANGUAGE));

    final Skills newSkill = Skills.create();
    newSkill.setExternalID(this.skillUriGenerator.generateRandomUri());
    newSkill.setTexts(new ArrayList<>());

    final SkillsTexts newText = SkillsTexts.create();
    newText.setName(context.getLabel());
    newText.setLocale(defaultLanguage.getLanguageCode());
    newText.setDescription(context.getDescription());

    newSkill.getTexts().add(newText);

    newSkill.setName(context.getLabel());
    newSkill.setDescription(context.getDescription());

    Skills draftSkill = this.skillRepo.createDraft(newSkill);
    context.setResult(draftSkill);
  }

  @On(event = AssignCatalogsContext.CDS_NAME, entity = Skills_.CDS_NAME)
  public void onAssignCatalogsToSkill(final AssignCatalogsContext context) {
    Skills skill = Skills.create();
    this.eventHandlerUtility.addKeyAttributesToEntity(context.getModel(), context.getCqn(), skill);
    skill = this.skillRepo.findById(skill.getId(), skill.getIsActiveEntity())
        .orElseThrow(() -> new EmptyResultException("Result is empty"));
    // Disallow catalog assignment for a skill replicated from MDI
    if (!IsNullCheckUtils.isNullOrEmpty(skill.get("OID"))) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.SKILL_FROM_MDICANNOT_BE_MAINTAINED);
    }

    boolean successfulAssignments = false;
    for (String catalogId : context.getCatalogIDs()) {
      if (this.skillValidator.isValidForCatalog2SkillAssignment(catalogId)) {
        Catalogs2Skills catalogAssignment = Catalogs2Skills.create();
        catalogAssignment.setId(UUID.randomUUID().toString());
        catalogAssignment.setCatalogId(catalogId);
        catalogAssignment.setSkillId(skill.getId());
        this.catalogs2SkillsRepository.createActiveEntity(catalogAssignment);
        successfulAssignments = true;
      }
    }
    if (successfulAssignments) {
      context.getMessages().success(MessageKeys.SUCCESSFUL_CATALOG_ASSIGNMENT);
    } else {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CATALOG2SKILL_ASSIGNMENT_ONLY_DRAFT_CATALOGS);
    }
    context.setCompleted();
  }

  @On(event = UnassignCatalogsContext.CDS_NAME, entity = Skills_.CDS_NAME)
  public void onUnassignCatalogsToSkill(final UnassignCatalogsContext context) {
    Skills skill = Skills.create();
    this.eventHandlerUtility.addKeyAttributesToEntity(context.getModel(), context.getCqn(), skill);
    skill = this.skillRepo.findById(skill.getId(), skill.getIsActiveEntity())
        .orElseThrow(() -> new EmptyResultException("Result is empty"));
    // Disallow catalog un-assignment for a skill replicated from MDI
    if (!IsNullCheckUtils.isNullOrEmpty(skill.get("OID"))) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.SKILL_FROM_MDICANNOT_BE_MAINTAINED);
    }

    boolean successfulUnassignments = false;
    for (String catalogId : context.getCatalogIDs()) {
      if (this.skillValidator.isValidForCatalog2SkillAssignment(catalogId)) {
        this.catalogs2SkillsRepository.deleteBySkillIdAndCatalogId(skill.getId(), catalogId);
        successfulUnassignments = true;
      }
    }
    if (successfulUnassignments) {
      context.getMessages().success(MessageKeys.SUCCESSFUL_CATALOG_UNASSIGNMENT);
    } else {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CATALOG2SKILL_ASSIGNMENT_ONLY_DRAFT_CATALOGS);
    }
    context.setCompleted();
  }

  /**
   * Updates name, description and commaSeparatedAlternativeLabels of the
   * {@link Skills} that was created.
   *
   * @param context {@link DraftNewEventContext}
   * @param skills  {@link List} of {@link Skills}
   */
  @After(event = DraftService.EVENT_DRAFT_NEW, entity = Skills_.CDS_NAME)
  public void afterDraftNew(DraftNewEventContext context, List<Skills> skills) {
    List<Skills> changedSkills = skills;
    changedSkills = this.commaSeparatedAlternativeLabelsGenerator.updateCommaSeparatedAlternativeLabels(changedSkills);
    changedSkills = this.skillTextReplicationService.replicateDefaultTexts(changedSkills);

    this.eventHandlerUtility.enhanceSkillResult(context.getResult(), changedSkills);
  }

  /**
   * Updates name, description and commaSeparatedAlternativeLabels of the
   * {@link Skills} that was updated.
   *
   * @param context {@link DraftEditEventContext}
   * @param skills  {@link List} of {@link Skills}
   */
  @After(event = DraftService.EVENT_DRAFT_EDIT, entity = Skills_.CDS_NAME)
  public void afterDraftEdit(final DraftEditEventContext context, final List<Skills> skills) {
    List<Skills> changedSkills = skills;
    changedSkills = this.commaSeparatedAlternativeLabelsGenerator.updateCommaSeparatedAlternativeLabels(changedSkills);
    changedSkills = this.skillTextReplicationService.replicateDefaultTexts(changedSkills);

    this.eventHandlerUtility.enhanceSkillResult(context.getResult(), changedSkills);
  }

  /**
   * Workaround for
   * https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/767
   *
   * Remove once the issue is fixed
   *
   * @param context {@link DraftSaveEventContext}
   */
  @Before(event = DraftService.EVENT_DRAFT_SAVE, entity = Skills_.CDS_NAME)
  public void beforeDraftSaveLocaleBugWorkaround(final DraftSaveEventContext context) {
    final Skills skill = Skills.create();
    this.eventHandlerUtility.addKeyAttributesToEntity(context.getModel(), context.getCqn(), skill);

    this.skillTextRepo.deleteActiveTextsOfSkill(skill);
  }
}
