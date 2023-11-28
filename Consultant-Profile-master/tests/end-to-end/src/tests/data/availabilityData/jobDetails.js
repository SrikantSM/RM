const uuid = require('uuid').v4;
const { costCenters } = require('./costCenter');
const { workAssignments } = require('./workAssignment');

const costCenter1 = costCenters[0].ID;
const costCenter2 = costCenters[1].ID;
const workAssignment1ID = workAssignments[0].ID;
const workAssignment2ID = workAssignments[1].ID;
const managerExternalID = workAssignments[2].externalID;

const jobDetail1 = {
    ID: uuid(),
    costCenterexternalID: costCenter1,
    supervisorWorkAssignmentExternalID: workAssignment1ID,
    jobTitle: 'Consultant WA1',
    parent: workAssignments[0].ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'DE',
    validFrom: '2018-11-12',
    validTo: '9999-12-31',
    eventSequence: 1,
};

const jobDetail2 = {
    ID: uuid(),
    costCenterexternalID: costCenter2,
    supervisorWorkAssignmentExternalID: managerExternalID,
    jobTitle: 'Consultant 2',
    parent: workAssignment2ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'DE',
    validFrom: '2019-11-13',
    validTo: '9999-12-31',
    eventSequence: 2,
};

const jobDetail3 = {
    ID: uuid(),
    costCenterexternalID: costCenter1,
    supervisorWorkAssignmentExternalID: managerExternalID,
    jobTitle: 'Consultant 3',
    parent: workAssignments[2].ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'DE',
    validFrom: '2018-11-12',
    validTo: '9999-12-31',
    eventSequence: 1,
};

const jobDetail4 = {
    ID: uuid(),
    costCenterexternalID: costCenter2,
    supervisorWorkAssignmentExternalID: workAssignment1ID,
    jobTitle: 'Consultant 4',
    parent: workAssignments[3].ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'DE',
    validFrom: '2018-11-12',
    validTo: '9999-12-31',
    eventSequence: 1,
};

const jobDetail5 = {
    ID: uuid(),
    costCenterexternalID: costCenter1,
    supervisorWorkAssignmentExternalID: workAssignment1ID,
    jobTitle: 'Consultant WA5',
    parent: workAssignments[4].ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'DE',
    validFrom: '2018-11-12',
    validTo: '9999-12-31',
    eventSequence: 1,
};

const jobDetails = [
    jobDetail1,
    jobDetail2,
    jobDetail3,
    jobDetail4,
    jobDetail5,
];

module.exports = { jobDetails };
