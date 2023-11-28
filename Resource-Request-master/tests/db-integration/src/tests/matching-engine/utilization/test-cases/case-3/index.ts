import { UtilizationOutput, UtilizationInput } from 'test-commons';

export const resource: UtilizationInput[] = [
  {
    ID: 'cc5693aa-2f46-4a4d-b924-64dc6e7787a1',
  },
];

export const expectation: UtilizationOutput[] = [
  {
    RESOURCE_ID: 'cc5693aa-2f46-4a4d-b924-64dc6e7787a1',
    UTILIZATIONPERCENTAGE: '60.00',
  },
];
