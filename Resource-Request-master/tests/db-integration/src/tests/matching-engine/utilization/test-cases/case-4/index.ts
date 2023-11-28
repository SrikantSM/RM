import { UtilizationOutput, UtilizationInput } from 'test-commons';

export const resource: UtilizationInput[] = [
  {
    ID: '93941b03-b519-4a42-b34c-8626cc07145b',
  },
];

export const expectation: UtilizationOutput[] = [
  {
    RESOURCE_ID: '93941b03-b519-4a42-b34c-8626cc07145b',
    UTILIZATIONPERCENTAGE: '100.00',
  },
];
