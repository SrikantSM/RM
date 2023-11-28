import { Catalogs2Skills } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { skills } from './skills';
import { catalogs } from './catalogs';
import { NUMBER_OF_CATALOGS2SKILLS } from './config';

const catalogs2skills: Catalogs2Skills[] = [];

for (let i = 0; i < skills.length; i += 1) {
  for (let j = 0; j < NUMBER_OF_CATALOGS2SKILLS; j += 1) {
    const catalogIndex = (i + j) % catalogs.length;
    const catalogs2Skills: Catalogs2Skills = {
      ID: uuid(),
      skill_ID: skills[i].ID,
      catalog_ID: catalogs[catalogIndex].ID,
    };
    catalogs2skills.push(catalogs2Skills);
  }
}

export { catalogs2skills };
