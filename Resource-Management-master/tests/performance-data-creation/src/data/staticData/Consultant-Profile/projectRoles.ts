import { ProjectRole } from "test-commons";
import { PROJECT_ROLE_ID_TEMPLATE, PROJECT_ROLES_NUMBER_OF_PROJECT_ROLES } from './config';
import { predictableUuid } from '../../../utils';

let projectRoles: ProjectRole[] = [];

for (let i = 0; i < PROJECT_ROLES_NUMBER_OF_PROJECT_ROLES; i++) {
	const roleCode = 'T' + i;
	const project_role_id = predictableUuid(PROJECT_ROLE_ID_TEMPLATE, i);
   	let projectRole: ProjectRole = {
    	ID: project_role_id,
    	code: roleCode.padStart(4, 'R'),
    	name: 'ProjectRole ' + roleCode,
	description: 'The description of ProjectRole ' + roleCode,
	roleLifecycleStatus_code: 0,
    }	
    projectRoles.push(projectRole);
}

export { projectRoles };
