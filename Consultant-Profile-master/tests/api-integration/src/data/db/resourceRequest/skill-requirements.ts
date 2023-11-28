import { SkillRequirement } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { resourceRequestData } from './resource-request';
import {
    skillWithDescription1, skillWithDescription2, setOneProficiencyLevel1, setTwoProficiencyLevel1,
} from '../skill';

const skillRequirements1: SkillRequirement = {
    ID: uuid(),
    RESOURCEREQUEST_ID: resourceRequestData[0].ID,
    SKILL_ID: skillWithDescription1.ID!,
    IMPORTANCE_CODE: 1,
    PROFICIENCYLEVEL_ID: setOneProficiencyLevel1.ID,
};

const skillRequirements2: SkillRequirement = {
    ID: uuid(),
    RESOURCEREQUEST_ID: resourceRequestData[1].ID,
    SKILL_ID: skillWithDescription2.ID!,
    IMPORTANCE_CODE: 1,
    PROFICIENCYLEVEL_ID: setTwoProficiencyLevel1.ID,
};

const allSkillRequirements = [
    skillRequirements1,
    skillRequirements2,
];

export {
    allSkillRequirements,
    skillRequirements1,
    skillRequirements2,
};
