package com.sap.c4p.rm.skill.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencyLevelRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencyLevelTextRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;
import com.sap.c4p.rm.skill.utils.HttpStatus;

import com.sap.resourcemanagement.config.DefaultLanguages;

import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevelsTexts;
import proficiencyservice.ProficiencySets;

@Service
public class ProficiencyLevelTextReplicationService {

  private final DefaultLanguageRepository defaultLanguageRepository;
  private final ProficiencyLevelRepository proficiencyLevelRepository;
  private final ProficiencyLevelTextRepository proficiencyLevelTextRepository;
  private final ProficiencySetRepository proficiencySetRepository;

  public ProficiencyLevelTextReplicationService(final DefaultLanguageRepository defaultLanguageRepository,
      final ProficiencyLevelRepository proficiencyLevelRepository,
      final ProficiencySetRepository proficiencySetRepository,
      final ProficiencyLevelTextRepository proficiencyLevelTextRepository) {
    this.defaultLanguageRepository = defaultLanguageRepository;
    this.proficiencyLevelRepository = proficiencyLevelRepository;
    this.proficiencySetRepository = proficiencySetRepository;
    this.proficiencyLevelTextRepository = proficiencyLevelTextRepository;
  }

  boolean isExpandNecessary(List<ProficiencyLevels> proficiencyLevels) {
    return !proficiencyLevels.stream()
        .allMatch(level -> level.getTexts() != null && level.getTexts().stream()
            .allMatch(text -> text.containsKey(ProficiencyLevelsTexts.NAME)
                && text.containsKey(ProficiencyLevelsTexts.DESCRIPTION)
                && text.containsKey(ProficiencyLevelsTexts.LOCALE)));
  }

  public List<ProficiencyLevels> replicateDefaultTexts(final List<ProficiencyLevels> proficiencyLevels) {
    List<ProficiencyLevels> expandedProficiencyLevels = proficiencyLevels;
    if (this.isExpandNecessary(proficiencyLevels)) {
      expandedProficiencyLevels = this.proficiencyLevelRepository.expandTexts(proficiencyLevels);
    }

    return this.replicate(expandedProficiencyLevels);
  }

  public List<ProficiencyLevels> replicateDefaultTexts(final ProficiencySets proficiencySet) {
    List<ProficiencyLevels> expandedProficiencyLevels = proficiencySet.getProficiencyLevels();
    if (expandedProficiencyLevels == null || isExpandNecessary(expandedProficiencyLevels)) {
      expandedProficiencyLevels = this.proficiencySetRepository.expandCompositions(proficiencySet)
          .orElseThrow(RuntimeException::new).getProficiencyLevels();
    }

    return this.replicate(expandedProficiencyLevels);
  }

  public void createProficiencyLevelText(final ProficiencyLevels proficiencyLevel) {
    if (proficiencyLevel.getTexts() == null) {
      final DefaultLanguages defaultLanguage = this.defaultLanguageRepository.findActiveEntityByRank(0)
          .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_DEFAULT_LANGUAGE));

      final ProficiencyLevelsTexts proficiencyLevelText = ProficiencyLevelsTexts.create();
      proficiencyLevelText.setLocale(defaultLanguage.getLanguageCode());
      proficiencyLevelText.setId(proficiencyLevel.getId());
      proficiencyLevelText.setName(proficiencyLevel.getName());
      proficiencyLevelText.setDescription(proficiencyLevel.getDescription());
      this.proficiencyLevelTextRepository.createDraft(proficiencyLevelText);
    }
  }

  List<ProficiencyLevels> replicate(final List<ProficiencyLevels> expandedProficiencyLevels) {
    final DefaultLanguages defaultLanguage = this.defaultLanguageRepository.findActiveEntityByRank(0)
        .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_DEFAULT_LANGUAGE));

    expandedProficiencyLevels.forEach(proficiencyLevel -> {
      final Optional<ProficiencyLevelsTexts> defaultText = proficiencyLevel.getTexts().stream()
          .filter(s -> defaultLanguage.getLanguageCode().equals(s.getLocale())).findFirst();

      defaultText.ifPresent(text -> {
        proficiencyLevel.setName(text.getName());
        proficiencyLevel.setDescription(text.getDescription());

        final ProficiencyLevels shallowProficiencyLevels = ProficiencyLevels.create();
        shallowProficiencyLevels.setId(proficiencyLevel.getId());
        shallowProficiencyLevels.setName(proficiencyLevel.getName());
        shallowProficiencyLevels.setDescription(proficiencyLevel.getDescription());

        if (Boolean.TRUE.equals(proficiencyLevel.getIsActiveEntity())) {
          this.proficiencyLevelRepository.updateActiveEntity(shallowProficiencyLevels);
        } else {
          this.proficiencyLevelRepository.updateDraft(shallowProficiencyLevels);
        }
      });
    });

    return expandedProficiencyLevels;
  }
}
