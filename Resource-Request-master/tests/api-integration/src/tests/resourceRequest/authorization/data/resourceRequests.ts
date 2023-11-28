import { ResourceRequest } from 'test-commons';

const moment = require('moment');
const uuid = require('uuid').v4;

export const resourceRequest: ResourceRequest = {
  ID: '5c4398bd-d835-441e-9636-54b2ae58b192',
  name: `Name_${uuid()}`,
  displayId: uuid().substring(26),
  isS4Cloud: true,
  demand_ID: 'ab188671-2ce5-4258-928f-1b76ea251f46',
  workpackage_ID: 'RRAPIPROJ.1.1',
  project_ID: 'RRAPIPROJ',
  projectRole_ID: 'b2ee640f-707a-4a63-8a56-ede4ab6bbc73',
  priority_code: 2,
  requestedResourceOrg_ID: 'ROO1',
  processingResourceOrg_ID: 'ROO1',
  requestStatus_code: 0,
  releaseStatus_code: 0,
  resourceKind_code: '0',
  startDate: moment(new Date('2020-04-01')).format('YYYY-MM-DD'),
  endDate: moment(new Date('2020-04-02')).format('YYYY-MM-DD'),
  startTime: '2019-01-01T00:00:00Z',
  endTime: '2019-02-02T00:00:00Z',
  resourceManager: '',
  processor: '',
  requestedCapacity: 100,
  requestedUnit: 'duration-hour',
  requestedCapacityInMinutes: 0,
  description:
    'Budget constraints/high demand in the Project so please assign accordingly. Low cost resource required',
};

export const resourceRequestInsertedViaDB: ResourceRequest = {
  ID: '653ffc81-ab50-4003-87f5-f516b379f0b5',
  name: `Name_${uuid()}`,
  displayId: uuid().substring(26),
  isS4Cloud: true,
  demand_ID: 'ab188671-2ce5-4258-928f-1b76ea251f00',
  workpackage_ID: 'RRAPIPROJ.1.1',
  project_ID: 'RRAPIPROJ',
  projectRole_ID: 'b2ee640f-707a-4a63-8a56-ede4ab6bbc73',
  priority_code: 2,
  requestedResourceOrg_ID: 'ROO2',
  processingResourceOrg_ID: 'ROO2',
  requestStatus_code: 0,
  releaseStatus_code: 1,
  resourceKind_code: '0',
  startDate: moment(new Date('2019-01-01')).format('YYYY-MM-DD'),
  endDate: moment(new Date('2019-02-02')).format('YYYY-MM-DD'),
  startTime: '2019-01-01T00:00:00Z',
  endTime: '2019-02-02T00:00:00Z',
  resourceManager: '',
  processor: '',
  requestedCapacity: 100,
  requestedUnit: 'duration-hour',
  requestedCapacityInMinutes: 0,
  description:
    'Budget constraints/high demand in the Project so please assign accordingly. Low cost resource required',
};
