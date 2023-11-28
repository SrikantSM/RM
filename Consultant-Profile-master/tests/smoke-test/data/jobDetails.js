const workAssignments = require('./workAssignments');
const costCenters = require('./costCenters');

const jobDetail1 = {
    ID: '2df16e38-64a0-11ed-9022-0242ac120002',
    costCenterexternalID: costCenters.costCenter1.ID,
    supervisorWorkAssignmentExternalID: workAssignments.workAssignment1.externalID,
    jobTitle: "Senior Consultant",
    parent: workAssignments.workAssignment1.ID,
    legalEntityExternalID: "AUG1",
    country_code: "DE",
    validFrom: "2017-01-01",
    validTo: "9999-12-31",
    eventSequence: 1,
    status_code: 'A',
};

const jobDetails = [
    jobDetail1,
];

module.exports = {
    jobDetails,
    jobDetail1,
};
