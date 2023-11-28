package com.sap.c4p.rm.skill.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import skillservice.Skills;
import skillservice.SkillsTexts;
import skillservice.SkillsTexts_;

class SkillTextRepositoryTest {
  private SkillTextRepository cut;
  private PersistenceService mockPersistenceService;
  private DraftService mockDraftService;

  /**
   * initialize object under test
   */
  @BeforeEach
  void beforeEach() {
    this.mockPersistenceService = mock(PersistenceService.class, RETURNS_DEEP_STUBS);
    this.mockDraftService = mock(DraftService.class, RETURNS_DEEP_STUBS);
    this.cut = new SkillTextRepository(this.mockDraftService, this.mockPersistenceService);
  }

  @Test
  @DisplayName("create a draft skill text")
  void createDraft() {
    SkillsTexts skillText = SkillTestHelper.createSkillTexts(1, SkillTestHelper.LANGUAGE_CODE_EN, false).get(0);

    CqnInsert expectedInsert = Insert.into(SkillsTexts_.class).entry(skillText);

    this.cut.createDraft(skillText);

    final ArgumentCaptor<CqnInsert> argument = ArgumentCaptor.forClass(CqnInsert.class);
    verify(this.mockDraftService, times(1)).newDraft(argument.capture());
    assertEquals(expectedInsert.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("update an active skill text")
  void updateActiveEntity() {
    SkillsTexts skillText = SkillTestHelper.createSkillTexts(1, SkillTestHelper.LANGUAGE_CODE_EN, true).get(0);

    CqnUpdate expectedUpdate = Update.entity(SkillsTexts_.class).where(s -> s.ID_texts().eq(skillText.getIDTexts()))
        .data(skillText);

    this.cut.updateActiveEntity(skillText);

    final ArgumentCaptor<CqnUpdate> argument = ArgumentCaptor.forClass(CqnUpdate.class);
    verify(this.mockPersistenceService, times(1)).run(argument.capture());
    assertEquals(expectedUpdate.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("update a draft skill text")
  void updateDraft() {
    SkillsTexts skillText = SkillTestHelper.createSkillTexts(1, SkillTestHelper.LANGUAGE_CODE_EN, true).get(0);

    CqnUpdate expectedUpdate = Update.entity(SkillsTexts_.class)
        .where(s -> s.ID_texts().eq(skillText.getIDTexts()).and(s.IsActiveEntity().eq(Boolean.FALSE))).data(skillText);

    this.cut.updateDraft(skillText);

    final ArgumentCaptor<CqnUpdate> argument = ArgumentCaptor.forClass(CqnUpdate.class);
    verify(this.mockDraftService, times(1)).patchDraft(argument.capture());
    assertEquals(expectedUpdate.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("delete the active texts of a skill")
  void deleteActiveTextsOfSkill() {
    final Skills skill = SkillTestHelper.createSkill();

    final CqnDelete expectedDelete = Delete.from(SkillsTexts_.class).where(t -> t.ID().eq(skill.getId()));

    this.cut.deleteActiveTextsOfSkill(skill);

    final ArgumentCaptor<CqnDelete> argument = ArgumentCaptor.forClass(CqnDelete.class);
    verify(this.mockPersistenceService, times(1)).run(argument.capture());
    assertEquals(expectedDelete.toJson(), argument.getValue().toJson());
  }
}
