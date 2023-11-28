package com.sap.c4p.rm.skill.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.ql.CQL;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import com.sap.resourcemanagement.skill.SkillsDownload;
import com.sap.resourcemanagement.skill.SkillsDownload_;

import skillservice.AlternativeLabels;
import skillservice.Catalogs2Skills_;
import skillservice.Catalogs_;
import skillservice.Skills;
import skillservice.SkillsTexts;
import skillservice.SkillsTexts_;
import skillservice.Skills_;

class SkillRepositoryTest {
  private SkillRepository cut;
  private DraftService mockDraftService;
  private PersistenceService mockPersistenceService;

  /**
   * initialize object under test
   */
  @BeforeEach
  void beforeEach() {
    this.mockDraftService = mock(DraftService.class);
    this.mockPersistenceService = mock(PersistenceService.class);
    this.cut = new SkillRepository(this.mockDraftService, this.mockPersistenceService);
  }

  @Test
  @DisplayName("create skill draft correctly")
  void createDraft() {
    Skills skill = SkillTestHelper.createSkill();
    SkillTestHelper.addTextsToSkill(skill, 1);

    final CqnInsert expectedInsert = Insert.into(Skills_.class).entry(skill);
    final ArgumentCaptor<CqnInsert> argumentInsert = ArgumentCaptor.forClass(CqnInsert.class);

    Result mockResult = mock(Result.class);
    when(this.mockDraftService.newDraft(any(Insert.class))).thenReturn(mockResult);

    this.cut.createDraft(skill);
    verify(this.mockDraftService, times(1)).newDraft(argumentInsert.capture());
    List<CqnInsert> capturedInsert = argumentInsert.getAllValues();
    assertEquals(expectedInsert.toString(), capturedInsert.get(0).toString());
  }

  @Test
  @DisplayName("expand SkillsTexts and AlternativeLabels for skill")
  void expandCompositions() {
    Skills skill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(skill, 2);
    SkillTestHelper.addLabelsToSkill(skill, 3);

    final CqnSelect expectedSelect = Select.from(Skills_.class)
        .where(s -> s.ID().eq(skill.getId()).and(s.IsActiveEntity().eq(skill.getIsActiveEntity())))
        .columns(Skills_::_all, s -> s.alternativeLabels().expand(), s -> s.texts().expand());
    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);

    List<Skills> skillsList = new ArrayList<>();
    skillsList.add(skill);

