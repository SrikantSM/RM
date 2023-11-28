package com.sap.c4p.rm.skill.services;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencyLevelRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencyLevelTextRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;

import com.sap.resourcemanagement.config.DefaultLanguages;

import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevelsTexts;
import proficiencyservice.ProficiencySets;

class ProficiencyLevelTextReplicationServiceTest {

  private final DefaultLanguageRepository mockDefaultLanguageRepository = mock(DefaultLanguageRepository.class);
  private final ProficiencyLevelRepository mockProficiencyLevelRepository = mock(ProficiencyLevelRepository.class);
  private final ProficiencyLevelTextRepository mockProficiencyLevelTextRepository = mock(
      ProficiencyLevelTextRepository.class);
  private final ProficiencySetRepository mockProficiencySetRepository = mock(ProficiencySetRepository.class);
  private final ProficiencyLevelTextReplicationService cut = new ProficiencyLevelTextReplicationService(
      this.mockDefaultLanguageRepository, this.mockProficiencyLevelRepository, this.mockProficiencySetRepository,
      this.mockProficiencyLevelTextRepository);
  private final ProficiencyLevelTextReplicationService spyCut = spy(this.cut);
  private final DefaultLanguages mockDefaultLanguage = mock(DefaultLanguages.class);
  private final static String MOCK_ID = "ID";
  private final static String MOCK_NAME_1 = "Mock name 1";
  private final static String MOCK_DESCRIPTION_1 = "Mock description 1";
  private final static String MOCK_NAME_2 = "Mock name 2";
  private final static String MOCK_DESCRIPTION_2 = "Mock description 2";

  @Test
  @DisplayName("Replication of default texts IsActiveEntity=false")
  void replicateDraft() {
    final List<ProficiencyLevelsTexts> proficiencyLevelsTextsList = getProficiencyLevelTexts();
    final List<ProficiencyLevels> expandedProficiencyLevelsList = getProficiencyLevelList(MOCK_NAME_2,
        MOCK_DESCRIPTION_2, false, proficiencyLevelsTextsList);

    final ProficiencyLevels expectedUpdateLevel = ProficiencyLevels.create();
    expectedUpdateLevel.setId(expandedProficiencyLevelsList.get(0).getId());
    expectedUpdateLevel.setName(proficiencyLevelsTextsList.get(0).getName());
    expectedUpdateLevel.setDescription(proficiencyLevelsTextsList.get(0).getDescription());

    when(this.mockDefaultLanguageRepository.findActiveEntityByRank(0))
        .thenReturn(Optional.of(this.mockDefaultLanguage));
    when(this.mockDefaultLanguage.getLanguageCode()).thenReturn("en");

    this.cut.replicate(expandedProficiencyLevelsList);

    final ArgumentCaptor<ProficiencyLevels> argumentUpdate = ArgumentCaptor.forClass(ProficiencyLevels.class);
    verify(this.mockProficiencyLevelRepository, times(1)).updateDraft(argumentUpdate.capture());
    assertEquals(expectedUpdateLevel, argumentUpdate.getValue());
  }

  @Test
  @DisplayName("Replication of default texts IsActiveEntity=true")
  void replicateActive() {
    final List<ProficiencyLevelsTexts> proficiencyLevelsTextsList = getProficiencyLevelTexts();
    final List<ProficiencyLevels> expandedProficiencyLevelsList = getProficiencyLevelList(MOCK_NAME_2,
        MOCK_DESCRIPTION_2, true, proficiencyLevelsTextsList);

    final ProficiencyLevels expectedUpdateLevel = ProficiencyLevels.create();
    expectedUpdateLevel.setId(expandedProficiencyLevelsList.get(0).getId());
    expectedUpdateLevel.setName(proficiencyLevelsTextsList.get(0).getName());
    expectedUpdateLevel.setDescription(proficiencyLevelsTextsList.get(0).getDescription());

    when(this.mockDefaultLanguageRepository.findActiveEntityByRank(0))
        .thenReturn(Optional.of(this.mockDefaultLanguage));
    when(this.mockDefaultLanguage.getLanguageCode()).thenReturn("en");

    this.cut.replicate(expandedProficiencyLevelsList);

    final ArgumentCaptor<ProficiencyLevels> argumentUpdate = ArgumentCaptor.forClass(ProficiencyLevels.class);
    verify(this.mockProficiencyLevelRepository, times(1)).updateActiveEntity(argumentUpdate.capture());
    assertEquals(expectedUpdateLevel, argumentUpdate.getValue());
  }

