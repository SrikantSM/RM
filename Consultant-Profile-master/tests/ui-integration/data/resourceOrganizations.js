const uuid = require('uuid').v4;

const resourceOrganization1 = {
    ID: uuid(),
    displayId: 'Org_1',
    description: 'Organization ORG_1 Germany',
    name: 'Organization ORG_1 Germany',
};

const resourceOrganization2 = {
    ID: uuid(),
    displayId: 'Org_2',
    description: 'Organization ORG_2 Germany',
    name: 'Organization ORG_2 Germany',
};

const resourceOrganization4 = {
    ID: uuid(),
    displayId: 'Org_4',
    description: 'Organization ORG_4 India',
    name: 'Organization ORG_4 India',
};

const resourceOrganizations = [
    resourceOrganization1,
    resourceOrganization2,
    resourceOrganization4,
];

module.exports = {
    resourceOrganizations,
    resourceOrganization1,
    resourceOrganization2,
    resourceOrganization4,
};
