import { Skill, ProficiencySetRepository } from 'test-commons';
import { proficiencySetWithMaxRank3, proficiencySetWithMaxRank4 } from './proficiency-Set';

const uuid = require('uuid').v4;

export const skillABAP: Skill = {
  ID: uuid(),
  description: 'SAP ABAP',
  lifecycleStatus_code: 0,
  proficiencySet_ID: proficiencySetWithMaxRank3.ID,
};
export const skillSCP: Skill = {
  ID: uuid(),
  description: 'SCP',
  lifecycleStatus_code: 0,
  proficiencySet_ID: proficiencySetWithMaxRank3.ID,
};
export const skillHANA: Skill = {
  ID: uuid(),
  description: 'SAP HANA',
  lifecycleStatus_code: 0,
  proficiencySet_ID: ProficiencySetRepository.defaultProficiencySetId,
};
export const skillCoreJava: Skill = {
  ID: uuid(),
  description: 'Core JAVA',
  lifecycleStatus_code: 0,
  proficiencySet_ID: proficiencySetWithMaxRank4.ID,
};
export const skillJavaOops: Skill = {
  ID: uuid(),
  description: 'JAVA OOPS',
  lifecycleStatus_code: 0,
  proficiencySet_ID: proficiencySetWithMaxRank4.ID,
};
export const skillJS: Skill = {
  ID: uuid(),
  description: 'Java Script',
  lifecycleStatus_code: 0,
  proficiencySet_ID: ProficiencySetRepository.defaultProficiencySetId,
};
export const skillsData: Skill[] = [
  skillABAP,
  skillSCP,
  skillHANA,
  skillCoreJava,
  skillJavaOops,
  skillJS,
];
