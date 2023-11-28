import { ProficiencyLevel } from 'test-commons';
import { proficiencySet1 } from './proficiency-Set';

export const proficiencyLevel11: ProficiencyLevel = {
  ID: '6e88cf20-f5f2-40dc-8b8e-e63d8bc868ea',
  proficiencySet_ID: proficiencySet1.ID,
  rank: 1,
  name: 'Proficiency Level 1.1',
  description: 'Proficiency Level 1.1',
};

export const proficiencyLevel12: ProficiencyLevel = {
  ID: '4e88cf20-f5f2-40dc-8b8e-e63d8bc868eb',
  proficiencySet_ID: proficiencySet1.ID,
  rank: 2,
  name: 'Proficiency Level 1.2',
  description: 'Proficiency Level 1.2',
};

export const proficiencyLevelData: ProficiencyLevel[] = [proficiencyLevel11, proficiencyLevel12];
