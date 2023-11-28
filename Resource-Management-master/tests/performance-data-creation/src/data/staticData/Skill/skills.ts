import { Skill } from 'test-commons';
import { predictableUuid } from '../../../utils';
import {
  ALTERNATIVE_LABELS_PER_LANGUAGE, NUMBER_OF_SKILLS, SKILL_ID_TEMPLATE, SKILL_LOCALES,
} from './config';
import { proficiencySets } from './proficiencySets';

const skills: Skill[] = [];

function getCommaSeparatedAlternativeLabels(skillNumber: number) {
  const labels: string[] = [];
  for (let i = 0; i < ALTERNATIVE_LABELS_PER_LANGUAGE; i += 1) {
    labels.push(`Alt ${skillNumber} ${SKILL_LOCALES[0]} ${i}`);
  }
  return labels.join(', ');
}

for (let i = 0; i < NUMBER_OF_SKILLS; i += 1) {
  const skill: Skill = {
    ID: predictableUuid(SKILL_ID_TEMPLATE, i),
    name: `Skill Name ${i} ${SKILL_LOCALES[0]}`,
    description: `Skill Description ${i} ${SKILL_LOCALES[0]}`,
    commaSeparatedAlternativeLabels: getCommaSeparatedAlternativeLabels(i),
    externalID: `http://data.europa.eu/esco/skill/perfTestSkill${i}`,
    lifecycleStatus_code: 0,
    proficiencySet_ID: proficiencySets[(i % (proficiencySets.length - 1)) + 1].ID,
  };
  skills.push(skill);
}

export { skills };
