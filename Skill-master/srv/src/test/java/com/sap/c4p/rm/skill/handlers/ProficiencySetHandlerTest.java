package com.sap.c4p.rm.skill.handlers;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
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

import com.sap.cds.services.draft.DraftSaveEventContext;

import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencyLevelTextRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;
import com.sap.c4p.rm.skill.services.ProficiencyLevelTextReplicationService;
import com.sap.c4p.rm.skill.services.validators.ProficiencySetValidator;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;

import com.sap.resourcemanagement.config.DefaultLanguages;

import proficiencyservice.CreateProficiencySetWithDialogContext;
import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencySets;

class ProficiencySetHandlerTest {

  private final ProficiencySetRepository mockProficiencySetRepo = mock(ProficiencySetRepository.class);
  private final ProficiencyLevelTextRepository mockProficiencyLevelTextRepo = mock(
      ProficiencyLevelTextRepository.class);
  private final ProficiencySetValidator mockProficiencySetValidator = mock(ProficiencySetValidator.class);
  private final ProficiencyLevelTextReplicationService mockProficiencyLevelTextReplicationService = mock(
      ProficiencyLevelTextReplicationService.class);
  private final EventHandlerUtility mockEventHandlerUtility = mock(EventHandlerUtility.class);
  private final ProficiencySetHandler cut = new ProficiencySetHandler(this.mockProficiencySetRepo,
      this.mockProficiencyLevelTextRepo, this.mockProficiencySetValidator,
      this.mockProficiencyLevelTextReplicationService, this.mockEventHandlerUtility);

  @BeforeEach
  void beforeEach() {
    when(this.mockProficiencySetRepo.createDraft(any())).thenReturn(ProficiencySets.create());
  }

  @Test
  @DisplayName("make sure that onCrateProficiencySetWithDialogAction success without an exception when providing a name and description")
  void onCreateProficiencySetWithDialogAction() {
    this.createLanguageRepo(DefaultLanguages.create());

    final CreateProficiencySetWithDialogContext mockCreateProficiencySetWithDialogContext = mock(
        CreateProficiencySetWithDialogContext.class);
    when(mockCreateProficiencySetWithDialogContext.getName()).thenReturn("My name");
    when(mockCreateProficiencySetWithDialogContext.getDescription()).thenReturn("My description");

    assertDoesNotThrow(
        () -> this.cut.onCreateProficiencySetWithDialogAction(mockCreateProficiencySetWithDialogContext));
  }

  @Test
  @DisplayName("check that beforeModification() executed all validations")
  void beforeModification() {
    this.createLanguageRepo(DefaultLanguages.create());

    final ProficiencySets mockProficiencyLevelSet = ProficiencySetHandlerTest.getProficiencySet();

    this.cut.beforeModification(mockProficiencyLevelSet);

    verify(this.mockProficiencySetValidator).validate(mockProficiencyLevelSet);
  }

  @Test
  @DisplayName("Check that afterDraftEdit() throws no exception when proficiencySet contains not a isCustom value")
  void afterDraftEdit() {
    final ProficiencySets proficiencySet = ProficiencySets.create();

    assertDoesNotThrow(() -> this.cut.afterDraftEdit(proficiencySet));

    verify(this.mockProficiencySetValidator, times(1)).validateIfDefaultProficiencySet(proficiencySet);
  }

  @Test
  @DisplayName("Check that afterModification() replicates the text on the active entity after activation")
  void afterModification() {
    final ProficiencySets proficiencySet = ProficiencySets.create();
    this.cut.afterModification(proficiencySet);
    verify(this.mockProficiencyLevelTextReplicationService, times(1)).replicateDefaultTexts(any(ProficiencySets.class));
  }

  @SuppressWarnings("unchecked")
  @Test
  @DisplayName("Check that beforeDraftSaveLocaleBugWorkaround behaved correctly")
  public void beforeDraftSaveLocaleBugWorkaround() {
    final DraftSaveEventContext mockContext = mock(DraftSaveEventContext.class);

    final List<ProficiencyLevels> proficiencyLevels = Collections.emptyList();
    final ProficiencySets proficiencySet = ProficiencySets.create();
    proficiencySet.setProficiencyLevels(proficiencyLevels);

    when(this.mockProficiencySetRepo.expandCompositions(any())).thenReturn(Optional.of(proficiencySet));

    this.cut.beforeDraftSaveLocaleBugWorkaround(mockContext);

    verify(this.mockEventHandlerUtility, times(1)).addKeyAttributesToEntity(any(), any(), any());
    verify(this.mockProficiencySetRepo, times(1)).expandCompositions(any());

    final ArgumentCaptor<List<ProficiencyLevels>> listCaptor = ArgumentCaptor.forClass(List.class);
    verify(this.mockProficiencyLevelTextRepo, times(1)).deleteActiveTextsOfLevels(listCaptor.capture());
    assertEquals(proficiencyLevels, listCaptor.getValue());
  }

  private void createLanguageRepo(final DefaultLanguages defaultLanguages) {
    final DefaultLanguageRepository mockDefaultLanguageRepo = mock(DefaultLanguageRepository.class);
    when(mockDefaultLanguageRepo.findActiveEntityByRank(0)).thenReturn(Optional.of(defaultLanguages));
  }

  private static ProficiencySets getProficiencySet() {
    final ProficiencySets mockProficiencyLevelSet = mock(ProficiencySets.class);
    when(mockProficiencyLevelSet.getName()).thenReturn("My name");
    when(mockProficiencyLevelSet.getDescription()).thenReturn(("My description"));
    return mockProficiencyLevelSet;
  }
}
