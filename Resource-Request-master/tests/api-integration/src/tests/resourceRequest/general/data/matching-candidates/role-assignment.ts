import { RoleAssignment } from 'test-commons';

export const roleAssignmentData: RoleAssignment[] = [
  // Employee 1 has two role maintained
  {
    ID: '7b94ec43-cc41-4fdc-8b3f-f02e15a684c4',
    employee_ID: '612488d9-56d6-4785-ab0e-edeea3be7669',
    role_ID: 'b2ee640f-707a-4a63-8a56-ede4ab6bbc73', // Role 1
  },
  {
    ID: 'a1440b15-3a78-4b1a-8b95-5b7694995495',
    employee_ID: '612488d9-56d6-4785-ab0e-edeea3be7669',
    role_ID: '3c3a11f2-dc13-4e4b-804f-44bac58549db', // Role 2
  },
  {
    ID: 'a1440b15-3a78-4b1a-8b95-5b7694995496',
    employee_ID: '9a7e8a42-f717-42bf-86e3-54b76d2aec62',
    role_ID: '3c3a11f2-dc13-4e4b-804f-44bac58549db', // Role 2
  },
];
