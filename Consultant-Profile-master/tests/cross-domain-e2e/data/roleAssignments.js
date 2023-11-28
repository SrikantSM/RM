const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');
const projectRoles = require('./projectRoles');

const roleAssignment1 = {
    ID : uuid(),
    employee_ID: employeeHeaders.employeeHeader1.ID,
    role_ID: projectRoles.projectRole1.ID
}

const roleAssignment2 = {
    ID : uuid(),
    employee_ID: employeeHeaders.employeeHeader2.ID,
    role_ID: projectRoles.projectRole1.ID
}

const roleAssignment3 = {
    ID : uuid(),
    employee_ID: employeeHeaders.employeeHeader3.ID,
    role_ID: projectRoles.projectRole1.ID
}

const roleAssignments = [
    roleAssignment1,
    roleAssignment2,
    roleAssignment3
]

module.exports = {
    roleAssignments,
    roleAssignment1,
    roleAssignment2,
    roleAssignment3
}