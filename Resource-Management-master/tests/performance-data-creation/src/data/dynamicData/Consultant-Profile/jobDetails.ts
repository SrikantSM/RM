import { JobDetail, WorkAssignment, CostCenter } from 'test-commons';
import { getWorkAssignmentsBatchDynamicData } from './workAssignments';
import { getCostCenterBatchDynamicData } from './costCenters';

const randomString = require('crypto-random-string');
const uuid = require('uuid').v4;
let jobDetails: JobDetail[] = [];
let lastBatchNum: number | null = null;

export function getJobDetailsBatchDynamicData(batchNum: number) {
    if (batchNum !== lastBatchNum) {
        const workAssignments: WorkAssignment[] = getWorkAssignmentsBatchDynamicData(batchNum);
        const costCenters: CostCenter[] = getCostCenterBatchDynamicData(batchNum);
        jobDetails = [];
        for (let i = 0; i < workAssignments.length; i += 1) {
            const workAsgn = workAssignments[i];
            let jobTitle = randomString({length: 6}) + '.' + i + '.' + batchNum + '.JobTitle';
            let legalEntityExternalID = randomString({length: 4});
            const num = (i%4);
            const costCenter = costCenters[num];
            const workAssignment = workAssignments[(i+1)%(workAssignments.length)];
            let country_code = 'DE';
            if(num > 1) {
                country_code = 'IN';
            }
            const jobDetail: JobDetail = {
                ID: uuid(),
                costCenterexternalID: costCenter.ID,
                supervisorWorkAssignmentExternalID: workAssignment.externalID,
                jobTitle: jobTitle,
                parent: workAsgn.ID,
                legalEntityExternalID: legalEntityExternalID,
                country_code: country_code,
                validFrom: '2017-01-01',
                validTo: '9999-12-31',
                eventSequence: 1,
                status_code: 'A'
            };
            jobDetails.push(jobDetail);
        }
        lastBatchNum = batchNum;
    }
    return jobDetails;
}