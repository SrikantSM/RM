const { organizationDetail1, organizationDetail2, organizationDetail3, organizationDetail4 } = require ('./organizationDetails');
const uuid = require('uuid').v4;

const costCenter1 = {
    ID: uuid(),
    costCenterID: organizationDetail1.unitKey,
    displayName: organizationDetail1.unitKey,
    costCenterDesc: `${organizationDetail1.unitKey} (${organizationDetail1.unitKey})`,
    companyCode: organizationDetail3.unitKey
};

const costCenter2 = {
    ID: uuid(),
    costCenterID: organizationDetail2.unitKey,
    displayName: organizationDetail2.unitKey,
    costCenterDesc: `${organizationDetail2.unitKey} (${organizationDetail2.unitKey})`,
    companyCode: organizationDetail4.unitKey
};

const costCenters = [
    costCenter1,
    costCenter2
];

module.exports = { costCenters, costCenter1, costCenter2 };