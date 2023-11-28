const uuid = require('uuid').v4;
const costCenters = require('./costCenters');

const costCenterAttribute1 = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters.costCenter1.ID,
    ID: uuid(),
    name: 'CCIN',
    description: 'Consulting Unit A',
    responsible: uuid(),
};

const costCenterAttribute2 = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters.costCenter2.ID,
    ID: uuid(),
    name: 'CCDE',
    description: 'Services/Consulting',
    responsible: uuid(),
};

const costCenterAttribute3 = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters.costCenter3.ID,
    ID: uuid(),
    name: 'CCEU',
    description: 'Manufacturing 2',
    responsible: uuid(),
};

const costCenterAttribute4 = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters.costCenter4.ID,
    ID: uuid(),
    name: 'CCUK',
    description: 'Consulting Unit B',
    responsible: uuid(),
};

const costCenterAttribute5 = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters.costCenter5.ID,
    ID: uuid(),
    name: '10011901',
    description: 'R&D',
    responsible: uuid(),
};

const costCenterAttributes = [
    costCenterAttribute1,
    costCenterAttribute2,
    costCenterAttribute3,
    costCenterAttribute4,
    costCenterAttribute5,
];

module.exports = {
    costCenterAttributes,
    costCenterAttribute1,
    costCenterAttribute2,
    costCenterAttribute3,
    costCenterAttribute4,
    costCenterAttribute5,
};
