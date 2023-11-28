const uuid = require('uuid').v4;
const { skills } = require('./skills');
const { employeeHeaders } = require('./employeeHeaders');
const { externalWorkExperiences } = require('./externalWorkExperiences');

const defaultProficiencyLevelId = '8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee';

const employeeHeader = employeeHeaders[0];

const externalWorkExperienceSkill1 = {
    ID: uuid(),
    workExperience_ID: externalWorkExperiences[0].ID,
    skill_ID: skills[0].ID,
    employee_ID: employeeHeader.ID,
    proficiencyLevel_ID: defaultProficiencyLevelId,
};
const externalWorkExperienceSkill2 = {
    ID: uuid(),
    workExperience_ID: externalWorkExperiences[1].ID,
    skill_ID: skills[1].ID,
    employee_ID: employeeHeader.ID,
    proficiencyLevel_ID: defaultProficiencyLevelId,
};
const externalWorkExperienceSkills = [
    externalWorkExperienceSkill1,
    externalWorkExperienceSkill2,
];

module.exports = { externalWorkExperienceSkills };
