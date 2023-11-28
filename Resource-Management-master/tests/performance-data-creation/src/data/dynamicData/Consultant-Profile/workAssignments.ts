import { WorkAssignment, EmployeeHeader } from 'test-commons';
import { getEmployeeHeadersBatchDynamicData } from './employeeHeaders';

const external_id = require('crypto-random-string');
const uuid = require('uuid').v4;
let workAssignments: WorkAssignment[] = [];
let lastBatchNum: number | null = null;

export function getWorkAssignmentsBatchDynamicData(batchNum: number) {
    if (batchNum !== lastBatchNum) {
        const employeeHeaders: EmployeeHeader[] = getEmployeeHeadersBatchDynamicData(batchNum);
            workAssignments = [];
        for (let i = 0; i < employeeHeaders.length; i += 1) {
                const empHeader = employeeHeaders[i];
                let externalId = external_id({length: 6}) + '.' + i + '.' + batchNum;
                const workAssignment: WorkAssignment = {
                    ID: uuid(),
                    workAssignmentID: externalId,
                    externalID: externalId,
                    parent: empHeader.ID,
                    startDate: '2017-12-31 11:00:00.000',
                    endDate: '2099-12-31 11:00:00.000',
                    isContingentWorker: false
                };
                workAssignments.push(workAssignment);
            }
            lastBatchNum = batchNum;
    }
    return workAssignments;
}
