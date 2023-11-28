import {
  AlternativeLabel, Catalogs2Skills, ProficiencyLevel, ProficiencyLevelText, Skill, SkillText,
} from 'test-commons';
import { v4 as uuid } from 'uuid';
import { catalog1, catalog2 } from './Catalogs';
import { correctDefaultLanguage, correctNonDefaultLanguage } from './Languages';
import { correctProficiencySet, secondCorrectProficiencySet } from './ProficiencySets';

// Skills

// Unrestricted, correctProficiencySet, one skill text in correctDefaultLanguage, one skill text in correctNonDefaultLanguage, one alternative label in correctDefaultLanguage, one alternative label in correctNonDefaultLanguage, catalog1
export const skillBothLanguages: Skill = {
  ID: uuid(),
  externalID: uuid(),
  lifecycleStatus_code: 0,
  proficiencySet_ID: correctProficiencySet.ID,
};

// Unrestricted, correctProficiencySet, one skill text in correctDefaultLanguage, one alternative label in correctDefaultLanguage, catalog1
export const skillDefaultLanguage: Skill = {
  ID: uuid(),
  externalID: uuid(),
  lifecycleStatus_code: 0,
  proficiencySet_ID: correctProficiencySet.ID,
};

// Unrestricted, secondCorrectProficiencySet, one skill text in correctNonDefaultLanguage, one alternative label in correctNonDefaultLanguage, catalog1
export const skillNonDefaultLanguage: Skill = {
  ID: uuid(),
  externalID: uuid(),
  lifecycleStatus_code: 0,
  proficiencySet_ID: secondCorrectProficiencySet.ID,
};

// Restricted, correctProficiencySet, one skill text in correctDefaultLanguage, one alternative label in correctDefaultLanguage, catalog1
export const skillRestricted: Skill = {
  ID: uuid(),
  externalID: uuid(),
  lifecycleStatus_code: 1,
  proficiencySet_ID: correctProficiencySet.ID,
};

// Restricted, correctProficiencySet, one skill text in correctDefaultLanguage, two alternative labels in correctDefaultLanguage, catalog1, catalog2
export const skillMultipleCatalogsAndLabels: Skill = {
  ID: uuid(),
  externalID: uuid(),
  lifecycleStatus_code: 0,
  proficiencySet_ID: correctProficiencySet.ID,
};

// Restricted, correctProficiencySet, one skill text in correctDefaultLanguage, no alternative labels, no catalogs
export const skillNoCatalogsAndLabels: Skill = {
  ID: uuid(),
  externalID: uuid(),
  lifecycleStatus_code: 0,
  proficiencySet_ID: correctProficiencySet.ID,
};

// SkilllTexts
export const skillTextBothLanguagesDefaultLanguage: SkillText = {
  ID_texts: uuid(),
  ID: skillBothLanguages.ID,
  locale: correctDefaultLanguage.code,
  name: `name skillTextBothLanguagesDefaultLanguage ${correctDefaultLanguage.code} ${uuid()}`,
  description: `description skillTextBothLanguagesDefaultLanguage ${correctDefaultLanguage.code} ${uuid()}`,
};

export const skillTextBothLanguagesNonDefaultLanguage: SkillText = {
  ID_texts: uuid(),
  ID: skillBothLanguages.ID,
  locale: correctNonDefaultLanguage.code,
  name: `name skillTextBothLanguagesNonDefaultLanguage ${correctNonDefaultLanguage.code} ${uuid()}`,
  description: `description skillTextBothLanguagesNonDefaultLanguage ${correctNonDefaultLanguage.code} ${uuid()}`,
};

export const skillTextDefaultLanguage: SkillText = {
  ID_texts: uuid(),
  ID: skillDefaultLanguage.ID,
  locale: correctDefaultLanguage.code,
  name: `name skillTextDefaultLanguage ${correctDefaultLanguage.code} ${uuid()}`,
  description: `description skillTextDefaultLanguage ${correctDefaultLanguage.code} ${uuid()}`,
};

