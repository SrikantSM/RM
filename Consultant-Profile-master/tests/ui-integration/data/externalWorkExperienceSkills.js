const uuid = require('uuid').v4;
const externalWorkExperiences = require('./externalWorkExperiences');
const skills = require('./skills');
const employeeHeaders = require('./employeeHeaders');
const proficiencyLevels = require('./proficiencyLevels');

const externalWorkExperienceSkill1 = {
    ID: uuid(),
    workExperience_ID: externalWorkExperiences.work1.ID,
    skill_ID: skills.skill1.ID,
    employee_ID: employeeHeaders.employeeHeader1.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet1.ID,
};

const externalWorkExperienceSkill2 = {
    ID: uuid(),
    workExperience_ID: externalWorkExperiences.work2.ID,
    skill_ID: skills.skill2.ID,
    employee_ID: employeeHeaders.employeeHeader1.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet2.ID,
};

const externalWorkExperienceSkill3 = {
    ID: uuid(),
    workExperience_ID: externalWorkExperiences.work3.ID,
    skill_ID: skills.skill3.ID,
    employee_ID: employeeHeaders.employeeHeader1.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet3.ID,
};

const externalWorkExperienceSkill4 = {
    ID: uuid(),
    workExperience_ID: externalWorkExperiences.work4.ID,
    skill_ID: skills.skill4.ID,
    employee_ID: employeeHeaders.employeeHeader2.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet4.ID,
};

const externalWorkExperienceSkill5 = {
    ID: uuid(),
    workExperience_ID: externalWorkExperiences.work5.ID,
    skill_ID: skills.skill5.ID,
    employee_ID: employeeHeaders.employeeHeader3.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet5.ID,
};

const externalWorkExperienceSkill6 = {
    ID: uuid(),
    workExperience_ID: externalWorkExperiences.work6.ID,
    skill_ID: skills.skill1.ID,
    employee_ID: employeeHeaders.employeeHeader3.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet1.ID,
};

const externalWorkExperienceSkill7 = {
    ID: uuid(),
    workExperience_ID: externalWorkExperiences.work7.ID,
    skill_ID: skills.skill2.ID,
    employee_ID: employeeHeaders.employeeHeader4.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet2.ID,
};

const externalWorkExperienceSkill8 = {
    ID: uuid(),
    workExperience_ID: externalWorkExperiences.work8.ID,
    skill_ID: skills.skill3.ID,
    employee_ID: employeeHeaders.employeeHeader4.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet3.ID,
};

const externalWorkExperienceSkills = [
    externalWorkExperienceSkill1,
    externalWorkExperienceSkill2,
    externalWorkExperienceSkill3,
    externalWorkExperienceSkill4,
    externalWorkExperienceSkill5,
    externalWorkExperienceSkill6,
    externalWorkExperienceSkill7,
    externalWorkExperienceSkill8,
];

module.exports = {
    externalWorkExperienceSkills,
    externalWorkExperienceSkill1,
    externalWorkExperienceSkill2,
    externalWorkExperienceSkill3,
    externalWorkExperienceSkill4,
    externalWorkExperienceSkill5,
    externalWorkExperienceSkill6,
    externalWorkExperienceSkill7,
    externalWorkExperienceSkill8,
};
