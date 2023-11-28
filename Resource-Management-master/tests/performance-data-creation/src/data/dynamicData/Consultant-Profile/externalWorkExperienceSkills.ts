import { ExternalWorkExperienceSkill, ExternalWorkExperience } from 'test-commons';
import * as staticData from '../../staticData';
import { getExternalWorkExperiencesBatchDynamicData } from './externalWorkExperiences';
import { EXTERNAL_WORK_EXPERIENCE_SKILL_COUNT } from './config';
import { proficiencyLevels } from '../../staticData';

const uuid = require('uuid').v4;

const { skills } = staticData;
let externalWorkExperienceSkills: ExternalWorkExperienceSkill[] = [];
let lastBatchNum: number | null = null;

export function getExternalWorkExperienceSkillsBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum) {
    const externalWorkExperiences: ExternalWorkExperience[] = getExternalWorkExperiencesBatchDynamicData(batchNum);
    externalWorkExperienceSkills = [];
    for (let count = 0; count < externalWorkExperiences.length; count += 1) {
      const externalWorkExperience = externalWorkExperiences[count];
      for (let x = 0; x < EXTERNAL_WORK_EXPERIENCE_SKILL_COUNT; x += 1) {
        const skillTextIndex = ((batchNum + count + x) % (skills.length));
        const assignSkill = skills[skillTextIndex];
        const levels = proficiencyLevels.filter((l) => l.proficiencySet_ID === assignSkill.proficiencySet_ID);
        const externalWorkExperienceSkill: ExternalWorkExperienceSkill = {
          ID: uuid(),
          workExperience_ID: externalWorkExperience.ID,
          skill_ID: assignSkill.ID!,
          employee_ID: externalWorkExperience.employee_ID,
          proficiencyLevel_ID: levels[(count * EXTERNAL_WORK_EXPERIENCE_SKILL_COUNT + x) % (levels.length)].ID,
        };
        externalWorkExperienceSkills.push(externalWorkExperienceSkill);
      }
    }
    lastBatchNum = batchNum;
  }
  return externalWorkExperienceSkills;
}
