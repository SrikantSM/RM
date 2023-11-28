package com.sap.c4p.rm.skill.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatchers;

import com.sap.cds.EmptyResultException;
import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftEditEventContext;
import com.sap.cds.services.draft.DraftNewEventContext;
import com.sap.cds.services.draft.DraftSaveEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.skill.repositories.Catalogs2SkillsRepository;
import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.repositories.SkillTextRepository;
import com.sap.c4p.rm.skill.services.CommaSeparatedAlternativeLabelsGenerator;
import com.sap.c4p.rm.skill.services.SkillTextReplicationService;
import com.sap.c4p.rm.skill.services.SkillUriGenerator;
import com.sap.c4p.rm.skill.services.validators.SkillValidator;
import com.sap.c4p.rm.skill.utils.CatalogTestHelper;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import com.sap.resourcemanagement.config.DefaultLanguages;

import catalogservice.Catalogs;
import catalogservice.Catalogs2Skills;
import skillservice.AssignCatalogsContext;
import skillservice.CreateSkillWithDialogContext;
import skillservice.Skills;
import skillservice.UnassignCatalogsContext;

class SkillEventHandlerTest {
  /* object under test */
  private SkillEventHandler cut;
  private SkillEventHandler spiedCut;

  /* mocks */
  private SkillValidator mockSkillValidator;
  private SkillRepository mockSkillRepo;
  private SkillTextRepository mockSkillTextRepo;
  private DefaultLanguageRepository mockDefaultLanguageRepo;
  private SkillUriGenerator mockSkillUriGenerator;
  private SkillTextReplicationService mockSkillTextReplicationService;
  private CommaSeparatedAlternativeLabelsGenerator mockCommaSeparatedAlternativeLabelsGenerator;
  private EventHandlerUtility mockEventHandlerUtility;
  private Catalogs2SkillsRepository mockCatalogs2SkillsRepository;

  /**
   * initialize object under test
   */
  @BeforeEach
  void beforeEach() {
    this.mockCatalogs2SkillsRepository = mock(Catalogs2SkillsRepository.class);
    this.mockSkillValidator = mock(SkillValidator.class);

    final DefaultLanguages defaultLanguage = DefaultLanguages.create();
    defaultLanguage.setLanguageCode(SkillTestHelper.LANGUAGE_CODE_EN);

    // mock SkillRepo
    this.mockSkillRepo = mock(SkillRepository.class);
    when(this.mockSkillRepo.expandCompositions(ArgumentMatchers.<List<Skills>>any()))
        .thenAnswer(i -> i.getArguments()[0]);
    when(this.mockSkillRepo.createDraft(any(Skills.class))).thenAnswer(i -> i.getArguments()[0]);

    // mock SkillTextRepo
    this.mockSkillTextRepo = mock(SkillTextRepository.class);

    // mock DefaultLanguageRepo
    this.mockDefaultLanguageRepo = mock(DefaultLanguageRepository.class);
    when(this.mockDefaultLanguageRepo.findActiveEntityByRank(anyInt())).thenReturn(Optional.of(defaultLanguage));

    // mock SkillUriGenerator
    this.mockSkillUriGenerator = mock(SkillUriGenerator.class);
    when(this.mockSkillUriGenerator.generateRandomUri()).thenReturn(SkillTestHelper.SKILL_EXTERNAL_ID);

    // mock SkillTextReplicationService
    this.mockSkillTextReplicationService = mock(SkillTextReplicationService.class);

    // mock CommaSeparatedAlternativeLabelsGenerator
    this.mockCommaSeparatedAlternativeLabelsGenerator = mock(CommaSeparatedAlternativeLabelsGenerator.class);

    // mock EventHandlerUtility
    this.mockEventHandlerUtility = mock(EventHandlerUtility.class);

    this.cut = new SkillEventHandler(this.mockSkillRepo, this.mockSkillTextRepo, this.mockDefaultLanguageRepo,
        this.mockSkillValidator, this.mockEventHandlerUtility, this.mockSkillUriGenerator,
        this.mockSkillTextReplicationService, this.mockCommaSeparatedAlternativeLabelsGenerator,
        this.mockCatalogs2SkillsRepository);
    this.spiedCut = spy(this.cut);
  }

