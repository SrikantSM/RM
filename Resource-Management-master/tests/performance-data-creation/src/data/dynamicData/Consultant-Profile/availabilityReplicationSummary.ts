import { JobDetail, WorkAssignment, CostCenter, AvailabilityReplicationSummary, WorkforcePerson } from 'test-commons';
import { getWorkAssignmentsBatchDynamicData } from './workAssignments';
import { getJobDetailsBatchDynamicData } from './jobDetails';
import { getWorkforcePersonsBatchDynamicData } from './workforcePersons';

const uuid = require('uuid').v4;
let availabilityReplicationSummaries: AvailabilityReplicationSummary[] = [];
let lastBatchNum: number | null = null;

export function getAvailabilityReplicationSummaryBatchDynamicData(batchNum: number) {
    if (batchNum !== lastBatchNum) {
        const workAssignments: WorkAssignment[] = getWorkAssignmentsBatchDynamicData(batchNum);
        const jobDetails: JobDetail[] = getJobDetailsBatchDynamicData(batchNum);
        const workforcePersons: WorkforcePerson[] = getWorkforcePersonsBatchDynamicData(batchNum);
        for (let i = 0; i < workAssignments.length; i += 1) {
            const workAssignment = workAssignments[i];
            const jobDetail = jobDetails[i];
            const workforcePerson = workforcePersons[i];
            const availabilityReplicationSummary: AvailabilityReplicationSummary = {
                resourceId: workAssignment.ID,
                workForcePersonExternalId:  workforcePerson.externalID,
                costCenterId: jobDetail.costCenterexternalID,
                workAssignmentStartDate: (workAssignment.startDate).substring(0,10),
                workAssignmentEndDate: (workAssignment.endDate).substring(0,10),
                workAssignmentExternalId:  workAssignment.externalID,
                noOfRecordsProcessed: 0,
                noOfRecordsFailed: 0,
                noOfRecordsPassed: 0,
                availabilitySummaryStatus_code: 0
            };
            availabilityReplicationSummaries.push(availabilityReplicationSummary);
        }
        lastBatchNum = batchNum;
    }
    return availabilityReplicationSummaries;
}
