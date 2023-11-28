const uuid = require("uuid").v4;

const { organizationHeaders } = require("./organizationHeaders");

const organizationHeader1 = organizationHeaders[0];
const organizationHeader2 = organizationHeaders[1];
const organizationHeader3 = organizationHeaders[2];

const resOrg1 = {
	ID: uuid(),
    displayId: 'E2ER1',
    name: 'Res org 1 name For Asgn E2E test',
    description: 'Res org 1 description For Asgn E2E test',
    serviceOrganization_code: organizationHeader1.code,
    lifeCycleStatus_code: '3'
};

const resOrg2 = {
	ID: uuid(),
    displayId: 'E2ER2',
    name: 'Res org 2 name For Asgn E2E test',
    description: 'Res org 2 description For Asgn E2E test',
    serviceOrganization_code: organizationHeader2.code,
    lifeCycleStatus_code: '3'
};

const resOrg3 = {
	ID: uuid(),
    displayId: 'E2ER3',
    name: 'Res org 3 name For Asgn E2E test',
    description: 'Res org 3 description For Asgn E2E test',
    serviceOrganization_code: organizationHeader3.code,
    lifeCycleStatus_code: '3'
};

const resOrgs = [resOrg1, resOrg2, resOrg3];

module.exports = {resOrgs,
                  resOrg1,
                  resOrg2,
                  resOrg3};