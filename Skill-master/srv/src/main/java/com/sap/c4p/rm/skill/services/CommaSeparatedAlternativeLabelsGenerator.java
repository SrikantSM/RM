package com.sap.c4p.rm.skill.services;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.repositories.SkillTextRepository;

import skillservice.AlternativeLabels;
import skillservice.Skills;
import skillservice.SkillsTexts;

@Service
public class CommaSeparatedAlternativeLabelsGenerator {

  private final SkillRepository skillRepository;
  private final SkillTextRepository skillTextRepository;

  public CommaSeparatedAlternativeLabelsGenerator(SkillRepository skillRepository,
      SkillTextRepository skillTextRepository) {
    this.skillRepository = skillRepository;
    this.skillTextRepository = skillTextRepository;
  }

  boolean isExpandNecessary(List<Skills> skills) {
    return !skills.stream().allMatch(skill -> skill.getAlternativeLabels() != null && skill.getTexts() != null
        && skill.getAlternativeLabels().stream().allMatch(
            label -> label.containsKey(AlternativeLabels.LANGUAGE_CODE) && label.containsKey(AlternativeLabels.NAME))
        && skill.getTexts().stream()
            .allMatch(text -> text.containsKey(SkillsTexts.ID_TEXTS) && text.containsKey(SkillsTexts.LOCALE)));
  }

  /**
   * Updates the comma-separated alternative labels of {@link SkillsTexts} of
   * given {@link Skills}
   *
   * @param skills {@link Skills}
   */
  public List<Skills> updateCommaSeparatedAlternativeLabels(List<Skills> skills) {
    List<Skills> expandedSkills = skills;
    if (isExpandNecessary(skills)) {
      expandedSkills = this.skillRepository.expandCompositions(skills);
    }

    expandedSkills.forEach(expandedSkill -> {
      this.addCommaSeparatedAlternativeLabels(expandedSkill);

      expandedSkill.getTexts().forEach(text -> {
        SkillsTexts shallowText = SkillsTexts.create();
        shallowText.setIDTexts(text.getIDTexts());
        shallowText.setCommaSeparatedAlternativeLabels(text.getCommaSeparatedAlternativeLabels());

        if (Boolean.TRUE.equals(expandedSkill.getIsActiveEntity())) {
          this.skillTextRepository.updateActiveEntity(shallowText);
        } else {
          this.skillTextRepository.updateDraft(shallowText);
        }
      });
    });

    return expandedSkills;
  }

  /**
   * Generates a string representation of the {@link AlternativeLabels} of a
   * {@link Skills} and stores it in the {@link SkillsTexts}. This is done for
   * each language.
   *
   * @param skill {@link Skills}
   */
  void addCommaSeparatedAlternativeLabels(Skills skill) {
    Map<String, String> commaSeparated;

    if (skill.getAlternativeLabels() == null) {
      commaSeparated = new HashMap<>();
    } else {
      commaSeparated = skill.getAlternativeLabels().stream()
          .filter(label -> label.getLanguageCode() != null && label.getName() != null
              && !label.getLanguageCode().isEmpty() && !label.getName().isEmpty())
          .sorted(Comparator.comparing(AlternativeLabels::getName))
          .collect(Collectors.groupingBy(AlternativeLabels::getLanguageCode,
              Collectors.mapping(AlternativeLabels::getName, Collectors.joining(", "))));
    }

    for (SkillsTexts text : skill.getTexts()) {
      text.setCommaSeparatedAlternativeLabels(commaSeparated.getOrDefault(text.getLocale(), ""));
    }
  }
}
