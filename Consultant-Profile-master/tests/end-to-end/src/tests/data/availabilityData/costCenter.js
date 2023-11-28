const uuid = require('uuid').v4;
const companyCode = require('crypto-random-string');
const { testRunId } = require('./testRunID.js');

const costCenterId1 = `CCDE-${testRunId}`;
const costCenterId2 = `CCIN-${testRunId}`;
const companyCode1 = companyCode({ length: 4 });
const companyCode2 = companyCode({ length: 4 });

const costCenter1 = {
    ID: uuid(),
    costCenterID: costCenterId1,
    displayName: costCenterId1,
    costCenterDesc: `${costCenterId1} (${costCenterId1})`,
    companyCode: companyCode1,
};

const costCenter2 = {
    ID: uuid(),
    costCenterID: costCenterId2,
    displayName: costCenterId2,
    costCenterDesc: `${costCenterId2} (${costCenterId2})`,
    companyCode: companyCode2,
};

const costCenters = [
    costCenter1,
    costCenter2,
];

module.exports = { costCenters };
