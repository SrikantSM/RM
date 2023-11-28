// Availability maintained partially
import { AvailabilityInput, AvailabilityInputResource, AvailabilityOutput } from 'test-commons';

export const resourceRequests: AvailabilityInput[] = [
  {
    ID: '061b363c-a21d-407e-8413-84c8e49328d3',
  },
];

export const resource: AvailabilityInputResource[] = [
  {
    ID: '732c9c31-e376-42dd-b110-852fd5e0af80',
    VALIDFROM: '2019-04-01',
    VALIDTO: '2020-01-02',
  },
];

export const expectation: AvailabilityOutput[] = [
  {
    RESOURCEREQUEST_ID: '061b363c-a21d-407e-8413-84c8e49328d3',
    RESOURCE_ID: '732c9c31-e376-42dd-b110-852fd5e0af80',
    AVAILABILITYMATCHPERCENTAGE: '0.00',
  },
];
