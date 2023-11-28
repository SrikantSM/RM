import { v4 as uuid } from 'uuid';
import { RoleCode } from '../../../serviceEntities/projectRoleService';

const createRoleCode: RoleCode = {
    ID: uuid(),
    code: 'ABCD',
};

export { createRoleCode };
