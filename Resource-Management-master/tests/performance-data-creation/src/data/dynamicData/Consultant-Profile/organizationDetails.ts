import { OrganizationDetail } from 'test-commons';
import { getOrganizationHeadersBatchDynamicData } from './organizationHeaders';
import { getCostCenterBatchDynamicData } from './costCenters';

let organizationDetails: OrganizationDetail[] = [];
let lastBatchNum: number | null = null;

export function getOrganizationDetailsBatchDynamicData(batchNum: number) {
    if (batchNum !== lastBatchNum) {
        const organizationHeaders = getOrganizationHeadersBatchDynamicData(batchNum);
        const costCenters = getCostCenterBatchDynamicData(batchNum);
        const organizationHeaderCode = organizationHeaders[0].code;
        organizationDetails = [];
        for(let i = 0 ; i < costCenters.length; i += 1) {
            const costCenter1 = costCenters[i];
            const organizationDetail1: OrganizationDetail = {
                code: organizationHeaderCode,
                unitKey: costCenter1.costCenterID,
                unitType: 'CS',
                compositeUnitKey: `${organizationHeaderCode}_${costCenter1.costCenterID}`
            };
            organizationDetails.push(organizationDetail1);
        }
        const organizationDetail2: OrganizationDetail = {
            code: organizationHeaderCode,
            unitKey: costCenters[0].companyCode!,
            unitType: 'CC',
            compositeUnitKey: `${organizationHeaderCode}_${costCenters[0].companyCode}`
        };
        organizationDetails.push(organizationDetail2);
        lastBatchNum = batchNum;
    }
    return organizationDetails;
}