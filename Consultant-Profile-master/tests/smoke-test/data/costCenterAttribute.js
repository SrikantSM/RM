const costCenters = require('./costCenters');

const costCenterAttribute1 = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters.costCenter1.ID,
    ID: '97581934-66fe-11ed-9022-0242ac190001',
    name: costCenters.costCenter1.costCenterID,
    description: costCenters.costCenter1.displayName,
    responsible: '97581934-66fe-11ed-9022-0242ac190002',
};

const costCenterAttributes = [
    costCenterAttribute1,
];

module.exports = { costCenterAttributes, costCenterAttribute1};
