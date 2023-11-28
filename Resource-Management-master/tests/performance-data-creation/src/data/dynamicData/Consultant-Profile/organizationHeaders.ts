import { OrganizationHeader } from 'test-commons';

let organizationHeaders: OrganizationHeader[] = [];
let lastBatchNum: number | null = null;
const org_header = require('crypto-random-string');

export function getOrganizationHeadersBatchDynamicData(batchNum: number) {
    if (batchNum !== lastBatchNum) {
        let orgHeader = org_header({length: 4});
        let orgHeaderDesc = 'The description of OrgHeader for batchNum: ' + batchNum + ' is '+ orgHeader;
        organizationHeaders = [];
        const organizationHeader: OrganizationHeader = {
            code: orgHeader,
            description: orgHeaderDesc,
            isDelivery: 'X'
        };
        organizationHeaders.push(organizationHeader);
        lastBatchNum = batchNum;
    }
    return organizationHeaders;
}