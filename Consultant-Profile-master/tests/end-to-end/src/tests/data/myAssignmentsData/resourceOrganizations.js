const uuid = require('uuid').v4;
const resourceOrg = require('crypto-random-string');
const environment = require('../../../utils').getEnvironment();

const { seleniumTestName } = environment;

const resourceOrg1 = resourceOrg({ length: 4 });
const resourceOrg2 = resourceOrg({ length: 4 });
const resourceOrg1Desc = `The description of resourceOrg1 is ${resourceOrg1} ${seleniumTestName}`;
const resourceOrg2Desc = `The description of resourceOrg2 is ${resourceOrg2} ${seleniumTestName}`;

const resourceOrganization1 = {
    ID: uuid(),
    displayId: resourceOrg1,
    description: resourceOrg1Desc,
    name: resourceOrg1Desc,
};
const resourceOrganization2 = {
    ID: uuid(),
    displayId: resourceOrg2,
    description: resourceOrg2Desc,
    name: resourceOrg2Desc,
};
const resourceOrganizations = [
    resourceOrganization1,
    resourceOrganization2,
];

module.exports = { resourceOrganizations };
