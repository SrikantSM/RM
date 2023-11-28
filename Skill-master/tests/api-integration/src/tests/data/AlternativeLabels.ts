import { AlternativeLabel } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { correctDefaultLanguage } from './Languages';

export const correctAlternativeLabel: AlternativeLabel = {
  ID: uuid(),
  language_code: correctDefaultLanguage.code,
  name: uuid(),
  skill_ID: uuid(),
};

export const secondCorrectAlternativeLabel: AlternativeLabel = {
  ID: uuid(),
  language_code: correctDefaultLanguage.code,
  name: uuid(),
  skill_ID: uuid(),
};

export const alternativeLabelWithNullLanguageCode: AlternativeLabel = {
  ID: uuid(),
  name: uuid(),
  skill_ID: uuid(),
} as any as AlternativeLabel;

export const alternativeLabelWithEmptyLanguageCode: AlternativeLabel = {
  ID: uuid(),
  language_code: '',
  name: uuid(),
  skill_ID: uuid(),
};

export const alternativeLabelWithNonExistingLanguageCode: AlternativeLabel = {
  ID: uuid(),
  language_code: uuid().substring(0, 5),
  name: uuid(),
  skill_ID: uuid(),
};

export const alternativeLabelWithNullName: AlternativeLabel = {
  ID: uuid(),
  language_code: correctDefaultLanguage.code,
  skill_ID: uuid(),
} as any as AlternativeLabel;

export const alternativeLabelWithEmptyName: AlternativeLabel = {
  ID: uuid(),
  language_code: correctDefaultLanguage.code,
  name: '',
  skill_ID: uuid(),
};

export const evilAlternativeLabel: AlternativeLabel = {
  ID: uuid(),
  language_code: correctDefaultLanguage.code,
  name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
  skill_ID: uuid(),
};

export const forbiddenFirstCharacterAlternativeLabel: AlternativeLabel = {
  ID: uuid(),
  language_code: correctDefaultLanguage.code,
  name: `@${uuid()}`,
  skill_ID: uuid(),
};
