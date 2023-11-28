import { Assignments } from 'test-commons';

export const assignmentData: Assignments[] = [
  // RR-2 Under-staffing Assignment
  {
    ID: '7ed3b236-f043-4cbe-8e2f-aaf34828b9b5',
    resourceRequest_ID: '727d8074-851d-46f2-8dd5-5a3a28583ec6',
    resource_ID: 'f523c457-1b76-4551-ade7-f4c8fd58091d',
    bookedCapacityInMinutes: 3000,
    assignmentstatus_code: 0,
  },
  // RR-3 Full-staffing Assignment
  {
    ID: 'b4d89954-3981-49db-bc6a-23f6f0c08100',
    resourceRequest_ID: 'eba6ebe8-2789-4e17-82f4-d5c71a44f8bb',
    resource_ID: '7b08b4a0-6309-4bbe-a968-39c6fefe195f',
    bookedCapacityInMinutes: 6000,
    assignmentstatus_code: 0,
  },
  // RR-4 Over-staffing Assignment
  {
    ID: 'b7f3a481-eb5d-46be-92ce-c0c008cb35cb',
    resourceRequest_ID: 'bfafb493-28f9-4933-bfbd-3d6e7465658d',
    resource_ID: '6ffcb1ec-00f1-4f18-92b2-31d36a197d12',
    bookedCapacityInMinutes: 9000,
    assignmentstatus_code: 0,
  },
];
