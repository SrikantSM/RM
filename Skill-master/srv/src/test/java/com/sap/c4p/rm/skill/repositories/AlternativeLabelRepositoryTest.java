package com.sap.c4p.rm.skill.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.Result;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.draft.DraftService;

import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import skillservice.AlternativeLabels;
import skillservice.AlternativeLabels_;
import skillservice.Skills;
import skillservice.Skills_;

class AlternativeLabelRepositoryTest {
  private AlternativeLabelRepository cut;
  private DraftService mockDraftService;

  @BeforeEach
  void setup() {
    this.mockDraftService = mock(DraftService.class, RETURNS_DEEP_STUBS);
    this.cut = new AlternativeLabelRepository(this.mockDraftService);
  }

  @Test
  @DisplayName("create draft alternative labels")
  void createDrafts() {
    AlternativeLabels alternativeLabel = SkillTestHelper.createAlternativeLabel();

    CqnInsert expectedInsert = Insert.into(AlternativeLabels_.class)
        .entries(Collections.singletonList(alternativeLabel));

    this.cut.createDrafts(Collections.singletonList(alternativeLabel));

    final ArgumentCaptor<CqnInsert> argument = ArgumentCaptor.forClass(CqnInsert.class);
    verify(this.mockDraftService, times(1)).newDraft(argument.capture());
    assertEquals(expectedInsert.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("expand the parent skill correctly")
  void expandSkill() {
    AlternativeLabels label = SkillTestHelper.createAlternativeLabel();
    final CqnSelect expectedSelect = Select.from(AlternativeLabels_.class)
        .where(l -> l.ID().eq(label.getId()).and(l.IsActiveEntity().eq(label.getIsActiveEntity())))
        .columns(l -> l.skill().expand(Skills_::_all));
    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    Result mockResult = mock(Result.class);
    when(mockResult.first(AlternativeLabels.class)).thenReturn(Optional.of(label));
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    this.cut.expandSkill(label);

    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());
    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
  }

  @Test
  @DisplayName("check if deleteAlternativeLabelsForLocale() is running correctly")
  void deleteDraftsOfSkillAndLocale() {
    Skills draftSkillWithID = Skills.create();
    draftSkillWithID.setId(SkillTestHelper.SKILL_ID);
    draftSkillWithID.setIsActiveEntity(Boolean.FALSE);

    String locale = "en";

    this.cut.deleteDraftsOfSkillAndLocale(draftSkillWithID, locale);

    final ArgumentCaptor<CqnDelete> argument = ArgumentCaptor.forClass(CqnDelete.class);
    verify(this.mockDraftService).cancelDraft(argument.capture());
    CqnDelete expectedDelete = Delete.from(AlternativeLabels_.class)
        .where(l -> l.skill_ID().eq(draftSkillWithID.getId()).and(l.language_code().eq(locale)));
    assertEquals(expectedDelete.toJson(), argument.getValue().toJson());
  }
}
