import { CostCenterAttribute } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { allCostCenters as costCenters } from './CostCenter';

const costCenterAttribute1: CostCenterAttribute = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[0].ID,
    ID: uuid(),
    name: costCenters[0].displayName,
    description: costCenters[0].displayName,
    responsible: uuid(),
};

const costCenterAttribute2: CostCenterAttribute = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[1].ID,
    ID: uuid(),
    name: costCenters[1].displayName,
    description: costCenters[1].displayName,
    responsible: uuid(),
};

const costCenterAttribute3: CostCenterAttribute = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[2].ID,
    ID: uuid(),
    name: costCenters[2].displayName,
    description: costCenters[2].displayName,
    responsible: uuid(),
};

const costCenterAttribute4: CostCenterAttribute = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[3].ID,
    ID: uuid(),
    name: costCenters[3].displayName,
    description: costCenters[3].displayName,
    responsible: uuid(),
};

const costCenterAttribute5: CostCenterAttribute = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[4].ID,
    ID: uuid(),
    name: costCenters[4].displayName,
    description: costCenters[4].displayName,
    responsible: uuid(),
};

const costCenterAttribute6: CostCenterAttribute = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[5].ID,
    ID: uuid(),
    name: costCenters[5].displayName,
    description: costCenters[5].displayName,
    responsible: uuid(),
};

const costCenterAttribute7: CostCenterAttribute = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[6].ID,
    ID: uuid(),
    name: costCenters[6].displayName,
    description: costCenters[6].displayName,
    responsible: uuid(),
};

const costCenterAttribute8: CostCenterAttribute = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[7].ID,
    ID: uuid(),
    name: costCenters[7].displayName,
    description: costCenters[7].displayName,
    responsible: uuid(),
};

const costCenterAttribute9: CostCenterAttribute = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[8].ID,
    ID: uuid(),
    name: costCenters[8].displayName,
    description: costCenters[8].displayName,
    responsible: uuid(),
};

const costCenterAttribute10: CostCenterAttribute = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[9].ID,
    ID: uuid(),
    name: costCenters[9].displayName,
    description: costCenters[9].displayName,
    responsible: uuid(),
};

const costCenterAttribute11: CostCenterAttribute = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[10].ID,
    ID: uuid(),
    name: costCenters[10].displayName,
    description: costCenters[10].displayName,
    responsible: uuid(),
};

const costCenterAttribute12: CostCenterAttribute = {
    validFrom: '2012-01-01',
    validTo: '9999-12-31',
    parent: costCenters[11].ID,
    ID: uuid(),
    name: costCenters[11].displayName,
    description: costCenters[11].displayName,
    responsible: uuid(),
};
const allCostCenterAttributes = [
    costCenterAttribute1,
    costCenterAttribute2,
    costCenterAttribute3,
    costCenterAttribute4,
    costCenterAttribute5,
    costCenterAttribute6,
    costCenterAttribute7,
    costCenterAttribute8,
    costCenterAttribute9,
    costCenterAttribute10,
    costCenterAttribute11,
    costCenterAttribute12,
];

export {
    allCostCenterAttributes,
    costCenterAttribute1,
    costCenterAttribute2,
    costCenterAttribute3,
    costCenterAttribute4,
    costCenterAttribute5,
    costCenterAttribute6,
    costCenterAttribute7,
    costCenterAttribute8,
    costCenterAttribute9,
    costCenterAttribute10,
    costCenterAttribute11,
    costCenterAttribute12,
};
