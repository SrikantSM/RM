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
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.cds.CdsReadEventContext;

import com.sap.c4p.rm.skill.repositories.ProficiencyLevelRepository;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;

import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevelsTexts;
import proficiencyservice.ProficiencyLevels_;

class CommaSeparatedProficiencyLevelLanguagesHandlerTest {
  private final ProficiencyLevelRepository proficiencyLevelRepository = mock(ProficiencyLevelRepository.class);
  private final EventHandlerUtility eventHandlerUtility = mock(EventHandlerUtility.class);

  private final CommaSeparatedProficiencyLevelLanguagesHandler cut = new CommaSeparatedProficiencyLevelLanguagesHandler(
      proficiencyLevelRepository, eventHandlerUtility);
  private final CommaSeparatedProficiencyLevelLanguagesHandler spyCut = spy(cut);

  @Test
  @DisplayName("verify that afterRead calls the correct methods (column requested)")
  void afterRead() {
    CdsReadEventContext mockReadEventContext = mock(CdsReadEventContext.class);
    CdsModel mockCdsModel = mock(CdsModel.class);
    doReturn(mockCdsModel).when(mockReadEventContext).getModel();
    doReturn(Select.from(ProficiencyLevels_.class)).when(mockReadEventContext).getCqn();

    ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId("ABC");
    proficiencyLevel.setIsActiveEntity(true);
    ProficiencyLevelsTexts proficiencyLevelTextEn = ProficiencyLevelsTexts.create();
    proficiencyLevelTextEn.setLocale("en");
    proficiencyLevelTextEn.setName("Name En");
    proficiencyLevelTextEn.setDescription("Description En");
    proficiencyLevel.setTexts(Collections.singletonList(proficiencyLevelTextEn));

    Map<String, Object> rootKeys = new HashMap<>();
    rootKeys.put("IsActiveEntity", true);
    rootKeys.put("ID", "ABC");
    doReturn(rootKeys).when(this.eventHandlerUtility).getRootKeysFromEventContext(any(), any());

    doReturn(true).when(this.spyCut).shouldComputeCommaSeparated(any());
    doReturn(Collections.singletonList(proficiencyLevel)).when(this.proficiencyLevelRepository)
        .getLanguagesByProficiencyLevels(any(), any());
    doReturn("en").when(this.spyCut).computeCommaSeparated(any());

    this.spyCut.afterRead(mockReadEventContext, Collections.singletonList(proficiencyLevel));

    verify(this.proficiencyLevelRepository, times(1)).getLanguagesByProficiencyLevels(any(), any());
    verify(this.spyCut, times(1)).computeCommaSeparated(any());
  }

  @Test
  @DisplayName("verify that afterRead calls the correct methods (column not requested)")
  void afterReadNoop() {
    CdsReadEventContext mockReadEventContext = mock(CdsReadEventContext.class);
    CdsModel mockCdsModel = mock(CdsModel.class);
    doReturn(mockCdsModel).when(mockReadEventContext).getModel();
    doReturn(Select.from(ProficiencyLevels_.class)).when(mockReadEventContext).getCqn();

    ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId("ABC");
    proficiencyLevel.setIsActiveEntity(true);
    ProficiencyLevelsTexts proficiencyLevelTextEn = ProficiencyLevelsTexts.create();
    proficiencyLevelTextEn.setLocale("en");
    proficiencyLevelTextEn.setName("Name En");
    proficiencyLevelTextEn.setDescription("Description En");
    proficiencyLevel.setTexts(Collections.singletonList(proficiencyLevelTextEn));

    Map<String, Object> rootKeys = new HashMap<>();
    rootKeys.put("IsActiveEntity", true);
    rootKeys.put("ID", "ABC");
    doReturn(rootKeys).when(this.eventHandlerUtility).getRootKeysFromEventContext(any(), any());

    doReturn(false).when(this.spyCut).shouldComputeCommaSeparated(any());

    this.spyCut.afterRead(mockReadEventContext, Collections.singletonList(proficiencyLevel));

    verify(this.proficiencyLevelRepository, times(0)).getLanguagesByProficiencyLevels(any(), any());
    verify(this.spyCut, times(0)).computeCommaSeparated(any());
  }

  @Test
  @DisplayName("verify that shouldComputeCommaSeparated is true on select *")
  void shouldComputeCommaSeparatedStar() {
    CqnSelect select = Select.from(ProficiencyLevels_.class).columns(ProficiencyLevels_::_all);
    assertTrue(cut.shouldComputeCommaSeparated(select));
  }

  @Test
  @DisplayName("verify that shouldComputeCommaSeparated is true on select COMMA_SEPARATED_LANGUAGES")
  void shouldComputeCommaSeparatedColumn() {
    CqnSelect select = Select.from(ProficiencyLevels_.class).columns(ProficiencyLevels_::ID,
        ProficiencyLevels_::commaSeparatedLanguages);
    assertTrue(cut.shouldComputeCommaSeparated(select));
  }

  @Test
  @DisplayName("verify that shouldComputeCommaSeparated is false on select w/o column or star")
  void shouldComputeCommaSeparatedNot() {
    CqnSelect select = Select.from(ProficiencyLevels_.class).columns(ProficiencyLevels_::ID);
    assertFalse(cut.shouldComputeCommaSeparated(select));
  }

  @Test
  @DisplayName("verify that computeCommaSeparated correctly processes a list of catalogAssociations")
  void computeCommaSeparated() {
    ProficiencyLevelsTexts testProficiencyLevelTextEn = ProficiencyLevelsTexts.create();
    testProficiencyLevelTextEn.setLocale("en");

    ProficiencyLevelsTexts testProficiencyLevelTextDe = ProficiencyLevelsTexts.create();
    testProficiencyLevelTextDe.setLocale("de");

    ProficiencyLevelsTexts testProficiencyLevelTextEs = ProficiencyLevelsTexts.create();
    testProficiencyLevelTextEs.setLocale("es");

    ProficiencyLevelsTexts testProficiencyLevelTextFr = ProficiencyLevelsTexts.create();
    testProficiencyLevelTextFr.setLocale("fr");

    assertEquals("de, en, es, fr", cut.computeCommaSeparated(Arrays.asList(testProficiencyLevelTextEn,
        testProficiencyLevelTextDe, testProficiencyLevelTextEs, testProficiencyLevelTextFr)));
  }

  @Test
  @DisplayName("verify that computeCommaSeparated correctly processes null")
  void computeCommaSeparatedNull() {
    assertEquals("", cut.computeCommaSeparated(null));
  }
}
