const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');

const emailAddress1 = { address: 'test.usere2e1@sap.com' };
const email1 = {
    ID: uuid(),
    parent: employeeHeaders.employeeHeader1.ID,
    isDefault: true
};
Object.assign(email1, emailAddress1);

const emailAddress2 = { address: 'test.usere2e2@sap.com' };
const email2 = {
    ID: uuid(),
    parent: employeeHeaders.employeeHeader2.ID,
    isDefault: true
};
Object.assign(email2, emailAddress2);

const emailAddress3 = { address: 'test.usere2e3@sap.com' };
const email3 = {
    ID: uuid(),
    parent: employeeHeaders.employeeHeader3.ID,
    isDefault: true
};
Object.assign(email3, emailAddress3);

const emailAddress4 = { address: 'sapc4prmauthpipelineconsultant@global.corp.sap' };
const email4 = {
    ID: uuid(),
    parent: employeeHeaders.employeeHeader4.ID,
    isDefault: true
};
Object.assign(email4, emailAddress4);

const emailAddress5 = { address: 'sapc4prmauthpipelineresourcemanager@global.corp.sap' };
const email5 = {
    ID: uuid(),
    parent: employeeHeaders.employeeHeader5.ID,
    isDefault: true
};
Object.assign(email5, emailAddress5);

const emailAddress6 = { address: 'SAPC4PAUTHORIZATIONPIPELINEPROCESSOR@global.corp.sap' };
const email6 = {
    ID: uuid(),
    parent: employeeHeaders.employeeHeader6.ID,
    isDefault: true
};
Object.assign(email6, emailAddress6);

const allEmailAddressData = [
    emailAddress1,
    emailAddress2,
    emailAddress3,
    emailAddress4,
    emailAddress5,
    emailAddress6
];

const emails = [
    email1,
    email2,
    email3,
    email4,
    email5,
    email6
];

module.exports = {
    allEmailAddressData,
    emails,
    email1,
    email2,
    email3,
    email4,
    email5,
    email6
};