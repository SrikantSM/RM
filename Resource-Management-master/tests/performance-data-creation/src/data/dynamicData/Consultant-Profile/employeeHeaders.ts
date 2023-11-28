import { EmployeeHeader } from 'test-commons';
import { EMPLOYEE_HEADER_NUMBER_OF_EMPLOYEE_PER_RM } from './config';

const uuid = require('uuid').v4;
let employeeHeaders: EmployeeHeader[] = [];
let lastBatchNum: number | null = null;

export function getEmployeeHeadersBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum) {  
	employeeHeaders = [];
  	for (let i = 0; i < EMPLOYEE_HEADER_NUMBER_OF_EMPLOYEE_PER_RM; i += 1) {
    	const employeeHeader: EmployeeHeader = {
      		ID: uuid()
    	};
    	employeeHeaders.push(employeeHeader);
  	}
  	lastBatchNum = batchNum;
  }
  return employeeHeaders;
}