package com.sap.c4p.rm.skill.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.cds.CdsReadEventContext;

import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import skillservice.Skills;
import skillservice.SkillsTexts;
import skillservice.Skills_;

class CommaSeparatedSkillLanguagesHandlerTest {
  private final SkillRepository skillRepository = mock(SkillRepository.class);

  private final CommaSeparatedSkillLanguagesHandler cut = new CommaSeparatedSkillLanguagesHandler(skillRepository);
  private final CommaSeparatedSkillLanguagesHandler spyCut = spy(cut);

  @Test
  @DisplayName("verify that afterRead() calls the correct methods (column requested)")
  void afterRead() {
    final CdsReadEventContext mockReadEventContext = mock(CdsReadEventContext.class);
    final CdsModel mockCdsModel = mock(CdsModel.class);
    doReturn(mockCdsModel).when(mockReadEventContext).getModel();
    doReturn(Select.from(Skills_.class)).when(mockReadEventContext).getCqn();

    final Skills testSkill1 = SkillTestHelper.createSkill(true);
    testSkill1.setId(UUID.randomUUID().toString());
    SkillTestHelper.addTextsToSkill(testSkill1, 1, true);
    final Skills testSkill2 = SkillTestHelper.createSkill(false);
    testSkill2.setId(UUID.randomUUID().toString());
    SkillTestHelper.addTextsToSkill(testSkill2, 1, false);

    doReturn(true).when(this.spyCut).shouldComputeCommaSeparated(any());
    doReturn(Arrays.asList(testSkill1, testSkill2)).when(this.skillRepository).getLanguagesBySkills(any(), any());
    doReturn("en").when(this.spyCut).computeCommaSeparated(any());

    this.spyCut.afterRead(mockReadEventContext, Arrays.asList(testSkill1, testSkill2));

    verify(this.skillRepository, times(2)).getLanguagesBySkills(any(), any());
    verify(this.spyCut, times(2)).computeCommaSeparated(any());
  }

  @Test
  @DisplayName("verify that afterRead() calls the expected methods (column not requested)")
  void afterReadNoop() {
    final CdsReadEventContext mockReadEventContext = mock(CdsReadEventContext.class);
    final CdsModel mockCdsModel = mock(CdsModel.class);
    doReturn(mockCdsModel).when(mockReadEventContext).getModel();
    doReturn(Select.from(Skills_.class)).when(mockReadEventContext).getCqn();

    final Skills testSkill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(testSkill, 1);

    doReturn(false).when(this.spyCut).shouldComputeCommaSeparated(any());

    this.spyCut.afterRead(mockReadEventContext, Collections.singletonList(testSkill));

    verify(this.skillRepository, times(0)).getLanguagesBySkills(any(), any());
    verify(this.spyCut, times(0)).computeCommaSeparated(any());
  }

  @Test
  @DisplayName("verify that shouldComputeCommaSeparated() is true on select *")
  void shouldComputeCommaSeparatedStar() {
    final CqnSelect select = Select.from(Skills_.class).columns(Skills_::_all);
    assertTrue(cut.shouldComputeCommaSeparated(select));
  }

  @Test
  @DisplayName("verify that shouldComputeCommaSeparated() returns true on select COMMA_SEPARATED_LANGUAGES")
  void shouldComputeCommaSeparatedColumn() {
    final CqnSelect select = Select.from(Skills_.class).columns(Skills_::ID, Skills_::commaSeparatedLanguages);
    assertTrue(cut.shouldComputeCommaSeparated(select));
  }

  @Test
  @DisplayName("verify that shouldComputeCommaSeparated() returns false on select w/o column or star")
  void shouldComputeCommaSeparatedNot() {
    final CqnSelect select = Select.from(Skills_.class).columns(Skills_::ID);
    assertFalse(cut.shouldComputeCommaSeparated(select));
  }

  @Test
  @DisplayName("verify that computeCommaSeparated() correctly processes a list of languages")
  void computeCommaSeparated() {
    final SkillsTexts testSkillTextEn = SkillsTexts.create();
    testSkillTextEn.setLocale("en");

    final SkillsTexts testSkillTextDe = SkillsTexts.create();
    testSkillTextDe.setLocale("de");

    final SkillsTexts testSkillTextEs = SkillsTexts.create();
    testSkillTextEs.setLocale("es");

    final SkillsTexts testSkillTextFr = SkillsTexts.create();
    testSkillTextFr.setLocale("fr");

    assertEquals("de, en, es, fr",
        cut.computeCommaSeparated(Arrays.asList(testSkillTextEn, testSkillTextDe, testSkillTextEs, testSkillTextFr)));
  }

  @Test
  @DisplayName("verify that computeCommaSeparated() correctly processes null")
  void computeCommaSeparatedNull() {
    assertEquals("", cut.computeCommaSeparated(null));
  }
}
