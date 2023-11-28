package com.sap.c4p.rm.skill.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevelsTexts;
import proficiencyservice.ProficiencyLevelsTexts_;
import proficiencyservice.ProficiencyLevels_;

class ProficiencyLevelRepositoryTest {
  private ProficiencyLevelRepository cut;
  private DraftService mockDraftService;
  private PersistenceService mockPersistenceService;

  @BeforeEach
  void setUp() {
    this.mockPersistenceService = mock(PersistenceService.class);
    this.mockDraftService = mock(DraftService.class);
    this.cut = new ProficiencyLevelRepository(this.mockDraftService, this.mockPersistenceService);
  }

  @Test
  @DisplayName("verify that invocation of updateActiveEntity() results in the right interaction with PersistenceService")
  void updateActiveEntity() {
    final ProficiencyLevels testLevels = ProficiencyLevels.create();

    this.cut.updateActiveEntity(testLevels);

    verify(this.mockPersistenceService, times(1)).run(any(CqnUpdate.class));
    verifyNoMoreInteractions(this.mockPersistenceService);
    verifyNoInteractions(this.mockDraftService);
  }

  @Test
  @DisplayName("verify that a proficiencyLevel will be found by an proficiencyLevelText")
  void findByProficiencyLevelText() {
    final ProficiencyLevelsTexts proficiencyLevelsTexts = ProficiencyLevelsTexts.create();

    final Result mockResult = mock(Result.class);
    final ProficiencyLevels proficiencyLevels = ProficiencyLevels.create();
    final List<ProficiencyLevels> proficiencyLevelsList = Collections.singletonList(proficiencyLevels);

    when(mockResult.listOf(ProficiencyLevels.class)).thenReturn(proficiencyLevelsList);

    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    assertEquals(proficiencyLevelsList, this.cut.findByProficiencyLevelText(proficiencyLevelsTexts));

    verify(this.mockDraftService, times(1)).run(any(CqnSelect.class));
    verifyNoMoreInteractions(this.mockPersistenceService);
  }

  @Test
  @DisplayName("update a draft proficiency level")
  void updateDraft() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId("ID");

    final CqnUpdate expectedUpdate = Update.entity(ProficiencyLevels_.class)
        .where(s -> s.ID().eq(proficiencyLevel.getId()).and(s.IsActiveEntity().eq(Boolean.FALSE)))
        .data(proficiencyLevel);

    this.cut.updateDraft(proficiencyLevel);

