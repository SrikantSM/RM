const { employeeHeaders } = require('./employeeHeaders');
const environment = require('../../utils').getEnvironment();

const { seleniumTestName } = environment;

const employeeHeader = employeeHeaders[0];
const managerHeader = employeeHeaders[1];

const employeeWorkforcePerson = {
    ID: employeeHeader.ID,
    externalID: `${seleniumTestName}.Employe`,
};

const managerWorkforcePerson = {
    ID: managerHeader.ID,
    externalID: `${seleniumTestName}.Manager`,
};

const workforcePersons = [
    employeeWorkforcePerson,
    managerWorkforcePerson,
];

module.exports = { workforcePersons };