    Result mockResult = mock(Result.class);
    when(mockResult.first(Skills.class)).thenReturn(Optional.of(skill));
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    this.cut.expandCompositions(skillsList);

    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());
    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
  }

  @Test
  @DisplayName("expand SkillsTexts and AlternativeLabels for skill if IsActiveEntity is null")
  void expandCompositionsIsActiveEntityNull() {
    Skills skill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(skill, 2);
    SkillTestHelper.addLabelsToSkill(skill, 3);
    skill.setIsActiveEntity(null);

    final CqnSelect expectedSelect = Select.from(Skills_.class)
        .where(s -> s.ID().eq(skill.getId()).and(s.IsActiveEntity().eq(Boolean.TRUE)))
        .columns(Skills_::_all, s -> s.alternativeLabels().expand(), s -> s.texts().expand());
    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);

    List<Skills> skillsList = new ArrayList<>();
    skillsList.add(skill);

    Result mockResult = mock(Result.class);
    when(mockResult.first(Skills.class)).thenReturn(Optional.of(skill));
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    this.cut.expandCompositions(skillsList);

    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());
    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
  }

  @Test
  @DisplayName("find all skills, prepared for a download")
  void findActiveEntitiesForDownload() {
    // expected list of skills
    List<SkillsDownload> expectedSkills = Arrays.asList(SkillsDownload.create(), SkillsDownload.create());

    // mock result class to return the expected skills
    Result mockResult = mock(Result.class);
    when(mockResult.listOf(SkillsDownload.class)).thenReturn(expectedSkills);

    // make mockPersistenceService return the mocked result on run()
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    // expected select
    String language = "en";
    int limit = 10;
    int offset = 10;
    final CqnSelect expectedSelect = Select.from(SkillsDownload_.class).where(s -> s.locale().eq(language)).limit(limit,
        offset);

    // run method
    List<SkillsDownload> actualSkills = this.cut.findActiveEntitiesForDownload(language, limit, offset);

    // verify that run() has been called one time with the correct select statement
    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockPersistenceService, times(1)).run(argumentSelect.capture());
    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());

    // verify that the mocked list of skills is returned
    assertEquals(expectedSkills, actualSkills);
  }

  @Test
  @DisplayName("find all skills")
  void findAllActiveEntities() {
    // expected list of skills
    List<Skills> expectedSkills = SkillTestHelper.createTestEntities(10, i -> {
      final Skills mockSkillToCreate = Skills.create();
      mockSkillToCreate.setIsActiveEntity(Boolean.TRUE);
      mockSkillToCreate.setId(SkillTestHelper.SKILL_ID + i);
      return mockSkillToCreate;
    });

    // mock result class to return the expected skills
    Result mockResult = mock(Result.class);
    when(mockResult.listOf(Skills.class)).thenReturn(expectedSkills);

    // make mockPersistenceService return the mocked result on run()
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    // expected select
    final CqnSelect expectedSelect = Select.from(Skills_.class).columns(Skills_::_all,
        c -> c.alternativeLabels().expand(), d -> d.texts().expand(),
        e -> e.catalogAssociations().expand(Catalogs2Skills_::_all, f -> f.catalog().expand()));

    // run method
    List<Skills> actualSkills = this.cut.findAllActiveEntities();

    // verify that run() has been called one time with the correct select statement
    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockPersistenceService, times(1)).run(argumentSelect.capture());
    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());

    // verify that the mocked list of skills is returned
    assertEquals(expectedSkills, actualSkills);
  }

  @Test
  @DisplayName("find a skill by its id correctly")
  void findById() {
    Skills skill = SkillTestHelper.createSkill();

    final CqnSelect expectedSelect = Select.from(Skills_.class)
        .where(a -> a.ID().eq(skill.getId()).and(a.IsActiveEntity().eq(skill.getIsActiveEntity())))
        .columns(Skills_::_all);

    Optional<Skills> expectedResult = Optional.empty();
    Result mockResult = mock(Result.class);
    when(mockResult.first(Skills.class)).thenReturn(expectedResult);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    Optional<Skills> actualResult = this.cut.findById(skill.getId(), skill.getIsActiveEntity());

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find a skill with localized expanded by its id correctly")
  void findByIdLocalized() {
    Skills skill = SkillTestHelper.createSkill();
    skill.setLocalized(SkillsTexts.create());

    final CqnSelect expectedSelect = Select.from(Skills_.class)
        .where(a -> a.ID().eq(skill.getId()).and(a.IsActiveEntity().eq(skill.getIsActiveEntity())))
        .columns(Skills_::_all, s -> s.localized().expand());

    Optional<Skills> expectedResult = Optional.empty();
    Result mockResult = mock(Result.class);
    when(mockResult.first(Skills.class)).thenReturn(expectedResult);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    Optional<Skills> actualResult = this.cut.findByIdLocalized(skill.getId(), skill.getIsActiveEntity());

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find a skill by its external id correctly")
  void findByExternalId() {
    Skills skill = SkillTestHelper.createSkill();

    final CqnSelect expectedSelect = Select.from(Skills_.class)
        .where(a -> a.externalID().eq(skill.getExternalID()).and(a.IsActiveEntity().eq(skill.getIsActiveEntity())))
        .columns(Skills_::_all, s -> s.alternativeLabels().expand(), s -> s.texts().expand());

    Optional<Skills> expectedResult = Optional.empty();
    Result mockResult = mock(Result.class);
    when(mockResult.first(Skills.class)).thenReturn(expectedResult);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    Optional<Skills> actualResult = this.cut.findByExternalId(skill.getExternalID(), skill.getIsActiveEntity());

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find skills by its alternative labels correctly")
  void findByAlternativeLabels() {
    List<AlternativeLabels> labels = new ArrayList<>();
    labels.add(SkillTestHelper.createAlternativeLabel());
    labels.add(SkillTestHelper.createAlternativeLabel());
    String[] labelIds = new String[] { labels.get(0).getId(), labels.get(0).getId() };

    final CqnSelect expectedSelect = Select.from(Skills_.class)
        .where(s -> s.alternativeLabels().ID().in(labelIds).and(s.IsActiveEntity().eq(Boolean.TRUE)));

    List<Skills> expectedResult = Collections.emptyList();
    Result mockResult = mock(Result.class);
    when(mockResult.listOf(Skills.class)).thenReturn(expectedResult);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    List<Skills> actualResult = this.cut.findByAlternativeLabels(labels, Boolean.TRUE);

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find a skill by its skill text correctly")
  void findBySkillText() {
    SkillsTexts text = SkillTestHelper.createSkillTexts(1, "en", true).get(0);

    final CqnSelect expectedSelect = Select.from(Skills_.class).where(
        s -> s.texts().ID_texts().eq(text.getIDTexts()).and(s.texts().IsActiveEntity().eq(text.getIsActiveEntity())))
        .columns(Skills_::_all, s -> s.texts().expand());

    List<Skills> expectedResult = Collections.emptyList();
    Result mockResult = mock(Result.class);
    when(mockResult.listOf(Skills.class)).thenReturn(expectedResult);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    List<Skills> actualResult = this.cut.findBySkillText(text);

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find a skill by its external id correctly")
  void editDraftByExternalId() {
    Skills skill = SkillTestHelper.createSkill();

    final CqnSelect expectedSelect = Select.from(Skills_.class)
        .where(a -> a.externalID().eq(skill.getExternalID()).and(a.IsActiveEntity().eq(Boolean.TRUE)))
        .columns(Skills_::_all);

    Skills expectedResult = skill;
    Result mockResult = mock(Result.class);
    when(mockResult.single(Skills.class)).thenReturn(expectedResult);
    when(this.mockDraftService.editDraft(any(CqnSelect.class), eq(false))).thenReturn(mockResult);

    Skills actualResult = this.cut.editDraftByExternalId(skill.getExternalID());

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).editDraft(argumentSelect.capture(), eq(false));

    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("update an active skill")
  void updateActiveEntity() {
    Skills skill = SkillTestHelper.createSkill();

    CqnUpdate expectedUpdate = Update.entity(Skills_.class).where(s -> s.ID().eq(skill.getId())).data(skill);

    this.cut.updateActiveEntity(skill);

    final ArgumentCaptor<CqnUpdate> argument = ArgumentCaptor.forClass(CqnUpdate.class);
    verify(this.mockPersistenceService, times(1)).run(argument.capture());
    assertEquals(expectedUpdate.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("update a draft skill")
  void updateDraft() {
    Skills skill = SkillTestHelper.createSkill();

    CqnUpdate expectedUpdate = Update.entity(Skills_.class)
        .where(s -> s.ID().eq(skill.getId()).and(s.IsActiveEntity().eq(Boolean.FALSE))).data(skill);

    this.cut.updateDraft(skill);

    final ArgumentCaptor<CqnUpdate> argument = ArgumentCaptor.forClass(CqnUpdate.class);
    verify(this.mockDraftService, times(1)).patchDraft(argument.capture());
    assertEquals(expectedUpdate.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("gets names of (active) catalogs assigned to skills")
  void getActiveCatalogNamesBySkills() {
    Skills skill1 = Skills.create();
    skill1.setId("s1");
    Skills skill2 = Skills.create();
    skill2.setId("s2");

    CqnSelect expectedSelect = Select.from(Skills_.class)
        .columns(Skills_::ID, s -> s.catalogAssociations().expand(c2s -> c2s.catalog().expand(Catalogs_::name)))
        .where(s -> s.ID().in("s1", "s2"));

    Result mockResult = mock(Result.class);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    this.cut.getActiveCatalogNamesBySkills(Arrays.asList(skill1, skill2));

    final ArgumentCaptor<CqnSelect> argument = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockPersistenceService, times(1)).run(argument.capture());
    assertEquals(expectedSelect.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("check if saveDraftSkill() is running correctly")
  void saveDraftSkillOk() {
    Skills draftSkillWithID = Skills.create();
    draftSkillWithID.setId(SkillTestHelper.SKILL_ID);
    draftSkillWithID.setIsActiveEntity(Boolean.FALSE);

    this.cut.saveDraft(draftSkillWithID);

    final ArgumentCaptor<CqnSelect> argument = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService).saveDraft(argument.capture());
    CqnSelect expectedSelect = Select.from(Skills_.class)
        .where(c -> c.ID().eq(draftSkillWithID.getId()).and(c.IsActiveEntity().eq(Boolean.FALSE)));
    assertEquals(expectedSelect.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("count other active entities with same name correctly")
  void countOtherActiveEntitiesWithSameName() {
    Skills skill = SkillTestHelper.createSkill();

    final CqnSelect expectedSelect = Select.from(Skills_.class).columns(CQL.count().as(SkillRepository.COUNT))
        .where(s -> s.externalID().eq(skill.getExternalID()).and(s.ID().ne((skill.getId()))));

    long expectedResult = 1L;
    Result mockResult = mock(Result.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockResult.single().get(SkillRepository.COUNT)).thenReturn(expectedResult);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    long actualResult = this.cut.countOtherActiveEntitiesWithSameExternalId(skill);
    verify(this.mockPersistenceService, times(1))
        .run(argThat((CqnSelect cqn) -> cqn.toString().equals(expectedSelect.toString())));

    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("count all skills")
  void countSkills() {
    CqnSelect expectedSelect = Select.from(com.sap.resourcemanagement.skill.Skills_.class)
        .columns(CQL.count().as(SkillRepository.COUNT));
    long expectedResult = 1L;
    Result mockResult = mock(Result.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockResult.single().get(SkillRepository.COUNT)).thenReturn(expectedResult);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
    long actualResult = this.cut.count();
    verify(this.mockPersistenceService, times(1))
        .run(argThat((CqnSelect cqn) -> cqn.toString().equals(expectedSelect.toString())));

    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("count skills with english language")
  void countSkillsWithLanguage() {
    CqnSelect expectedSelect = Select.from(com.sap.resourcemanagement.skill.Skills_.class)
        .columns(CQL.count().as(SkillRepository.COUNT))
        .where(s -> s.texts().locale().eq(SkillTestHelper.LANGUAGE_CODE_EN));
    long expectedResult = 1L;
    Result mockResult = mock(Result.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockResult.single().get(SkillRepository.COUNT)).thenReturn(expectedResult);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
    long actualResult = this.cut.countWithLanguage(SkillTestHelper.LANGUAGE_CODE_EN);

    verify(this.mockPersistenceService, times(1))
        .run(argThat((CqnSelect cqn) -> cqn.toString().equals(expectedSelect.toString())));

    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("check if getLanguagesBySkill() returns correct languages a for active skill")
  void getLanguagesBySkill() {
    final Skills testSkill1 = SkillTestHelper.createSkill(true);
    final Skills testSkill2 = SkillTestHelper.createSkill(true);

    final CqnSelect expectedSelect = Select.from(Skills_.class)
        .columns(Skills_::ID, pl -> pl.texts().expand(SkillsTexts_::locale))
        .where(pl -> pl.ID().in(testSkill1.getId(), testSkill2.getId()).and(pl.IsActiveEntity().eq(true)));

    final Result mockResult = mock(Result.class);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    this.cut.getLanguagesBySkills(Arrays.asList(testSkill1, testSkill2), true);

    final ArgumentCaptor<CqnSelect> argument = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockPersistenceService, times(1)).run(argument.capture());
    assertEquals(expectedSelect.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("check if getLanguagesBySkill() returns correct languages for a draft skill")
  void getLanguagesBySkillDraft() {
    final Skills testSkill1 = SkillTestHelper.createSkill(false);
    final Skills testSkill2 = SkillTestHelper.createSkill(false);

    final CqnSelect expectedSelect = Select.from(Skills_.class)
        .columns(Skills_::ID, pl -> pl.texts().expand(SkillsTexts_::locale))
        .where(pl -> pl.ID().in(testSkill1.getId(), testSkill2.getId()).and(pl.IsActiveEntity().eq(false)));

    final Result mockResult = mock(Result.class);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    this.cut.getLanguagesBySkills(Arrays.asList(testSkill1, testSkill2), false);

    final ArgumentCaptor<CqnSelect> argument = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argument.capture());
    assertEquals(expectedSelect.toJson(), argument.getValue().toJson());
  }
}
