package com.sap.c4p.rm.skill.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.EmptyResultException;
import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import skillservice.RemoveRestrictionContext;
import skillservice.RestrictContext;
import skillservice.Skills;

class RestrictionHandlerTest {

  private RestrictionHandler cut;
  private RemoveRestrictionContext mockRemoveRestrictionContext;
  private RestrictContext mockRestrictContext;
  private EventHandlerUtility mockEventHandlerUtility;
  private SkillRepository mockSkillRepository;
  private Result mockResult;
  private Messages mockMessages;

  /**
   * initialize object under test
   */
  @BeforeEach
  void beforeEach() {
    this.prepareMockObjects();

    this.cut = new RestrictionHandler(this.mockEventHandlerUtility, this.mockSkillRepository);
  }

  @Test
  @DisplayName("Restrict skill")
  void onRestrict() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setLifecycleStatusCode(0);
    skill.setIsActiveEntity(true);

    when(this.mockSkillRepository.findById(any(), any())).thenReturn(Optional.of(skill));

    this.cut.onRestrict(this.mockRestrictContext);

    // verify: expected result
    verify(this.mockRestrictContext).setResult(skill);
    assertEquals(1, skill.getLifecycleStatusCode());
  }

  @Test
  @DisplayName("Restrict skill with empty result")
  void onRestrictResultEmpty() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setLifecycleStatusCode(null);
    skill.setIsActiveEntity(true);

    when(this.mockSkillRepository.findById(any(), any())).thenReturn(Optional.empty());

    assertThrows(EmptyResultException.class, () -> this.cut.onRestrict(this.mockRestrictContext));
  }

  @Test
  @DisplayName("Try to restrict already restricted skill")
  void onRestrictAlreadyRestrictedSkill() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setLifecycleStatusCode(1);
    skill.setIsActiveEntity(true);

    when(this.mockSkillRepository.findById(any(), any())).thenReturn(Optional.of(skill));

    assertThrows(ServiceException.class, () -> {
      this.cut.onRestrict(this.mockRestrictContext);
    }, "onRestrict() did not throw ServiceException although skill was already restricted.");
  }

  @Test
  @DisplayName("Remove restriction on skill")
  void onRemoveRestrictionSkill() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setLifecycleStatusCode(1);
    skill.setIsActiveEntity(true);

    when(this.mockSkillRepository.findById(any(), any())).thenReturn(Optional.of(skill));

    this.cut.onRemoveRestriction(this.mockRemoveRestrictionContext);
    // verify: expected result
    verify(this.mockRemoveRestrictionContext).setResult(skill);
    assertEquals(0, skill.getLifecycleStatusCode());
  }

  @Test
  @DisplayName("Remove restriction of skill with empty result")
  void onRemoveRestrictionEmpty() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setLifecycleStatusCode(null);
    skill.setIsActiveEntity(true);

    when(this.mockSkillRepository.findById(any(), any())).thenReturn(Optional.empty());

    assertThrows(EmptyResultException.class, () -> this.cut.onRemoveRestriction(this.mockRemoveRestrictionContext));
  }

  @Test
  @DisplayName("Remove restriction on skill")
  void onRemoveRestrictionSkillWithLifecyclestatusNull() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setLifecycleStatusCode(null);
    skill.setIsActiveEntity(true);

    when(this.mockSkillRepository.findById(any(), any())).thenReturn(Optional.of(skill));

    this.cut.onRemoveRestriction(this.mockRemoveRestrictionContext);
    // verify: expected result
    verify(this.mockRemoveRestrictionContext).setResult(skill);
    assertEquals(0, skill.getLifecycleStatusCode());
  }

  @Test
  @DisplayName("try to remove restriction on already unrestricted skill")
  void onRemoveRestrictionAlreadyActiveSkill() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setLifecycleStatusCode(0);
    skill.setIsActiveEntity(true);

    when(this.mockSkillRepository.findById(any(), any())).thenReturn(Optional.of(skill));

    assertThrows(ServiceException.class, () -> {
      this.cut.onRemoveRestriction(this.mockRemoveRestrictionContext);
    }, "onRemoveRestriction() did not throw ServiceException although skill was already active.");
  }

  @Test
  @DisplayName("try to restrict draft skill")
  void onRestrictDraftSkill() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setLifecycleStatusCode(0);
    skill.setIsActiveEntity(false);

    when(this.mockSkillRepository.findById(any(), any())).thenReturn(Optional.of(skill));

    assertThrows(ServiceException.class, () -> {
      this.cut.onRestrict(this.mockRestrictContext);
    }, "onRestrict() did not throw ServiceException although skill was in draft.");
  }

  @Test
  @DisplayName("try to remove restriction from draft skill")
  void onRemoveRestrictionDraftSkill() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setLifecycleStatusCode(1);
    skill.setIsActiveEntity(false);

    when(this.mockSkillRepository.findById(any(), any())).thenReturn(Optional.of(skill));

    assertThrows(ServiceException.class, () -> {
      this.cut.onRemoveRestriction(this.mockRemoveRestrictionContext);
    }, "onRemoveRestriction() did not throw ServiceException although skill was in draft.");
  }

  @Test
  @DisplayName("try to restrict on a skill that has a non-null OID")
  void onRestrictOIDNotNull() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setLifecycleStatusCode(0);
    skill.setIsActiveEntity(true);
    skill.setOid("OIDNotNull");

    when(this.mockSkillRepository.findById(any(), any())).thenReturn(Optional.of(skill));

    assertThrows(ServiceException.class, () -> {
      this.cut.onRestrict(this.mockRestrictContext);
    }, "onRestrict() did not throw ServiceException although OID was not null");
  }

  @Test
  @DisplayName("try to remove restrict on a skill that has a non-null OID")
  void onRemoveRestrictOIDNotNull() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setLifecycleStatusCode(1);
    skill.setIsActiveEntity(true);
    skill.setOid("OIDNotNull");

    when(this.mockSkillRepository.findById(any(), any())).thenReturn(Optional.of(skill));

    assertThrows(ServiceException.class, () -> {
      this.cut.onRemoveRestriction(this.mockRemoveRestrictionContext);
    }, "onRemoveRestriction() did not throw ServiceException although OID was not null");
  }

  private void prepareMockObjects() {
    this.mockMessages = mock(Messages.class);
    this.mockRestrictContext = mock(RestrictContext.class);
    this.mockRemoveRestrictionContext = mock(RemoveRestrictionContext.class);
    this.mockEventHandlerUtility = mock(EventHandlerUtility.class);
    this.mockSkillRepository = mock(SkillRepository.class);
    CqnSelect mockSelect = mock(CqnSelect.class);
    DraftService mockDraftService = mock(DraftService.class);
    this.mockResult = mock(Result.class);
    when(this.mockRestrictContext.getMessages()).thenReturn(this.mockMessages);
    when(this.mockRestrictContext.getCqn()).thenReturn(mockSelect);
    when(this.mockRestrictContext.getService()).thenReturn(mockDraftService);
    when(this.mockRemoveRestrictionContext.getMessages()).thenReturn(this.mockMessages);
    when(this.mockRemoveRestrictionContext.getCqn()).thenReturn(mockSelect);
    when(this.mockRemoveRestrictionContext.getService()).thenReturn(mockDraftService);
    when(mockDraftService.run(any(CqnSelect.class))).thenReturn(this.mockResult);
  }
}
