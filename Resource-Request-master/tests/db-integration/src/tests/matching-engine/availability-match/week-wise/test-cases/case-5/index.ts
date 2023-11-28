import { AvailabilityInput, AvailabilityInputResource, AvailabilityOutput } from 'test-commons';

export const resourceRequests: AvailabilityInput[] = [
  {
    ID: '11787704-1894-4af0-a306-3aeb5a5c1c08',
  },
];

export const resource: AvailabilityInputResource[] = [
  {
    ID: 'e0f753f5-cf15-45e6-81cb-9c34869e4819',
    VALIDFROM: '2018-01-01',
    VALIDTO: '2022-01-02',
  },
];

export const expectation: AvailabilityOutput[] = [
  {
    RESOURCEREQUEST_ID: '11787704-1894-4af0-a306-3aeb5a5c1c08',
    RESOURCE_ID: 'e0f753f5-cf15-45e6-81cb-9c34869e4819',
    AVAILABILITYMATCHPERCENTAGE: '0.00',
  },
];
