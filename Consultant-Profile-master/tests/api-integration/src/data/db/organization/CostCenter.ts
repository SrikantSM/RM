import { CostCenter } from 'test-commons';
import { v4 as uuid } from 'uuid';

const controllingAreaCode: string = 'A000';

const costCenter1: CostCenter = {
    ID: uuid(),
    costCenterID: 'CCDE0001',
    displayName: 'CCDE0001',
    costCenterDesc: 'CCDE0001 (CCDE0001)',
    companyCode: 'C001',
    controllingArea: controllingAreaCode,
};

const costCenter2: CostCenter = {
    ID: uuid(),
    costCenterID: 'CCIN0001',
    displayName: 'CCIN0001',
    costCenterDesc: 'CCIN0001 (CCIN0001)',
    companyCode: 'C002',
    controllingArea: controllingAreaCode,
};

const costCenter3: CostCenter = {
    ID: uuid(),
    costCenterID: '1010XYZ1',
    displayName: '1010XYZ1',
    costCenterDesc: '1010XYZ1 (1010XYZ1)',
    companyCode: '1010',
    controllingArea: controllingAreaCode,
};

const costCenter4: CostCenter = {
    ID: uuid(),
    costCenterID: '1010XYZ2',
    displayName: '1010XYZ2',
    costCenterDesc: '1010XYZ2 (1010XYZ2)',
    companyCode: '1010',
    controllingArea: controllingAreaCode,
};

const costCenter5: CostCenter = {
    ID: uuid(),
    costCenterID: '1710XYZ1',
    displayName: '1710XYZ1',
    costCenterDesc: '1710XYZ1 (1710XYZ1)',
    companyCode: '1710',
    controllingArea: controllingAreaCode,
};

const costCenter6: CostCenter = {
    ID: uuid(),
    costCenterID: '1710XYZ2',
    displayName: '1710XYZ2',
    costCenterDesc: '1710XYZ2 (1710XYZ2)',
    companyCode: '1710',
    controllingArea: controllingAreaCode,
};

const costCenter7: CostCenter = {
    ID: uuid(),
    costCenterID: 'C003XYZ01',
    displayName: 'C003XYZ01',
    costCenterDesc: 'C003XYZ01 (C003XYZ01)',
    companyCode: 'C003',
    controllingArea: controllingAreaCode,
};

const costCenter8: CostCenter = {
    ID: uuid(),
    costCenterID: 'C003XYZ02',
    displayName: 'C003XYZ02',
    costCenterDesc: 'C003XYZ02 (C003XYZ02)',
    companyCode: 'C003',
    controllingArea: controllingAreaCode,
};

const costCenter9: CostCenter = {
    ID: uuid(),
    costCenterID: 'C003XYZ03',
    displayName: 'C003XYZ03',
    costCenterDesc: 'C003XYZ03 (C003XYZ03)',
    companyCode: 'C003',
    controllingArea: controllingAreaCode,
};

const costCenter10: CostCenter = {
    ID: uuid(),
    costCenterID: 'C003XYZ04',
    displayName: 'C003XYZ04',
    costCenterDesc: 'C003XYZ04 (C003XYZ04)',
    companyCode: 'C003',
    controllingArea: controllingAreaCode,
};

const costCenter11: CostCenter = {
    ID: uuid(),
    costCenterID: 'C003XYZ05',
    displayName: 'C003XYZ05',
    costCenterDesc: 'C003XYZ05 (C003XYZ05)',
    companyCode: 'C003',
    controllingArea: controllingAreaCode,
};

const costCenter12: CostCenter = {
    ID: uuid(),
    costCenterID: 'C003XYZ06',
    displayName: 'C003XYZ06',
    costCenterDesc: 'C003XYZ06 (C003XYZ06)',
    companyCode: 'C003',
    controllingArea: controllingAreaCode,
};

const allCostCenters = [
    costCenter1,
    costCenter2,
    costCenter3,
    costCenter4,
    costCenter5,
    costCenter6,
    costCenter7,
    costCenter8,
    costCenter9,
    costCenter10,
    costCenter11,
    costCenter12,
];

export {
    allCostCenters,
    costCenter1,
    costCenter2,
    costCenter3,
    costCenter4,
    costCenter5,
    costCenter6,
    costCenter7,
    costCenter8,
    costCenter9,
    costCenter10,
    costCenter11,
    costCenter12,
};
