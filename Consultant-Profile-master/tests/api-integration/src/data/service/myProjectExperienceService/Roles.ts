import { v4 as uuid } from 'uuid';
import { Roles } from '../../../serviceEntities/myProjectExperienceService/Roles';
import { projectRoleWithDescription3, employeeHeaderWithDescription1 } from '../../db';

const createRole: Roles = {
    ID: uuid(),
    role_ID: projectRoleWithDescription3.ID,
    employee_ID: employeeHeaderWithDescription1.ID,
};

const deleteRole = createRole;

export { createRole, deleteRole };
