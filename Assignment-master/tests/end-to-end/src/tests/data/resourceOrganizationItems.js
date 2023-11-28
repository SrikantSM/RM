const { costCenters } = require("./costCenter");
const uuid = require("uuid").v4;

const { resOrgs } = require("./resourceOrganizations");

const resOrgItem1 = {
	ID: uuid(),
    resourceOrganization_ID: resOrgs[0].ID,
    costCenterId: costCenters[0].costCenterID
};

const resOrgItem2 = {
	ID: uuid(),
    resourceOrganization_ID: resOrgs[1].ID,
    costCenterId: costCenters[1].costCenterID
};

const resOrgItem3 = {
	ID: uuid(),
    resourceOrganization_ID: resOrgs[2].ID,
    costCenterId: costCenters[2].costCenterID
};

const resOrgItems = [resOrgItem1, resOrgItem2, resOrgItem3];

module.exports = {resOrgItems};