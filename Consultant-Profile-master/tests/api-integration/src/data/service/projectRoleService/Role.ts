import { v4 as uuid } from 'uuid';
import { Role, ProjectRoleText, RoleLifecycleStatus } from '../../../serviceEntities/projectRoleService';

const createRole: Role = {
    ID: uuid(),
    code: 'ABCD',
    name: 'Role Name',
    description: 'Description Of The Role',
};

const roleWithoutCode: Role = {
    ID: uuid(),
    name: 'Role Name',
    description: 'Description Of The Role',
};

const roleWithoutName: Role = {
    ID: uuid(),
    code: 'ABCD',
    name: '',
    description: 'Description Of The Role',
};

const deleteRole = createRole;

function getRole(roleCode: string, roleName: string, roleDescription: string, roleLifecycleStatus: RoleLifecycleStatus): Role {
    const createRoleObject: Role = {
        ID: uuid(),
        code: roleCode,
        name: roleName,
        description: roleDescription,
        roleLifecycleStatus_code: roleLifecycleStatus.code,
    };
    return createRoleObject;
}

function getRoleText(roleId: string, roleName: string, roleDescription: string, roleLocale: string): ProjectRoleText {
    const createRoleText: ProjectRoleText = {
        ID_texts: uuid(),
        ID: roleId,
        name: roleName,
        description: roleDescription,
        locale: roleLocale,
    };
    return createRoleText;
}

export {
    createRole,
    deleteRole,
    getRole,
    getRoleText,
    roleWithoutCode,
    roleWithoutName,
};
