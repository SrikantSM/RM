import { Skill, ProficiencySetRepository } from 'test-commons';

export const skillsData: Skill[] = [
  {
    ID: '0dd7395b-0fc6-4c4b-a9cf-f150df4a034f',
    description: 'API SKILL',
    lifecycleStatus_code: 0,
    proficiencySet_ID: ProficiencySetRepository.defaultProficiencySetId,
  },
  {
    ID: '7977bdf8-2ae9-4245-8d12-c79c6241f5de',
    description: 'SAP ABAP',
    lifecycleStatus_code: 1,
    proficiencySet_ID: ProficiencySetRepository.defaultProficiencySetId,
  },
  {
    ID: '1dd7395b-0fc6-4c4b-a9cf-f150df4a034e',
    description: 'API SKILL 2',
    name: 'API SKILL 2',
    lifecycleStatus_code: 0,
    proficiencySet_ID: ProficiencySetRepository.defaultProficiencySetId,
  },
];
