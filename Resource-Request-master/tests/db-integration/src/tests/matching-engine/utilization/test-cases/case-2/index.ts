import { UtilizationOutput, UtilizationInput } from 'test-commons';

export const resource: UtilizationInput[] = [
  {
    ID: 'e2454aaa-b301-41c3-bcfc-3a911f17efca',
  },
];

export const expectation: UtilizationOutput[] = [
  {
    RESOURCE_ID: 'e2454aaa-b301-41c3-bcfc-3a911f17efca',
    UTILIZATIONPERCENTAGE: '100.00',
  },
];
