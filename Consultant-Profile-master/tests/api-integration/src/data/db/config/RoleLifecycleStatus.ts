import { RoleLifecycleStatus } from 'test-commons';

const roleLifecycleStatus1: RoleLifecycleStatus = {
    code: 0,
    name: 'Unrestricted',
    descr: 'Unrestricted',
};

const roleLifecycleStatus2: RoleLifecycleStatus = {
    code: 1,
    name: 'Restricted',
    descr: 'Restricted',
};

const createRoleLifecycleStatus: RoleLifecycleStatus = {
    code: 3,
    name: 'Error',
    descr: 'Error',
};

export {
    createRoleLifecycleStatus,
    roleLifecycleStatus1,
    roleLifecycleStatus2,
};
