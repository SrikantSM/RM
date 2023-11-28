import { AvailabilityInput, AvailabilityInputResource, AvailabilityOutput } from 'test-commons';

export const resourceRequests: AvailabilityInput[] = [
  {
    ID: '11787704-1894-4af0-a306-3aeb5a5c1c08',
  },
];

export const resource: AvailabilityInputResource[] = [
  {
    ID: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    VALIDFROM: '2018-01-01',
    VALIDTO: '2022-01-02',
  },
];

export const expectation: AvailabilityOutput[] = [
  {
    RESOURCEREQUEST_ID: '11787704-1894-4af0-a306-3aeb5a5c1c08',
    RESOURCE_ID: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    AVAILABILITYMATCHPERCENTAGE: '100.00',
  },
];
