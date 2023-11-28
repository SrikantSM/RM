namespace com.sap.resourceManagement.skill;

using {
  com.sap.resourceManagement.skill.AlternativeLabels,
  com.sap.resourceManagement.skill.Catalogs,
  com.sap.resourceManagement.skill.Catalogs2Skills,
  com.sap.resourceManagement.skill.Skills,
  com.sap.resourceManagement.skill.ProficiencySets,
  com.sap.resourceManagement.skill.ProficiencyLevels
} from './skills';

@readonly
view AlternativeLabelsConsumption as
  select from AlternativeLabels {
    ID,
    skill_ID,
    name,
    language
  };

@readonly
view CatalogsConsumption as
  select from Catalogs mixin {
    skillAssociations : Association to many Catalogs2SkillsConsumption on skillAssociations.catalog_ID = ID;
  } into {
    ID,
    name,
    description,
    skillAssociations
  };

@readonly
view Catalogs2SkillsConsumption as
  select from Catalogs2Skills mixin {
    catalog : Association to CatalogsConsumption on catalog.ID = catalog_ID;
    skill : Association to SkillsConsumption on skill.ID = skill_ID;
  } into {
    ID,
    catalog_ID,
    skill_ID,
    catalog,
    skill
  };

@readonly
view SkillsConsumption as
  select from Skills mixin {
    catalogAssociations : Association to many Catalogs2SkillsConsumption on catalogAssociations.skill_ID = ID;
    alternativeLabels : Association to many AlternativeLabelsConsumption on alternativeLabels.skill_ID = ID;
    proficiencySet: Association to ProficiencySetsConsumption on proficiencySet.ID = proficiencySet_ID;
  } into {
    ID,
    externalID,
    proficiencySet_ID,
    proficiencySet,
    catalogAssociations,
    alternativeLabels,
    commaSeparatedAlternativeLabels,
    description,
    name,
    lifecycleStatus_code,
    lifecycleStatus,
    texts,
    localized
  };

@readonly
view ProficiencySetsConsumption as
  select from ProficiencySets mixin {
    skills : Association to many SkillsConsumption on skills.proficiencySet_ID = ID;
    proficiencyLevels : Association to many ProficiencyLevelsConsumption on proficiencyLevels.proficiencySet_ID = ID;
  } into {
    ID,
    name,
    description,
    max(proficiencyLevels.rank)  as maxRank : Integer,
    skills,
    proficiencyLevels
  }Group By ID,name,description;

@readonly
view ProficiencyLevelsConsumption as
  select from ProficiencyLevels mixin {
    proficiencySet : Association to ProficiencySetsConsumption on proficiencySet.ID = proficiencySet_ID;
  } into {
    ID,
    proficiencySet_ID,
    proficiencySet,
    rank,
    name,
    description,
    texts,
    localized
  };
