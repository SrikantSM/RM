const uuid = require('uuid').v4;
const workAssignments = require('./workAssignments');
const costCenters = require('./costCenters');

const now = new Date(Date.now());
const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
const day5 = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 5));

const jobDetail1 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter2.ID,
    supervisorWorkAssignmentExternalID: 'test.usere2e3',
    jobTitle: 'Associate Consultant',
    parent: workAssignments.workAssignment1.ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'IN',
    validFrom: '2017-01-01',
    validTo: '2023-01-01',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail2 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter1.ID,
    supervisorWorkAssignmentExternalID: 'test.usere2e2',
    jobTitle: 'Junior Consultant',
    parent: workAssignments.workAssignment1.ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'IN',
    validFrom: '2023-01-02',
    validTo: '9999-12-31',
    eventSequence: 1,
    status_code: 'F',
};

const jobDetail3 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter1.ID,
    supervisorWorkAssignmentExternalID: 'test.usere2e2',
    jobTitle: 'Consultant',
    parent: workAssignments.workAssignment2.ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'IN',
    validFrom: '2020-01-01',
    validTo: '2020-04-01',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail4 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter2.ID,
    supervisorWorkAssignmentExternalID: 'test.usere2e2',
    jobTitle: 'Senior Consultant',
    parent: workAssignments.workAssignment2.ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'DE',
    validFrom: '2020-04-01',
    validTo: '2023-03-31',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail5 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter1.ID,
    supervisorWorkAssignmentExternalID: 'test.usere2e1',
    jobTitle: 'Senior Consultant',
    parent: workAssignments.workAssignment3.ID,
    legalEntityExternalID: 'AUG2',
    country_code: 'DE',
    validFrom: '2017-02-02',
    validTo: '9999-12-31',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail6 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter1.ID,
    supervisorWorkAssignmentExternalID: 'test.usere2e4',
    jobTitle: 'Senior Consultant',
    parent: workAssignments.workAssignment4.ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'IN',
    validFrom: '2017-03-03',
    validTo: '2018-12-31',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail7 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter2.ID,
    supervisorWorkAssignmentExternalID: 'test.usere2e5',
    jobTitle: 'Associate Consultant',
    parent: workAssignments.workAssignment5.ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'IN',
    validFrom: '2017-12-31',
    validTo: '9999-12-31',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail8 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter3.ID,
    supervisorWorkAssignmentExternalID: 'test.usere2e2',
    jobTitle: 'Junior Consultant',
    parent: workAssignments.workAssignment6.ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'IN',
    validFrom: '2017-12-31',
    validTo: '9999-12-31',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail9 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter2.ID,
    supervisorWorkAssignmentExternalID: 'test.usere2e4',
    jobTitle: 'Senior Consultant',
    parent: workAssignments.workAssignment4.ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'IN',
    validFrom: '2018-03-03',
    validTo: today.toISOString().slice(0, 10),
    eventSequence: 1,
    status_code: 'A',
};

const jobDetail10 = {
    ID: uuid(),
    costCenterexternalID: costCenters.costCenter3.ID,
    supervisorWorkAssignmentExternalID: 'test.usere2e4',
    jobTitle: 'Senior Consultant',
    parent: workAssignments.workAssignment4.ID,
    legalEntityExternalID: 'AUG1',
    country_code: 'IN',
    validFrom: day5.toISOString().slice(0, 10),
    validTo: '9999-12-31',
    eventSequence: 1,
    status_code: 'A',
};

const jobDetails = [
    jobDetail1,
    jobDetail2,
    jobDetail3,
    jobDetail4,
    jobDetail5,
    jobDetail6,
    jobDetail7,
    jobDetail8,
    jobDetail9,
    jobDetail10,
];

module.exports = {
    jobDetails,
    jobDetail1,
    jobDetail2,
    jobDetail3,
    jobDetail4,
    jobDetail5,
    jobDetail6,
    jobDetail7,
    jobDetail8,
    jobDetail9,
    jobDetail10,
};