export const skillTextNonDefaultLanguage: SkillText = {
  ID_texts: uuid(),
  ID: skillNonDefaultLanguage.ID,
  locale: correctNonDefaultLanguage.code,
  name: `name skillTextNonDefaultLanguage ${correctNonDefaultLanguage.code} ${uuid()}`,
  description: `description skillTextNonDefaultLanguage ${correctNonDefaultLanguage.code} ${uuid()}`,
};

export const skillTextRestricted: SkillText = {
  ID_texts: uuid(),
  ID: skillRestricted.ID,
  locale: correctDefaultLanguage.code,
  name: `name skillTextRestricted ${correctDefaultLanguage.code} ${uuid()}`,
  description: `description skillTextRestricted ${correctDefaultLanguage.code} ${uuid()}`,
};

export const skillTextMultipleCatalogsAndLabels: SkillText = {
  ID_texts: uuid(),
  ID: skillMultipleCatalogsAndLabels.ID,
  locale: correctDefaultLanguage.code,
  name: `name skillTextMultipleCatalogsAndLabels ${correctDefaultLanguage.code} ${uuid()}`,
  description: `description skillTextMultipleCatalogsAndLabels ${correctDefaultLanguage.code} ${uuid()}`,
};

export const skillTextNoCatalogsAndLabels: SkillText = {
  ID_texts: uuid(),
  ID: skillNoCatalogsAndLabels.ID,
  locale: correctDefaultLanguage.code,
  name: `name skillTextNoCatalogsAndLabels ${correctDefaultLanguage.code} ${uuid()}`,
  description: `description skillTextNoCatalogsAndLabels ${correctDefaultLanguage.code} ${uuid()}`,
};

// AlternativeLabels
export const alternativeLabelBothLanguagesDefaultLanguage: AlternativeLabel = {
  ID: uuid(),
  language_code: correctDefaultLanguage.code,
  name: `alternativeLabelBothLanguagesDefaultLanguage ${uuid()}`,
  skill_ID: skillBothLanguages.ID,
};

export const alternativeLabelBothLanguagesNonDefaultLanguage: AlternativeLabel = {
  ID: uuid(),
  language_code: correctNonDefaultLanguage.code,
  name: `alternativeLabelBothLanguagesNonDefaultLanguage ${uuid()}`,
  skill_ID: skillBothLanguages.ID,
};

export const alternativeLabelDefaultLanguage: AlternativeLabel = {
  ID: uuid(),
  language_code: correctDefaultLanguage.code,
  name: `alternativeLabelDefaultLanguage ${uuid()}`,
  skill_ID: skillDefaultLanguage.ID,
};

export const alternativeLabelNonDefaultLanguage: AlternativeLabel = {
  ID: uuid(),
  language_code: correctNonDefaultLanguage.code,
  name: `alternativeLabelNonDefaultLanguage ${uuid()}`,
  skill_ID: skillNonDefaultLanguage.ID,
};

export const alternativeLabelRestricted: AlternativeLabel = {
  ID: uuid(),
  language_code: correctDefaultLanguage.code,
  name: `alternativeLabelRestricted ${uuid()}`,
  skill_ID: skillRestricted.ID,
};

export const alternativeLabelMultipleCatalogsAndLabelsOne: AlternativeLabel = {
  ID: uuid(),
  language_code: correctDefaultLanguage.code,
  name: `alternativeLabelMultipleCatalogsAndLabelsOne ${uuid()}`,
  skill_ID: skillMultipleCatalogsAndLabels.ID,
};

export const alternativeLabelMultipleCatalogsAndLabelsTwo: AlternativeLabel = {
  ID: uuid(),
  language_code: correctDefaultLanguage.code,
  name: `alternativeLabelMultipleCatalogsAndLabelsTwo ${uuid()}`,
  skill_ID: skillMultipleCatalogsAndLabels.ID,
};

// Catalog2Skills
export const catalog2SkillBothLanguagesDefaultLanguage: Catalogs2Skills = {
  ID: uuid(),
  catalog_ID: catalog1.ID,
  skill_ID: skillBothLanguages.ID,
};

export const catalog2SkillDefaultLanguage: Catalogs2Skills = {
  ID: uuid(),
  catalog_ID: catalog1.ID,
  skill_ID: skillDefaultLanguage.ID,
};

