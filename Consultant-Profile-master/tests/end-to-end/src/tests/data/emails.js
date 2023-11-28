const uuid = require('uuid').v4;
const { employeeHeaders } = require('./employeeHeaders');
const environment = require('../../utils').getEnvironment();

const { appUsers } = environment;

const employeeHeader1 = employeeHeaders[0];
const employeeHeader2 = employeeHeaders[1];
const emailAddress = appUsers.get('CONSULTANT');
const employeeEmailData = { address: emailAddress };
const managerEmailData = { address: `${emailAddress.substr(0, emailAddress.indexOf('@'))}.manager@sap.com` };
const allEmailAddressData = [employeeEmailData, managerEmailData];

const employeeEmail = {
    parent: employeeHeader1.ID,
    ID: uuid(),
    isDefault: true,
};

const managerEmail = {
    parent: employeeHeader2.ID,
    ID: uuid(),
    isDefault: true,
};

Object.assign(employeeEmail, employeeEmailData);
Object.assign(managerEmail, managerEmailData);

const emails = [
    employeeEmail,
    managerEmail,
];

module.exports = {
    allEmailAddressData,
    emails,
};
