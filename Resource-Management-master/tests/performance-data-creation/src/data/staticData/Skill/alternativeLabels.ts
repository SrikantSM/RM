import { AlternativeLabel } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { ALTERNATIVE_LABELS_PER_LANGUAGE, SKILL_LOCALES } from './config';
import { skills } from './skills';

const alternativeLabels: AlternativeLabel[] = [];
const commaSeparatedAlternativeLabelsInSkillOrder: any[] = [];

for (let i = 0; i < skills.length; i += 1) {
  const commaSeparatedLabelsOfSkill: any = {};
  for (const locale of SKILL_LOCALES) {
    const labelsOfLocale: string[] = [];
    for (let j = 0; j < ALTERNATIVE_LABELS_PER_LANGUAGE; j += 1) {
      const alternativeLabel: AlternativeLabel = {
        ID: uuid(),
        skill_ID: skills[i].ID,
        language_code: locale,
        name: `Alt ${i} ${locale} ${j}`,
      };
      alternativeLabels.push(alternativeLabel);
      labelsOfLocale.push(alternativeLabel.name);
    }
    commaSeparatedLabelsOfSkill[locale] = labelsOfLocale.join(', ');
  }
  commaSeparatedAlternativeLabelsInSkillOrder.push(commaSeparatedLabelsOfSkill);
}

export { alternativeLabels, commaSeparatedAlternativeLabelsInSkillOrder };
