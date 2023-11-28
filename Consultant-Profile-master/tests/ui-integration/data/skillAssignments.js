const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');
const skills = require('./skills');
const proficiencyLevels = require('./proficiencyLevels');

const skillAssignment1 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader1.ID,
    skill_ID: skills.skill1.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet1.ID,
};

const skillAssignment2 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader2.ID,
    skill_ID: skills.skill2.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet2.ID,
};

const skillAssignment3 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader3.ID,
    skill_ID: skills.skill3.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet3.ID,
};

const skillAssignment4 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader4.ID,
    skill_ID: skills.skill4.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet4.ID,
};

const skillAssignment5 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader1.ID,
    skill_ID: skills.skill4.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet4.ID,
};

const skillAssignment6 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader2.ID,
    skill_ID: skills.skill1.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet1.ID,
};

const skillAssignment7 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader3.ID,
    skill_ID: skills.skill2.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet2.ID,
};

const skillAssignment8 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader4.ID,
    skill_ID: skills.skill3.ID,
    proficiencyLevel_ID: proficiencyLevels.firstProficiencyLevelSet3.ID,
};

const skillAssignments = [
    skillAssignment1,
    skillAssignment2,
    skillAssignment3,
    skillAssignment4,
    skillAssignment5,
    skillAssignment6,
    skillAssignment7,
    skillAssignment8,
];

module.exports = {
    skillAssignments,
    skillAssignment1,
    skillAssignment2,
    skillAssignment3,
    skillAssignment4,
    skillAssignment5,
    skillAssignment6,
    skillAssignment7,
    skillAssignment8,
};
