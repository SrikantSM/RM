const uuid = require('uuid').v4;
const { roleLifecycleStatus } = require('./roleLifecycleStatus');

const unrestrictedCode = roleLifecycleStatus[0].code;
const restrictedCode = roleLifecycleStatus[1].code;

const projectRole1 = {
    ID: uuid(),
    code: 'T006',
    name: 'Junior Consultant1',
    description: '',
    roleLifecycleStatus_code: unrestrictedCode,
};

const projectRole2 = {
    ID: uuid(),
    code: 'T007',
    name: 'Senior Consultant1',
    description: '',
    roleLifecycleStatus_code: unrestrictedCode,
};

const projectRole3 = {
    ID: uuid(),
    code: 'T008',
    name: 'Platinum Consultant1',
    description: '',
    roleLifecycleStatus_code: unrestrictedCode,
};

const projectRole4 = {
    ID: uuid(),
    code: 'T009',
    name: 'Architect1',
    description: '',
    roleLifecycleStatus_code: restrictedCode,
};

const projectRole5 = {
    ID: uuid(),
    code: 'T010',
    name: 'Program Manager1',
    description: '',
    roleLifecycleStatus_code: restrictedCode,
};
const projectRoles = [
    projectRole1,
    projectRole2,
    projectRole3,
    projectRole4,
    projectRole5,
];

module.exports = {
    projectRoles,
    projectRole1,
    projectRole2,
    projectRole3,
    projectRole4,
    projectRole5,
};
