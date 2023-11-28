import { RoleAssignment } from 'test-commons';

export const roleAssignmentData: RoleAssignment[] = [
  // Employee 1 has one role maintained
  {
    ID: '2fd6bf81-3c61-4549-85e8-6519dca0cca0',
    employee_ID: 'c7dff55e-c880-4495-bbca-13541eed4897',
    role_ID: 'df420fe7-6671-44f9-911f-408c79c01c77', // Role 1
  },
  // Employee 2 has two roles
  {
    ID: '0c41f30b-5d7d-405c-b258-6e3adf6791e1',
    employee_ID: '5ba1aa7d-a1dd-4de1-afbd-9adb433395bf',
    role_ID: 'df420fe7-6671-44f9-911f-408c79c01c77', // Role 1
  },
  {
    ID: 'b8778ff9-ffa2-48c1-b801-163290440dbf',
    employee_ID: '5ba1aa7d-a1dd-4de1-afbd-9adb433395bf',
    role_ID: '460d10ea-77a3-49dc-9090-eedea1142680', // Role 2
  },
  {
    ID: '3dc2e0f9-a024-4507-b99b-84fbf7e7ec91',
    employee_ID: 'd629ae17-4817-4087-bb50-95889112e300',
    role_ID: 'df420fe7-6671-44f9-911f-408c79c01c77', // Role 1
  },
  {
    ID: 'e397ffbd-5e9b-4058-aa08-b6573f66b14f',
    employee_ID: 'b2ceff3c-bbd7-41d7-908d-ffa33896c6d4',
    role_ID: '460d10ea-77a3-49dc-9090-eedea1142680', // Role 2
  },
  // Employee 7 has one role maintained
  {
    ID: '288d37d1-54b0-4ee2-b4bd-930875f920e5',
    employee_ID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
    role_ID: 'df420fe7-6671-44f9-911f-408c79c01c77', // Role 1
  },
    // Employee 8 has one role maintained
    {
      ID: '288d37d1-54b0-4ee2-b4bd-930875f920e6',
      employee_ID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce6',
      role_ID: '460d10ea-77a3-49dc-9090-eedea1142680', // Role 2
    },
];
