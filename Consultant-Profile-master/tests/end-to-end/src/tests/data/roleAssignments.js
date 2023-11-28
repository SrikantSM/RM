const uuid = require('uuid').v4;
const { projectRoles } = require('./projectRoles');
const { employeeHeaders } = require('./employeeHeaders');

const employeeHeader = employeeHeaders[0];

const roleAssignment1 = {
    ID: uuid(),
    role_ID: projectRoles[0].ID,
    employee_ID: employeeHeader.ID,
};
const roleAssignment2 = {
    ID: uuid(),
    role_ID: projectRoles[2].ID,
    employee_ID: employeeHeader.ID,
};
const roleAssignment3 = {
    ID: uuid(),
    role_ID: projectRoles[4].ID,
    employee_ID: employeeHeader.ID,
};
const roleAssignments = [
    roleAssignment1,
    roleAssignment2,
    roleAssignment3,
];

module.exports = { roleAssignments };
