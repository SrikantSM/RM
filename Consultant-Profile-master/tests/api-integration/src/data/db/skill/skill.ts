import { Skill } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    proficiencySet1, proficiencySet2, proficiencySet3, proficiencySet4,
} from './proficiencySets';

const skill1Id = uuid();
const skill2Id = uuid();
const skill3Id = uuid();
const skill4Id = uuid();

const skillName1 = {
    name: 'SkillName1',
};

const skillName2 = {
    name: 'SkillName2',
};

const skillName3 = {
    name: 'SkillName3',
};

const skillName4 = {
    name: 'SkillName4',
};

const allSkillNames = [
    skillName1,
    skillName2,
    skillName3,
    skillName4,
];

const skillWithDescription1: Skill = {
    ID: skill1Id,
    name: skillName1.name,
    description: 'SkillDescription1',
    lifecycleStatus_code: 0,
    proficiencySet_ID: proficiencySet1.ID,
};

const skillWithDescription2: Skill = {
    ID: skill2Id,
    name: skillName2.name,
    description: 'SkillDescription2',
    lifecycleStatus_code: 0,
    proficiencySet_ID: proficiencySet2.ID,
};

const skillWithDescription3: Skill = {
    ID: skill3Id,
    name: skillName3.name,
    description: 'SkillDescription3',
    lifecycleStatus_code: 0,
    proficiencySet_ID: proficiencySet3.ID,
};

const skillWithDescription4: Skill = {
    ID: skill4Id,
    name: skillName4.name,
    description: 'SkillDescription4',
    lifecycleStatus_code: 1,
    proficiencySet_ID: proficiencySet4.ID,
};

const allSkills = [
    skillWithDescription1,
    skillWithDescription2,
    skillWithDescription3,
    skillWithDescription4,
];

export {
    allSkillNames,
    allSkills,
    skillWithDescription1,
    skillWithDescription2,
    skillWithDescription3,
    skillWithDescription4,
};
