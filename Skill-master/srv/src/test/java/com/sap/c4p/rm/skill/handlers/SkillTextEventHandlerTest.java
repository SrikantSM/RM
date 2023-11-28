package com.sap.c4p.rm.skill.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftCancelEventContext;

import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.services.SkillTextReplicationService;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import com.sap.resourcemanagement.config.DefaultLanguages;

import skillservice.Skills;
import skillservice.SkillsTexts;

class SkillTextEventHandlerTest {
  /* object under test */
  private SkillTextEventHandler cut;

  /* mocks */
  private DefaultLanguageRepository mockDefaultLanguageRepo = mock(DefaultLanguageRepository.class);
  private SkillTextReplicationService mockSkillTextReplicationService = mock(SkillTextReplicationService.class);
  private SkillRepository mockSkillRepository = mock(SkillRepository.class);
  private EventHandlerUtility mockEventHandlerUtility = mock(EventHandlerUtility.class);
  private DraftCancelEventContext mockDraftCancelEventContext = mock(DraftCancelEventContext.class);

  /**
   * initialize object under test
   */
  @BeforeEach
  void beforeEach() {

    // class under test
    this.cut = new SkillTextEventHandler(this.mockEventHandlerUtility, this.mockSkillTextReplicationService,
        this.mockSkillRepository);

    final DefaultLanguages defaultLanguage = DefaultLanguages.create();
    defaultLanguage.setLanguageCode(SkillTestHelper.LANGUAGE_CODE_EN);

    // mock DefaultLanguageRepo
    when(this.mockDefaultLanguageRepo.findActiveEntityByRank(anyInt())).thenReturn(Optional.of(defaultLanguage));
  }

  @Test
  @DisplayName("EventHandler: Throws on direct modification")
  void beforeModification() {
    assertThrows(ServiceException.class, () -> this.cut.beforeModification());
  }

  @Test
  @DisplayName("Check if a skill is stored in the event context before text deletion")
  void beforeDraftCancel() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setTexts(new LinkedList<>());
    final List<Skills> skillList = Collections.singletonList(skill);
    final String DELETED_TEXT_PARENTS = "DELETED_TEXT_PARENTS";

    when(this.mockSkillRepository.findBySkillText(any())).thenReturn(skillList);

    this.cut.beforeDraftCancel(this.mockDraftCancelEventContext);

    verify(this.mockEventHandlerUtility, times(1)).addKeyAttributesToEntity(any(), any(), any());
    verify(this.mockDraftCancelEventContext, times(1)).put(any(), any());
  }

  @Test
  @DisplayName("Call text replication whenever a skill text draft is deleted")
  void afterDraftCancel() {
    final Skills skill = SkillTestHelper.createSkill();
    final List<Skills> skillList = Collections.singletonList(skill);
    final List<Skills> skillListResult = Collections.singletonList(skill);
    final String DELETED_TEXT_PARENTS = "DELETED_TEXT_PARENTS";

    when(this.mockSkillTextReplicationService.replicateDefaultTexts(skillList)).thenReturn(skillListResult);
    when(this.mockDraftCancelEventContext.get(DELETED_TEXT_PARENTS)).thenReturn(skillList);

    this.cut.afterDraftCancel(this.mockDraftCancelEventContext);
    verify(this.mockSkillTextReplicationService, times(1)).replicateDefaultTexts(skillList);
  }

  @Test
  @DisplayName("Verify that removeDeletedText deletes the texts correctly")
  void removeDeletedText() {
    final Skills skill = Skills.create();
    final SkillsTexts text1 = SkillsTexts.create();
    text1.setIDTexts("Text 1");
    final SkillsTexts text2 = SkillsTexts.create();
    text2.setIDTexts("Text 2");
    skill.setTexts(Arrays.asList(text1, text2));

    this.cut.removeDeletedText(skill, text1);

    assertEquals(1, skill.getTexts().size());
    assertEquals(text2, skill.getTexts().get(0));
  }
}
