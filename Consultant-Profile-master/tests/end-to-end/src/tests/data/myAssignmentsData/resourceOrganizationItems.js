const uuid = require('uuid').v4;
const { resourceOrganizations } = require('./resourceOrganizations');
const { costCenters } = require('./costCenter');

const resourceOrganization1 = resourceOrganizations[0];
const resourceOrganization2 = resourceOrganizations[1];

const resourceOrgItem1 = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganization1.ID,
    costCenterId: costCenters[0].displayName,
};

const resourceOrgItem2 = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganization2.ID,
    costCenterId: costCenters[1].displayName,
};

const resourceOrganizationItems = [
    resourceOrgItem1,
    resourceOrgItem2,
];

module.exports = { resourceOrganizationItems };
