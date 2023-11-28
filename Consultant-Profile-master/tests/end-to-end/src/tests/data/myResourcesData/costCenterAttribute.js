const uuid = require('uuid').v4;
const { costCenters } = require('./costCenter');

const costCenterAttribute1 = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[0].ID,
    ID: uuid(),
    name: costCenters[0].costCenterID,
    description: costCenters[0].displayName,
    responsible: uuid(),
};

const costCenterAttribute2 = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[1].ID,
    ID: uuid(),
    name: costCenters[1].costCenterID,
    description: costCenters[1].displayName,
    responsible: uuid(),
};

const costCenterAttribute3 = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[2].ID,
    ID: uuid(),
    name: costCenters[2].costCenterID,
    description: costCenters[2].displayName,
    responsible: uuid(),
};

const costCenterAttribute4 = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[3].ID,
    ID: uuid(),
    name: costCenters[3].costCenterID,
    description: costCenters[3].displayName,
    responsible: uuid(),
};

const costCenterAttributes = [
    costCenterAttribute1,
    costCenterAttribute2,
    costCenterAttribute3,
    costCenterAttribute4,
];

module.exports = { costCenterAttributes };
