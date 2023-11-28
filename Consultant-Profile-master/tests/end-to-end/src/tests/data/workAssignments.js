const uuid = require('uuid').v4;
const { employeeHeaders } = require('./employeeHeaders');
const environment = require('../../utils').getEnvironment();

const { seleniumTestName } = environment;

const employeeHeader1ID = employeeHeaders[0].ID;
const employeeHeader2ID = employeeHeaders[1].ID;

const workAssignment1 = {
    ID: uuid(),
    workAssignmentID: uuid(),
    parent: employeeHeader1ID,
    externalID: `${seleniumTestName}.Employee`,
    startDate: '2017-12-31',
    endDate: '2018-05-31',
    isContingentWorker: false,
};

const workAssignment2 = {
    ID: uuid(),
    workAssignmentID: uuid(),
    parent: employeeHeader1ID,
    externalID: `${seleniumTestName}.Employee`,
    startDate: '2018-06-01',
    endDate: '2099-12-31',
    isContingentWorker: false,
};

const workAssignment3 = {
    ID: uuid(),
    workAssignmentID: uuid(),
    parent: employeeHeader2ID,
    externalID: `${seleniumTestName}.Manager`,
    startDate: '2017-01-01',
    endDate: '9999-12-31',
    isContingentWorker: false,
};

const workAssignments = [
    workAssignment1,
    workAssignment2,
    workAssignment3,
];

module.exports = { workAssignments };
