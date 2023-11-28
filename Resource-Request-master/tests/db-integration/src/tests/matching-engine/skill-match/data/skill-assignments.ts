import { SkillAssignment } from 'test-commons';

const uuid = require('uuid').v4;

export function getSkillAssignment(empId: string, SkillId: string, proficiencyLevel: string) {
  const skillAssignment:SkillAssignment = {
    ID: uuid(),
    employee_ID: empId,
    skill_ID: SkillId,
    proficiencyLevel_ID: proficiencyLevel,
  };
  return skillAssignment;
}
