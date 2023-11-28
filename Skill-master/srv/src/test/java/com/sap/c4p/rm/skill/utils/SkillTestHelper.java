package com.sap.c4p.rm.skill.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.sap.resourcemanagement.config.DefaultLanguages;

import skillservice.AlternativeLabels;
import skillservice.Skills;
import skillservice.SkillsTexts;

public final class SkillTestHelper {
  public static final String LANGUAGE_CODE_EN = "en";
  public static final String LANGUAGE_CODE_DE = "de";

  public static final String CONCEPT_TYPE_VALUE = "KnowledgeSkillCompetence";
  public static final String SKILL_TYPE_VALUE = "skill/competence";
  public static final String EMPTY_VALUE = "";
  public static final String UNRESTRICTED = "unrestricted";
  public static final String RESTRICTED = "restricted";
  public static final String CSV_LINE_SEPARATOR = "\r\n";

  public static final String SKILL_ID = "sId#";
  public static final String SKILL_NAME = "sName#";
  public static final String SKILL_DESCRIPTION = "sDescription#";
  public static final String SKILL_EXTERNAL_ID = "sExternalId#";
  public static final String ALTERNATIVE_LABEL_ID = "aId#";
  public static final String ALTERNATIVE_LABEL_NAME = "aName#";
  public static final String SKILL_TEXT_ID = "tId#";
  public static final String SKILL_TEXT_NAME = "tName#";
  public static final String SKILL_TEXT_DESCRIPTION = "tDescription#";
  public static final String SKILL_TEXT_ID_TEXTS = "tIdTexts#";
  public static final String CATALOGS2SKILLS_ID = "c2sId#";
  public static final String CATALOG_ID = "cId#";
  public static final String CATALOG_NAME = "cName#";
  public static final String PROFICIENCY_SET_NAME = "Default";
  public static final String PROFICIENCY_LEVEL_UUID = "pID#";
  public static final String PROFICIENCY_LEVEL = "1#";
  public static final String PROFICIENCY_LEVEL_NAME = "level1#";
  public static final String USER = "test@sap.com";
  public static final String TENANT = "testTenant";
  public static final String READ_ACCESS_EVENT_NAME = "READ";
  public static final String ACCESS_ENTITY_NAME = "entity";
  public static final String ACCESS_SERVICE_NAME = "service";

  public static final String HEADER_DOWNLOADED_COUNTER = "Skills-Downloaded-Counter";
  public static final String HEADER_NOT_DOWNLOADED_COUNTER = "Skills-Not-Downloaded-Counter";

  public static final String SERVICE_PATH = "SERVICE_PATH";

  public static <T> List<T> createTestEntities(int numberOfTestEntities, Function<Integer, T> entityCreationFunction) {
    List<T> entities = new ArrayList<>();
    for (int i = 0; i < numberOfTestEntities; i++) {
      entities.add(entityCreationFunction.apply(i));
    }
    return entities;
  }

  public static <T> T createTestEntities(Function<Integer, T> entityCreationFunction) {
    return createTestEntities(1, entityCreationFunction).get(0);
  }

  public static DefaultLanguages createDefaultLanguage(String languageCode) {
    return SkillTestHelper.createTestEntities(i -> {
      DefaultLanguages defaultLanguages = DefaultLanguages.create();
      defaultLanguages.setLanguageCode(languageCode);
      defaultLanguages.setRank(0);
      return defaultLanguages;
    });
  }

  public static AlternativeLabels createAlternativeLabel() {
    return SkillTestHelper.createTestEntities(i -> {
      AlternativeLabels alternativeLabel = AlternativeLabels.create();
      alternativeLabel.setId(SkillTestHelper.ALTERNATIVE_LABEL_ID + i);
      alternativeLabel.setIsActiveEntity(Boolean.TRUE);
      alternativeLabel.setSkill(Skills.create());
      return alternativeLabel;
    });
  }

  public static Skills createSkill() {
    return SkillTestHelper.createTestEntities(i -> {
      final Skills skill = Skills.create();
      skill.setExternalID(SKILL_EXTERNAL_ID);
      skill.setName(SkillTestHelper.SKILL_NAME + i);
      skill.setDescription(SkillTestHelper.SKILL_DESCRIPTION + i);
      skill.setId(SkillTestHelper.SKILL_ID + i);
      return skill;
    });
  }

