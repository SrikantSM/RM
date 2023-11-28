const uuid = require('uuid').v4;

const orgHeader1Name = 'Service Organization for RR check';
const orgHeader1Desc = 'Service Organization for RR check(RRC1)';
const serviceOrganizationCodeCode1 = 'RRC1';
const displayId1 = 'RR11';

const resourceOrganization1 = {
    ID: uuid(),
    displayId: displayId1,
    name: orgHeader1Name,
    description: orgHeader1Desc,
    serviceOrganization_code: serviceOrganizationCodeCode1,
    lifeCycleStatus_code: 3,
};

const rrResourceOrganizations = [
    resourceOrganization1,
];

module.exports = { rrResourceOrganizations };
