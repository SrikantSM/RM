package com.sap.c4p.rm.skill.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.repositories.SkillTextRepository;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import skillservice.AlternativeLabels;
import skillservice.Languages;
import skillservice.Skills;
import skillservice.SkillsTexts;

class CommaSeparatedAlternativeLabelsGeneratorTest {
  /* object under test */
  private CommaSeparatedAlternativeLabelsGenerator cut;

  /* mocks */
  private SkillRepository mockSkillRepo;
  private SkillTextRepository mockSkillTextRepo;

  @BeforeEach
  void beforeEach() {
    this.mockSkillRepo = mock(SkillRepository.class);
    this.mockSkillTextRepo = mock(SkillTextRepository.class);

    this.cut = new CommaSeparatedAlternativeLabelsGenerator(this.mockSkillRepo, this.mockSkillTextRepo);
  }

  @Test
  @DisplayName("Update the comma-separated alternative labels for an active skill")
  void updateCommaSeparatedAlternativeLabelsActiveSkill() {
    final Languages language = Languages.create();
    language.setCode(SkillTestHelper.LANGUAGE_CODE_EN);

    final Skills mockSkill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(mockSkill, 1, "de", true);
    SkillTestHelper.addLabelsToSkill(mockSkill, 3, "de", true);

    final List<Skills> mockSkills = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillsExpanded = Collections.singletonList(mockSkill);

    CommaSeparatedAlternativeLabelsGenerator spyCut = spy(this.cut);
    doNothing().when(spyCut).addCommaSeparatedAlternativeLabels(any());

    when(this.mockSkillRepo.expandCompositions(mockSkills)).thenReturn(mockSkillsExpanded);

    spyCut.updateCommaSeparatedAlternativeLabels(mockSkills);

    verify(this.mockSkillRepo, times(1)).expandCompositions(mockSkills);

    final ArgumentCaptor<SkillsTexts> captor = ArgumentCaptor.forClass(SkillsTexts.class);
    verify(this.mockSkillTextRepo, times(1)).updateActiveEntity(captor.capture());

    assertEquals(mockSkill.getTexts().get(0).getIDTexts(), captor.getValue().getIDTexts());
    assertEquals(mockSkill.getTexts().get(0).getCommaSeparatedAlternativeLabels(),
        captor.getValue().getCommaSeparatedAlternativeLabels());
  }

  @Test
  @DisplayName("Update the comma-separated alternative labels for a draft skill")
  void updateCommaSeparatedAlternativeLabelsDraftSkill() {
    final Languages language = Languages.create();
    language.setCode(SkillTestHelper.LANGUAGE_CODE_EN);

    final Skills mockSkill = SkillTestHelper.createSkill(false);
    SkillTestHelper.addTextsToSkill(mockSkill, 1, "de", false);
    SkillTestHelper.addLabelsToSkill(mockSkill, 3, "de", false);

    final List<Skills> mockSkills = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillsExpanded = Collections.singletonList(mockSkill);

    CommaSeparatedAlternativeLabelsGenerator spyCut = spy(this.cut);
    doNothing().when(spyCut).addCommaSeparatedAlternativeLabels(any());

    when(this.mockSkillRepo.expandCompositions(mockSkills)).thenReturn(mockSkillsExpanded);

    spyCut.updateCommaSeparatedAlternativeLabels(mockSkills);

    verify(this.mockSkillRepo, times(1)).expandCompositions(mockSkills);

    final ArgumentCaptor<SkillsTexts> captor = ArgumentCaptor.forClass(SkillsTexts.class);
    verify(this.mockSkillTextRepo, times(1)).updateDraft(captor.capture());

    assertEquals(mockSkill.getTexts().get(0).getIDTexts(), captor.getValue().getIDTexts());
    assertEquals(mockSkill.getTexts().get(0).getCommaSeparatedAlternativeLabels(),
        captor.getValue().getCommaSeparatedAlternativeLabels());
  }

  @Test
  @DisplayName("Add the comma-separated alternative labels to a skill")
  void addCommaSeparatedAlternativeLabels() {
    Skills skill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", true);
    SkillTestHelper.addTextsToSkill(skill, 1, "de", true);
    SkillTestHelper.addLabelsToSkill(skill, 3, "en", true);

    this.cut.addCommaSeparatedAlternativeLabels(skill);

    assertEquals("aName#0, aName#1, aName#2", skill.getTexts().get(0).getCommaSeparatedAlternativeLabels());
    assertEquals("", skill.getTexts().get(1).getCommaSeparatedAlternativeLabels());
  }

  @Test
  @DisplayName("Add the comma-separated alternative labels to a skill if the name is null")
  void addCommaSeparatedAlternativeLabelsNameNull() {
    Skills skill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", true);
    SkillTestHelper.addTextsToSkill(skill, 1, "de", true);
    SkillTestHelper.addLabelsToSkill(skill, 3, "en", true);

    skill.getAlternativeLabels().forEach(a -> a.setName(null));

    this.cut.addCommaSeparatedAlternativeLabels(skill);

    assertEquals("", skill.getTexts().get(0).getCommaSeparatedAlternativeLabels());
  }

