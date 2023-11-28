package com.sap.c4p.rm.skill.utils;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnStatement;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CdsUpsertEventContext;

import proficiencyservice.ProficiencyLevels;
import skillservice.Skills;

@Component
public class EventHandlerUtility {

  /**
   * Adds the key attribute information contained in a {@link CqnStatement} to an
   * entity instance
   *
   * @param cdsModel     {@link CdsModel} from the {@link EventContext}
   * @param cqnStatement {@link CqnStatement} from the {@link EventContext}
   * @param entityData   {@link Map} representing the data of an entity
   */
  public void addKeyAttributesToEntity(final CdsModel cdsModel, final CqnStatement cqnStatement,
      final Map<String, Object> entityData) {
    CqnAnalyzer.create(cdsModel).analyze(cqnStatement.ref()).targetKeys().entrySet().stream()
        .filter(entry -> entry.getValue() != null).forEach(entry -> entityData.put(entry.getKey(), entry.getValue()));
  }

  /**
   * Retrieve the entity id from the EventContext. The ID field must be named "ID"
   *
   * @param cdsModel     {@link CdsModel} from the {@link EventContext}
   * @param cqnStatement {@link CqnStatement} from the {@link EventContext}
   * @return the id from an entity
   */
  public String getEntityIdFromEventContext(final CdsModel cdsModel, final CqnStatement cqnStatement) {
    CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(cdsModel);
    AnalysisResult result = cqnAnalyzer.analyze(cqnStatement.ref());
    Map<String, Object> targetKeys = result.targetKeys();
    return (String) targetKeys.get("ID");
  }

  /**
   * Retrieve the keys of the root entity from the EventContext.
   *
   * @param cdsModel     {@link CdsModel} from the {@link EventContext}
   * @param cqnStatement {@link CqnStatement} from the {@link EventContext}
   * @return keys of the root entity
   */
  public Map<String, Object> getRootKeysFromEventContext(final CdsModel cdsModel, final CqnStatement cqnStatement) {
    CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(cdsModel);
    AnalysisResult result = cqnAnalyzer.analyze(cqnStatement.ref());
    return result.rootKeys();
  }

  /**
   * Removes all duplicates (by ID) from a {@link List} of {@link Skills}
   *
   * @param skills {@link List} of {@link Skills} with their ID set
   * @return Filtered {@link List} containing each skill ID at maximum one time
   */
  public List<Skills> dedupeSkillList(List<Skills> skills) {
    Set<String> skillIdSet = new HashSet<>();
    return skills.stream().filter(s -> s != null && skillIdSet.add(s.getId())).collect(Collectors.toList());
  }

  /**
   * For some (draft) action results, FE needs the new Skill entity. Sometimes,
   * however, we modify that Skill's name, description and
   * commaSeparatedAlternativeLabels after CAP's generic handlers. We need to
   * change the List in the Result of the context afterwards
   *
   * @param result        The Result of the EventContext for the (draft) action
   * @param changedSkills List containing skills that were changed
   */
  public void enhanceSkillResult(Result result, List<Skills> changedSkills) {
    result.listOf(Skills.class).forEach(skill -> {
      for (Skills changedSkill : changedSkills) {
        if (changedSkill.getId().equals(skill.getId())) {
          skill.setName(changedSkill.getName());
          skill.setDescription(changedSkill.getDescription());
          skill.setCommaSeparatedAlternativeLabels(changedSkill.getCommaSeparatedAlternativeLabels());
        }
      }
    });
  }

  public List<ProficiencyLevels> dedupeProficiencyLevelList(final List<ProficiencyLevels> proficiencyLevels) {
    final Set<String> proficiencyLevelIdSet = new HashSet<>();
    return proficiencyLevels.stream().filter(s -> s != null && proficiencyLevelIdSet.add(s.getId()))
        .collect(Collectors.toList());
  }

  public Result getResultFromEventContext(final EventContext context) {
    if (context instanceof CdsCreateEventContext) {
      return ((CdsCreateEventContext) context).getResult();
    } else if (context instanceof CdsUpdateEventContext) {
      return ((CdsUpdateEventContext) context).getResult();
    } else if (context instanceof CdsUpsertEventContext) {
      return ((CdsUpsertEventContext) context).getResult();
    }
    throw new UnsupportedOperationException();
  }

  /**
   * For the given event context, this method returns the available entities in as
   * Map<String, Object>. The entity might not be complete.
   *
   * @param context The event context for which processing currently happens
   * @return list of entities
   */
  public List<Map<String, Object>> getEntitiesFromEventContext(final EventContext context) {
    if (context instanceof CdsCreateEventContext) {
      return ((CdsCreateEventContext) context).getCqn().entries();
    } else if (context instanceof CdsUpdateEventContext) {
      return ((CdsUpdateEventContext) context).getCqn().entries();
    } else if (context instanceof CdsUpsertEventContext) {
      return ((CdsUpsertEventContext) context).getCqn().entries();
    }
    throw new UnsupportedOperationException();
  }
}
