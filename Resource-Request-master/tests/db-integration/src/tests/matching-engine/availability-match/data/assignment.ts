import { Assignments } from 'test-commons';

export const assignmentData: Assignments[] = [
  // Resource 3 assignment data
  {
    ID: '53a1a4b6-6287-4b88-a8a1-49f9281f3678',
    resourceRequest_ID: 'c3c77393-c881-484a-88ca-47daf50fd74c',
    resource_ID: 'cc5693aa-2f46-4a4d-b924-64dc6e7787a1',
    bookedCapacityInMinutes: 33000,
  },
  // Resource request 1 assignment
  {
    ID: 'b003d9f8-847c-48a4-8c10-3bc195cd9c8e',
    resourceRequest_ID: '061b363c-a21d-407e-8413-84c8e49328d3',
    resource_ID: '158201be-f17c-48c5-957c-5e26bfa88de4',
    bookedCapacityInMinutes: 4000,
  },
  {
    ID: 'a1ac4245-eac0-417a-8055-8f4cf421cf7f',
    resourceRequest_ID: '061b363c-a21d-407e-8413-84c8e49328d3',
    resource_ID: '54e3c3c2-611b-4381-807e-ec741defe659',
    bookedCapacityInMinutes: 1000,
  },
  // Overassigned for Resource Request 4
  {
    ID: '58d9391d-3f2c-4b59-92b9-238373df7376',
    resourceRequest_ID: '8428a3f0-b32f-42a9-999c-966b972d3570',
    resource_ID: 'efe24235-e43a-47ac-b323-1e38ce9f2102',
    bookedCapacityInMinutes: 33000,
  },
];
