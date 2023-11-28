package com.sap.c4p.rm.resourcerequest.validations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;

import manageresourcerequestservice.SkillRequirements;
import manageresourcerequestservice.SkillsConsumption;

@DisplayName("Unit test for Resource Request Skill Requirements Validator")
public class ResourceRequestSkillsValidatorTest {

  private static ResourceRequestSkillsValidator cut;

  /** mocks */
  private static PersistenceService mockPersistenceService;
  private static Messages messages;

  @BeforeAll
  public static void beforeAll() {

    mockPersistenceService = mock(PersistenceService.class, RETURNS_DEEP_STUBS);

  }

  @BeforeEach
  public void setup() {

    messages = mock(Messages.class, RETURNS_DEEP_STUBS);
    cut = new ResourceRequestSkillsValidator(mockPersistenceService, messages);

  }

  @Nested
  @DisplayName("Duplicate Skill Payload check on create or update of Resource Request Skills")
  class WhenDuplicatePayload {

    // private ResourceRequests resourceRequest;

    @Test
    @DisplayName("Duplicates payload sent with resource request")
    public void validateResourceRequestSkillsDuplicates() {

      List<SkillRequirements> skillRequirements;

      /*
       * Make duplicate skills by calling same method twice and updating list
       *
       */
      skillRequirements = getDuplicateSkills("450a2453-ec0a-4a85-8247-94c39b9bdd67");

      cut.checkDuplicatesSkillPayload(skillRequirements);

      verify(messages, times(1)).error(MessageKeys.DUPLICATE_SKILLS);

    }

    @Test
    @DisplayName("Duplicates payload not sent with resource request")
    public void validateResourceRequestSkillsNoDuplicates() {

      List<SkillRequirements> skillRequirements;

      skillRequirements = getSkillRequirements("450a2453-ec0a-4a85-8247-94c39b9bdd67");

      cut.checkDuplicatesSkillPayload(skillRequirements);

    }

    private List<SkillRequirements> getDuplicateSkills(String resourceRequestId) {

      LinkedList<SkillRequirements> skillRequirements = new LinkedList<>();

      SkillRequirements skill = Struct.create(SkillRequirements.class);

      for (int i = 1; i < 4; i++) {

        skill = getSkillRequirement(resourceRequestId);

        skillRequirements.add(skill);

      }

      skillRequirements.add(skill);

      return skillRequirements;

    }

  }

  @Nested
  @DisplayName("Valid Skill ID Exists check in Database")
  class CheckValidSkillId {

    @Test
    @DisplayName("When Valid Skill ID is sent")
    public void validateValidSkillId() {

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1);

      cut.validateSkillId("b8377261-7310-416b-9606-cea837e0496e", "64580ad5-e48d-442d-89de-9235f096a3de");

      verify(messages, times(0)).error(MessageKeys.INVALID_SKILL);

    }

    @Test
    @DisplayName("When Invalid Skill ID is sent")
    public void validateInvalidSkillId() {

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);

      String skillId = "b8377261-7310-416b-9606-cea837e0496e";
      String skillRequirementId = "64580ad5-e48d-442d-89de-9235f096a3de";

      cut.validateSkillId(skillId, skillRequirementId);

