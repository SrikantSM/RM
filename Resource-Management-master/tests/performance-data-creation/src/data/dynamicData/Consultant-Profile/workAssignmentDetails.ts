import { WorkAssignmentDetail, WorkAssignment } from 'test-commons';
import { getWorkAssignmentsBatchDynamicData } from './workAssignments';

const uuid = require('uuid').v4;
let workAssignmentDetails: WorkAssignmentDetail[] = [];
let lastBatchNum: number | null = null;

export function getWorkAssignmentDetailsBatchDynamicData(batchNum: number) {
    if (batchNum !== lastBatchNum) {
        const workAssignments: WorkAssignment[] = getWorkAssignmentsBatchDynamicData(batchNum);
        workAssignmentDetails = [];
        for (let i = 0; i < workAssignments.length; i += 1) {
                const workAssignment = workAssignments[i];
                const workAssignmentDetail: WorkAssignmentDetail = {
                    ID: uuid(),
                    parent: workAssignment.ID,
                    validFrom: workAssignment.startDate,
                    validTo: workAssignment.endDate,
                    isPrimary: true
                };
                workAssignmentDetails.push(workAssignmentDetail);
            }
            lastBatchNum = batchNum;
    }
    return workAssignmentDetails;
}
