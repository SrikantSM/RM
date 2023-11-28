import { ExternalWorkExperience, EmployeeHeader } from 'test-commons';
import { getEmployeeHeadersBatchDynamicData } from './employeeHeaders';

const randomString = require('crypto-random-string');
const uuid = require('uuid').v4;
let externalWorkExperiences: ExternalWorkExperience[] = [];
let lastBatchNum: number | null = null;

export function getExternalWorkExperiencesBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum) {  
    const employeeHeaders: EmployeeHeader[] = getEmployeeHeadersBatchDynamicData(batchNum);
  	externalWorkExperiences = [];
	for (let i = 0; i < employeeHeaders.length; i += 1) {
    	const empHeader = employeeHeaders[i];
   		let projectName = randomString({length: 6}) + '.' + i + '.' + batchNum + '.PrjectName';
   		let companyName = randomString({length: 6}) + '.' + i + '.' + batchNum + '.CompanyName';
   		let rolePlayed = randomString({length: 6}) + '.' + i + '.' + batchNum + '.Role';
   		let customer = randomString({length: 6}) + '.' + i + '.' + batchNum + '.Customer';
   		let comment = randomString({length: 6}) + '.' + i + '.' + batchNum + '.Comment';
    	const externalWorkExperience: ExternalWorkExperience = {
        	ID: uuid(),
    		companyName: companyName,
    		projectName: projectName,
    		customer: customer,
    		rolePlayed: rolePlayed,
    		startDate: '2010-02-20 00:00:00.000',
    		endDate: '2012-10-17 00:00:00.000',
   			employee_ID: empHeader.ID,
    		comments: comment
    	};
    	externalWorkExperiences.push(externalWorkExperience);
  	}
  	lastBatchNum = batchNum;
  }  
  return externalWorkExperiences;
}