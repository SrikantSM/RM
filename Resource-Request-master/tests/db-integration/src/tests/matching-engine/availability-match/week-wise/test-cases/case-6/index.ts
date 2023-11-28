import { AvailabilityInput, AvailabilityInputResource, AvailabilityOutput } from 'test-commons';

export const resourceRequests: AvailabilityInput[] = [
  {
    ID: '11787704-1894-4af0-a306-3aeb5a5c1c08',
  },
];

export const resource: AvailabilityInputResource[] = [
  {
    ID: 'b6170953-b353-40cf-b86a-c0a3ce55ad0d',
    VALIDFROM: '2018-01-01',
    VALIDTO: '2022-01-02',
  },
];

export const expectation: AvailabilityOutput[] = [
  {
    RESOURCEREQUEST_ID: '11787704-1894-4af0-a306-3aeb5a5c1c08',
    RESOURCE_ID: 'b6170953-b353-40cf-b86a-c0a3ce55ad0d',
    AVAILABILITYMATCHPERCENTAGE: '61.66',
  },
];
