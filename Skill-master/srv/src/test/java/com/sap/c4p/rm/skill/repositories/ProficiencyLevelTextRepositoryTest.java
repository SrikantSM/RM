package com.sap.c4p.rm.skill.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevelsTexts;
import proficiencyservice.ProficiencyLevelsTexts_;

class ProficiencyLevelTextRepositoryTest {
  private ProficiencyLevelTextRepository cut;

  private final PersistenceService mockPersistenceService = mock(PersistenceService.class, RETURNS_DEEP_STUBS);
  private final DraftService mockDraftService = mock(DraftService.class, RETURNS_DEEP_STUBS);

  @BeforeEach
  void setUp() {
    this.cut = new ProficiencyLevelTextRepository(this.mockPersistenceService, this.mockDraftService);
  }

  @Test
  @DisplayName("create a draft proficiency level text")
  void createDraft() {
    final ProficiencyLevelsTexts proficiencyLevelText = ProficiencyLevelsTexts.create();
    proficiencyLevelText.setLocale("en");
    proficiencyLevelText.setId("ID");

    CqnInsert expectedInsert = Insert.into(ProficiencyLevelsTexts_.class).entry(proficiencyLevelText);

    this.cut.createDraft(proficiencyLevelText);

    final ArgumentCaptor<CqnInsert> argument = ArgumentCaptor.forClass(CqnInsert.class);
    verify(this.mockDraftService, times(1)).newDraft(argument.capture());
    assertEquals(expectedInsert.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("delete the active texts of a skill")
  void deleteActiveTextsOfSkill() {
    final ProficiencyLevels level1 = ProficiencyLevels.create();
    level1.setId("1");
    final ProficiencyLevels level2 = ProficiencyLevels.create();
    level2.setId("2");
    final ProficiencyLevels level3 = ProficiencyLevels.create();
    level3.setId("3");
    final ProficiencyLevels level4 = ProficiencyLevels.create();
    level4.setId("4");

    final CqnDelete expectedDelete = Delete.from(ProficiencyLevelsTexts_.class)
        .where(t -> t.ID().in(level1.getId(), level2.getId(), level3.getId(), level4.getId()));

    this.cut.deleteActiveTextsOfLevels(Arrays.asList(level1, level2, level3, level4));

    final ArgumentCaptor<CqnDelete> argument = ArgumentCaptor.forClass(CqnDelete.class);
    verify(this.mockPersistenceService, times(1)).run(argument.capture());
    assertEquals(expectedDelete.toJson(), argument.getValue().toJson());
  }
}
