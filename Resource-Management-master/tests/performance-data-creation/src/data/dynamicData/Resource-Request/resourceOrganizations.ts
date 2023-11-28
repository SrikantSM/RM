import { ResourceOrganizations } from 'test-commons';
import { v4 as uuid } from 'uuid';
import resOrg_Id from 'crypto-random-string';
import { getOrganizationHeadersBatchDynamicData } from '../Consultant-Profile/organizationHeaders';

let resourceOrganizations: ResourceOrganizations[] = [];
let lastBatchNum: number | null = null;

export function getResourceOrganizationsBatchDynamicData(batchNum: number) {
    if (batchNum !== lastBatchNum) {
        const organizationHeaders = getOrganizationHeadersBatchDynamicData(batchNum);
        const organizationHeaderCode = organizationHeaders[0].code;
        let lifeCycleStatus = 3;
        let resOrgId = resOrg_Id({length: 4});
        let resOrgName = 'Name ' + batchNum + ' is '+ resOrgId;
        let resOrgDesc = 'The description of ResourceOrg for batchNum: ' + batchNum + ' is '+ resOrgId;
        resourceOrganizations = [];
        const resourceOrganization: ResourceOrganizations = {
            ID: uuid(),
            displayId: resOrgId,
            name: resOrgName,
            description: resOrgDesc,
            serviceOrganization_code: organizationHeaderCode, 
            lifeCycleStatus_code: lifeCycleStatus
        };
        resourceOrganizations.push(resourceOrganization);
        lastBatchNum = batchNum;
    }
    return resourceOrganizations;    
}