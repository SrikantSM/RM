const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');

const skillAssignment1 = {
    ID: uuid(),
    skill_ID : undefined,
    proficiencyLevel_ID: undefined,
    employee_ID: employeeHeaders.employeeHeader1.ID
}

const skillAssignment2 = {
    ID: uuid(),
    skill_ID : undefined,
    proficiencyLevel_ID: undefined,
    employee_ID: employeeHeaders.employeeHeader1.ID
}

const skillAssignment3 = {
    ID: uuid(),
    skill_ID : undefined,
    proficiencyLevel_ID: undefined,
    employee_ID: employeeHeaders.employeeHeader2.ID
}

const skillAssignment4 = {
    ID: uuid(),
    skill_ID : undefined,
    proficiencyLevel_ID: undefined,
    employee_ID: employeeHeaders.employeeHeader3.ID
}

const skillAssignments = [
    skillAssignment1,
    skillAssignment2,
    skillAssignment3,
    skillAssignment4
]

module.exports = {
    skillAssignments,
    skillAssignment1,
    skillAssignment2,
    skillAssignment3,
    skillAssignment4
}