  @Test
  @DisplayName("verify that beforeSkillModification() invokes all expected methods")
  void beforeModification() {
    Skills skill = SkillTestHelper.createSkill();
    SkillTestHelper.addTextsToSkill(skill, 1, "de", false);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", false);
    SkillTestHelper.addLabelsToSkill(skill, 3, "de", false);

    this.cut.beforeModification(Collections.singletonList(skill));

    verify(this.mockSkillValidator).validate(skill);
  }

  @Test
  @DisplayName("check behavior of onCreateSkillWithDialogAction()")
  void onCreateSkillWithDialogAction() {
    // create expected skill (and label)
    final Skills expectedSkill = SkillTestHelper.createSkill();
    expectedSkill.setName(SkillTestHelper.SKILL_NAME + "_" + SkillTestHelper.LANGUAGE_CODE_EN + "0");
    expectedSkill.setDescription(SkillTestHelper.SKILL_DESCRIPTION + "_" + SkillTestHelper.LANGUAGE_CODE_EN + "0");
    expectedSkill.remove("ID");
    expectedSkill.remove("IsActiveEntity");
    SkillTestHelper.addTextsToSkill(expectedSkill, 1);
    expectedSkill.getTexts().get(0).remove("ID");
    expectedSkill.getTexts().get(0).remove("IsActiveEntity");

    // mock context
    final CreateSkillWithDialogContext mockContext = mock(CreateSkillWithDialogContext.class);
    when(mockContext.getDescription()).thenReturn(expectedSkill.getTexts().get(0).getDescription());
    when(mockContext.getLabel()).thenReturn(expectedSkill.getTexts().get(0).getName());

    // mock draftService
    final DraftService mockService = mock(DraftService.class);
    final Result fakeResult = mock(Result.class);
    when(mockService.newDraft(any(CqnInsert.class))).thenReturn(fakeResult);
    when(fakeResult.single(Skills.class)).thenReturn(expectedSkill);
    when(mockContext.getService()).thenReturn(mockService);

    // act
    this.cut.onCreateSkillWithDialogAction(mockContext);

    // createDraft method should be called once
    final ArgumentCaptor<Skills> captorSkills = ArgumentCaptor.forClass(Skills.class);
    verify(this.mockSkillRepo, times(1)).createDraft(captorSkills.capture());

    // check that the right parameters have been used
    assertEquals(expectedSkill, captorSkills.getValue());

    verify(mockContext, times(1)).setResult(captorSkills.capture());
    assertEquals(expectedSkill, captorSkills.getValue());
  }

  @Test
  @DisplayName("check behaviour of onAssignCatalogsToSkill() with no draft catalog")
  void onAssignCatalogsToSkillNoDraft() {
    final Skills skill = SkillTestHelper.createSkill();
    final Catalogs catalog = CatalogTestHelper.createCatalog();
    final AssignCatalogsContext mockContext = mock(AssignCatalogsContext.class);
    final Messages mockMessages = mock(Messages.class);
    final Catalogs2Skills catalogs2Skill = Catalogs2Skills.create();
    catalogs2Skill.setSkillId(skill.getId());
    catalogs2Skill.setCatalogId(catalog.getId());

    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockContext.getCatalogIDs()).thenReturn(Collections.singletonList(catalog.getId()));
    when(this.mockSkillRepo.findById(any(), any())).thenReturn(Optional.of(skill));
    when(this.mockSkillValidator.isValidForCatalog2SkillAssignment(any())).thenReturn(true);

