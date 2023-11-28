import { AvailabilityInput, AvailabilityInputResource, AvailabilityOutput } from 'test-commons';

export const resourceRequests: AvailabilityInput[] = [
  {
    ID: '11787704-1894-4af0-a306-3aeb5a5c1c08',
  },
];

export const resource: AvailabilityInputResource[] = [
  {
    ID: '93941b03-b519-4a42-b34c-8626cc07145b',
    VALIDFROM: '2018-01-01',
    VALIDTO: '2022-01-02',
  },
];

export const expectation: AvailabilityOutput[] = [
  {
    RESOURCEREQUEST_ID: '11787704-1894-4af0-a306-3aeb5a5c1c08',
    RESOURCE_ID: '93941b03-b519-4a42-b34c-8626cc07145b',
    AVAILABILITYMATCHPERCENTAGE: '100.00',
  },
];
