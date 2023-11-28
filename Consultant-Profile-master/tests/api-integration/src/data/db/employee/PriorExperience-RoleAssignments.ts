import { RoleAssignment } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { projectRoleWithDescription1, projectRoleWithDescription2 } from '../config';
import { employeeHeaderWithDescription1, employeeHeaderWithDescription2, employeeHeaderWithDescription4 } from './Headers';

const roleAssignmentWithDescription1: RoleAssignment = {
    ID: uuid(),
    role_ID: projectRoleWithDescription1.ID,
    employee_ID: employeeHeaderWithDescription1.ID,
};

const roleAssignmentWithDescription2: RoleAssignment = {
    ID: uuid(),
    role_ID: projectRoleWithDescription1.ID,
    employee_ID: employeeHeaderWithDescription2.ID,
};

const roleAssignmentWithDescription3: RoleAssignment = {
    ID: uuid(),
    role_ID: projectRoleWithDescription2.ID,
    employee_ID: employeeHeaderWithDescription1.ID,
};

const roleAssignmentWithDescription4: RoleAssignment = {
    ID: uuid(),
    role_ID: projectRoleWithDescription1.ID,
    employee_ID: employeeHeaderWithDescription4.ID,
};

const roleAssignmentWithDescription5: RoleAssignment = {
    ID: uuid(),
    role_ID: projectRoleWithDescription2.ID,
    employee_ID: employeeHeaderWithDescription4.ID,
};

const allRoleAssignments = [
    roleAssignmentWithDescription1,
    roleAssignmentWithDescription2,
    roleAssignmentWithDescription3,
    roleAssignmentWithDescription4,
    roleAssignmentWithDescription5,
];

export {
    allRoleAssignments,
    roleAssignmentWithDescription1,
    roleAssignmentWithDescription2,
    roleAssignmentWithDescription3,
    roleAssignmentWithDescription4,
    roleAssignmentWithDescription5,
};
