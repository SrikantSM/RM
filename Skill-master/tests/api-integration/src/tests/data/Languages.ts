import { Language } from 'test-commons';

export const correctDefaultLanguage: Language = {
  code: 'en',
  name: 'English',
  descr: 'English language',
};

export const correctNonDefaultLanguage: Language = {
  code: 'de',
  name: 'German',
  descr: 'German language',
};

export const nonExistingLanguage: Language = {
  code: 'tlh',
  name: 'Klingon',
  descr: 'Klingon language',
};
