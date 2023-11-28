const uuid = require('uuid').v4;
const resourceOrganizations = require('./resourceOrganizations');

const resourceOrganizationItem1 = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganizations.resourceOrganization1.ID,
    costCenterId: 'CCDE',
};

const resourceOrganizationItem2 = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganizations.resourceOrganization2.ID,
    costCenterId: 'CCIN',
};

const resourceOrganizationItem4 = {
    ID: uuid(),
    resourceOrganization_ID: resourceOrganizations.resourceOrganization4.ID,
    costCenterId: 'CCUK',
};

const resourceOrganizationItems = [
    resourceOrganizationItem1,
    resourceOrganizationItem2,
    resourceOrganizationItem4,
];

module.exports = {
    resourceOrganizationItems,
    resourceOrganizationItem1,
    resourceOrganizationItem2,
    resourceOrganizationItem4,
};
