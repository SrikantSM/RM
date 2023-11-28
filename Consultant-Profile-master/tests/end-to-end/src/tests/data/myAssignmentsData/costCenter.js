const uuid = require('uuid').v4;
const orgUnitKey = require('crypto-random-string');

const costCenterUnitKey1 = orgUnitKey({ length: 5 });
const costCenterUnitKey2 = orgUnitKey({ length: 5 });
const companyCodeUnitKey1 = orgUnitKey({ length: 4 });
const companyCodeUnitKey2 = orgUnitKey({ length: 4 });

const costCenter1 = {
    ID: uuid(),
    costCenterID: 'CCINE2MA',
    displayName: costCenterUnitKey1,
    costCenterDesc: `CCINE2MA (${costCenterUnitKey1})`,
    companyCode: companyCodeUnitKey1,
};

const costCenter2 = {
    ID: uuid(),
    costCenterID: 'CCDEE2MA',
    displayName: costCenterUnitKey1,
    costCenterDesc: `CCDEE2MA (${costCenterUnitKey2})`,
    companyCode: companyCodeUnitKey2,
};

const costCenters = [
    costCenter1,
    costCenter2,
];

module.exports = { costCenters };
