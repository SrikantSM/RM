const uuid = require('uuid').v4;
const orgUnitKey = require('crypto-random-string');

const costCenterUnitKey1 = orgUnitKey({ length: 5 });
const costCenterUnitKey2 = orgUnitKey({ length: 5 });
const costCenterUnitKey3 = orgUnitKey({ length: 5 });
const costCenterUnitKey4 = orgUnitKey({ length: 5 });
const companyCodeUnitKey1 = orgUnitKey({ length: 4 });
const companyCodeUnitKey2 = orgUnitKey({ length: 4 });
const companyCodeUnitKey3 = orgUnitKey({ length: 4 });
const companyCodeUnitKey4 = orgUnitKey({ length: 4 });

const costCenter1 = {
    ID: uuid(),
    costCenterID: 'CCINE2ER',
    displayName: costCenterUnitKey1,
    costCenterDesc: `CCINE2ER (${costCenterUnitKey1})`,
    companyCode: companyCodeUnitKey1,
};

const costCenter2 = {
    ID: uuid(),
    costCenterID: 'CCDEE2ER',
    displayName: costCenterUnitKey2,
    costCenterDesc: `CCDEE2ER (${costCenterUnitKey2})`,
    companyCode: companyCodeUnitKey2,
};

const costCenter3 = {
    ID: uuid(),
    costCenterID: 'CCERE2ER',
    displayName: costCenterUnitKey3,
    costCenterDesc: `CCERE2ER (${costCenterUnitKey3})`,
    companyCode: companyCodeUnitKey3,
};

const costCenter4 = {
    ID: uuid(),
    costCenterID: 'CCCTE2ER',
    displayName: costCenterUnitKey4,
    costCenterDesc: `CCCTE2ER (${costCenterUnitKey4})`,
    companyCode: companyCodeUnitKey4,
};

const costCenters = [
    costCenter1,
    costCenter2,
    costCenter3,
    costCenter4,
];

module.exports = { costCenters };
