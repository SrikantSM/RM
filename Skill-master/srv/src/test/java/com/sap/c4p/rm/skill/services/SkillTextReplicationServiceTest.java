package com.sap.c4p.rm.skill.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import com.sap.resourcemanagement.config.DefaultLanguages;

import skillservice.Skills;
import skillservice.SkillsTexts;

class SkillTextReplicationServiceTest {
  /* object under test */
  private SkillTextReplicationService cut;

  /* mocks */
  private DefaultLanguageRepository mockDefaultLanguageRepository;
  private SkillRepository mockSkillRepo;

  @BeforeEach
  void beforeEach() {
    this.mockDefaultLanguageRepository = mock(DefaultLanguageRepository.class);
    this.mockSkillRepo = mock(SkillRepository.class);

    final DefaultLanguages defaultLanguage = DefaultLanguages.create();
    defaultLanguage.setLanguageCode(SkillTestHelper.LANGUAGE_CODE_EN);
    when(this.mockDefaultLanguageRepository.findActiveEntityByRank(0)).thenReturn(Optional.of(defaultLanguage));

    this.cut = new SkillTextReplicationService(this.mockDefaultLanguageRepository, this.mockSkillRepo);
  }

  @Test
  @DisplayName("Replicate the default text content to the active skill entity")
  void replicateDefaultTextsActive() {
    final Skills mockSkill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(mockSkill, 1, SkillTestHelper.LANGUAGE_CODE_EN, true);
    SkillTestHelper.addTextsToSkill(mockSkill, 1, SkillTestHelper.LANGUAGE_CODE_DE, true);

    final List<Skills> mockSkills = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillsExpanded = Collections.singletonList(mockSkill);

    when(this.mockSkillRepo.expandCompositions(mockSkills)).thenReturn(mockSkillsExpanded);

    final List<Skills> result = this.cut.replicateDefaultTexts(mockSkills);

    verify(this.mockSkillRepo, times(1)).expandCompositions(mockSkills);

    final ArgumentCaptor<Skills> captor = ArgumentCaptor.forClass(Skills.class);
    verify(this.mockSkillRepo, times(1)).updateActiveEntity(captor.capture());

    // Assert that the database is updated correctly
    assertEquals(mockSkill.getId(), captor.getValue().getId());
    assertEquals(mockSkill.getTexts().get(0).getName(), captor.getValue().getName());
    assertEquals(mockSkill.getTexts().get(0).getDescription(), captor.getValue().getDescription());
    assertEquals(mockSkill.getTexts().get(0).getCommaSeparatedAlternativeLabels(),
        captor.getValue().getCommaSeparatedAlternativeLabels());

    // Assert that the Java objects are updated correctly
    assertEquals(mockSkill.getTexts().get(0).getName(), result.get(0).getTexts().get(0).getName());
    assertEquals(mockSkill.getTexts().get(0).getDescription(), result.get(0).getTexts().get(0).getDescription());
    assertEquals(mockSkill.getTexts().get(0).getCommaSeparatedAlternativeLabels(),
        result.get(0).getTexts().get(0).getCommaSeparatedAlternativeLabels());

    assertEquals(mockSkillsExpanded, result);
  }

