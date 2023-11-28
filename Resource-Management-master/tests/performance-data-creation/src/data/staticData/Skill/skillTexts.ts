import { SkillText } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { commaSeparatedAlternativeLabelsInSkillOrder } from './alternativeLabels';
import { SKILL_LOCALES } from './config';
import { skills } from './skills';

const skillTexts: SkillText[] = [];

for (let i = 0; i < skills.length; i += 1) {
  for (const locale of SKILL_LOCALES) {
    const text: SkillText = {
      ID_texts: uuid(),
      ID: skills[i].ID,
      name: `Skill Name ${i} ${locale}`,
      description: `Skill Description ${i} ${locale}`,
      locale,
      commaSeparatedAlternativeLabels: commaSeparatedAlternativeLabelsInSkillOrder[i][locale],
    };
    skillTexts.push(text);
  }
}

export { skillTexts };
