const uuid = require('uuid').v4;
const { employeeHeaders } = require('./employeeHeaders');

const employeeHeader = employeeHeaders[0];
const managerHeader = employeeHeaders[1];

const employeePhone = {
    ID: uuid(),
    number: '1234-010-12345678',
    parent: employeeHeader.ID,
    isDefault: true,
};

const managerPhone = {
    ID: uuid(),
    number: '9876-020-98765432',
    parent: managerHeader.ID,
    isDefault: true,
};

const phones = [
    employeePhone,
    managerPhone,
];

module.exports = { phones };
