const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');
const projectRoles = require('./projectRoles');

const roleAssignment1 = {
    ID: uuid(),
    role_ID: projectRoles.projectRole1.ID,
    employee_ID: employeeHeaders.employeeHeader1.ID,
};

const roleAssignment2 = {
    ID: uuid(),
    role_ID: projectRoles.projectRole2.ID,
    employee_ID: employeeHeaders.employeeHeader2.ID,
};
const roleAssignment3 = {
    ID: uuid(),
    role_ID: projectRoles.projectRole1.ID,
    employee_ID: employeeHeaders.employeeHeader3.ID,
};

const roleAssignment4 = {
    ID: uuid(),
    role_ID: projectRoles.projectRole2.ID,
    employee_ID: employeeHeaders.employeeHeader4.ID,
};

const roleAssignment5 = {
    ID: uuid(),
    role_ID: projectRoles.projectRole3.ID,
    employee_ID: employeeHeaders.employeeHeader1.ID,
};

const roleAssignment6 = {
    ID: uuid(),
    role_ID: projectRoles.projectRole4.ID,
    employee_ID: employeeHeaders.employeeHeader2.ID,
};

const roleAssignment7 = {
    ID: uuid(),
    role_ID: projectRoles.projectRole5.ID,
    employee_ID: employeeHeaders.employeeHeader3.ID,
};

const roleAssignment8 = {
    ID: uuid(),
    role_ID: projectRoles.projectRole4.ID,
    employee_ID: employeeHeaders.employeeHeader4.ID,
};

const roleAssignments = [
    roleAssignment1,
    roleAssignment2,
    roleAssignment3,
    roleAssignment4,
    roleAssignment5,
    roleAssignment6,
    roleAssignment7,
    roleAssignment8,
];

module.exports = {
    roleAssignments,
    roleAssignment1,
    roleAssignment2,
    roleAssignment3,
    roleAssignment4,
    roleAssignment5,
    roleAssignment6,
    roleAssignment7,
    roleAssignment8,
};