  @Test
  @DisplayName("Replicate the default text content to the draft skill entity")
  void replicateDefaultTextsDraft() {
    final Skills mockSkill = SkillTestHelper.createSkill(false);
    SkillTestHelper.addTextsToSkill(mockSkill, 1, SkillTestHelper.LANGUAGE_CODE_EN, false);
    SkillTestHelper.addTextsToSkill(mockSkill, 1, SkillTestHelper.LANGUAGE_CODE_DE, false);

    final List<Skills> mockSkills = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillsExpanded = Collections.singletonList(mockSkill);

    when(this.mockSkillRepo.expandCompositions(mockSkills)).thenReturn(mockSkillsExpanded);

    final List<Skills> result = this.cut.replicateDefaultTexts(mockSkills);

    verify(this.mockSkillRepo, times(1)).expandCompositions(mockSkills);

    final ArgumentCaptor<Skills> captor = ArgumentCaptor.forClass(Skills.class);
    verify(this.mockSkillRepo, times(1)).updateDraft(captor.capture());

    // Assert that the database is updated correctly
    assertEquals(mockSkill.getId(), captor.getValue().getId());
    assertEquals(mockSkill.getTexts().get(0).getName(), captor.getValue().getName());
    assertEquals(mockSkill.getTexts().get(0).getDescription(), captor.getValue().getDescription());
    assertEquals(mockSkill.getTexts().get(0).getCommaSeparatedAlternativeLabels(),
        captor.getValue().getCommaSeparatedAlternativeLabels());

    // Assert that the Java objects are updated correctly
    assertEquals(mockSkill.getTexts().get(0).getName(), result.get(0).getTexts().get(0).getName());
    assertEquals(mockSkill.getTexts().get(0).getDescription(), result.get(0).getTexts().get(0).getDescription());
    assertEquals(mockSkill.getTexts().get(0).getCommaSeparatedAlternativeLabels(),
        result.get(0).getTexts().get(0).getCommaSeparatedAlternativeLabels());

    assertEquals(mockSkillsExpanded, result);
  }

  @Test
  @DisplayName("Abort replication if there is no default language")
  void replicateDefaultTextsWithoutDefaultLanguage() {
    when(this.mockDefaultLanguageRepository.findActiveEntityByRank(0)).thenReturn(Optional.empty());

    final Skills mockSkill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(mockSkill, 1, SkillTestHelper.LANGUAGE_CODE_DE, true);

    final List<Skills> mockSkills = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillsExpanded = Collections.singletonList(mockSkill);

    when(this.mockSkillRepo.expandCompositions(mockSkills)).thenReturn(mockSkillsExpanded);

    assertThrows(ServiceException.class, () -> this.cut.replicateDefaultTexts(mockSkills));
  }

  @Test
  @DisplayName("Abort replication if there is no default text")
  void replicateDefaultTextsWithoutDefaultText() {
    final Skills mockSkill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(mockSkill, 1, SkillTestHelper.LANGUAGE_CODE_DE, true);

    final List<Skills> mockSkills = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillsExpanded = Collections.singletonList(mockSkill);

    when(this.mockSkillRepo.expandCompositions(mockSkills)).thenReturn(mockSkillsExpanded);

    final List<Skills> result = this.cut.replicateDefaultTexts(mockSkills);

    verify(this.mockSkillRepo, times(1)).expandCompositions(mockSkills);

    assertEquals(mockSkillsExpanded, result);
  }

  @Test
  @DisplayName("isExpandNecessary empty skill")
  void isExpandNecessary1() {
    Skills skill = Skills.create();
    assertTrue(this.cut.isExpandNecessary(Collections.singletonList(skill)));
  }

  @Test
  @DisplayName("isExpandNecessary empty text")
  void isExpandNecessary2() {
    Skills skill = Skills.create();
    SkillsTexts text = SkillsTexts.create();
    skill.setTexts(Collections.singletonList(text));

    assertTrue(this.cut.isExpandNecessary(Collections.singletonList(skill)));
  }

  @Test
  @DisplayName("isExpandNecessary complete")
  void isExpandNecessary3() {
    Skills skill = Skills.create();
    SkillsTexts text = SkillsTexts.create();
    text.setLocale("");
    text.setName("");
    text.setDescription("");
    text.setCommaSeparatedAlternativeLabels("");
    skill.setTexts(Collections.singletonList(text));

    assertFalse(this.cut.isExpandNecessary(Collections.singletonList(skill)));
  }

  @Test
  @DisplayName("isExpandNecessary list")
  void isExpandNecessary4() {
    Skills skill = Skills.create();
    SkillsTexts text = SkillsTexts.create();
    text.setLocale("");
    text.setName("");
    text.setDescription("");
    text.setCommaSeparatedAlternativeLabels("");
    skill.setTexts(Collections.singletonList(text));

    Skills skill2 = Skills.create();

    assertTrue(this.cut.isExpandNecessary(Arrays.asList(skill, skill2)));
  }
}
