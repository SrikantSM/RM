package com.sap.c4p.rm.skill.utils;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CdsUpsertEventContext;

import proficiencyservice.ProficiencyLevels;
import skillservice.Skills;

class EventHandlerUtilityTest {
  /** object under test */
  private EventHandlerUtility cut;

  /**
   * initialize object under test
   */
  @BeforeEach
  void beforeEach() {
    // init class under test
    this.cut = new EventHandlerUtility();
  }

  @Test
  @DisplayName("Enhance the Result of a Skill Draft Action with changed Skill texts")
  void enhanceSkillResult() {
    final List<Skills> resultList = SkillTestHelper.createTestEntities(4, i -> {
      final Skills skill = Skills.create();
      skill.setId(SkillTestHelper.SKILL_ID + i);
      return skill;
    });

    final List<Skills> changedList = SkillTestHelper.createTestEntities(3, i -> {
      final Skills skill = Skills.create();
      skill.setId(SkillTestHelper.SKILL_ID + i);
      skill.setName(SkillTestHelper.SKILL_NAME + i);
      skill.setDescription(SkillTestHelper.SKILL_DESCRIPTION + i);
      skill.setCommaSeparatedAlternativeLabels("sCommaSeparatedAlternativeLabels#" + i);
      return skill;
    });

    final Result mockResult = mock(Result.class);
    doReturn(resultList).when(mockResult).listOf(eq(Skills.class));

    // act
    this.cut.enhanceSkillResult(mockResult, changedList);

    assertEquals(changedList.get(0), resultList.get(0)); // regular update
    assertEquals(changedList.get(1), resultList.get(1)); // updates out of order
    assertEquals(changedList.get(2), resultList.get(2)); // updates out of order
    assertNull(resultList.get(3).getName()); // unchanged if not in changedList
    assertNull(resultList.get(3).getDescription());
    assertNull(resultList.get(3).getCommaSeparatedAlternativeLabels());
  }

  @Test
  @DisplayName("Deduplicate List of Skills")
  void dedupeSkillList() {
    final List<Skills> skills = SkillTestHelper.createTestEntities(2, i -> {
      final Skills skill = Skills.create();
      skill.setId(SkillTestHelper.SKILL_ID + i);
      return skill;
    });
    final Skills skill = SkillTestHelper.createTestEntities(i -> {
      final Skills newSkill = Skills.create();
      newSkill.setId(SkillTestHelper.SKILL_ID + i);
      return newSkill;
    });
    skills.add(skill);

    final List<Skills> resultList = this.cut.dedupeSkillList(skills);

    assertEquals(2, resultList.size());
    for (int i = 0; i < resultList.size(); i++) {
      assertEquals(skills.get(i), resultList.get(i));
    }
  }

  @Test
  @DisplayName("check that dedupeProficiencyLevelList with two diffrent proficiency level does not reduce the list")
  void dedupeProficiencyLevelList() {
    final ProficiencyLevels firstProficiencyLevel = ProficiencyLevels.create();
    firstProficiencyLevel.setId(UUID.randomUUID().toString());

    final ProficiencyLevels secondProficiencyLevel = ProficiencyLevels.create();
    secondProficiencyLevel.setId(UUID.randomUUID().toString());

    final List<ProficiencyLevels> proficiencyLevelsList = Arrays.asList(firstProficiencyLevel, secondProficiencyLevel);

    final List<ProficiencyLevels> resultList = this.cut.dedupeProficiencyLevelList(proficiencyLevelsList);

    assertEquals(proficiencyLevelsList, resultList);
  }

  @Test
  @DisplayName("check that deduplicateProficiencyLevelList removes duplicates of two identical proficiency levels")
  void dedupeProficiencyLevelListWithDuplicatedElement() {
    final String id = UUID.randomUUID().toString();

    final ProficiencyLevels firstProficiencyLevel = ProficiencyLevels.create();
    firstProficiencyLevel.setId(id);

    final ProficiencyLevels secondProficiencyLevel = ProficiencyLevels.create();
    secondProficiencyLevel.setId(id);

    final List<ProficiencyLevels> proficiencyLevelsList = Arrays.asList(firstProficiencyLevel, secondProficiencyLevel);

    final List<ProficiencyLevels> resultList = this.cut.dedupeProficiencyLevelList(proficiencyLevelsList);

    assertDoesNotThrow(() -> this.cut.dedupeProficiencyLevelList(proficiencyLevelsList));
    assertEquals(1, resultList.size());
  }

  @Test
  @DisplayName("Test that result can be retrieved from CdsCreateEventContext")
  void getResultFromCreateEventContext() {
    EventContext eventContext = mock(CdsCreateEventContext.class);
    assertDoesNotThrow(() -> cut.getResultFromEventContext(eventContext));
  }

  @Test
  @DisplayName("Test that result can be retrieved from CdsUpsertEventContext")
  void getResultFromUpsertEventContext() {
    EventContext eventContext = mock(CdsUpsertEventContext.class);
    assertDoesNotThrow(() -> cut.getResultFromEventContext(eventContext));
  }

  @Test
  @DisplayName("Test that result can be retrieved from CdsUpdateEventContext")
  void getResultFromUpdateEventContext() {
    EventContext eventContext = mock(CdsUpdateEventContext.class);
    assertDoesNotThrow(() -> cut.getResultFromEventContext(eventContext));
  }

}