  @Test
  @DisplayName("Replication without default language")
  void replicateNoDefault() {
    final List<ProficiencyLevelsTexts> proficiencyLevelsTextsList = getProficiencyLevelTexts();

    final List<ProficiencyLevels> expandedProficiencyLevelsList = getProficiencyLevelList(MOCK_NAME_2,
        MOCK_DESCRIPTION_2, false, proficiencyLevelsTextsList);

    when(this.mockDefaultLanguageRepository.findActiveEntityByRank(0)).thenReturn(Optional.empty());

    assertThrows(ServiceException.class, () -> this.cut.replicate(expandedProficiencyLevelsList));
  }

  @Test
  @DisplayName("Verify that replication of default texts from levels calls correctly")
  void replicateDefaultTextsFromLevels() {
    final List<ProficiencyLevelsTexts> proficiencyLevelsTextsList = getProficiencyLevelTexts();

    final List<ProficiencyLevels> proficiencyLevelsList = getProficiencyLevelList(MOCK_NAME_1, MOCK_DESCRIPTION_1,
        false, null);
    final List<ProficiencyLevels> expandedProficiencyLevelsList = getProficiencyLevelList(MOCK_NAME_2,
        MOCK_DESCRIPTION_2, false, proficiencyLevelsTextsList);

    when(this.mockProficiencyLevelRepository.expandTexts(proficiencyLevelsList))
        .thenReturn(expandedProficiencyLevelsList);
    doReturn(null).when(this.spyCut).replicate(anyList());

    this.spyCut.replicateDefaultTexts(proficiencyLevelsList);

    verify(this.mockProficiencyLevelRepository, times(1)).expandTexts(proficiencyLevelsList);
    verify(this.spyCut, times(1)).replicate(expandedProficiencyLevelsList);
  }

  @SuppressWarnings("unchecked")
  @Test
  @DisplayName("Verify that replication of default texts from set calls correctly")
  void replicateDefaultTextsFromSet() {
    final List<ProficiencyLevelsTexts> proficiencyLevelsTextsList = getProficiencyLevelTexts();
    final List<ProficiencyLevels> expandedProficiencyLevelsList = getProficiencyLevelList(MOCK_NAME_2,
        MOCK_DESCRIPTION_2, true, proficiencyLevelsTextsList);
    final ProficiencySets expandedProficiencySet = ProficiencySets.create();
    expandedProficiencySet.setIsActiveEntity(Boolean.TRUE);
    expandedProficiencySet.setProficiencyLevels(expandedProficiencyLevelsList);

    final ProficiencySets proficiencySet = ProficiencySets.create();
    proficiencySet.setIsActiveEntity(Boolean.TRUE);

    when(this.mockProficiencySetRepository.expandCompositions(proficiencySet))
        .thenReturn(Optional.of(expandedProficiencySet));
    doReturn(null).when(this.spyCut).replicate(anyList());

    this.spyCut.replicateDefaultTexts(proficiencySet);

    verify(this.mockProficiencySetRepository, times(1)).expandCompositions(proficiencySet);

    // For some reason, direct equals on the list fails somewhere within CAP
    final ArgumentCaptor<List<ProficiencyLevels>> argumentList = ArgumentCaptor.forClass(List.class);
    verify(this.spyCut, times(1)).replicate(argumentList.capture());
    assertEquals(expandedProficiencyLevelsList.get(0), argumentList.getValue().get(0));
  }

  @Test
  @DisplayName("Verify that level text with default language, name  and description is created")
  void createProficiencyLevelTextWithText() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    final DefaultLanguages defaultLanguage = DefaultLanguages.create();

    proficiencyLevel.setId("ID");
    defaultLanguage.setLanguageCode("en");

    when(this.mockDefaultLanguageRepository.findActiveEntityByRank(0)).thenReturn(Optional.of(defaultLanguage));
    when(this.mockProficiencyLevelTextRepository.createDraft(any())).thenReturn(any());

