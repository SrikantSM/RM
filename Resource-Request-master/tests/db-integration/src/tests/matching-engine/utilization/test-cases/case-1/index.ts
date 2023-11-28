import { UtilizationOutput, UtilizationInput } from 'test-commons';

export const resource: UtilizationInput[] = [
  {
    ID: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
  },
];

export const expectation: UtilizationOutput[] = [
  {
    RESOURCE_ID: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    UTILIZATIONPERCENTAGE: '0.00',
  },
];
