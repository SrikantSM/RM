const uuid = require('uuid').v4;
const { costCenters } = require('./costCenter');
const { workAssignments } = require('./workAssignments');

const costCenter1 = costCenters[0].ID;
const costCenter2 = costCenters[1].ID;
const workAssignment1ID = workAssignments[0].ID;
const workAssignment2ID = workAssignments[1].ID;
const managerExternalID = workAssignments[2].externalID;

const jobDetail1 = {
    ID: uuid(),
    costCenterexternalID: costCenter1,
    supervisorWorkAssignmentExternalID: managerExternalID,
    jobTitle: 'Associate Consultant',
    parent: workAssignment1ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'DE',
    validFrom: '2017-01-01',
    validTo: '2018-01-02',
    eventSequence: 1,
};

const jobDetail2 = {
    ID: uuid(),
    costCenterexternalID: costCenter1,
    supervisorWorkAssignmentExternalID: managerExternalID,
    jobTitle: 'Consultant',
    parent: workAssignment1ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'DE',
    validFrom: '2018-01-02',
    validTo: '2018-05-31',
    eventSequence: 1,
};

const jobDetail3 = {
    ID: uuid(),
    costCenterexternalID: costCenter2,
    supervisorWorkAssignmentExternalID: managerExternalID,
    jobTitle: 'Consultant',
    parent: workAssignment2ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'DE',
    validFrom: '2018-06-01',
    validTo: '2019-06-01',
    eventSequence: 1,
};

const jobDetail4 = {
    ID: uuid(),
    costCenterexternalID: costCenter1,
    supervisorWorkAssignmentExternalID: managerExternalID,
    jobTitle: 'Senior Consultant',
    parent: workAssignment2ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'DE',
    validFrom: '2019-06-02',
    validTo: '9999-12-31',
    eventSequence: 1,
};

const jobDetails = [
    jobDetail1,
    jobDetail2,
    jobDetail3,
    jobDetail4,
];

module.exports = { jobDetails };
