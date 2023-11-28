import { SkillAssignment, ProficiencyLevelRepository } from 'test-commons';

export const skillAssignmentData: SkillAssignment[] = [
  // Employee 1 - ABAP, JAVA, Node.JS
  {
    ID: '57caaf1f-15e3-432d-a5c1-b291ebf93d2f',
    employee_ID: '612488d9-56d6-4785-ab0e-edeea3be7669',
    skill_ID: '0dd7395b-0fc6-4c4b-a9cf-f150df4a034f',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '5fc8bd82-8f04-4cef-9c45-456b0ecca33e',
    employee_ID: '9a7e8a42-f717-42bf-86e3-54b76d2aec61',
    skill_ID: '7977bdf8-2ae9-4245-8d12-c79c6241f5de',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '5fc8bd82-8f04-4cef-9c45-456b0ecca33f',
    employee_ID: '9a7e8a42-f717-42bf-86e3-54b76d2aec62',
    skill_ID: '7977bdf8-2ae9-4245-8d12-c79c6241f5de',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
];
