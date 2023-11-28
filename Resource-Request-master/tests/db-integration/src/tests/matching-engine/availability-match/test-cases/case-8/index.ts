// Availability maintained partially
import { AvailabilityInput, AvailabilityInputResource, AvailabilityOutput } from 'test-commons';

export const resourceRequests: AvailabilityInput[] = [
  {
    ID: '061b363c-a21d-407e-8413-84c8e49328d3',
  },
];

export const resource: AvailabilityInputResource[] = [
  {
    ID: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    VALIDFROM: '2019-03-01',
    VALIDTO: '2020-01-02',
  },
];

export const expectation: AvailabilityOutput[] = [
  {
    RESOURCEREQUEST_ID: '061b363c-a21d-407e-8413-84c8e49328d3',
    RESOURCE_ID: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    AVAILABILITYMATCHPERCENTAGE: '33.33',
  },
];
