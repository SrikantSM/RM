package com.sap.c4p.rm.skill.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatchers;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftCancelEventContext;
import com.sap.cds.services.draft.DraftService;

import com.sap.c4p.rm.skill.repositories.AlternativeLabelRepository;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.services.CommaSeparatedAlternativeLabelsGenerator;
import com.sap.c4p.rm.skill.services.SkillTextReplicationService;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import skillservice.AlternativeLabels;
import skillservice.Skills;

class AlternativeLabelEventHandlerTest {
  /* object under test */
  private AlternativeLabelEventHandler cut;

  /* mocks */
  private SkillRepository mockSkillRepo;
  private AlternativeLabelRepository mockAlternativeLabelRepo;
  private EventHandlerUtility mockEventHandlerUtility;
  private SkillTextReplicationService mockSkillTextReplicationService;
  private CommaSeparatedAlternativeLabelsGenerator mockCommaSeparatedAlternativeLabelsGenerator;

  /**
   * initialize object under test
   */
  @BeforeEach
  void beforeEach() {

    // mock SkillTextRepository
    this.mockSkillRepo = mock(SkillRepository.class);
    this.mockAlternativeLabelRepo = mock(AlternativeLabelRepository.class);
    this.mockSkillTextReplicationService = mock(SkillTextReplicationService.class);
    this.mockCommaSeparatedAlternativeLabelsGenerator = mock(CommaSeparatedAlternativeLabelsGenerator.class);

    // mock EventHandlerUtility
    this.mockEventHandlerUtility = mock(EventHandlerUtility.class);

    // init class under test
    this.cut = new AlternativeLabelEventHandler(this.mockSkillRepo, this.mockAlternativeLabelRepo,
        this.mockEventHandlerUtility, this.mockSkillTextReplicationService,
        this.mockCommaSeparatedAlternativeLabelsGenerator);
  }

  @Test
  @DisplayName("EventHandler: Throws on direct modification")
  void beforeModification() {
    assertThrows(ServiceException.class, () -> this.cut.beforeModification());
  }

  @Test
  @DisplayName("EventHandler: After Draft AlternativeLabel Patch")
  void afterDraftPatch() {
    // given
    final AlternativeLabelEventHandler spiedCut = spy(this.cut);
    doNothing().when(spiedCut).updateTextsFromAlternativeLabels(any());

    AlternativeLabels label = SkillTestHelper.createAlternativeLabel();

    // when
    spiedCut.afterDraftPatch(Collections.singletonList(label));

    // then
    verify(spiedCut, times(1)).updateTextsFromAlternativeLabels(Collections.singletonList(label));
  }

  @Test
  @SuppressWarnings("unchecked")
  @DisplayName("EventHandler: After Skill Draft Label Creation")
  void afterDraftNew() {
    final AlternativeLabelEventHandler spiedCut = spy(this.cut);
    doNothing().when(spiedCut).updateTextsFromSkills(any());
    doNothing().when(spiedCut).updateTextsFromAlternativeLabels(any());

    final List<AlternativeLabels> mockAlternativeLabels = new LinkedList<>();

    spiedCut.afterDraftNew(mockAlternativeLabels);

    final ArgumentCaptor<List<AlternativeLabels>> captorList = ArgumentCaptor.forClass(List.class);
    verify(spiedCut, times(1)).updateTextsFromAlternativeLabels(captorList.capture());

    assertEquals(mockAlternativeLabels, captorList.getValue());
  }

  @Test
  @DisplayName("EventHandler: After Draft AlternativeLabel Deletion")
  void afterDraftDelete() {
    // given
    final AlternativeLabelEventHandler spiedCut = spy(this.cut);
    doNothing().when(spiedCut).updateTextsFromSkills(any());

    // create/mock context
    final DraftCancelEventContext mockContext = mock(DraftCancelEventContext.class);
    final DraftService mockService = mock(DraftService.class);
    when(mockContext.getService()).thenReturn(mockService);

    // create/mock result of CQN select
    final Result mockResult = mock(Result.class);
    when(mockService.run(ArgumentMatchers.<CqnSelect>any(), ArgumentMatchers.<Object>any())).thenReturn(mockResult);

    // create/mock result stream of CQN select
    final AlternativeLabels altLabel = AlternativeLabels.create();
    final List<AlternativeLabels> fakeList = Collections.singletonList(altLabel);
    when(mockResult.listOf(AlternativeLabels.class)).thenReturn(fakeList);

    // when
    spiedCut.afterDraftCancel(mockContext);

    // then
    verify(this.mockEventHandlerUtility, times(1)).addKeyAttributesToEntity(any(), any(), any());
    verify(spiedCut, times(1)).updateTextsFromSkills(any());
  }

  @SuppressWarnings("unchecked")
  @Test
  @DisplayName("Update Texts for a List of AlternativeLabels")
  void updateTextsFromAlternativeLabels() {
    final Skills mockSkill = SkillTestHelper.createSkill();
    SkillTestHelper.addTextsToSkill(mockSkill, 1, "de", false);
    SkillTestHelper.addTextsToSkill(mockSkill, 1, "en", false);
    SkillTestHelper.addLabelsToSkill(mockSkill, 3, "de", false);
    mockSkill.setIsActiveEntity(Boolean.FALSE);
    List<AlternativeLabels> mockAlternativeLabels = mockSkill.getAlternativeLabels();
    List<Skills> mockSkillList = Collections.singletonList(mockSkill);

    final AlternativeLabelEventHandler spiedCut = spy(this.cut);
    doNothing().when(spiedCut).updateTextsFromSkills(any());

    when(this.mockSkillRepo.findByAlternativeLabels(any(), eq(Boolean.FALSE))).thenReturn(mockSkillList);

    // act
    spiedCut.updateTextsFromAlternativeLabels(mockAlternativeLabels);

    final ArgumentCaptor<List<AlternativeLabels>> labelArgumentList = ArgumentCaptor.forClass(List.class);
    verify(this.mockSkillRepo, times(1)).findByAlternativeLabels(labelArgumentList.capture(), eq(Boolean.FALSE));
    assertEquals(labelArgumentList.getValue(), mockAlternativeLabels);

    final ArgumentCaptor<List<Skills>> skillArgumentList = ArgumentCaptor.forClass(List.class);
    verify(spiedCut, times(1)).updateTextsFromSkills(skillArgumentList.capture());
    assertEquals(skillArgumentList.getValue(), mockSkillList);
  }

  @Test
  @DisplayName("Update Texts for a single Skill")
  void updateTextsFromSkill() {
    final Skills mockSkill = SkillTestHelper.createSkill();
    final List<Skills> mockSkillList = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillListDeduped = Collections.singletonList(mockSkill);
    final List<Skills> mockSkillListResult = Collections.singletonList(mockSkill);

    when(this.mockEventHandlerUtility.dedupeSkillList(mockSkillList)).thenReturn(mockSkillListDeduped);
    when(this.mockSkillTextReplicationService.replicateDefaultTexts(mockSkillListDeduped))
        .thenReturn(mockSkillListResult);

    this.cut.updateTextsFromSkills(mockSkillList);

    verify(this.mockEventHandlerUtility, times(1)).dedupeSkillList(mockSkillList);
    verify(this.mockCommaSeparatedAlternativeLabelsGenerator, times(1))
        .updateCommaSeparatedAlternativeLabels(mockSkillListDeduped);
    verify(this.mockSkillTextReplicationService, times(1)).replicateDefaultTexts(mockSkillListDeduped);
  }
}