  public static Skills createSkill(boolean isActiveEntity) {
    return SkillTestHelper.createTestEntities(i -> {
      final Skills skill = createSkill();
      skill.setIsActiveEntity(isActiveEntity);
      return skill;
    });
  }

  public static void addTextsToSkill(Skills skill, int numberOfTexts) {
    addTextsToSkill(skill, numberOfTexts, SkillTestHelper.LANGUAGE_CODE_EN, true);
  }

  public static void addTextsToSkill(Skills skill, int numberOfTexts, String languageCode) {
    addTextsToSkill(skill, numberOfTexts, languageCode, true);
  }

  public static void addTextsToSkill(Skills skill, int numberOfTexts, boolean isActiveEntity) {
    addTextsToSkill(skill, numberOfTexts, SkillTestHelper.LANGUAGE_CODE_EN, isActiveEntity);
  }

  public static void addTextsToSkill(Skills skill, int numberOfTexts, String languageCode, boolean isActiveEntity) {
    final List<SkillsTexts> textsToAdd = createSkillTexts(numberOfTexts, languageCode, isActiveEntity);
    if (skill.getTexts() != null) {
      List<SkillsTexts> newTexts = Stream.concat(skill.getTexts().stream(), textsToAdd.stream())
          .collect(Collectors.toList());
      skill.setTexts(newTexts);
    } else {
      skill.setTexts(textsToAdd);
    }
  }

  public static List<SkillsTexts> createSkillTexts(int numberOfTexts, String languageCode, boolean isActiveEntity) {
    final List<SkillsTexts> texts = SkillTestHelper.createTestEntities(numberOfTexts, i -> {
      SkillsTexts text = SkillsTexts.create();
      text.setId(UUID.randomUUID().toString()); // random UUID
      text.setName(SkillTestHelper.SKILL_NAME + "_" + languageCode + i);
      text.setDescription(SkillTestHelper.SKILL_DESCRIPTION + "_" + languageCode + i);
      text.setLocale(languageCode);
      text.setIsActiveEntity(isActiveEntity);
      return text;
    });
    return texts;
  }

  public static void addLabelsToSkill(Skills skill, int numberOfLabels) {
    addLabelsToSkill(skill, numberOfLabels, SkillTestHelper.LANGUAGE_CODE_EN, true);
  }

  public static void addLabelsToSkill(Skills skill, int numberOfLabels, String languageCode) {
    addLabelsToSkill(skill, numberOfLabels, languageCode, true);
  }

  public static void addLabelsToSkill(Skills skill, int numberOfLabels, boolean isActiveEntity) {
    addLabelsToSkill(skill, numberOfLabels, SkillTestHelper.LANGUAGE_CODE_EN, isActiveEntity);
  }

  public static void addLabelsToSkill(Skills skill, int numberOfLabels, String languageCode, boolean isActiveEntity) {
    List<AlternativeLabels> labelsToAdd = createSkillLabels(skill.getId(), numberOfLabels, languageCode,
        isActiveEntity);
    if (skill.getAlternativeLabels() != null) {
      List<AlternativeLabels> newLabels = Stream.concat(skill.getAlternativeLabels().stream(), labelsToAdd.stream())
          .collect(Collectors.toList());
      skill.setAlternativeLabels(newLabels);
    } else {
      skill.setAlternativeLabels(labelsToAdd);
    }
  }

  private static List<AlternativeLabels> createSkillLabels(String skillId, int numberOfLabels, String languageCode,
      boolean isActiveEntity) {
    List<AlternativeLabels> alternativeLabels = SkillTestHelper.createTestEntities(numberOfLabels, j -> {
      AlternativeLabels label = AlternativeLabels.create();
      label.setLanguageCode(languageCode);
      label.setName(SkillTestHelper.ALTERNATIVE_LABEL_NAME + j);
      label.setId(UUID.randomUUID().toString()); // random UUID
      label.setIsActiveEntity(isActiveEntity);
      label.setSkillId(skillId);
      return label;
    });
    return alternativeLabels;
  }
}
