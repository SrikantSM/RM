const uuid = require('uuid').v4;
const roleCode = require('crypto-random-string');
const environment = require('../../utils').getEnvironment();
const { testRunId } = require('./testRunID.js');

const { seleniumTestName } = environment;
const { roleLifecycleStatus } = require('./roleLifecycleStatus');

const unrestrictedCode = roleLifecycleStatus[0].code;
const restrictedCode = roleLifecycleStatus[1].code;

const projectRoleDescription = {
    description: `Description for Project Role for e2e tests with grid as ${seleniumTestName}`,
};

const projectRole1 = {
    ID: uuid(),
    code: roleCode({ length: 4 }),
    name: `Junior Consultant ${testRunId}`,
    roleLifecycleStatus_code: unrestrictedCode,
};
const projectRole2 = {
    ID: uuid(),
    code: roleCode({ length: 4 }),
    name: `Senior Consultant ${testRunId}`,
    roleLifecycleStatus_code: unrestrictedCode,
};
const projectRole3 = {
    ID: uuid(),
    code: roleCode({ length: 4 }),
    name: `Platinum Consultant ${testRunId}`,
    roleLifecycleStatus_code: unrestrictedCode,
};
const projectRole4 = {
    ID: uuid(),
    code: roleCode({ length: 4 }),
    name: `Architect ${testRunId}`,
    roleLifecycleStatus_code: unrestrictedCode,
};
const projectRole5 = {
    ID: uuid(),
    code: roleCode({ length: 4 }),
    name: `Program Manager ${testRunId}`,
    roleLifecycleStatus_code: restrictedCode,
};

Object.assign(projectRole1, projectRoleDescription);
Object.assign(projectRole2, projectRoleDescription);
Object.assign(projectRole3, projectRoleDescription);
Object.assign(projectRole4, projectRoleDescription);
Object.assign(projectRole5, projectRoleDescription);

const projectRoles = [
    projectRole1,
    projectRole2,
    projectRole3,
    projectRole4,
    projectRole5,
];

module.exports = { projectRoleDescription, projectRoles };
