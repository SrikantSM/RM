const { employeeHeaders } = require('./employeeHeaders');
const environment = require('../../../utils').getEnvironment();
const { testRunId } = require('../testRunID.js');

const { seleniumTestName } = environment;

const employeeHeader = employeeHeaders[0];
const managerHeader = employeeHeaders[1];

const employeeWorkforcePerson = {
    ID: employeeHeader.ID,
    externalID: `${testRunId}${seleniumTestName}.Employe`,
};

const managerWorkforcePerson = {
    ID: managerHeader.ID,
    externalID: `${testRunId}${seleniumTestName}.Manager`,
};

const workforcePersons = [
    employeeWorkforcePerson,
    managerWorkforcePerson,
];

module.exports = { workforcePersons };
