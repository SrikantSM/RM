import { SkillText } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { correctDefaultLanguage, correctNonDefaultLanguage } from './Languages';

export const correctSkillText: SkillText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: correctDefaultLanguage.code,
  name: uuid(),
  description: uuid(),
} as any as SkillText;

export const correctSkillTextInAnotherLanguage: SkillText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: correctNonDefaultLanguage.code,
  name: uuid(),
  description: uuid(),
} as any as SkillText;

export const secondCorrectSkillText: SkillText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: correctDefaultLanguage.code,
  name: uuid(),
  description: uuid(),
} as any as SkillText;

export const skillTextWithNullDescription: SkillText = {
  ID: uuid(),
  ID_texts: uuid(),
  locale: correctDefaultLanguage.code,
  name: uuid(),
} as any as SkillText;

export const skillTextWithEmptyDescription: SkillText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: correctDefaultLanguage.code,
  name: uuid(),
  description: '',
} as any as SkillText;

export const skillTextWithNullName: SkillText = {
  ID: uuid(),
  ID_texts: uuid(),
  locale: correctDefaultLanguage.code,
  description: uuid(),
} as any as SkillText;

export const skillTextWithEmptyName: SkillText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: correctDefaultLanguage.code,
  name: '',
  description: uuid(),
} as any as SkillText;

export const skillTextWithNonExistingLanguage: SkillText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: uuid().substring(0, 5),
  name: uuid(),
  description: uuid(),
} as any as SkillText;

export const skillTextWithNullLanguage: SkillText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: null,
  name: uuid(),
  description: uuid(),
} as any as SkillText;

export const evilSkillTextName: SkillText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: correctDefaultLanguage.code,
  name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
  description: uuid(),
} as any as SkillText;

export const evilSkillTextDescription: SkillText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: correctDefaultLanguage.code,
  name: uuid(),
  description: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
} as any as SkillText;

export const forbiddenFirstCharacterSkillTextName: SkillText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: correctDefaultLanguage.code,
  name: `@${uuid()}`,
  description: uuid(),
} as any as SkillText;

export const forbiddenFirstCharacterSkillTextDescription: SkillText = {
  ID_texts: uuid(),
  ID: uuid(),
  locale: correctDefaultLanguage.code,
  name: uuid(),
  description: `@${uuid()}`,
} as any as SkillText;
