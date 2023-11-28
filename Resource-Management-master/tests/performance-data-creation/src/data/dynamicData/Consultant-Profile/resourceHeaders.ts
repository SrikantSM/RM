import { ResourceHeader, WorkAssignment } from 'test-commons';
import { getWorkAssignmentsBatchDynamicData } from './workAssignments';

const uuid = require('uuid').v4;
let lastBatchNum: number | null = null;
let resourceHeaders: ResourceHeader[] = [];

export function getResourceHeadersBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum) {  
	const workAssignments: WorkAssignment[] = getWorkAssignmentsBatchDynamicData(batchNum);
    resourceHeaders = [];
    for (let i = 0; i < workAssignments.length; i += 1) {
      const workAssignment = workAssignments[i];
      const resourceHeader: ResourceHeader = {
        ID: workAssignment.ID,
        type_code: '1'
      };
      resourceHeaders.push(resourceHeader);
    }
  	lastBatchNum = batchNum;
  }
	
  return resourceHeaders; 
}
