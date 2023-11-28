const uuid = require('uuid').v4;
const { skills } = require('./skills');
const { proficiencyLevels } = require('./proficiencyLevels');
const { employeeHeaders } = require('./employeeHeaders');

const employeeHeader = employeeHeaders[0];

const skillAssignment1 = {
    ID: uuid(),
    employee_ID: employeeHeader.ID,
    skill_ID: skills[0].ID,
    proficiencyLevel_ID: proficiencyLevels[1].ID,
};
const skillAssignment2 = {
    ID: uuid(),
    employee_ID: employeeHeader.ID,
    skill_ID: skills[3].ID,
    proficiencyLevel_ID: proficiencyLevels[0].ID,
};
const skillAssignment3 = {
    ID: uuid(),
    employee_ID: employeeHeader.ID,
    skill_ID: skills[6].ID,
    proficiencyLevel_ID: proficiencyLevels[2].ID,
};
const skillAssignments = [
    skillAssignment1,
    skillAssignment2,
    skillAssignment3,
];

module.exports = { skillAssignments };
