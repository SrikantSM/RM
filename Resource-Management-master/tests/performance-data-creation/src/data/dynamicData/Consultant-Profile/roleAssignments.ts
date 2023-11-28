import { RoleAssignment, EmployeeHeader } from 'test-commons';
import * as staticData from './../../staticData';
import { getEmployeeHeadersBatchDynamicData } from './employeeHeaders';
import { ROLE_ASSIGNMENT_CATEGORY_1_BATCH_LAST_INDEX, ROLE_ASSIGNMENT_CATEGORY_2_BATCH_LAST_INDEX, ROLE_ASSIGNMENT_CATEGORY_3_BATCH_LAST_INDEX, ROLE_ASSIGNMENT_CATEGORY_4_BATCH_LAST_INDEX } from './config';

const uuid = require('uuid').v4;
const projectRoles = staticData.projectRoles;
let lastBatchNum: number | null = null;
let roleAssignments: RoleAssignment[] = [];
	  
export function getRoleAssignmentsBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum) {
      const employeeHeaders: EmployeeHeader[] = getEmployeeHeadersBatchDynamicData(batchNum);
	  roleAssignments = [];
	  let num1 = ((batchNum - 1) % (projectRoles.length));
	  let num2 = ((batchNum) % (projectRoles.length));
	  let num3 = ((batchNum + 1) % (projectRoles.length));
	  for (let i = 0; i < ROLE_ASSIGNMENT_CATEGORY_1_BATCH_LAST_INDEX; i += 1) {
    		const empHeader = employeeHeaders[i];
			    const roleAssignment: RoleAssignment = {
 		  		ID: uuid(),
	  	    	role_ID : projectRoles[num1].ID!,
	        	employee_ID : empHeader.ID
	  		};
	  		roleAssignments.push(roleAssignment);
      }
  	  for (let i = ROLE_ASSIGNMENT_CATEGORY_1_BATCH_LAST_INDEX; i < ROLE_ASSIGNMENT_CATEGORY_2_BATCH_LAST_INDEX; i += 1) {
    		const empHeader = employeeHeaders[i];
		    const roleAssignment: RoleAssignment = {
			      ID: uuid(),
				  role_ID : projectRoles[num2].ID!,
			      employee_ID : empHeader.ID
    		};
   	 		roleAssignments.push(roleAssignment);
  	  }
	  for (let i = ROLE_ASSIGNMENT_CATEGORY_2_BATCH_LAST_INDEX; i < ROLE_ASSIGNMENT_CATEGORY_3_BATCH_LAST_INDEX; i += 1) {
   		 const empHeader = employeeHeaders[i];
    	 const roleAssignment1: RoleAssignment = {
      			ID: uuid(),
	  			role_ID : projectRoles[num1].ID!,
      			employee_ID : empHeader.ID
    	 };
	     const roleAssignment2: RoleAssignment = {
      			ID: uuid(),
	  			role_ID : projectRoles[num2].ID!,
      			employee_ID : empHeader.ID
    	 };
    	 roleAssignments.push(roleAssignment1);
    	 roleAssignments.push(roleAssignment2);
  	  }  
	  for (let i = ROLE_ASSIGNMENT_CATEGORY_3_BATCH_LAST_INDEX; i < ROLE_ASSIGNMENT_CATEGORY_4_BATCH_LAST_INDEX; i += 1) {
    		const empHeader = employeeHeaders[i];
		    const roleAssignment1: RoleAssignment = {
		    	ID: uuid(),
	  			role_ID : projectRoles[num1].ID!,
      			employee_ID : empHeader.ID
    		};
    		const roleAssignment2: RoleAssignment = {
      			ID: uuid(),
	  			role_ID : projectRoles[num2].ID!,
      			employee_ID : empHeader.ID
    		};
	 	    const roleAssignment3: RoleAssignment = {
      			ID: uuid(),
	  			role_ID : projectRoles[num3].ID!,
      			employee_ID : empHeader.ID
    		};
		    roleAssignments.push(roleAssignment1);
		    roleAssignments.push(roleAssignment2);
		    roleAssignments.push(roleAssignment3);
  	  }
  	  lastBatchNum = batchNum;
  }
  return roleAssignments;
}