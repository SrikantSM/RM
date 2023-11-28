package com.sap.c4p.rm.resourcerequest.validations;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;

import manageresourcerequestservice.ProficiencyLevelsConsumption_;
import manageresourcerequestservice.ResourceRequests_;
import manageresourcerequestservice.SkillImportanceCodes_;
import manageresourcerequestservice.SkillRequirements;
import manageresourcerequestservice.SkillRequirements_;
import manageresourcerequestservice.SkillsConsumption;
import manageresourcerequestservice.SkillsConsumption_;

@Component

public class ResourceRequestSkillsValidator {

  private final PersistenceService persistenceService;
  private Messages messages;

  @Autowired
  public ResourceRequestSkillsValidator(final PersistenceService persistenceService, final Messages messages) {
    this.persistenceService = persistenceService;
    this.messages = messages;

  }

  public void checkDuplicatesSkillPayload(List<SkillRequirements> resourceRequestSkills) {

    if (!resourceRequestSkills.isEmpty()) {

      final Set<String> uniqueSkills = resourceRequestSkills.stream().map(SkillRequirements::getSkillId)
          .collect(Collectors.toSet());

      if (uniqueSkills.size() != resourceRequestSkills.size()) {
        messages.error(MessageKeys.DUPLICATE_SKILLS).target("in", ResourceRequests_.class,
            resourceRequest -> resourceRequest.skillRequirements());
      }

    }

  }

  public void checkValidSkills(List<SkillRequirements> resourceRequestSkillRequirements) {

    if (!resourceRequestSkillRequirements.isEmpty()) {

      resourceRequestSkillRequirements.stream().forEach(resourceRequestSkillRequirement -> {

        validateSkillId(resourceRequestSkillRequirement.getSkillId(), resourceRequestSkillRequirement.getId());
        validateSkillImportanceCode(resourceRequestSkillRequirement.getImportanceCode(),
            resourceRequestSkillRequirement.getId());
        validateSkillProficiencyLevel(resourceRequestSkillRequirement.getSkillId(),
            resourceRequestSkillRequirement.getProficiencyLevelId(), resourceRequestSkillRequirement.getId());
      });

    }

  }

  public void validateSkillId(String skillId, String skillRequirementId) {

    if (skillId != null && !skillId.isEmpty()) {
      CqnSelect existingSkills = Select.from(SkillRequirements_.class).where(
          skillRequirement -> skillRequirement.ID().eq(skillRequirementId).and(skillRequirement.skill_ID().eq(skillId)))
          .columns(skillRequirement -> skillRequirement.ID(), skillRequirement -> skillRequirement.skill_ID());
      CqnSelect select = Select.from(SkillsConsumption_.class)
          .where(skillsConsumption -> skillsConsumption.ID().eq(skillId)
              .and(skillsConsumption.lifecycleStatus_code().eq(0)))
          .columns(skillsConsumption -> skillsConsumption.ID(),
              skillsConsumption -> skillsConsumption.lifecycleStatus_code());

      final long existingRowCount = persistenceService.run(existingSkills).rowCount();
      final long rowCount = persistenceService.run(select).rowCount();

      if (rowCount == 0 && existingRowCount == 0)
        messages
            .error(
                MessageKeys.INVALID_SKILL)
            .target("in", ResourceRequests_.class,
                resourceRequest -> resourceRequest.skillRequirements(skillRequirementObj -> skillRequirementObj.ID()
                    .eq(skillRequirementId).and(skillRequirementObj.IsActiveEntity().eq(Boolean.FALSE))).skill_ID());
    } else {
      messages.error(MessageKeys.INVALID_SKILL).target("in", ResourceRequests_.class,
          resourceRequest -> resourceRequest.skillRequirements(skillRequirementObj -> skillRequirementObj.ID()
              .eq(skillRequirementId).and(skillRequirementObj.IsActiveEntity().eq(Boolean.FALSE))).skill_ID());
    }

  }

  public void validateSkillImportanceCode(Integer skillImportanceCode, String skillRequirementId) {

    if (skillImportanceCode != null) {

      CqnSelect select = Select.from(SkillImportanceCodes_.class).columns(importance -> importance.code())
          .where(importance -> importance.code().eq(skillImportanceCode));

      final long rowCount = persistenceService.run(select).rowCount();
      if (rowCount == 0) {
        messages.error(MessageKeys.INVALID_IMPORTANCE_CODE)
            .target("in", ResourceRequests_.class,
                resourceRequest -> resourceRequest.skillRequirements(skillRequirementObj -> skillRequirementObj.ID()
                    .eq(skillRequirementId).and(skillRequirementObj.IsActiveEntity().eq(Boolean.FALSE)))
                    .importance_code());

      }

    } else {
      messages.error(MessageKeys.INVALID_IMPORTANCE_CODE)
          .target("in", ResourceRequests_.class,
              resourceRequest -> resourceRequest.skillRequirements(skillRequirementObj -> skillRequirementObj.ID()
                  .eq(skillRequirementId).and(skillRequirementObj.IsActiveEntity().eq(Boolean.FALSE)))
                  .importance_code());

    }

  }

  public void validateSkillProficiencyLevel(String skillId, String proficiencyLevelId, String skillRequirementId) {

    /*
     * Get the proficiency Set ID and name of the selected skill.
     */

    if (skillId != null && !skillId.isEmpty()) {
      CqnSelect selectProficiencySetFromSkill = Select.from(SkillsConsumption_.class)
          .columns(skillsConsumption -> skillsConsumption.proficiencySet_ID(),
              skillsConsumption -> skillsConsumption.name())
          .where(skillsConsumption -> skillsConsumption.ID().eq(skillId));

      SkillsConsumption skillAttribute = persistenceService.run(selectProficiencySetFromSkill)
          .single(SkillsConsumption.class);

      /*
       * Null check for proficiency level.
       */
      if (proficiencyLevelId == null) {
        messages.error(MessageKeys.PROFICIENCY_LEVEL_NULL, skillAttribute.getName()).target("in",
            ResourceRequests_.class,
            resourceRequest -> resourceRequest.skillRequirements(skillRequirementObj -> skillRequirementObj.ID()
                .eq(skillRequirementId).and(skillRequirementObj.IsActiveEntity().eq(Boolean.FALSE)))
                .proficiencyLevel_ID());
      } else {

        /*
         * Check if selected proficiency level belong to the proficiency set associated
         * with the selected skill.
         */
        CqnSelect selectProficiencySetFromProficiencyLevel = Select.from(ProficiencyLevelsConsumption_.class)
            .columns(request -> request.proficiencySet_ID()).where(request -> request.ID().eq(proficiencyLevelId)
                .and(request.proficiencySet_ID().eq(skillAttribute.getProficiencySetId())));

        final long rowCount = persistenceService.run(selectProficiencySetFromProficiencyLevel).rowCount();

        /*
         * Raise Error if the selected proficiency Level does not belong to the
         * Proficiency Set associated to the selected Skill.
         */
        if (rowCount == 0) {
          messages.error(MessageKeys.PROFICIENCY_LEVEL_INVALID, skillAttribute.getName()).target("in",
              ResourceRequests_.class,
              resourceRequest -> resourceRequest.skillRequirements(skillRequirementObj -> skillRequirementObj.ID()
                  .eq(skillRequirementId).and(skillRequirementObj.IsActiveEntity().eq(Boolean.FALSE)))
                  .proficiencyLevel_ID());
        }
      }
    }
  }
}
