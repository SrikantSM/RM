import { UtilizationOutput, UtilizationInput } from 'test-commons';

export const resource: UtilizationInput[] = [
  {
    ID: 'e0f753f5-cf15-45e6-81cb-9c34869e4819',
  },
];

export const expectation: UtilizationOutput[] = [
  {
    RESOURCE_ID: 'e0f753f5-cf15-45e6-81cb-9c34869e4819',
    UTILIZATIONPERCENTAGE: '140.00',
  },
];
