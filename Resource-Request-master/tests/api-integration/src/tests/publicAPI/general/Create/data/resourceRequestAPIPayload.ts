import { ResourceRequestApiStructure } from 'test-commons';

export const resourceRequestAPIPayload: ResourceRequestApiStructure = {
  startDate: '2019-01-01',
  endDate: '2020-02-28',
  requiredEffort: 350,
  name: 'New Resource Request Name.',
  description: 'New Resource Request Description.',
};

export const expectedEndTime = '2020-02-29T00:00:00Z';
