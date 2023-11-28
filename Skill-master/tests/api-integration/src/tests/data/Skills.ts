import { Skill } from 'test-commons';
import { v4 as uuid } from 'uuid';

export const correctSkill: Skill = {
  ID: uuid(),
  externalID: uuid(),
  lifecycleStatus_code: 0,
};

export const mdiSkill: Skill = {
  ID: uuid(),
  OID: uuid(),
  externalID: uuid(),
  lifecycleStatus_code: 0,
};

export const skillWithExistingExternalID: Skill = {
  ID: uuid(),
  externalID: correctSkill.externalID,
  lifecycleStatus_code: 0,
};

export const skillWithoutExternalID: Skill = {
  ID: uuid(),
  lifecycleStatus_code: 0,
} as any as Skill;

export const skillWithoutProficiencySet: Skill = {
  ID: uuid(),
  proficiencySet_ID: undefined,
  lifecycleStatus_code: 0,
};

export const skillWithNonExistingProficiencySet: Skill = {
  ID: uuid(),
  proficiencySet_ID: uuid(),
  lifecycleStatus_code: 0,
};
