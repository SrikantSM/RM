const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');

const email1 = {
    ID: uuid(),
    address: 'authenticated-user@sap.com',
    parent: employeeHeaders.employeeHeader1.ID,
    isDefault: true,
};

const email2 = {
    ID: uuid(),
    address: 'test.usere2e2@sap.com',
    parent: employeeHeaders.employeeHeader2.ID,
    isDefault: true,
};

const email3 = {
    ID: uuid(),
    address: 'test.usere2e3@sap.com',
    parent: employeeHeaders.employeeHeader3.ID,
    isDefault: true,
};

const email4 = {
    ID: uuid(),
    address: 'test.usere2e4@sap.com',
    parent: employeeHeaders.employeeHeader4.ID,
    isDefault: true,
};

const emails = [
    email1,
    email2,
    email3,
    email4,
];

module.exports = {
    emails,
    email1,
    email2,
    email3,
    email4,
};
