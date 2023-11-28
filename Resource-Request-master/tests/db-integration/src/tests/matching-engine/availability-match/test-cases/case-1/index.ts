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
  {
    ID: '8428a3f0-b32f-42a9-999c-966b972d3570',
  },
];

export const resource: AvailabilityInputResource[] = [
  {
    ID: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    VALIDFROM: '2018-01-01',
    VALIDTO: '2020-01-02',
  },
];

export const expectation: AvailabilityOutput[] = [
  {
    RESOURCEREQUEST_ID: '061b363c-a21d-407e-8413-84c8e49328d3',
    RESOURCE_ID: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    AVAILABILITYMATCHPERCENTAGE: '100.00',
  },
  {
    RESOURCEREQUEST_ID: '6209bb99-6737-4239-ad01-a97f01e6ea19',
    RESOURCE_ID: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    AVAILABILITYMATCHPERCENTAGE: '100.00',
  },
  {
    RESOURCEREQUEST_ID: '9ee21a35-4125-4458-8870-33d013ac7bf0',
    RESOURCE_ID: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    AVAILABILITYMATCHPERCENTAGE: '100.00',
  },
  {
    RESOURCEREQUEST_ID: '8428a3f0-b32f-42a9-999c-966b972d3570',
    RESOURCE_ID: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    AVAILABILITYMATCHPERCENTAGE: '100.00',
  },
];
