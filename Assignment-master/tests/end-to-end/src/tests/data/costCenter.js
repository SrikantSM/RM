const { allUnitKeys } = require("./organizationDetails");
const uuid = require("uuid").v4;

const costCenter1 = {
	ID: uuid(),
	costCenterID: allUnitKeys[0].unitKey,
	displayName: "Excelsior 1",
	companyCode: allUnitKeys[3].unitKey,
	controllingArea: allUnitKeys[6].unitKey
};

const costCenter2 = {
	ID: uuid(),
	costCenterID: allUnitKeys[1].unitKey,
	displayName: "Excelsior 2",
	companyCode: allUnitKeys[4].unitKey,
	controllingArea: allUnitKeys[7].unitKey
};

const costCenter3 = {
	ID: uuid(),
	costCenterID: allUnitKeys[2].unitKey,
	displayName: "Excelsior 3",
	companyCode: allUnitKeys[5].unitKey,
	controllingArea: allUnitKeys[8].unitKey
};

const costCenters = [costCenter1, costCenter2, costCenter3];

module.exports = {costCenters};