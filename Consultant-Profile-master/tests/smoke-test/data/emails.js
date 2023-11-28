const employeeHeaders = require('./employeeHeaders');

const emailAddress1 = { address: 'sapc4prmauthpipelineprojectmanager@global.corp.sap' };
const email1 = {
    ID: 'ae623e50-63e5-11ed-81ce-0242ac120002',
    parent: employeeHeaders.employeeHeader1.ID,
    isDefault: true
};
Object.assign(email1, emailAddress1);

const allEmailAddressData = [
    emailAddress1,
];

const emails = [
    email1,
];

module.exports = {
    allEmailAddressData,
    emails,
    email1,
};
