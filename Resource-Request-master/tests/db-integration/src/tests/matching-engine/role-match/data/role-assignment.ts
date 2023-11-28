import { RoleAssignment } from 'test-commons';

export const roleAssignmentData: RoleAssignment[] = [
  // Employee 1 has one role maintained
  {
    ID: '83f37f0c-cb82-4f95-b1f1-d4ee628364f7',
    employee_ID: 'ccc76d20-d2c9-492e-9e88-bd935e0c6f2f',
    role_ID: 'dfb5a13a-80e1-4aff-ab5c-c70dfbda1442', // Role 1
  },
  // Employee 2 has three roles maintained
  {
    ID: '8a449c4e-ebdd-411d-8759-616bf186eff6',
    employee_ID: 'cbd44d11-5de6-4c5b-8ccd-9b4dbdcd7765',
    role_ID: 'dfb5a13a-80e1-4aff-ab5c-c70dfbda1442', // Role 1
  },
  {
    ID: 'bcb76156-3a76-463d-9165-50babf27e301',
    employee_ID: 'cbd44d11-5de6-4c5b-8ccd-9b4dbdcd7765',
    role_ID: '3cc5decf-15ec-4ed9-bd98-d367a524e601', // Role 2
  },
  {
    ID: '98773d6c-0436-45c8-926a-413a82b20b91',
    employee_ID: 'cbd44d11-5de6-4c5b-8ccd-9b4dbdcd7765',
    role_ID: '09f44c74-eb00-48f1-a096-1ba516bbe2ee', // Role 3
  },
];
