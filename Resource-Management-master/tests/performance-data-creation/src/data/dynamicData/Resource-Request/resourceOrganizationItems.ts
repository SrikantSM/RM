import { ResourceOrganizationItems } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { getCostCenterBatchDynamicData } from '../Consultant-Profile/costCenters';
import { getResourceOrganizationsBatchDynamicData } from './resourceOrganizations';

let resourceOrganizationItems: ResourceOrganizationItems[] = [];
let lastBatchNum: number | null = null;

export function getResourceOrganizationItemsBatchDynamicData(batchNum: number) {
    if (batchNum !== lastBatchNum) {
        const resourceOrganizations = getResourceOrganizationsBatchDynamicData(batchNum);
        const costCenters = getCostCenterBatchDynamicData(batchNum);
        const resourceOrganizationGuid = resourceOrganizations[0].ID;
        resourceOrganizationItems = [];
        for(let i = 0 ; i < costCenters.length; i += 1) {
            const costCenter = costCenters[i];
            const resourceOrganizationItem: ResourceOrganizationItems = {
                ID: uuid(),
                resourceOrganization_ID: resourceOrganizationGuid,
                costCenterId: costCenter.costCenterID
            };
            resourceOrganizationItems.push(resourceOrganizationItem);
        }
       
        lastBatchNum = batchNum;
    }
    return resourceOrganizationItems;
}