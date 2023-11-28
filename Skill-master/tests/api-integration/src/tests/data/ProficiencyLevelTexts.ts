import { ProficiencyLevelText } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { correctDefaultLanguage, correctNonDefaultLanguage } from './Languages';

export const correctProficiencyLevelText: ProficiencyLevelText = {
  ID: uuid(),
  ID_texts: uuid(),
  name: uuid(),
  description: uuid(),
  locale: correctDefaultLanguage.code,
};

export const secondCorrectProficiencyLevelText: ProficiencyLevelText = {
  ID: uuid(),
  ID_texts: uuid(),
  name: uuid(),
  description: uuid(),
  locale: correctDefaultLanguage.code,
};

export const correctProficiencyLevelTextInAnotherLanguage: ProficiencyLevelText = {
  ID: uuid(),
  ID_texts: uuid(),
  name: uuid(),
  description: uuid(),
  locale: correctNonDefaultLanguage.code,
};

export const evilProficiencyLevelTextName: ProficiencyLevelText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: correctDefaultLanguage.code,
  name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
  description: uuid(),
} as any as ProficiencyLevelText;

export const evilProficiencyLevelTextDescription: ProficiencyLevelText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: correctDefaultLanguage.code,
  name: uuid(),
  description: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
} as any as ProficiencyLevelText;

export const proficiencyLevelTextWithNullName: ProficiencyLevelText = {
  ID: uuid(),
  ID_texts: uuid(),
  description: uuid(),
  locale: correctDefaultLanguage.code,
} as any as ProficiencyLevelText;

export const proficiencyLevelTextWithNullDescription: ProficiencyLevelText = {
  ID: uuid(),
  ID_texts: uuid(),
  name: uuid(),
  locale: correctDefaultLanguage.code,
} as any as ProficiencyLevelText;

export const proficiencyLevelTextWithEmptyName: ProficiencyLevelText = {
  ID: uuid(),
  ID_texts: uuid(),
  name: '',
  description: uuid(),
  locale: correctDefaultLanguage.code,
} as any as ProficiencyLevelText;

export const proficiencyLevelTextWithEmptyDescription: ProficiencyLevelText = {
  ID: uuid(),
  ID_texts: uuid(),
  name: uuid(),
  description: '',
  locale: correctDefaultLanguage.code,
} as any as ProficiencyLevelText;
