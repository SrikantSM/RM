import { WorkforcePerson, EmployeeHeader } from 'test-commons';
import { getEmployeeHeadersBatchDynamicData } from './employeeHeaders';

const external_id = require('crypto-random-string');
const uuid = require('uuid').v4;
let workforcePersons: WorkforcePerson[] = [];
let lastBatchNum: number | null = null;

export function getWorkforcePersonsBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum) {  
      const employeeHeaders: EmployeeHeader[] = getEmployeeHeadersBatchDynamicData(batchNum);
	  workforcePersons = [];
	  for (let i = 0; i < employeeHeaders.length; i += 1) {
		    const empHeader = employeeHeaders[i];
		   	let externalId = external_id({length: 6}) + '_' + i + '_' + batchNum;
		    const workforcePerson: WorkforcePerson = {
			    externalID: externalId,
				ID: empHeader.ID,
				isBusinessPurposeCompleted: false
  		    };
      		workforcePersons.push(workforcePerson);
  	  }
  	  lastBatchNum = batchNum;
  }  
  return workforcePersons;
}