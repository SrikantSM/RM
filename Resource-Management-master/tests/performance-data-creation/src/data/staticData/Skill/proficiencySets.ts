import { ProficiencySet } from 'test-commons';
import { NUMBER_OF_PROFICIENCY_SETS, PROFICIENCY_SET_ID_TEMPLATE } from './config';
import { predictableUuid } from '../../../utils';

const proficiencySets: ProficiencySet[] = [];

proficiencySets.push({
  ID: '8a2cc2c3-4a46-47f0-ae67-2ac67c673aae',
  name: 'Not specified',
  description: 'This proficiency set is empty. It is the default proficiency set for skills. This proficiency set can\'t be modified.',
  isCustom: false,
});

for (let i = 1; i <= NUMBER_OF_PROFICIENCY_SETS; i += 1) {
  const proficiencySet: ProficiencySet = {
    ID: predictableUuid(PROFICIENCY_SET_ID_TEMPLATE, i),
    name: `Proficiency Set Name ${i}`,
    description: `Proficiency Set Description ${i}`,
    isCustom: true,
  };
  proficiencySets.push(proficiencySet);
}

export { proficiencySets };
