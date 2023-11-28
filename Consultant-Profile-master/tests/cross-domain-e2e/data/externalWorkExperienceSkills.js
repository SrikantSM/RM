const uuid = require('uuid').v4;
const { employeeHeader1 } = require('./employeeHeaders');
const { externalWorkExperience1 } = require('./externalWorkExperiences');

const externalWorkExperienceSkill1 = {
    ID: uuid(),
    workExperience_ID: externalWorkExperience1.ID,
    employee_ID: employeeHeader1.ID,
    skill_ID: undefined,
    proficiencyLevel_ID: undefined
};

const externalWorkExperienceSkill2 = {
    ID: uuid(),
    workExperience_ID: externalWorkExperience1.ID,
    employee_ID: employeeHeader1.ID,
    skill_ID: undefined,
    proficiencyLevel_ID: undefined
};

const externalWorkExperienceSkills = [
    externalWorkExperienceSkill1,
    externalWorkExperienceSkill2
];

module.exports = {
    externalWorkExperienceSkills,
    externalWorkExperienceSkill1,
    externalWorkExperienceSkill2
};
