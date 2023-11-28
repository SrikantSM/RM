// Availability maintained partially
import { AvailabilityInput, AvailabilityInputResource, AvailabilityOutput } from 'test-commons';

export const resourceRequests: AvailabilityInput[] = [
  {
    ID: '061b363c-a21d-407e-8413-84c8e49328d3',
  },
  {
    ID: '6209bb99-6737-4239-ad01-a97f01e6ea19',
  },
  {
    ID: '9ee21a35-4125-4458-8870-33d013ac7bf0',
  },
];

export const resource: AvailabilityInputResource[] = [
  {
    ID: 'fa5bfc31-1dca-4332-8454-9eb164c5bfd9',
    VALIDFROM: '2018-01-01',
    VALIDTO: '2020-01-02',
  },
];

export const expectation: AvailabilityOutput[] = [
  {
    RESOURCEREQUEST_ID: '061b363c-a21d-407e-8413-84c8e49328d3',
    RESOURCE_ID: 'fa5bfc31-1dca-4332-8454-9eb164c5bfd9',
    AVAILABILITYMATCHPERCENTAGE: '66.66',
  },
  {
    RESOURCEREQUEST_ID: '6209bb99-6737-4239-ad01-a97f01e6ea19',
    RESOURCE_ID: 'fa5bfc31-1dca-4332-8454-9eb164c5bfd9',
    AVAILABILITYMATCHPERCENTAGE: '50.00',
  },
  {
    RESOURCEREQUEST_ID: '9ee21a35-4125-4458-8870-33d013ac7bf0',
    RESOURCE_ID: 'fa5bfc31-1dca-4332-8454-9eb164c5bfd9',
    AVAILABILITYMATCHPERCENTAGE: '66.66',
  },
];
