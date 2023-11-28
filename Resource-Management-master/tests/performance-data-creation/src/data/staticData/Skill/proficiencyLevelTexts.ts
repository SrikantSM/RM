import { ProficiencyLevelText } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { SKILL_LOCALES } from './config';
import { proficiencyLevels } from './proficiencyLevels';

const proficiencyLevelTexts: ProficiencyLevelText[] = [];

proficiencyLevelTexts.push({
  ID_texts: '2cce36f8-5b8a-4aba-9812-a868fd8fb6c0',
  ID: '8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee',
  locale: 'en',
  name: 'None',
  description: 'No proficiency levels exist for this skill.',
});

proficiencyLevelTexts.push({
  ID_texts: '465be7f9-17dc-46e4-a7ed-8c8dac3387e3',
  ID: '8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee',
  locale: 'de',
  name: 'Keine',
  description: 'Für diese Fähigkeit sind keine Kompetenzstufen vorhanden.',
});

for (let i = 1; i < proficiencyLevels.length; i += 1) {
  for (const locale of SKILL_LOCALES) {
    const proficiencyLevel: ProficiencyLevelText = {
      ID_texts: uuid(),
      ID: proficiencyLevels[i].ID,
      locale,
      name: `${proficiencyLevels[i].name} ${locale}`,
      description: `${proficiencyLevels[i].description} ${locale}`,
    };
    proficiencyLevelTexts.push(proficiencyLevel);
  }
}

export { proficiencyLevelTexts };
