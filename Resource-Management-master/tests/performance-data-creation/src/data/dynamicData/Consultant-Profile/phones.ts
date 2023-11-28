import { Phone, EmployeeHeader } from 'test-commons';
import { getEmployeeHeadersBatchDynamicData } from './employeeHeaders';

const uuid = require('uuid').v4;
let phones: Phone[] = [];
let lastBatchNum: number | null = null;

export function getPhonesBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum) {
      const employeeHeaders: EmployeeHeader[] = getEmployeeHeadersBatchDynamicData(batchNum);
	  phones = [];
	  for (let i = 0; i < employeeHeaders.length; i += 1) {
		    const empHeader = employeeHeaders[i];
		   	let randomNumber = Math.floor(10000000 + Math.random() * 90000000);
		   	let extnNum = i + batchNum;
		   	let areaNum = extnNum + 10;
		    const phone: Phone = {
			    parent: empHeader.ID,
		        ID: uuid(),
		        number: extnNum+ '-' + areaNum + '-' + randomNumber,
    		    isDefault: true
    		};
      phones.push(phone);
  	 }
  	 lastBatchNum = batchNum;
  }
  return phones;
}
