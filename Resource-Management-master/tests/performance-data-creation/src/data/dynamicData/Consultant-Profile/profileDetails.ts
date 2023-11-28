import { ProfileDetail, EmployeeHeader } from 'test-commons';
import { getEmployeeHeadersBatchDynamicData } from './employeeHeaders';

const random_string = require('crypto-random-string');
const uuid = require('uuid').v4;
let profileDetails: ProfileDetail[] = [];
let lastBatchNum: number | null = null;

export function getProfileDetailsBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum) { 
      const employeeHeaders: EmployeeHeader[] = getEmployeeHeadersBatchDynamicData(batchNum);
  	  profileDetails = [];
	  for (let i = 0; i < employeeHeaders.length; i += 1) {
    		const empHeader = employeeHeaders[i];
   			let randomString = random_string({length: 6}) + '-' + i + '-' + batchNum;
   			let firstName = 'firstName' + randomString;
   			let lastName = 'lastName' + randomString;
    		const profileDetail: ProfileDetail = {
      			parent: empHeader.ID,
      			ID: uuid(),
      			firstName: firstName,
      			lastName: lastName,
				fullName: firstName + ' ' + lastName,
				initials: 'FL',
      			validFrom: '2001-12-31',
      			validTo: '2099-12-31'
    		};
   		 	profileDetails.push(profileDetail);
  	  }
  	  lastBatchNum = batchNum;
  }  
  return profileDetails;
}
