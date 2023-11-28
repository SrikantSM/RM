import { ResourceRequest } from 'test-commons';

const moment = require('moment');
const uuid = require('uuid').v4;

export const resourceRequestData: ResourceRequest[] = [
  {
    ID: '11787704-1894-4af0-a306-3aeb5a5c1c08',
    name: `Name_${uuid()}`,
    displayId: uuid().substring(26),
    isS4Cloud: true,
    demand_ID: '',
    workpackage_ID: '',
    project_ID: '',
    projectRole_ID: 'PROJECTROLE1',
    priority_code: 2,
    requestStatus_code: 1,
    releaseStatus_code: 1,
    resourceKind_code: '1',
    startDate: moment(new Date('2020-01-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2020-01-31')).format('YYYY-MM-DD'),
    startTime: '2020-01-01T17:00:00Z',
    endTime: '2020-01-31T17:00:00Z',
    resourceManager: '',
    processor: '',
    description: 'Resource Request for JAVA in Resource Management',
    requestedCapacity: 2940,
    requestedUnit: 'min',
    requestedCapacityInMinutes: 2940,
  },
];
