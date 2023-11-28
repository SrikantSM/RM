package com.sap.c4p.rm.skill.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.skill.repositories.ProficiencyLevelRepository;

import proficiencyservice.ProficiencyLevels;

@Component
public class ProficiencyLevelRankingService {
  private final ProficiencyLevelRepository proficiencyLevelRepository;

  @Autowired
  public ProficiencyLevelRankingService(final ProficiencyLevelRepository proficiencyLevelRepository) {
    this.proficiencyLevelRepository = proficiencyLevelRepository;
  }

  public ProficiencyLevels assignNextRank(final ProficiencyLevels proficiencyLevel) {
    Optional<ProficiencyLevels> highestProficiencyLevel = this.proficiencyLevelRepository
        .findHighestRankedDraftByProficiencySetId(proficiencyLevel.getProficiencySetId());

    int highestRank = highestProficiencyLevel.map(ProficiencyLevels::getRank).orElse(0);

    proficiencyLevel.setRank(highestRank + 1);
    this.proficiencyLevelRepository.updateDraft(proficiencyLevel);

    return proficiencyLevel;
  }
}
