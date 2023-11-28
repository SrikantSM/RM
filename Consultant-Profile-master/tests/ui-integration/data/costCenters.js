const uuid = require('uuid').v4;

const costCenter1 = {
    ID: uuid(),
    costCenterID: 'CCIN',
    displayName: 'CCIN',
    costCenterDesc: 'CCIN (CCIN)',
    companyCode: 'CC02',
    controllingArea: 'CA01',
};
const costCenter2 = {
    ID: uuid(),
    costCenterID: 'CCDE',
    displayName: 'CCDE',
    costCenterDesc: 'CCDE (CCDE)',
    companyCode: 'CC01',
    controllingArea: 'CA01',
};
const costCenter3 = {
    ID: uuid(),
    costCenterID: 'CCEU',
    displayName: 'CCEU',
    costCenterDesc: 'CCEU (CCEU)',
    companyCode: 'CC03',
    controllingArea: 'CA01',
};
const costCenter4 = {
    ID: uuid(),
    costCenterID: 'CCUK',
    displayName: 'CCUK',
    costCenterDesc: 'CCUK (CCUK)',
    companyCode: 'CC04',
    controllingArea: 'CA01',
};

const costCenter5 = {
    ID: uuid(),
    costCenterID: '10011901',
    displayName: '1001',
    costCenterDesc: '1001 (10011901)',
    companyCode: '1001',
    controllingArea: 'A000',
};

const costCenter6 = {
    ID: uuid(),
    costCenterID: '10011902',
    displayName: '1001',
    costCenterDesc: '1001 (10011902)',
    companyCode: '1001',
    controllingArea: 'A000',
};

const costCenter7 = {
    ID: uuid(),
    costCenterID: '10021901',
    displayName: '1002',
    costCenterDesc: '1002 (10021901)',
    companyCode: '1002',
    controllingArea: 'A000',
};

const costCenters = [
    costCenter1,
    costCenter2,
    costCenter3,
    costCenter4,
    costCenter5,
    costCenter6,
    costCenter7,
];

module.exports = {
    costCenters,
    costCenter1,
    costCenter2,
    costCenter3,
    costCenter4,
    costCenter5,
    costCenter6,
    costCenter7,
};