export const catalog2SkillNonDefaultLanguage: Catalogs2Skills = {
  ID: uuid(),
  catalog_ID: catalog1.ID,
  skill_ID: skillNonDefaultLanguage.ID,
};

export const catalog2SkillRestricted: Catalogs2Skills = {
  ID: uuid(),
  catalog_ID: catalog1.ID,
  skill_ID: skillRestricted.ID,
};

export const catalog2SkillMultipleCatalogsAndLabelsOne: Catalogs2Skills = {
  ID: uuid(),
  catalog_ID: catalog1.ID,
  skill_ID: skillMultipleCatalogsAndLabels.ID,
};

export const catalog2SkillMultipleCatalogsAndLabelsTwo: Catalogs2Skills = {
  ID: uuid(),
  catalog_ID: catalog2.ID,
  skill_ID: skillMultipleCatalogsAndLabels.ID,
};

export const correctProficiencyLevel1: ProficiencyLevel = {
  ID: uuid(),
  proficiencySet_ID: correctProficiencySet.ID,
  rank: 1,
  name: uuid(),
  description: uuid(),
};

export const secondCorrectProficiencyLevel1: ProficiencyLevel = {
  ID: uuid(),
  proficiencySet_ID: secondCorrectProficiencySet.ID,
  rank: 1,
  name: uuid(),
  description: uuid(),
};

export const correctProficiencyLevelTextDeLang: ProficiencyLevelText = {
  ID_texts: uuid(),
  ID: correctProficiencyLevel1.ID,
  locale: correctDefaultLanguage.code,
  description: uuid(),
  name: uuid(),
};

export const secondCorrectProficiencyLevelTextDeLang: ProficiencyLevelText = {
  ID_texts: uuid(),
  ID: secondCorrectProficiencyLevel1.ID,
  locale: correctDefaultLanguage.code,
  description: uuid(),
  name: uuid(),
};

export const correctProficiencyLevelTextNonDeLang: ProficiencyLevelText = {
  ID_texts: uuid(),
  ID: correctProficiencyLevel1.ID,
  locale: correctNonDefaultLanguage.code,
  description: uuid(),
  name: uuid(),
};

export const secondCorrectProficiencyLevelTextNonDeLang: ProficiencyLevelText = {
  ID_texts: uuid(),
  ID: secondCorrectProficiencyLevel1.ID,
  locale: correctNonDefaultLanguage.code,
  description: uuid(),
  name: uuid(),
};

export const proficiencyLevels = [correctProficiencyLevel1, secondCorrectProficiencyLevel1];
export const proficiencyLevelTexts = [correctProficiencyLevelTextDeLang, secondCorrectProficiencyLevelTextDeLang, correctProficiencyLevelTextNonDeLang, secondCorrectProficiencyLevelTextNonDeLang];
export const proficiencySets = [correctProficiencySet, secondCorrectProficiencySet];
export const catalogs = [catalog1, catalog2];
export const skills = [skillBothLanguages, skillDefaultLanguage, skillNonDefaultLanguage, skillRestricted, skillMultipleCatalogsAndLabels, skillNoCatalogsAndLabels];
export const skillTexts = [skillTextBothLanguagesDefaultLanguage, skillTextBothLanguagesNonDefaultLanguage, skillTextDefaultLanguage, skillTextNonDefaultLanguage, skillTextRestricted, skillTextMultipleCatalogsAndLabels, skillTextNoCatalogsAndLabels];
export const alternativeLabels = [alternativeLabelBothLanguagesDefaultLanguage, alternativeLabelBothLanguagesNonDefaultLanguage, alternativeLabelDefaultLanguage, alternativeLabelNonDefaultLanguage, alternativeLabelRestricted, alternativeLabelMultipleCatalogsAndLabelsOne, alternativeLabelMultipleCatalogsAndLabelsTwo];
export const catalogs2Skills = [catalog2SkillBothLanguagesDefaultLanguage, catalog2SkillDefaultLanguage, catalog2SkillNonDefaultLanguage, catalog2SkillRestricted, catalog2SkillMultipleCatalogsAndLabelsOne, catalog2SkillMultipleCatalogsAndLabelsTwo];

