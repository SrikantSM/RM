const { employeeHeaders } = require('./headers');
const { testRunId } = require('./testRunID.js');

const employeeHeaderWithDescription1 = employeeHeaders[0];
const employeeHeaderWithDescription2 = employeeHeaders[1];
const employeeHeaderWithDescription3 = employeeHeaders[2];

const workforcePersonWithDescription1 = {
    ID: employeeHeaderWithDescription1.ID,
    isBusinessPurposeCompleted: false,
    externalID: `workforcePersonExternalID1 ${testRunId}`,
};

const workforcePersonWithDescription2 = {
    ID: employeeHeaderWithDescription2.ID,
    isBusinessPurposeCompleted: false,
    externalID: `workforcePersonExternalID2 ${testRunId}`,
};

const workforcePersonManagerWithDescription = {
    ID: employeeHeaderWithDescription3.ID,
    isBusinessPurposeCompleted: true,
    externalID: `workforcePersonExternalID3 ${testRunId}`,
};

const workforcePersons = [
    workforcePersonWithDescription1,
    workforcePersonWithDescription2,
    workforcePersonManagerWithDescription,
];

module.exports = { workforcePersons };