    final ArgumentCaptor<CqnUpdate> argument = ArgumentCaptor.forClass(CqnUpdate.class);
    verify(this.mockDraftService, times(1)).patchDraft(argument.capture());
    assertEquals(expectedUpdate.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("find a proficiency level by its id correctly")
  void findById() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId("ID");
    proficiencyLevel.setIsActiveEntity(Boolean.FALSE);

    final CqnSelect expectedSelect = Select.from(ProficiencyLevels_.class).where(
        x -> x.ID().eq(proficiencyLevel.getId()).and(x.IsActiveEntity().eq(proficiencyLevel.getIsActiveEntity())));

    final Optional<ProficiencyLevels> expectedResult = Optional.empty();
    final Result mockResult = mock(Result.class);
    when(mockResult.first(ProficiencyLevels.class)).thenReturn(expectedResult);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    final Optional<ProficiencyLevels> actualResult = this.cut.findById(proficiencyLevel.getId(),
        proficiencyLevel.getIsActiveEntity());

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    final List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find the proficiency level with the next lower rank for a proficiency level")
  void findNextLowerRankedDraft() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId("ID");

    final CqnSelect expectedSelect = Select.from(ProficiencyLevels_.class)
        .where(x -> x.proficiencySet_ID().eq(proficiencyLevel.getProficiencySetId())
            .and(x.IsActiveEntity().eq(Boolean.FALSE)).and(x.rank().lt(proficiencyLevel.getRank())))
        .orderBy(x -> x.rank().desc());

    final Optional<ProficiencyLevels> expectedResult = Optional.empty();
    final Result mockResult = mock(Result.class);
    when(mockResult.first(ProficiencyLevels.class)).thenReturn(expectedResult);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    final Optional<ProficiencyLevels> actualResult = this.cut.findNextLowerRankedDraft(proficiencyLevel);

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    final List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find the proficiency level with the next higher rank for a proficiency level")
  void findNextHigherRankedDraft() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId("ID");

    final CqnSelect expectedSelect = Select.from(ProficiencyLevels_.class)
        .where(x -> x.proficiencySet_ID().eq(proficiencyLevel.getProficiencySetId())
            .and(x.IsActiveEntity().eq(Boolean.FALSE)).and(x.rank().gt(proficiencyLevel.getRank())))
        .orderBy(x -> x.rank().asc());

    final Optional<ProficiencyLevels> expectedResult = Optional.empty();
    final Result mockResult = mock(Result.class);
    when(mockResult.first(ProficiencyLevels.class)).thenReturn(expectedResult);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    final Optional<ProficiencyLevels> actualResult = this.cut.findNextHigherRankedDraft(proficiencyLevel);

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    final List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find the proficiency level with the next higher rank for a proficiency set")
  void findHighestRankedDraftByProficiencySetId() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId("ID");
    proficiencyLevel.setProficiencySetId("SET_ID");

    final CqnSelect expectedSelect = Select.from(ProficiencyLevels_.class).where(
        x -> x.proficiencySet_ID().eq(proficiencyLevel.getProficiencySetId()).and(x.IsActiveEntity().eq(Boolean.FALSE)))
        .orderBy(x -> x.rank().desc());

    final Optional<ProficiencyLevels> expectedResult = Optional.empty();
    final Result mockResult = mock(Result.class);
    when(mockResult.first(ProficiencyLevels.class)).thenReturn(expectedResult);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    final Optional<ProficiencyLevels> actualResult = this.cut
        .findHighestRankedDraftByProficiencySetId(proficiencyLevel.getProficiencySetId());

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    final List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find the proficiency levels for a proficiency set")
  void findActiveLevelsByProficiencySetId() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId("ID");
    proficiencyLevel.setProficiencySetId("SET_ID");

    final CqnSelect expectedSelect = Select.from(ProficiencyLevels_.class).where(
        x -> x.proficiencySet_ID().eq(proficiencyLevel.getProficiencySetId()).and(x.IsActiveEntity().eq(Boolean.TRUE)));

    final List<ProficiencyLevels> expectedResult = Collections.singletonList(proficiencyLevel);
    final Result mockResult = mock(Result.class);
    when(mockResult.listOf(ProficiencyLevels.class)).thenReturn(expectedResult);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    final List<ProficiencyLevels> actualResult = this.cut
        .findLevelsByProficiencySetId(proficiencyLevel.getProficiencySetId(), Boolean.TRUE);

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    final List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find the proficiency levels for a proficiency set")
  void findDraftLevelsByProficiencySetId() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    proficiencyLevel.setId("ID");
    proficiencyLevel.setProficiencySetId("SET_ID");

    final CqnSelect expectedSelect = Select.from(ProficiencyLevels_.class).where(x -> x.proficiencySet_ID()
        .eq(proficiencyLevel.getProficiencySetId()).and(x.IsActiveEntity().eq(Boolean.FALSE)));

    final List<ProficiencyLevels> expectedResult = Collections.singletonList(proficiencyLevel);
    final Result mockResult = mock(Result.class);
    when(mockResult.listOf(ProficiencyLevels.class)).thenReturn(expectedResult);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    final List<ProficiencyLevels> actualResult = this.cut
        .findLevelsByProficiencySetId(proficiencyLevel.getProficiencySetId(), Boolean.FALSE);

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    final List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("verify that expandTexts() ")
  void expandTexts() {
    final ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
    final String id = UUID.randomUUID().toString();
    proficiencyLevel.setId(id);

    final List<ProficiencyLevels> proficiencyLevelsList = Collections.singletonList(proficiencyLevel);

    final Result mockResult = mock(Result.class);

    final CqnSelect cqnSelect = Select.from(ProficiencyLevels_.class)
        .where(s -> s.ID().eq(proficiencyLevel.getId()).and(s.IsActiveEntity().eq(Boolean.TRUE)))
        .columns(ProficiencyLevels_::_all, s -> s.texts().expand());

    when(mockResult.single(ProficiencyLevels.class)).thenReturn(proficiencyLevel);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    final ArgumentCaptor<CqnSelect> selectCaptor = ArgumentCaptor.forClass(CqnSelect.class);

    assertEquals(proficiencyLevelsList, this.cut.expandTexts(proficiencyLevelsList));
    verify(this.mockDraftService, times(1)).run(selectCaptor.capture());
    assertEquals(cqnSelect.toString(), selectCaptor.getValue().toString());
  }

  @Test
  @DisplayName("gets maintained languages for proficiency level")
  void getLanguagesByProficiencyLevels() {
    ProficiencyLevels testProficiencyLevel1 = ProficiencyLevels.create();
    testProficiencyLevel1.setId("pl1");
    testProficiencyLevel1.setIsActiveEntity(true);
    ProficiencyLevels testProficiencyLevel2 = ProficiencyLevels.create();
    testProficiencyLevel2.setId("pl2");
    testProficiencyLevel2.setIsActiveEntity(true);

    CqnSelect expectedSelect = Select.from(ProficiencyLevels_.class)
        .columns(ProficiencyLevels_::ID, pl -> pl.texts().expand(ProficiencyLevelsTexts_::locale))
        .where(pl -> pl.ID().in("pl1", "pl2").and(pl.IsActiveEntity().eq(true)));

    Result mockResult = mock(Result.class);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    this.cut.getLanguagesByProficiencyLevels(Arrays.asList(testProficiencyLevel1, testProficiencyLevel2), true);

    final ArgumentCaptor<CqnSelect> argument = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockPersistenceService, times(1)).run(argument.capture());
    assertEquals(expectedSelect.toJson(), argument.getValue().toJson());
  }

  @Test
  @DisplayName("gets maintained languages for proficiency level")
  void getLanguagesByProficiencyLevelsDraft() {
    ProficiencyLevels testProficiencyLevel1 = ProficiencyLevels.create();
    testProficiencyLevel1.setId("pl1");
    testProficiencyLevel1.setIsActiveEntity(false);
    ProficiencyLevels testProficiencyLevel2 = ProficiencyLevels.create();
    testProficiencyLevel2.setId("pl2");
    testProficiencyLevel2.setIsActiveEntity(false);

    CqnSelect expectedSelect = Select.from(ProficiencyLevels_.class)
        .columns(ProficiencyLevels_::ID, pl -> pl.texts().expand(ProficiencyLevelsTexts_::locale))
        .where(pl -> pl.ID().in("pl1", "pl2").and(pl.IsActiveEntity().eq(false)));

    Result mockResult = mock(Result.class);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    this.cut.getLanguagesByProficiencyLevels(Arrays.asList(testProficiencyLevel1, testProficiencyLevel2), false);

    final ArgumentCaptor<CqnSelect> argument = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argument.capture());
    assertEquals(expectedSelect.toJson(), argument.getValue().toJson());
  }
}