export const csvLinesDefaultLanguage = [
  // skillBothLanguages
  `KnowledgeSkillCompetence,${skillBothLanguages.externalID},${skillBothLanguages.ID},skill/competence,${skillTextBothLanguagesDefaultLanguage.name},${alternativeLabelBothLanguagesDefaultLanguage.name},${skillTextBothLanguagesDefaultLanguage.description},unrestricted,${catalog1.name},${correctProficiencySet.name},${correctProficiencyLevel1.ID},${correctProficiencyLevel1.rank},${correctProficiencyLevelTextDeLang.name}\r\n`,
  // skillDefaultLanguage
  `KnowledgeSkillCompetence,${skillDefaultLanguage.externalID},${skillDefaultLanguage.ID},skill/competence,${skillTextDefaultLanguage.name},${alternativeLabelDefaultLanguage.name},${skillTextDefaultLanguage.description},unrestricted,${catalog1.name},${correctProficiencySet.name},${correctProficiencyLevel1.ID},${correctProficiencyLevel1.rank},${correctProficiencyLevelTextDeLang.name}\r\n`,
  // skillRestricted
  `KnowledgeSkillCompetence,${skillRestricted.externalID},${skillRestricted.ID},skill/competence,${skillTextRestricted.name},${alternativeLabelRestricted.name},${skillTextRestricted.description},restricted,${catalog1.name},${correctProficiencySet.name},${correctProficiencyLevel1.ID},${correctProficiencyLevel1.rank},${correctProficiencyLevelTextDeLang.name}\r\n`,
  // skillMultipleCatalogsAndLabels
  `KnowledgeSkillCompetence,${skillMultipleCatalogsAndLabels.externalID},${skillMultipleCatalogsAndLabels.ID},skill/competence,${skillTextMultipleCatalogsAndLabels.name},"${alternativeLabelMultipleCatalogsAndLabelsOne.name}\n${alternativeLabelMultipleCatalogsAndLabelsTwo.name}",${skillTextMultipleCatalogsAndLabels.description},unrestricted,"${catalog1.name}\n${catalog2.name}",${correctProficiencySet.name},${correctProficiencyLevel1.ID},${correctProficiencyLevel1.rank},${correctProficiencyLevelTextDeLang.name}\r\n`,
  // skillNoCatalogsAndLabels
  `KnowledgeSkillCompetence,${skillNoCatalogsAndLabels.externalID},${skillNoCatalogsAndLabels.ID},skill/competence,${skillTextNoCatalogsAndLabels.name},,${skillTextNoCatalogsAndLabels.description},unrestricted,,${correctProficiencySet.name},${correctProficiencyLevel1.ID},${correctProficiencyLevel1.rank},${correctProficiencyLevelTextDeLang.name}\r\n`,
];

export const csvLinesNonDefaultLanguage = [
  // skillBothLanguages
  `KnowledgeSkillCompetence,${skillBothLanguages.externalID},${skillBothLanguages.ID},skill/competence,${skillTextBothLanguagesNonDefaultLanguage.name},${alternativeLabelBothLanguagesNonDefaultLanguage.name},${skillTextBothLanguagesNonDefaultLanguage.description},unrestricted,${catalog1.name},${correctProficiencySet.name},${correctProficiencyLevel1.ID},${correctProficiencyLevel1.rank},${correctProficiencyLevelTextNonDeLang.name}\r\n`,
  // skillNonDefaultLanguage
  `KnowledgeSkillCompetence,${skillNonDefaultLanguage.externalID},${skillNonDefaultLanguage.ID},skill/competence,${skillTextNonDefaultLanguage.name},${alternativeLabelNonDefaultLanguage.name},${skillTextNonDefaultLanguage.description},unrestricted,${catalog1.name},${secondCorrectProficiencySet.name},${secondCorrectProficiencyLevel1.ID},${secondCorrectProficiencyLevel1.rank},${secondCorrectProficiencyLevelTextNonDeLang.name}\r\n`,
];
