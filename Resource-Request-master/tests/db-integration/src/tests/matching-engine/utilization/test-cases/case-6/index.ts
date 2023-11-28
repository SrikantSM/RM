import { UtilizationOutput, UtilizationInput } from 'test-commons';

export const resource: UtilizationInput[] = [
  {
    ID: 'b6170953-b353-40cf-b86a-c0a3ce55ad0d',
  },
];

export const expectation: UtilizationOutput[] = [
  {
    RESOURCE_ID: 'b6170953-b353-40cf-b86a-c0a3ce55ad0d',
    UTILIZATIONPERCENTAGE: '0.00',
  },
];
