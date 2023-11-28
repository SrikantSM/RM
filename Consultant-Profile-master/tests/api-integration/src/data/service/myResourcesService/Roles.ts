import { v4 as uuid } from 'uuid';
import { Roles } from '../../../serviceEntities/myProjectExperienceService/Roles';
import { employeeHeaderWithDescription4, projectRoleWithDescription3 } from '../../db';

const createRole: Roles = {
    ID: uuid(),
    role_ID: projectRoleWithDescription3.ID,
    employee_ID: employeeHeaderWithDescription4.ID,
};

const deleteRole = createRole;

export { createRole, deleteRole };
