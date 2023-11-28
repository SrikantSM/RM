import { ProficiencySet } from 'test-commons';
import { v4 as uuid } from 'uuid';

export const correctProficiencySet: ProficiencySet = {
  ID: uuid(),
  isCustom: true,
  name: uuid(),
  description: uuid(),
};

export const mdiProficiencySet: ProficiencySet = {
  ID: uuid(),
  OID: uuid(),
  isCustom: true,
  name: uuid(),
  description: uuid(),
};

export const secondCorrectProficiencySet: ProficiencySet = {
  ID: uuid(),
  isCustom: true,
  name: uuid(),
  description: uuid(),
};

export const proficiencySetWithNullDescription: ProficiencySet = {
  ID: uuid(),
  isCustom: true,
  name: uuid(),
} as any as ProficiencySet;

export const proficiencySetWithNullName: ProficiencySet = {
  ID: uuid(),
  isCustom: true,
  description: uuid(),
} as any as ProficiencySet;

export const proficiencySetWithEmptyDescription: ProficiencySet = {
  ID: uuid(),
  isCustom: true,
  name: uuid(),
  description: '',
};

export const proficiencySetWithEmptyName: ProficiencySet = {
  ID: uuid(),
  isCustom: true,
  name: '',
  description: uuid(),
};

export const evilProficiencySetName: ProficiencySet = {
  ID: uuid(),
  isCustom: true,
  name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
  description: uuid(),
};

export const evilProficiencySetDescription: ProficiencySet = {
  ID: uuid(),
  isCustom: true,
  name: uuid(),
  description: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
};

export const evilCsvProficiencySetName: ProficiencySet = {
  ID: uuid(),
  isCustom: true,
  name: '@evil set name',
  description: uuid(),
};
