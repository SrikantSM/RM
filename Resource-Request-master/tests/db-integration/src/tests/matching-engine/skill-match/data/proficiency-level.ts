import { ProficiencyLevel } from 'test-commons';
import { proficiencySetWithMaxRank3, proficiencySetWithMaxRank4 } from './proficiency-Set';

export const proficiencyLevelRank1MaxRank3 : ProficiencyLevel = {
  ID: '405055e6-2903-4341-adfb-db4f017370f1',
  proficiencySet_ID: proficiencySetWithMaxRank3.ID,
  rank: 1,
  name: 'Rank 1 Proficiency Set 1',
  description: 'Description for Rank 1 Proficiency Set 1',
};
export const proficiencyLevelRank2MaxRank3 : ProficiencyLevel = {
  ID: '0433a642-de0a-4dc0-8f32-b90ceb7678af',
  proficiencySet_ID: proficiencySetWithMaxRank3.ID,
  rank: 2,
  name: 'Rank 2 Proficiency Set 1',
  description: 'Description for Rank 2 Proficiency Set 1',
};
export const proficiencyLevelRank3MaxRank3 : ProficiencyLevel = {
  ID: 'e8c5053c-5571-4b33-8690-cf6216971245',
  proficiencySet_ID: proficiencySetWithMaxRank3.ID,
  rank: 3,
  name: 'Rank 3 Proficiency Set 1',
  description: 'Description for Rank 3 Proficiency Set 1',
};
export const proficiencyLevelRank1MaxRank4 : ProficiencyLevel = {
  ID: 'fb841dd4-6b73-4b26-b99d-8c62a66a2c86',
  proficiencySet_ID: proficiencySetWithMaxRank4.ID,
  rank: 1,
  name: 'Rank 1 Proficiency Set 2',
  description: 'Description for Rank 2 Proficiency Set 2',
};
export const proficiencyLevelRank2MaxRank4 : ProficiencyLevel = {
  ID: '1e5b1f3d-eb31-45e6-a05e-144a898ee475',
  proficiencySet_ID: proficiencySetWithMaxRank4.ID,
  rank: 2,
  name: 'Rank 2 Proficiency Set 2',
  description: 'Description for Rank 2 Proficiency Set 2',
};
export const proficiencyLevelRank3MaxRank4 : ProficiencyLevel = {
  ID: 'fd5b8e84-0b0d-4cc5-a4f3-a78843f2afce',
  proficiencySet_ID: proficiencySetWithMaxRank4.ID,
  rank: 3,
  name: 'Rank 3 Proficiency Set 2',
  description: 'Description for Rank 3 Proficiency Set 2',
};
export const proficiencyLevelRank4MaxRank4 : ProficiencyLevel = {
  ID: '6b9959ff-55cb-465e-9626-a653f18fdf02',
  proficiencySet_ID: proficiencySetWithMaxRank4.ID,
  rank: 4,
  name: 'Rank 4 Proficiency Set 2',
  description: 'Description for Rank 4 Proficiency Set 2',
};
export const proficiencyLevelData = [
  proficiencyLevelRank1MaxRank3,
  proficiencyLevelRank2MaxRank3,
  proficiencyLevelRank3MaxRank3,
  proficiencyLevelRank1MaxRank4,
  proficiencyLevelRank2MaxRank4,
  proficiencyLevelRank3MaxRank4,
  proficiencyLevelRank4MaxRank4,
];
