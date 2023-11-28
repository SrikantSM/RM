const uuid = require('uuid').v4;

const costCenterID1 = 'RRCC01';
const costCenterID2 = 'RRCC02';

const controllingArea1 = 'BXXX';
const companyCode1 = 'XBBB';

const controllingAreaID = {
    controllingArea: controllingArea1,
};

const rrControllingArea = [
    controllingAreaID,
];

const costCenter1 = {
    ID: uuid(),
    costCenterID: costCenterID1,
    displayName: costCenterID1,
    costCenterDesc: `${costCenterID1} (${costCenterID1})`,
    companyCode: companyCode1,
    controllingArea: controllingArea1,
};

const costCenter2 = {
    ID: uuid(),
    costCenterID: costCenterID2,
    displayName: costCenterID2,
    costCenterDesc: `${costCenterID2} (${costCenterID2})`,
    companyCode: companyCode1,
    controllingArea: controllingArea1,
};

const rrCostCenters = [
    costCenter1,
    costCenter2,
];

module.exports = { rrCostCenters, rrControllingArea };
