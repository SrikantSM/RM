package com.sap.c4p.rm.skill.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.Result;
import com.sap.cds.ql.CQL;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import proficiencyservice.ProficiencyLevelsTexts_;
import proficiencyservice.ProficiencyLevels_;
import proficiencyservice.ProficiencySets;
import proficiencyservice.ProficiencySets_;

class ProficiencySetRepositoryTest {

  private final static String PROFICIENCY_SET_ID = "testProficiencySetId";
  private final static String PROFICIENCY_SET_NAME = "testProficiencySetName";

  private ProficiencySetRepository cut;
  private PersistenceService mockPersistenceService;
  private DraftService mockDraftService;

  @BeforeEach
  public void setUp() {
    this.mockPersistenceService = mock(PersistenceService.class);
    this.mockDraftService = mock(DraftService.class);
    this.cut = new ProficiencySetRepository(this.mockDraftService, this.mockPersistenceService);
  }

  @Test
  @DisplayName("verify that create() invokes all expected methods with expected arguments and expected return values")
  void findById() {
    final ProficiencySets testProficiencySet = ProficiencySets.create();
    testProficiencySet.setId(PROFICIENCY_SET_ID);
    testProficiencySet.setIsActiveEntity(true);
    final CqnSelect expectedSelect = Select.from(ProficiencySets_.class).where(
        a -> a.ID().eq(testProficiencySet.getId()).and(a.IsActiveEntity().eq(testProficiencySet.getIsActiveEntity())))
        .columns(ProficiencySets_::_all);

    final Optional<ProficiencySets> expectedResult = Optional.empty();
    final Result mockResult = mock(Result.class);
    when(mockResult.first(ProficiencySets.class)).thenReturn(expectedResult);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

    final Optional<ProficiencySets> actualResult = this.cut.findById(PROFICIENCY_SET_ID, true);

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    final List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("find active entity by ID correctly")
  void findActiveEntityById() {
    final CqnSelect expectedSelect = Select.from(ProficiencySets_.class).where(p -> p.ID().eq(""))
        .columns(ProficiencySets_::_all);

    Optional<ProficiencySets> expectedResult = Optional.of(ProficiencySets.create());
    Result mockResult = mock(Result.class);
    when(mockResult.first(ProficiencySets.class)).thenReturn(expectedResult);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    Optional<ProficiencySets> actualResult = this.cut.findActiveEntityById("");

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockPersistenceService, times(1)).run(argumentSelect.capture());

    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }

  @Test
  @DisplayName("verify that upsert() invokes all expected methods with expected arguments in case of create")
  void upsertInsert() {
    final com.sap.resourcemanagement.skill.ProficiencySets testProficiencySet = com.sap.resourcemanagement.skill.ProficiencySets
        .create();
    testProficiencySet.setName("Default proficiency set name");
    testProficiencySet.setDescription("Default proficiency set description");

    final CqnInsert expectedStatement = Insert.into(com.sap.resourcemanagement.skill.ProficiencySets_.class)
        .entry(testProficiencySet);
    final ArgumentCaptor<CqnInsert> argumentUpsert = ArgumentCaptor.forClass(CqnInsert.class);
    final Result mockResult = mock(Result.class);
    when(mockResult.first(any())).thenReturn(Optional.empty());
    when(this.mockPersistenceService.run(any(Insert.class))).thenReturn(mockResult);
    when(this.mockPersistenceService.run(any(Select.class))).thenReturn(mockResult);

    this.cut.upsert(testProficiencySet);

    verify(this.mockPersistenceService, times(1)).run(argumentUpsert.capture());
    final CqnInsert capturedInsert = argumentUpsert.getValue();
    assertEquals(expectedStatement.toString(), capturedInsert.toString());
  }

