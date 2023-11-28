const uuid = require('uuid').v4;
const orgUnitKey = require('crypto-random-string');

const costCenterUnitKey1 = orgUnitKey({ length: 5 });
const costCenterUnitKey2 = orgUnitKey({ length: 5 });
const companyCodeUnitKey1 = orgUnitKey({ length: 4 });
const companyCodeUnitKey2 = orgUnitKey({ length: 4 });

const costCenter1 = {
    ID: uuid(),
    costCenterID: costCenterUnitKey1,
    displayName: costCenterUnitKey1,
    costCenterDesc: `${costCenterUnitKey1} (${costCenterUnitKey1})`,
    companyCode: companyCodeUnitKey1,
};

const costCenter2 = {
    ID: uuid(),
    costCenterID: costCenterUnitKey2,
    displayName: costCenterUnitKey2,
    costCenterDesc: `${costCenterUnitKey2} (${costCenterUnitKey2})`,
    companyCode: companyCodeUnitKey2,
};

const costCenters = [
    costCenter1,
    costCenter2,
];

module.exports = { costCenters };
