package com.sap.c4p.rm.skill.handlers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftNewEventContext;

import com.sap.c4p.rm.skill.services.ProficiencyLevelRankingService;
import com.sap.c4p.rm.skill.services.ProficiencyLevelTextReplicationService;

import proficiencyservice.ProficiencyLevels;

class ProficiencyLevelHandlerTest {
  /* object under test */
  private ProficiencyLevelHandler cut;
  private ProficiencyLevelHandler spiedCut;

  /* mocks */
  private final ProficiencyLevelRankingService mockProficiencyLevelRankingService = mock(
      ProficiencyLevelRankingService.class);
  private final ProficiencyLevelTextReplicationService mockProficiencyLevelTextReplicationService = mock(
      ProficiencyLevelTextReplicationService.class);

  /**
   * initialize object under test
   */
  @BeforeEach
  void beforeEach() {
    this.cut = new ProficiencyLevelHandler(this.mockProficiencyLevelRankingService,
        this.mockProficiencyLevelTextReplicationService);
    this.spiedCut = spy(this.cut);
  }

  @Test
  @DisplayName("EventHandler: Throws on direct modification")
  void beforeModification() {
    assertThrows(ServiceException.class, () -> this.cut.beforeModification());
  }

  @Test
  @DisplayName("EventHandler: After Proficiency Level Draft Creation")
  void afterDraftNew() {
    final ProficiencyLevels proficiencyLevel1 = ProficiencyLevels.create();
    proficiencyLevel1.setId("ID1");
    final ProficiencyLevels proficiencyLevel2 = ProficiencyLevels.create();
    proficiencyLevel2.setId("ID2");
    final List<ProficiencyLevels> mockProficiencyLevelList = Arrays.asList(proficiencyLevel1, proficiencyLevel2);

    final DraftNewEventContext mockContext = mock(DraftNewEventContext.class);

    final Result result = mock(Result.class);
    when(mockContext.getResult()).thenReturn(result);

    this.spiedCut.afterDraftNew(mockContext, mockProficiencyLevelList);

    verify(this.mockProficiencyLevelRankingService, times(1)).assignNextRank(proficiencyLevel1);
    verify(this.mockProficiencyLevelRankingService, times(1)).assignNextRank(proficiencyLevel2);
    verify(this.mockProficiencyLevelTextReplicationService, times(1)).createProficiencyLevelText(proficiencyLevel1);
  }
}
