const uuid = require('uuid').v4;
const { employeeHeaders } = require('./employeeHeaders');

const employeeHeader = employeeHeaders[0];
const managerHeader = employeeHeaders[1];
const employeeFirstName = 'EmployeeFirstName';
const employeeLastName = 'EmployeeLastName';
const managerFirstName = 'ManagerFirstName';
const managerLastName = 'ManagerLastName';

const employeeProfileDetail = {
    ID: uuid(),
    firstName: employeeFirstName,
    lastName: employeeLastName,
    fullName: 'EmployeeFirstName EmployeeLastName',
    initials: 'EE',
    parent: employeeHeader.ID,
    validFrom: '1985-01-02',
    validTo: '9999-12-31',
};
const managerProfileDetail = {
    ID: uuid(),
    firstName: managerFirstName,
    lastName: managerLastName,
    fullName: 'ManagerFirstName ManagerLastName',
    initials: 'MM',
    parent: managerHeader.ID,
    validFrom: '1980-03-04',
    validTo: '9999-12-31',
};
const profileDetails = [
    employeeProfileDetail,
    managerProfileDetail,
];

module.exports = { profileDetails };
