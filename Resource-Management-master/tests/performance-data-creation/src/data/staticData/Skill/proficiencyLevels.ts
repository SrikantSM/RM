import { ProficiencyLevel } from 'test-commons';
import { MAX_PROFICIENCY_LEVELS_PER_SET, PROFICIENCY_LEVEL_ID_TEMPLATE } from './config';
import { proficiencySets } from './proficiencySets';
import { predictableUuid } from '../../../utils';

const proficiencyLevels: ProficiencyLevel[] = [];

proficiencyLevels.push({
  ID: '8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee',
  name: 'None',
  description: 'No proficiency levels exist for this skill.',
  proficiencySet_ID: proficiencySets[0].ID,
  rank: 1,
});

let counter: number = 0;

for (let i = 1; i < proficiencySets.length; i += 1) {
  for (let rank = 1; rank <= ((i - 1) % MAX_PROFICIENCY_LEVELS_PER_SET) + 1; rank += 1) {
    counter += 1;
    const proficiencyLevel: ProficiencyLevel = {
      ID: predictableUuid(PROFICIENCY_LEVEL_ID_TEMPLATE, counter),
      name: `Proficiency Level Name ${i}.${rank}`,
      description: `Proficiency Level Description ${i}.${rank}`,
      proficiencySet_ID: proficiencySets[i].ID,
      rank,
    };
    proficiencyLevels.push(proficiencyLevel);
  }
}

export { proficiencyLevels };
