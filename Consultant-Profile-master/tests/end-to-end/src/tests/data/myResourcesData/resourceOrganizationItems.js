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

const resourceOrgItem3 = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganization1.ID,
    costCenterId: 'CCINE2ER',
};

const resourceOrgItem4 = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganization2.ID,
    costCenterId: 'CCDEE2ER',
};

const resourceOrganizationItems = [
    resourceOrgItem1,
    resourceOrgItem2,
    resourceOrgItem3,
    resourceOrgItem4,
];

module.exports = { resourceOrganizationItems };
