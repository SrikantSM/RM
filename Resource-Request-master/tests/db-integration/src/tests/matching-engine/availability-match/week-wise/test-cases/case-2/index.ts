import { AvailabilityInput, AvailabilityInputResource, AvailabilityOutput } from 'test-commons';

export const resourceRequests: AvailabilityInput[] = [
  {
    ID: '11787704-1894-4af0-a306-3aeb5a5c1c08',
  },
];

export const resource: AvailabilityInputResource[] = [
  {
    ID: 'e2454aaa-b301-41c3-bcfc-3a911f17efca',
    VALIDFROM: '2018-01-01',
    VALIDTO: '2022-01-02',
  },
];

export const expectation: AvailabilityOutput[] = [
  {
    RESOURCEREQUEST_ID: '11787704-1894-4af0-a306-3aeb5a5c1c08',
    RESOURCE_ID: 'e2454aaa-b301-41c3-bcfc-3a911f17efca',
    AVAILABILITYMATCHPERCENTAGE: '80.33',
  },
];