    assertDoesNotThrow(() -> this.cut.createProficiencyLevelText(proficiencyLevel));
    verify(this.mockDefaultLanguageRepository, times(1)).findActiveEntityByRank(0);
    verify(this.mockProficiencyLevelTextRepository, times(1)).createDraft(any());
  }

  @Test
  @DisplayName("Verify no new level will be created")
  void createProficiencyLevelTextCreateNoLevel() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    final ProficiencyLevelsTexts proficiencyLevelText = ProficiencyLevelsTexts.create();
    final DefaultLanguages defaultLanguage = DefaultLanguages.create();

    proficiencyLevel.setId("ID");
    defaultLanguage.setLanguageCode("en");
    proficiencyLevelText.setLocale("en");
    proficiencyLevelText.setId(proficiencyLevel.getId());

    final List<ProficiencyLevelsTexts> proficiencyLevelsTextsList = Collections.singletonList(proficiencyLevelText);

    proficiencyLevel.setTexts(proficiencyLevelsTextsList);

    assertDoesNotThrow(() -> this.cut.createProficiencyLevelText(proficiencyLevel));
    verify(this.mockDefaultLanguageRepository, times(0)).findActiveEntityByRank(0);
    verify(this.mockProficiencyLevelTextRepository, times(0)).createDraft(any());
  }

  @Test
  @DisplayName("isExpandNecessary empty skill")
  void isExpandNecessary1() {
    ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    assertTrue(this.cut.isExpandNecessary(Collections.singletonList(proficiencyLevel)));
  }

  @Test
  @DisplayName("isExpandNecessary empty text")
  void isExpandNecessary2() {
    ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    ProficiencyLevelsTexts text = ProficiencyLevelsTexts.create();
    proficiencyLevel.setTexts(Collections.singletonList(text));

    assertTrue(this.cut.isExpandNecessary(Collections.singletonList(proficiencyLevel)));
  }

  @Test
  @DisplayName("isExpandNecessary complete")
  void isExpandNecessary3() {
    ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    ProficiencyLevelsTexts text = ProficiencyLevelsTexts.create();
    text.setLocale("");
    text.setName("");
    text.setDescription("");
    proficiencyLevel.setTexts(Collections.singletonList(text));

    assertFalse(this.cut.isExpandNecessary(Collections.singletonList(proficiencyLevel)));
  }

  @Test
  @DisplayName("isExpandNecessary list")
  void isExpandNecessary4() {
    ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    ProficiencyLevelsTexts text = ProficiencyLevelsTexts.create();
    text.setLocale("");
    text.setName("");
    text.setDescription("");
    proficiencyLevel.setTexts(Collections.singletonList(text));

    ProficiencyLevels skill2 = ProficiencyLevels.create();

    assertTrue(this.cut.isExpandNecessary(Arrays.asList(proficiencyLevel, skill2)));
  }

  /**
   * Return list of proficiencyLevelsTexts containing an instance representing the
   * provided values.
   *
   * @return a list of ProficiencyLevelTexts
   */
  private static List<ProficiencyLevelsTexts> getProficiencyLevelTexts() {
    final ProficiencyLevelsTexts proficiencyLevelsTexts = ProficiencyLevelsTexts.create();
    proficiencyLevelsTexts.setName(ProficiencyLevelTextReplicationServiceTest.MOCK_NAME_1);
    proficiencyLevelsTexts.setDescription(ProficiencyLevelTextReplicationServiceTest.MOCK_DESCRIPTION_1);
    proficiencyLevelsTexts.setLocale("en");

    return Collections.singletonList(proficiencyLevelsTexts);
  }

  /**
   * Return list of proficiencyLevels containing an instance representing the
   * provided values.
   *
   * @param name                       target value of attribute name of
   *                                   proficiencyLevels.
   * @param description                target value of attribute descritpion of
   *                                   proficiencyLevels.
   * @param activeEntity               target value of attribute activeEntity of
   *                                   proficiencyLevels.
   * @param proficiencyLevelsTextsList target value of attribute
   *                                   proficiencyLevelsTextsList of
   *                                   proficiencyLevels.
   * @return a list of ProficiencyLevel
   */
  private static List<ProficiencyLevels> getProficiencyLevelList(final String name, final String description,
      final Boolean activeEntity, final List<ProficiencyLevelsTexts> proficiencyLevelsTextsList) {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId(MOCK_ID);
    proficiencyLevel.setName(name);
    proficiencyLevel.setDescription(description);
    proficiencyLevel.setIsActiveEntity(activeEntity);

    if (proficiencyLevelsTextsList != null) {
      proficiencyLevel.setTexts(proficiencyLevelsTextsList);
    }

    return Collections.singletonList(proficiencyLevel);
  }
}
