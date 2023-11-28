const uuid = require('uuid').v4;
const workAssignments = require('./workAssignments');
const costCenters = require('./costCenters');

const jobDetail1 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter2.ID,
    supervisorWorkAssignmentExternalID: workAssignments.workAssignment2.externalID,
    jobTitle: "Senior Consultant",
    parent: workAssignments.workAssignment1.ID,
    legalEntityExternalID: "AUG1",
    country_code: "DE",
    validFrom: "2017-01-01",
    validTo: "9999-12-31",
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail2 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter2.ID,
    supervisorWorkAssignmentExternalID: workAssignments.workAssignment1.externalID,
    jobTitle: 'Senior Consultant',
    parent: workAssignments.workAssignment2.ID,
    legalEntityExternalID: 'AUG2',
    country_code: 'DE',
    validFrom: '2017-02-02',
    validTo: '9999-12-31',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail3 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter2.ID,
    supervisorWorkAssignmentExternalID: workAssignments.workAssignment4.externalID,
    jobTitle: "Senior Consultant",
    parent: workAssignments.workAssignment3.ID,
    legalEntityExternalID: "AUG1",
    country_code: "DE",
    validFrom: "2017-03-03",
    validTo: "9999-12-31",
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail4 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter2.ID,
    supervisorWorkAssignmentExternalID: workAssignments.workAssignment3.externalID,
    jobTitle: 'Senior Consultant',
    parent: workAssignments.workAssignment4.ID,
    legalEntityExternalID: 'AUG2',
    country_code: 'DE',
    validFrom: '2017-04-04',
    validTo: '9999-12-31',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetails = [
    jobDetail1,
    jobDetail2,
    jobDetail3,
    jobDetail4,
];

module.exports = {
    jobDetails,
    jobDetail1,
    jobDetail2,
    jobDetail3,
    jobDetail4,
};