  @Test
  @DisplayName("verify that upsert() invokes all expected methods with expected arguments in case of update")
  void upsertUpdate() {
    final com.sap.resourcemanagement.skill.ProficiencySets testProficiencySet = com.sap.resourcemanagement.skill.ProficiencySets
        .create();
    testProficiencySet.setName("Default proficiency set name");
    testProficiencySet.setDescription("Default proficiency set description");

    final CqnUpdate expectedStatement = Update.entity(com.sap.resourcemanagement.skill.ProficiencySets_.class)
        .data(testProficiencySet);
    final ArgumentCaptor<CqnUpdate> argumentUpdate = ArgumentCaptor.forClass(CqnUpdate.class);
    final Result mockResult = mock(Result.class);
    when(mockResult.first(any())).thenReturn(Optional.of(testProficiencySet));
    when(this.mockPersistenceService.run(any(Update.class))).thenReturn(mockResult);
    when(this.mockPersistenceService.run(any(Select.class))).thenReturn(mockResult);

    this.cut.upsert(testProficiencySet);

    verify(this.mockPersistenceService, times(1)).run(argumentUpdate.capture());
    final CqnUpdate capturedUpdate = argumentUpdate.getValue();
    assertEquals(expectedStatement.toString(), capturedUpdate.toString());
  }

  @Test
  @DisplayName("verify that createDraft() interacts as expected with DraftService")
  void createDraft() {
    // given
    final ProficiencySets testSets = ProficiencySets.create();

    final Result mockResult = mock(Result.class);
    when(this.mockDraftService.newDraft(any(CqnInsert.class))).thenReturn(mockResult);

    when(mockResult.single(ProficiencySets.class)).thenReturn(testSets);

    // when
    final ProficiencySets result = this.cut.createDraft(testSets);

    // then
    verify(this.mockDraftService, times(1)).newDraft(any(CqnInsert.class));
    verify(mockResult, times(1)).single(ProficiencySets.class);
    assertEquals(result, testSets);
  }

  @Test
  @DisplayName("expandCompositions correctly")
  void expandCompositions() {
    final ProficiencySets testSet = ProficiencySets.create();
    testSet.setId(PROFICIENCY_SET_ID);
    final Result mockResult = mock(Result.class);
    when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);
    when(mockResult.first(ProficiencySets.class)).thenReturn(Optional.of(testSet));

    this.cut.expandCompositions(testSet);
    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockDraftService, times(1)).run(argumentSelect.capture());

    final CqnSelect expectedSelect = Select.from(ProficiencySets_.class)
        .where(s -> s.ID().eq(PROFICIENCY_SET_ID).and(s.IsActiveEntity().eq(Boolean.TRUE)))
        .columns(ProficiencySets_::_all, s -> s.proficiencyLevels().expand(ProficiencyLevels_::_all,
            l -> l.texts().expand(ProficiencyLevelsTexts_::_all)));
    assertEquals(expectedSelect.toString(), argumentSelect.getValue().toString());
  }

  @Test
  @DisplayName("count other active entities with same name correctly")
  void countOtherActiveEntitiesWithSameName() {
    ProficiencySets proficiencySet = ProficiencySets.create();
    proficiencySet.setId(PROFICIENCY_SET_ID);
    proficiencySet.setName(PROFICIENCY_SET_NAME);

    final CqnSelect expectedSelect = Select.from(ProficiencySets_.class)
        .columns(CQL.count().as(ProficiencySetRepository.COUNT))
        .where(s -> s.name().eq(proficiencySet.getName()).and(s.ID().ne(proficiencySet.getId())));

    long expectedResult = 1L;
    Result mockResult = mock(Result.class, RETURNS_DEEP_STUBS);
    when(mockResult.single().get(ProficiencySetRepository.COUNT)).thenReturn(expectedResult);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    long actualResult = this.cut.countOtherActiveEntitiesWithSameName(proficiencySet);

    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    verify(this.mockPersistenceService, times(1)).run(argumentSelect.capture());

    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
    assertEquals(expectedResult, actualResult);
  }
}
