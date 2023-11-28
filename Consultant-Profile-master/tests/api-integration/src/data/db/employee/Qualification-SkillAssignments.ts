import { SkillAssignment } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    setOneProficiencyLevel1,
    setOneProficiencyLevel2,
    setTwoProficiencyLevel1,
    skillWithDescription1,
    skillWithDescription2,
} from '../skill';
import { employeeHeaderWithDescription1, employeeHeaderWithDescription2, employeeHeaderWithDescription4 } from './Headers';

const skillAssignmentWithDescription1: SkillAssignment = {
    ID: uuid(),
    skill_ID: skillWithDescription1.ID!,
    employee_ID: employeeHeaderWithDescription1.ID,
    proficiencyLevel_ID: setOneProficiencyLevel1.ID,
};

const skillAssignmentWithDescription2: SkillAssignment = {
    ID: uuid(),
    skill_ID: skillWithDescription1.ID!,
    employee_ID: employeeHeaderWithDescription2.ID,
    proficiencyLevel_ID: setOneProficiencyLevel2.ID,
};

const skillAssignmentWithDescription3: SkillAssignment = {
    ID: uuid(),
    skill_ID: skillWithDescription2.ID!,
    employee_ID: employeeHeaderWithDescription1.ID,
    proficiencyLevel_ID: setTwoProficiencyLevel1.ID,
};

const skillAssignmentWithDescription4: SkillAssignment = {
    ID: uuid(),
    skill_ID: skillWithDescription2.ID!,
    employee_ID: employeeHeaderWithDescription2.ID,
    proficiencyLevel_ID: setTwoProficiencyLevel1.ID,
};

const skillAssignmentWithDescription5: SkillAssignment = {
    ID: uuid(),
    skill_ID: skillWithDescription1.ID!,
    employee_ID: employeeHeaderWithDescription4.ID,
    proficiencyLevel_ID: setOneProficiencyLevel1.ID,
};

const skillAssignmentWithDescription6: SkillAssignment = {
    ID: uuid(),
    skill_ID: skillWithDescription2.ID!,
    employee_ID: employeeHeaderWithDescription4.ID,
    proficiencyLevel_ID: setTwoProficiencyLevel1.ID,
};

const allSkillAssignments = [
    skillAssignmentWithDescription1,
    skillAssignmentWithDescription2,
    skillAssignmentWithDescription3,
    skillAssignmentWithDescription4,
    skillAssignmentWithDescription5,
    skillAssignmentWithDescription6,
];

export {
    allSkillAssignments,
    skillAssignmentWithDescription1,
    skillAssignmentWithDescription2,
    skillAssignmentWithDescription3,
    skillAssignmentWithDescription4,
    skillAssignmentWithDescription5,
    skillAssignmentWithDescription6,
};
