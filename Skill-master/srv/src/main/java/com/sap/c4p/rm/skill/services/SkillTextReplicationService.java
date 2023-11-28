package com.sap.c4p.rm.skill.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.utils.HttpStatus;

import com.sap.resourcemanagement.config.DefaultLanguages;

import skillservice.Skills;
import skillservice.SkillsTexts;

@Service
public class SkillTextReplicationService {

  private final DefaultLanguageRepository defaultLanguageRepository;
  private final SkillRepository skillRepository;

  public SkillTextReplicationService(DefaultLanguageRepository defaultLanguageRepository,
      SkillRepository skillRepository) {
    this.defaultLanguageRepository = defaultLanguageRepository;
    this.skillRepository = skillRepository;
  }

  boolean isExpandNecessary(List<Skills> skills) {
    return !skills.stream()
        .allMatch(skill -> skill.getTexts() != null && skill.getTexts().stream()
            .allMatch(text -> text.containsKey(SkillsTexts.NAME) && text.containsKey(SkillsTexts.DESCRIPTION)
                && text.containsKey(SkillsTexts.COMMA_SEPARATED_ALTERNATIVE_LABELS)
                && text.containsKey(SkillsTexts.LOCALE)));
  }

  /**
   * Replicates the content of the {@link SkillsTexts} in the default language to
   * the parent {@link Skills} entity for each given {@link Skills}.
   *
   * @param skills {@link Skills}
   * @return {@link List} of {@link Skills} that were updated
   */
  public List<Skills> replicateDefaultTexts(List<Skills> skills) {
    List<Skills> expandedSkills = skills;
    if (this.isExpandNecessary(skills)) {
      expandedSkills = this.skillRepository.expandCompositions(skills);
    }

    DefaultLanguages defaultLanguage = this.defaultLanguageRepository.findActiveEntityByRank(0)
        .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_DEFAULT_LANGUAGE));

    expandedSkills.forEach(skill -> {
      Optional<SkillsTexts> defaultText = skill.getTexts().stream()
          .filter(s -> defaultLanguage.getLanguageCode().equals(s.getLocale())).findFirst();

      defaultText.ifPresent(text -> {
        skill.setName(text.getName());
        skill.setDescription(text.getDescription());
        skill.setCommaSeparatedAlternativeLabels(text.getCommaSeparatedAlternativeLabels());

        Skills shallowSkill = Skills.create();
        shallowSkill.setId(skill.getId());
        shallowSkill.setName(skill.getName());
        shallowSkill.setDescription(skill.getDescription());
        shallowSkill.setCommaSeparatedAlternativeLabels(skill.getCommaSeparatedAlternativeLabels());

        if (Boolean.TRUE.equals(skill.getIsActiveEntity())) {
          this.skillRepository.updateActiveEntity(shallowSkill);
        } else {
          this.skillRepository.updateDraft(shallowSkill);
        }
      });
    });
    return expandedSkills;
  }
}
