import { CostCenter } from 'test-commons';
import { COST_CENTER_COUNT } from './config';
const uuid = require('uuid').v4;

let costCenters: CostCenter[] = [];
let lastBatchNum: number | null = null;

export function getCostCenterBatchDynamicData(batchNum: number) {
    if (batchNum !== lastBatchNum) {
        costCenters = [];
        for(let i = 0; i < COST_CENTER_COUNT ; i +=1) {
            const costCenterUnitKey1 =  `D${i}_${batchNum}`;
            const companyCodeUnitKey1 = `C_${batchNum}`;
            const costCenter1: CostCenter = {
                ID: uuid(),
                costCenterID: costCenterUnitKey1,
                displayName: costCenterUnitKey1,
                costCenterDesc: `${costCenterUnitKey1} (${costCenterUnitKey1})`,
                companyCode: companyCodeUnitKey1,
            };
            costCenters.push(costCenter1);
        }
        lastBatchNum = batchNum;
    }
    return costCenters;
}