      verify(messages, times(1)).error(MessageKeys.INVALID_SKILL);

    }

    @Test
    @DisplayName("When null Skill ID is sent")
    public void validateNullSkillId() {

      String skillId = null;
      String skillRequirementId = "64580ad5-e48d-442d-89de-9235f096a3de";

      cut.validateSkillId(skillId, skillRequirementId);

      verify(messages, times(1)).error(MessageKeys.INVALID_SKILL);

    }

    @Test
    @DisplayName("Validate when multiple Skill ID is sent for validation")
    public void checkValidSkillsTest() {

      SkillsConsumption skill = getSkill();
      Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.single(SkillsConsumption.class)).thenReturn(skill);

      when(mockResult.rowCount()).thenReturn((long) 1);

      cut.checkValidSkills(getSkillRequirements("450a2453-ec0a-4a85-8247-94c39b9bdd67"));

      verify(messages, times(0)).error(MessageKeys.INVALID_SKILL);

    }

    @Test
    @DisplayName("Validate when invalid importance code is sent for validation")
    public void validImportanceCodeTest() {

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);

      String skillRequirementId = "64580ad5-e48d-442d-89de-9235f096a3de";

      cut.validateSkillImportanceCode(4, skillRequirementId);

      verify(messages, times(1)).error(MessageKeys.INVALID_IMPORTANCE_CODE);

    }

    @Test
    @DisplayName("Validate when null importance code is sent for validation")
    public void nullImportanceCodeTest() {

      Integer code = null;
      String skillRequirementId = "64580ad5-e48d-442d-89de-9235f096a3de";

      cut.validateSkillImportanceCode(code, skillRequirementId);

      verify(messages, times(1)).error(MessageKeys.INVALID_IMPORTANCE_CODE);

    }

  }

  @Nested
  @DisplayName("Validate Skill Proficiency Level")
  class ValidateSkillProficiencyLevel {

    @Test
    @DisplayName("Validate when valid skill proficiency Level is sent for validation")
    public void validSkillProficiencyLevelTest() {
      String skillId = "b8377261-7310-416b-9606-cea837e0496e";
      String proficiencyLevelId = "a8377261-7310-416b-9606-cea837e0496f";
      String skillRequirementId = "64580ad5-e48d-442d-89de-9235f096a3de";
      SkillsConsumption skill = getSkill();

      Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.single(SkillsConsumption.class)).thenReturn(skill);

      when(mockResult.rowCount()).thenReturn((long) 1);
      cut.validateSkillProficiencyLevel(skillId, proficiencyLevelId, skillRequirementId);

      verifyNoInteractions(messages);

    }

    @Test
    @DisplayName("Validate when invalid skill proficiency Level is sent for validation")
    public void invalidSkillProficiencyLevelTest() {
      String skillId = "b8377261-7310-416b-9606-cea837e0496e";
      String proficiencyLevelId = "a8377261-7310-416b-9606-cea837e0496f";
      String skillRequirementId = "64580ad5-e48d-442d-89de-9235f096a3de";
      SkillsConsumption skill = getSkill();

      Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.single(SkillsConsumption.class)).thenReturn(skill);

      when(mockResult.rowCount()).thenReturn((long) 0);
      cut.validateSkillProficiencyLevel(skillId, proficiencyLevelId, skillRequirementId);

      verify(messages, times(1)).error(MessageKeys.PROFICIENCY_LEVEL_INVALID, skill.getName());

    }

    @Test
    @DisplayName("Validate when skill proficiency Level is sent as null")
    public void nullSkillProficiencyLevelTest() {
      String skillId = "b8377261-7310-416b-9606-cea837e0496e";
      String proficiencyLevelId = null;
      String skillRequirementId = "64580ad5-e48d-442d-89de-9235f096a3de";
      SkillsConsumption skill = getSkill();

      Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.single(SkillsConsumption.class)).thenReturn(skill);

      cut.validateSkillProficiencyLevel(skillId, proficiencyLevelId, skillRequirementId);

      verify(messages, times(1)).error(MessageKeys.PROFICIENCY_LEVEL_NULL, skill.getName());

    }

    @Test
    @DisplayName("Validate when skillId is passed as null")
    public void nullSkillIdTest() {
      cut.validateSkillProficiencyLevel(null, null, null);
      verifyNoInteractions(messages);
    }

    @Test
    @DisplayName("Validate when skillId is passed as empty string")
    public void emptyStringSkillIdTest() {
      cut.validateSkillProficiencyLevel("", null, null);
      verifyNoInteractions(messages);
    }

  }

  private List<SkillRequirements> getSkillRequirements(String resourceRequestId) {

    LinkedList<SkillRequirements> skillRequirements = new LinkedList<>();

    SkillRequirements skill = Struct.create(SkillRequirements.class);

    for (int i = 1; i < 4; i++) {

      skill = getSkillRequirement(resourceRequestId);

      skillRequirements.add(skill);

    }

    return skillRequirements;

  }

  private SkillRequirements getSkillRequirement(String resourceRequestId) {

    SkillRequirements skill = Struct.create(SkillRequirements.class);

    skill.setComment("Testing skills");
    skill.setId("b104fb13-9549-4d93-81d2-37ba543729fe");
    skill.setImportanceCode(1);
    skill.setResourceRequestId(resourceRequestId);
    skill.setSkillId(UUID.randomUUID().toString());
    skill.setProficiencyLevelId("8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee");

    return skill;

  }

  private SkillsConsumption getSkill() {

    String skillName = "SkillName";
    String proficiencySetId = "1104fb13-9549-4d93-81d2-37ba543729ff";
    SkillsConsumption skill = Struct.create(SkillsConsumption.class);
    skill.setProficiencySetId(proficiencySetId);
    skill.setName(skillName);

    return skill;
  }

}
