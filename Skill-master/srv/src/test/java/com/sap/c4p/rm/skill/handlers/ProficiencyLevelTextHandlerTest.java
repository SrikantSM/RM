package com.sap.c4p.rm.skill.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftCancelEventContext;
import com.sap.cds.services.draft.DraftPatchEventContext;

import com.sap.c4p.rm.skill.repositories.ProficiencyLevelRepository;
import com.sap.c4p.rm.skill.services.ProficiencyLevelTextReplicationService;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;

import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevelsTexts;

class ProficiencyLevelTextHandlerTest {

  /* object under test */
  private ProficiencyLevelTextHandler cut;

  /* mocks */
  private ProficiencyLevelRepository mockProficiencyLevelRepository;
  private ProficiencyLevelTextReplicationService mockProficiencyLevelTextReplicationService;
  private EventHandlerUtility mockEventHandlerUtility;
  private DraftPatchEventContext mockDraftPatchEventContext;
  private DraftCancelEventContext mockDraftCancelEventContext;

  /**
   * initialize object under test
   */
  @BeforeEach
  void beforeEach() {

    /* mocks */
    this.mockProficiencyLevelRepository = mock(ProficiencyLevelRepository.class);
    this.mockProficiencyLevelTextReplicationService = mock(ProficiencyLevelTextReplicationService.class);
    this.mockEventHandlerUtility = mock(EventHandlerUtility.class);
    this.mockDraftPatchEventContext = mock(DraftPatchEventContext.class);
    this.mockDraftCancelEventContext = mock(DraftCancelEventContext.class);

    // class under test
    this.cut = new ProficiencyLevelTextHandler(this.mockEventHandlerUtility,
        this.mockProficiencyLevelTextReplicationService, this.mockProficiencyLevelRepository);
  }

  @Test
  @DisplayName("EventHandler: Throws on direct modification")
  void beforeModification() {
    assertThrows(ServiceException.class, () -> this.cut.beforeModification());
  }

  @Test
  @DisplayName("calls text replication [correctly]")
  void afterDraftPatch() {
    final List<ProficiencyLevelsTexts> proficiencyLevelsTexts = ProficiencyLevelTextHandlerTest
        .getProficiencyLevelTexts();

    final List<ProficiencyLevels> proficiencyLevelsOne = Collections.singletonList(ProficiencyLevels.create());
    final List<ProficiencyLevels> proficiencyLevelsTwo = Collections.singletonList(ProficiencyLevels.create());

    when(this.mockProficiencyLevelRepository.findByProficiencyLevelText(any())).thenReturn(proficiencyLevelsOne);
    when(this.mockEventHandlerUtility.dedupeProficiencyLevelList(any())).thenReturn(proficiencyLevelsTwo);

    this.cut.afterDraftPatch(this.mockDraftPatchEventContext, proficiencyLevelsTexts);

    verify(this.mockProficiencyLevelTextReplicationService).replicateDefaultTexts(proficiencyLevelsTwo);
  }

  @Test
  @DisplayName("Check if a Proficiency Set is stored in the event context before draft cancel")
  void beforeDraftCancel() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId("ID1");
    proficiencyLevel.setTexts(new LinkedList<>());
    final List<ProficiencyLevels> proficiencyLevelList = Collections.singletonList(proficiencyLevel);

    when(this.mockProficiencyLevelRepository.findByProficiencyLevelText(any())).thenReturn(proficiencyLevelList);

    this.cut.beforeDraftCancel(this.mockDraftCancelEventContext);

    verify(this.mockEventHandlerUtility, times(1)).addKeyAttributesToEntity(any(), any(), any());
    verify(this.mockDraftCancelEventContext, times(1)).put(any(), any());
  }

  @Test
  @DisplayName("Call text replication whenever a proficiencyLevel text draft is deleted")
  void afterDraftCancel() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId("ID1");
    final List<ProficiencyLevels> proficiencyLevelList = Collections.singletonList(proficiencyLevel);
    final List<ProficiencyLevels> proficiencyLevelListResult = Collections.singletonList(proficiencyLevel);
    final String DELETED_TEXT_PARENTS = "DELETED_TEXT_PARENTS";

    when(this.mockDraftCancelEventContext.get(DELETED_TEXT_PARENTS)).thenReturn(proficiencyLevelList);

    this.cut.afterDraftCancel(this.mockDraftCancelEventContext);
    verify(this.mockProficiencyLevelTextReplicationService, times(1)).replicateDefaultTexts(proficiencyLevelList);
  }

  private static List<ProficiencyLevelsTexts> getProficiencyLevelTexts() {
    final ProficiencyLevelsTexts proficiencyLevelsTexts = ProficiencyLevelsTexts.create();
    final List<ProficiencyLevelsTexts> proficiencyLevelsTextsList = new ArrayList<>();
    proficiencyLevelsTextsList.add(proficiencyLevelsTexts);
    return proficiencyLevelsTextsList;
  }

  @Test
  @DisplayName("Verify that removeDeletedText deletes the texts correctly")
  void removeDeletedText() {
    final ProficiencyLevels level = ProficiencyLevels.create();
    final ProficiencyLevelsTexts text1 = ProficiencyLevelsTexts.create();
    text1.setIDTexts("Text 1");
    final ProficiencyLevelsTexts text2 = ProficiencyLevelsTexts.create();
    text2.setIDTexts("Text 2");
    level.setTexts(Arrays.asList(text1, text2));

    this.cut.removeDeletedText(level, text1);

    assertEquals(1, level.getTexts().size());
    assertEquals(text2, level.getTexts().get(0));
  }
}
