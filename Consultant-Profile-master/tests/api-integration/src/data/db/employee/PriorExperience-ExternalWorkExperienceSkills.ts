import { ExternalWorkExperienceSkill } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    externalWorkExperience1, externalWorkExperience2, externalWorkExperience3, externalWorkExperience4,
} from './PriorExperience-ExternalWorkExperience';
import {
    setOneProficiencyLevel1,
    setTwoProficiencyLevel1,
    setTwoProficiencyLevel2,
    skillWithDescription1,
    skillWithDescription2,
} from '../skill';
import { employeeHeaderWithDescription2, employeeHeaderWithDescription1, employeeHeaderWithDescription4 } from './Headers';

const externalWorkExperienceSkills11: ExternalWorkExperienceSkill = {
    ID: uuid(),
    workExperience_ID: externalWorkExperience1.ID,
    skill_ID: skillWithDescription1.ID!,
    employee_ID: employeeHeaderWithDescription1.ID,
    proficiencyLevel_ID: setOneProficiencyLevel1.ID,
};

const externalWorkExperienceSkills12: ExternalWorkExperienceSkill = {
    ID: uuid(),
    workExperience_ID: externalWorkExperience1.ID,
    skill_ID: skillWithDescription2.ID!,
    employee_ID: employeeHeaderWithDescription1.ID,
    proficiencyLevel_ID: setTwoProficiencyLevel1.ID,
};

const externalWorkExperienceSkills21: ExternalWorkExperienceSkill = {
    ID: uuid(),
    workExperience_ID: externalWorkExperience2.ID,
    skill_ID: skillWithDescription1.ID!,
    employee_ID: employeeHeaderWithDescription2.ID,
    proficiencyLevel_ID: setOneProficiencyLevel1.ID,
};

const externalWorkExperienceSkills31: ExternalWorkExperienceSkill = {
    ID: uuid(),
    workExperience_ID: externalWorkExperience3.ID,
    skill_ID: skillWithDescription1.ID!,
    employee_ID: employeeHeaderWithDescription1.ID,
    proficiencyLevel_ID: setOneProficiencyLevel1.ID,
};

const externalWorkExperienceSkills41: ExternalWorkExperienceSkill = {
    ID: uuid(),
    workExperience_ID: externalWorkExperience4.ID,
    skill_ID: skillWithDescription1.ID!,
    employee_ID: employeeHeaderWithDescription4.ID,
    proficiencyLevel_ID: setOneProficiencyLevel1.ID,
};

const externalWorkExperienceSkills42: ExternalWorkExperienceSkill = {
    ID: uuid(),
    workExperience_ID: externalWorkExperience4.ID,
    skill_ID: skillWithDescription2.ID!,
    employee_ID: employeeHeaderWithDescription4.ID,
    proficiencyLevel_ID: setTwoProficiencyLevel2.ID,
};

const allExternalWorkExperienceSkills = [
    externalWorkExperienceSkills11,
    externalWorkExperienceSkills12,
    externalWorkExperienceSkills21,
    externalWorkExperienceSkills31,
    externalWorkExperienceSkills41,
    externalWorkExperienceSkills42,
];

export {
    allExternalWorkExperienceSkills,
    externalWorkExperienceSkills11,
    externalWorkExperienceSkills12,
    externalWorkExperienceSkills21,
    externalWorkExperienceSkills31,
    externalWorkExperienceSkills41,
    externalWorkExperienceSkills42,
};
