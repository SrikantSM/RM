import { ProjectRole } from 'test-commons';
import { v4 as uuidv4 } from 'uuid';
import { roleLifecycleStatus1, roleLifecycleStatus2 } from './RoleLifecycleStatus';

const projectRoleDescription = {
    description: 'API-Project Role Description.',
};

const projectRoleWithDescription1: ProjectRole = {
    ID: uuidv4(),
    code: 'R1C1',
    name: 'RoleName1',
    description: projectRoleDescription.description,
    roleLifecycleStatus_code: roleLifecycleStatus1.code,
};

const projectRoleWithDescription2: ProjectRole = {
    ID: uuidv4(),
    code: 'R2C2',
    name: 'RoleName2',
    description: projectRoleDescription.description,
    roleLifecycleStatus_code: roleLifecycleStatus1.code,
};

const projectRoleWithDescription3: ProjectRole = {
    ID: uuidv4(),
    code: 'R3C3',
    name: 'RoleName3',
    description: projectRoleDescription.description,
    roleLifecycleStatus_code: roleLifecycleStatus1.code,
};

const projectRoleWithDescription4: ProjectRole = {
    ID: uuidv4(),
    code: 'R4C4',
    name: 'RoleName4',
    description: projectRoleDescription.description,
    roleLifecycleStatus_code: roleLifecycleStatus2.code,
};

const allProjectRoles = [
    projectRoleWithDescription1,
    projectRoleWithDescription2,
    projectRoleWithDescription3,
    projectRoleWithDescription4,
];

const allUnrestrictedProjectRoles = [
    projectRoleWithDescription1,
    projectRoleWithDescription2,
    projectRoleWithDescription3,
];

export {
    projectRoleDescription,
    allProjectRoles,
    allUnrestrictedProjectRoles,
    projectRoleWithDescription1,
    projectRoleWithDescription2,
    projectRoleWithDescription3,
    projectRoleWithDescription4,
};
