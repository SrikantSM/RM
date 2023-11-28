const uuid = require('uuid').v4;
const { workforcePersons } = require('./workforcePerson');
const { testRunId } = require('./testRunID.js');

const workforcePersonWithDescription1 = workforcePersons[0];
const workforcePersonWithDescription2 = workforcePersons[1];
const workforcePersonManagerWithDescription = workforcePersons[2];

const workAssignment1 = {
    ID: uuid(),
    workAssignmentID: 'workAssignmentID1',
    externalID: `workAssignmentID1 ${testRunId}`,
    startDate: '2015-11-12',
    endDate: '2019-11-12',
    parent: workforcePersonWithDescription1.ID,
    isContingentWorker: false,
};

const workAssignment2 = {
    ID: uuid(),
    workAssignmentID: 'workAssignmentID2',
    externalID: `workAssignmentID2 ${testRunId}`,
    startDate: '2019-11-13',
    endDate: '9999-11-12',
    parent: workforcePersonWithDescription1.ID,
    isContingentWorker: false,
};

const workAssignment3 = {
    ID: uuid(),
    workAssignmentID: 'workAssignmentID3',
    externalID: `workAssignmentID3 ${testRunId}`,
    startDate: '2018-11-12',
    endDate: '9999-11-12',
    parent: workforcePersonWithDescription2.ID,
    isContingentWorker: false,
};

const workAssignment4 = {
    ID: uuid(),
    workAssignmentID: 'workAssignmentID4',
    externalID: `workAssignmentID4 ${testRunId}`,
    startDate: '2018-11-12',
    endDate: '9999-11-12',
    parent: workforcePersonManagerWithDescription.ID,
    isContingentWorker: false,
};

const workAssignment5 = {
    ID: uuid(),
    workAssignmentID: 'workAssignmentID5',
    externalID: `workAssignmentID5 ${testRunId}`,
    startDate: '2018-11-13',
    endDate: '9999-11-12',
    parent: workforcePersonWithDescription1.ID,
    isContingentWorker: false,
};

const workAssignments = [
    workAssignment1,
    workAssignment2,
    workAssignment3,
    workAssignment4,
    workAssignment5,
];

module.exports = { workAssignments };
