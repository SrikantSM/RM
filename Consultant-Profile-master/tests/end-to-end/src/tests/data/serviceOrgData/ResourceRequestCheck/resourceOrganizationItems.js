const uuid = require('uuid').v4;
const { rrResourceOrganizations } = require('./resourceOrganization');
const { rrCostCenters } = require('./costCenters');

const resourceOrgItem1 = {
    ID: uuid(),
    resourceOrganization_ID: rrResourceOrganizations[0].ID,
    costCenterId: rrCostCenters[0].displayName,
};

const resourceOrgItem2 = {
    ID: uuid(),
    resourceOrganization_ID: rrResourceOrganizations[0].ID,
    costCenterId: rrCostCenters[1].displayName,
};

const rrResourceOrganizationItems = [
    resourceOrgItem1,
    resourceOrgItem2,
];

module.exports = { rrResourceOrganizationItems };
