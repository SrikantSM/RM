import { SkillRequirement } from 'test-commons';

const uuid = require('uuid').v4;

export const skillImportance = {
  manadatory: 1,
  preffered: 2,
};

export const resourceRequestIds = {
  RR1: 'rr111e36-ae2a-11e9-a2a3-2a2ae2dbrrq1',
  RR2: 'rr111e36-ae2a-11e9-a2a3-2a2ae2dbrrq2',
  RR3: 'rr111e36-ae2a-11e9-a2a3-2a2ae2dbrrq3',
};

export function getSkillRequirement(rrId: string, SkillId: string, importance: number, proficiencyLevel: string) {
  const skillRequirement:SkillRequirement = {
    ID: uuid(),
    RESOURCEREQUEST_ID: rrId,
    SKILL_ID: SkillId,
    IMPORTANCE_CODE: importance,
    PROFICIENCYLEVEL_ID: proficiencyLevel,
  };
  return skillRequirement;
}
