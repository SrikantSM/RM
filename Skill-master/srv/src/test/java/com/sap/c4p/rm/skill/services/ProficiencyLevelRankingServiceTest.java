package com.sap.c4p.rm.skill.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.c4p.rm.skill.repositories.ProficiencyLevelRepository;

import proficiencyservice.ProficiencyLevels;

class ProficiencyLevelRankingServiceTest {
  /* object under test */
  private ProficiencyLevelRankingService spiedCut;

  /* mocks */
  private ProficiencyLevelRepository mockProficiencyLevelRepository;

  @BeforeEach
  void beforeEach() {
    this.mockProficiencyLevelRepository = mock(ProficiencyLevelRepository.class);

    this.spiedCut = spy(new ProficiencyLevelRankingService(this.mockProficiencyLevelRepository));
  }

  @Test
  @DisplayName("Assign the next available rank to a proficiency level when other proficiency levels exist")
  void assignNextRankOthersExisting() {
    final ProficiencyLevels proficiencyLevel1 = ProficiencyLevels.create();
    proficiencyLevel1.setId("ID1");
    proficiencyLevel1.setIsActiveEntity(Boolean.FALSE);
    proficiencyLevel1.setProficiencySetId("SET_ID1");
    final ProficiencyLevels proficiencyLevel2 = ProficiencyLevels.create();
    proficiencyLevel2.setId("ID2");
    proficiencyLevel2.setIsActiveEntity(Boolean.FALSE);
    proficiencyLevel2.setRank(1);

    when(this.mockProficiencyLevelRepository
        .findHighestRankedDraftByProficiencySetId(proficiencyLevel1.getProficiencySetId()))
            .thenReturn(Optional.of(proficiencyLevel2));

    final ProficiencyLevels result = this.spiedCut.assignNextRank(proficiencyLevel1);

    verify(this.mockProficiencyLevelRepository, times(1))
        .findHighestRankedDraftByProficiencySetId(proficiencyLevel1.getProficiencySetId());
    verify(this.mockProficiencyLevelRepository, times(1)).updateDraft(proficiencyLevel1);

    assertEquals(proficiencyLevel2.getRank() + 1, result.getRank());
  }

  @Test
  @DisplayName("Assign the next available rank to a proficiency level when no other proficiency levels exist")
  void assignNextRankOthersNotExisting() {
    final ProficiencyLevels proficiencyLevel1 = ProficiencyLevels.create();
    proficiencyLevel1.setId("ID1");
    proficiencyLevel1.setIsActiveEntity(Boolean.FALSE);
    proficiencyLevel1.setProficiencySetId("SET_ID1");
    final ProficiencyLevels proficiencyLevel2 = ProficiencyLevels.create();
    proficiencyLevel2.setId("ID2");
    proficiencyLevel2.setIsActiveEntity(Boolean.FALSE);
    proficiencyLevel2.setRank(1);

    when(this.mockProficiencyLevelRepository
        .findHighestRankedDraftByProficiencySetId(proficiencyLevel1.getProficiencySetId()))
            .thenReturn(Optional.empty());

    final ProficiencyLevels result = this.spiedCut.assignNextRank(proficiencyLevel1);

    verify(this.mockProficiencyLevelRepository, times(1))
        .findHighestRankedDraftByProficiencySetId(proficiencyLevel1.getProficiencySetId());
    verify(this.mockProficiencyLevelRepository, times(1)).updateDraft(proficiencyLevel1);

    assertEquals(1, result.getRank());
  }
}
