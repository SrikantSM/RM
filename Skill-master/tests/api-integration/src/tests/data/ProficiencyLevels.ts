import { ProficiencyLevel } from 'test-commons';
import { v4 as uuid } from 'uuid';

export const correctProficiencyLevel: ProficiencyLevel = {
  ID: uuid(),
  proficiencySet_ID: uuid(),
  rank: 1,
  name: uuid(),
  description: uuid(),
};

export const secondCorrectProficiencyLevel: ProficiencyLevel = {
  ID: uuid(),
  proficiencySet_ID: uuid(),
  rank: 2,
  name: uuid(),
  description: uuid(),
};

export const correctProficiencyLevelWithoutRank: ProficiencyLevel = {
  ID: uuid(),
  proficiencySet_ID: uuid(),
  name: uuid(),
  description: uuid(),
} as any as ProficiencyLevel;

export const secondCorrectProficiencyLevelWithoutRank: ProficiencyLevel = {
  ID: uuid(),
  proficiencySet_ID: uuid(),
  name: uuid(),
  description: uuid(),
} as any as ProficiencyLevel;

export const evilProficiencyLevelName: ProficiencyLevel = {
  ID: uuid(),
  proficiencySet_ID: uuid(),
  name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
  description: uuid(),
} as any as ProficiencyLevel;

export const evilProficiencyLevelDescription: ProficiencyLevel = {
  ID: uuid(),
  proficiencySet_ID: uuid(),
  name: uuid(),
  description: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
} as any as ProficiencyLevel;

export const proficiencyLevelWithInvalidRank: ProficiencyLevel = {
  ID: uuid(),
  proficiencySet_ID: uuid(),
  rank: 0,
  name: uuid(),
  description: uuid(),
};
