import { Email, EmployeeHeader } from 'test-commons';
import { getEmployeeHeadersBatchDynamicData } from './employeeHeaders';

const uuid = require('uuid').v4;
const random_string = require('crypto-random-string');
let emails: Email[] = [];
let lastBatchNum: number | null = null;

export function getEmailsBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum) {
    const employeeHeaders: EmployeeHeader[] = getEmployeeHeadersBatchDynamicData(batchNum);
  	emails = [];
  	for (let i = 0; i < employeeHeaders.length; i += 1) {
    	const empHeader = employeeHeaders[i];
    	let emailAddress;
    	if(i == 0) {
    		if(batchNum ==1 ){
    			emailAddress = 'sapc4pauthconsultant' + batchNum + '@global.corp.sap';
    		}
    		else {
    			emailAddress = 'sapc4pauthorizationpipelineconsultant' + batchNum + '@global.corp.sap';
    		}
       	}
    	else {
			emailAddress = 'sapc4pauthconsultant' + i + batchNum + '@global.corp.sap';    
    	}
   		const email: Email = {
      		parent: empHeader.ID,
      		ID: uuid(),
      		address: emailAddress,
      		isDefault: true
    	};
    	emails.push(email);
  	}
    lastBatchNum = batchNum;
  }    
  return emails;
}