  @Test
  @DisplayName("Add the comma-separated alternative labels to a skill if the language code is null")
  void addCommaSeparatedAlternativeLabelsLanguageCodeNull() {
    Skills skill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", true);
    SkillTestHelper.addTextsToSkill(skill, 1, "de", true);
    SkillTestHelper.addLabelsToSkill(skill, 3, null, true);

    this.cut.addCommaSeparatedAlternativeLabels(skill);

    assertEquals("", skill.getTexts().get(0).getCommaSeparatedAlternativeLabels());
  }

  @Test
  @DisplayName("Add the comma-separated alternative labels to a skill if the name is empty")
  void addCommaSeparatedAlternativeLabelsNameEmpty() {
    Skills skill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", true);
    SkillTestHelper.addTextsToSkill(skill, 1, "de", true);
    SkillTestHelper.addLabelsToSkill(skill, 3, "en", true);

    skill.getAlternativeLabels().forEach(a -> a.setName(""));

    this.cut.addCommaSeparatedAlternativeLabels(skill);

    assertEquals("", skill.getTexts().get(0).getCommaSeparatedAlternativeLabels());
  }

  @Test
  @DisplayName("Add the comma-separated alternative labels to a skill if the language code is empty")
  void addCommaSeparatedAlternativeLabelsLanguageCodeEmpty() {
    Skills skill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", true);
    SkillTestHelper.addTextsToSkill(skill, 1, "de", true);
    SkillTestHelper.addLabelsToSkill(skill, 3, "", true);

    this.cut.addCommaSeparatedAlternativeLabels(skill);

    assertEquals("", skill.getTexts().get(0).getCommaSeparatedAlternativeLabels());
  }

  @Test
  @DisplayName("Add the comma-separated alternative labels to a skill if the alternative labels are null")
  void addCommaSeparatedAlternativeLabelsNull() {
    Skills skill = SkillTestHelper.createSkill(true);
    SkillTestHelper.addTextsToSkill(skill, 1, "en", true);
    SkillTestHelper.addTextsToSkill(skill, 1, "de", true);

    this.cut.addCommaSeparatedAlternativeLabels(skill);

    assertEquals("", skill.getTexts().get(0).getCommaSeparatedAlternativeLabels());
  }

  @Test
  @DisplayName("isExpandNecessary empty skill")
  void isExpandNecessary1() {
    Skills skill = Skills.create();
    assertTrue(this.cut.isExpandNecessary(Collections.singletonList(skill)));
  }

  @Test
  @DisplayName("isExpandNecessary empty text and label")
  void isExpandNecessary2() {
    Skills skill = Skills.create();
    SkillsTexts text = SkillsTexts.create();
    AlternativeLabels label = AlternativeLabels.create();
    skill.setTexts(Collections.singletonList(text));
    skill.setAlternativeLabels(Collections.singletonList(label));

    assertTrue(this.cut.isExpandNecessary(Collections.singletonList(skill)));
  }

  @Test
  @DisplayName("isExpandNecessary complete")
  void isExpandNecessary3() {
    Skills skill = Skills.create();
    SkillsTexts text = SkillsTexts.create();
    text.setLocale("");
    text.setIDTexts("");
    AlternativeLabels label = AlternativeLabels.create();
    label.setName("");
    label.setLanguageCode("");
    skill.setTexts(Collections.singletonList(text));
    skill.setAlternativeLabels(Collections.singletonList(label));

    assertFalse(this.cut.isExpandNecessary(Collections.singletonList(skill)));
  }

  @Test
  @DisplayName("isExpandNecessary only label")
  void isExpandNecessary4() {
    Skills skill = Skills.create();
    SkillsTexts text = SkillsTexts.create();
    AlternativeLabels label = AlternativeLabels.create();
    label.setName("");
    label.setLanguageCode("");
    skill.setTexts(Collections.singletonList(text));
    skill.setAlternativeLabels(Collections.singletonList(label));

    assertTrue(this.cut.isExpandNecessary(Collections.singletonList(skill)));
  }

  @Test
  @DisplayName("isExpandNecessary only text")
  void isExpandNecessary5() {
    Skills skill = Skills.create();
    SkillsTexts text = SkillsTexts.create();
    text.setLocale("");
    text.setIDTexts("");
    AlternativeLabels label = AlternativeLabels.create();
    skill.setTexts(Collections.singletonList(text));
    skill.setAlternativeLabels(Collections.singletonList(label));

    assertTrue(this.cut.isExpandNecessary(Collections.singletonList(skill)));
  }

  @Test
  @DisplayName("isExpandNecessary list")
  void isExpandNecessary6() {
    Skills skill = Skills.create();
    SkillsTexts text = SkillsTexts.create();
    text.setLocale("");
    text.setIDTexts("");
    skill.setTexts(Collections.singletonList(text));

    Skills skill2 = Skills.create();

    assertTrue(this.cut.isExpandNecessary(Arrays.asList(skill, skill2)));
  }
}