    this.cut.onAssignCatalogsToSkill(mockContext);
    final ArgumentCaptor<Catalogs2Skills> captorCatalogs2Skills = ArgumentCaptor.forClass(Catalogs2Skills.class);
    verify(mockContext, times(1)).setCompleted();
    verify(this.mockCatalogs2SkillsRepository, times(1)).createActiveEntity(captorCatalogs2Skills.capture());
    verify(mockContext, times(1)).getMessages();

    assertEquals(catalogs2Skill.getCatalogId(), captorCatalogs2Skills.getValue().getCatalogId());
    assertEquals(catalogs2Skill.getSkillId(), captorCatalogs2Skills.getValue().getSkillId());
  }

  @Test
  @DisplayName("check behaviour of onAssignCatalogsToSkill() for a Skill replicated from MDI")
  void onAssignCatalogsToMDISkill() {
    final Skills skill = SkillTestHelper.createSkill();
    final Catalogs catalog = CatalogTestHelper.createCatalog();
    final AssignCatalogsContext mockContext = mock(AssignCatalogsContext.class);
    final Messages mockMessages = mock(Messages.class);
    final Catalogs2Skills catalogs2Skill = Catalogs2Skills.create();
    skill.setOid("MDI-OID");
    catalogs2Skill.setSkillId(skill.getId());
    catalogs2Skill.setCatalogId(catalog.getId());

    when(mockContext.getCatalogIDs()).thenReturn(Collections.singletonList(catalog.getId()));
    when(this.mockSkillRepo.findById(any(), any())).thenReturn(Optional.of(skill));

    assertThrows(ServiceException.class, () -> this.cut.onAssignCatalogsToSkill(mockContext));
  }

  @Test
  @DisplayName("check behaviour of onUnassignCatalogsToSkill() for a Skill replicated from MDI")
  void onUnassignCatalogsToMDISkill() {
    final Skills skill = SkillTestHelper.createSkill();
    final Catalogs catalog = CatalogTestHelper.createCatalog();
    final UnassignCatalogsContext mockContext = mock(UnassignCatalogsContext.class);
    final Catalogs2Skills catalogs2Skill = Catalogs2Skills.create();
    skill.setOid("MDI-OID");
    catalogs2Skill.setSkillId(skill.getId());
    catalogs2Skill.setCatalogId(catalog.getId());

    when(mockContext.getCatalogIDs()).thenReturn(Collections.singletonList(catalog.getId()));
    when(this.mockSkillRepo.findById(any(), any())).thenReturn(Optional.of(skill));

    assertThrows(ServiceException.class, () -> this.cut.onUnassignCatalogsToSkill(mockContext));
  }

  @Test
  @DisplayName("check behaviour of onAssignCatalogsToSkill() with draft catalog")
  void onAssignCatalogsToSkillWithDraft() {
    final Skills skill = SkillTestHelper.createSkill();
    final Catalogs catalog = CatalogTestHelper.createCatalog();
    final AssignCatalogsContext mockContext = mock(AssignCatalogsContext.class);

    when(mockContext.getCatalogIDs()).thenReturn(Collections.singletonList(catalog.getId()));
    when(this.mockSkillRepo.findById(any(), any())).thenReturn(Optional.of(skill));
    when(this.mockSkillValidator.isValidForCatalog2SkillAssignment(any())).thenReturn(false);

    assertThrows(ServiceException.class, () -> this.cut.onAssignCatalogsToSkill(mockContext));
    verify(this.mockCatalogs2SkillsRepository, times(0)).createActiveEntity(any());

  }

  @Test
  @DisplayName("check behaviour of onAssignCatalogsToSkill() with not existing skill")
  void onAssignCatalogsToSkillWithSkillDoesNotExist() {
    final AssignCatalogsContext mockContext = mock(AssignCatalogsContext.class);

    when(mockContext.getCatalogIDs()).thenReturn(Collections.singletonList(UUID.randomUUID().toString()));
    when(this.mockSkillRepo.findById(any(), any())).thenReturn(Optional.empty());

    assertThrows(EmptyResultException.class, () -> this.cut.onAssignCatalogsToSkill(mockContext));
  }

  @Test
  @DisplayName("check behaviour of onUnassignCatalogsToSkill() with no draft catalog")
  void onUnassignCatalogsToSkillNoDraft() {
    final Skills skill = SkillTestHelper.createSkill();
    final Catalogs catalog = CatalogTestHelper.createCatalog();
    final UnassignCatalogsContext mockContext = mock(UnassignCatalogsContext.class);
    final Messages mockMessages = mock(Messages.class);

    when(mockContext.getMessages()).thenReturn(mockMessages);
    when(mockContext.getCatalogIDs()).thenReturn(Collections.singletonList(catalog.getId()));
    when(this.mockSkillRepo.findById(any(), any())).thenReturn(Optional.of(skill));
    when(this.mockSkillValidator.isValidForCatalog2SkillAssignment(any())).thenReturn(true);

    this.cut.onUnassignCatalogsToSkill(mockContext);
    final ArgumentCaptor<String> idCaptor = ArgumentCaptor.forClass(String.class);
    verify(mockContext, times(1)).setCompleted();
    verify(this.mockCatalogs2SkillsRepository, times(1)).deleteBySkillIdAndCatalogId(idCaptor.capture(),
        idCaptor.capture());
    verify(mockContext, times(1)).getMessages();

    assertEquals(skill.getId(), idCaptor.getAllValues().get(0));
    assertEquals(catalog.getId(), idCaptor.getAllValues().get(1));
  }

  @Test
  @DisplayName("check behaviour of onUnassignCatalogsToSkill() with draft catalog")
  void onUnassignCatalogsToSkillWithDraft() {
    final Skills skill = SkillTestHelper.createSkill();
    final Catalogs catalog = CatalogTestHelper.createCatalog();
    final UnassignCatalogsContext mockContext = mock(UnassignCatalogsContext.class);

    when(mockContext.getCatalogIDs()).thenReturn(Collections.singletonList(catalog.getId()));
    when(this.mockSkillRepo.findById(any(), any())).thenReturn(Optional.of(skill));
    when(this.mockSkillValidator.isValidForCatalog2SkillAssignment(any())).thenReturn(false);

    assertThrows(ServiceException.class, () -> this.cut.onUnassignCatalogsToSkill(mockContext));
    verify(this.mockCatalogs2SkillsRepository, times(0)).deleteBySkillIdAndCatalogId(any(), any());
    verify(mockContext, times(0)).getMessages();
  }

  @Test
  @SuppressWarnings("unchecked")
  @DisplayName("EventHandler: After Skill Draft Creation")
  void afterDraftNew() throws Exception {
    final Skills mockSkill = SkillTestHelper.createSkill();
    final List<Skills> mockSkillList = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillListResult1 = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillListResult2 = Collections.singletonList(mockSkill);

    when(this.mockCommaSeparatedAlternativeLabelsGenerator.updateCommaSeparatedAlternativeLabels(mockSkillList))
        .thenReturn(mockSkillListResult1);
    when(this.mockSkillTextReplicationService.replicateDefaultTexts(mockSkillListResult1))
        .thenReturn(mockSkillListResult2);

    final DraftNewEventContext mockContext = mock(DraftNewEventContext.class);

    Result result = mock(Result.class);
    when(mockContext.getResult()).thenReturn(result);

    this.spiedCut.afterDraftNew(mockContext, mockSkillList);

    final ArgumentCaptor<List<Skills>> captorList = ArgumentCaptor.forClass(List.class);

    verify(this.mockEventHandlerUtility, times(1)).enhanceSkillResult(eq(result), captorList.capture());
    verify(this.mockCommaSeparatedAlternativeLabelsGenerator, times(1))
        .updateCommaSeparatedAlternativeLabels(mockSkillList);
    verify(this.mockSkillTextReplicationService, times(1)).replicateDefaultTexts(mockSkillListResult1);

    assertEquals(mockSkillListResult2, captorList.getValue());
  }

  @Test
  @SuppressWarnings("unchecked")
  @DisplayName("EventHandler: After Skill Edit Mode")
  void afterDraftEdit() {
    final Skills mockSkill = SkillTestHelper.createSkill();
    final List<Skills> mockSkillList = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillListResult1 = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillListResult2 = Collections.singletonList(mockSkill);

    when(this.mockCommaSeparatedAlternativeLabelsGenerator.updateCommaSeparatedAlternativeLabels(mockSkillList))
        .thenReturn(mockSkillListResult1);
    when(this.mockSkillTextReplicationService.replicateDefaultTexts(mockSkillListResult1))
        .thenReturn(mockSkillListResult2);

    final DraftEditEventContext mockContext = mock(DraftEditEventContext.class);

    Result result = mock(Result.class);
    when(mockContext.getResult()).thenReturn(result);

    this.spiedCut.afterDraftEdit(mockContext, mockSkillList);

    final ArgumentCaptor<List<Skills>> captorList = ArgumentCaptor.forClass(List.class);

    verify(this.mockEventHandlerUtility, times(1)).enhanceSkillResult(eq(result), captorList.capture());
    verify(this.mockCommaSeparatedAlternativeLabelsGenerator, times(1))
        .updateCommaSeparatedAlternativeLabels(mockSkillList);
    verify(this.mockSkillTextReplicationService, times(1)).replicateDefaultTexts(mockSkillListResult1);

    assertEquals(mockSkillListResult2, captorList.getValue());
  }

  @Test
  @SuppressWarnings("unchecked")
  @DisplayName("EventHandler: After Skill Modification")
  void afterModification() {
    final Skills mockSkill = SkillTestHelper.createSkill();
    final List<Skills> mockSkillList = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillListResult1 = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillListResult2 = Collections.singletonList(mockSkill);

    when(this.mockCommaSeparatedAlternativeLabelsGenerator.updateCommaSeparatedAlternativeLabels(mockSkillList))
        .thenReturn(mockSkillListResult1);
    when(this.mockSkillTextReplicationService.replicateDefaultTexts(mockSkillListResult1))
        .thenReturn(mockSkillListResult2);

    final DraftSaveEventContext mockContext = mock(DraftSaveEventContext.class);

    Result result = mock(Result.class);
    when(this.mockEventHandlerUtility.getResultFromEventContext(any())).thenReturn(result);

    this.spiedCut.afterModification(mockContext, mockSkillList);

    final ArgumentCaptor<List<Skills>> captorList = ArgumentCaptor.forClass(List.class);

    verify(this.mockEventHandlerUtility, times(1)).enhanceSkillResult(eq(result), captorList.capture());
    verify(this.mockCommaSeparatedAlternativeLabelsGenerator, times(1))
        .updateCommaSeparatedAlternativeLabels(mockSkillList);
    verify(this.mockSkillTextReplicationService, times(1)).replicateDefaultTexts(mockSkillListResult1);

    assertEquals(mockSkillListResult2, captorList.getValue());
  }

  @Test
  @DisplayName("EventHandler: beforeDraftSaveLocaleBugWorkaround")
  public void beforeDraftSaveLocaleBugWorkaround() {
    final DraftSaveEventContext mockContext = mock(DraftSaveEventContext.class);

    this.cut.beforeDraftSaveLocaleBugWorkaround(mockContext);

    verify(this.mockEventHandlerUtility, times(1)).addKeyAttributesToEntity(any(), any(), any());
    verify(this.mockSkillTextRepo, times(1)).deleteActiveTextsOfSkill(any());
  }
}
