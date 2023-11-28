import { ResourceRequest } from 'test-commons';

const moment = require('moment');
const uuid = require('uuid').v4;

export const resourceRequestData: ResourceRequest[] = [
  {
    ID: '061b363c-a21d-407e-8413-84c8e49328d3',
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
    startDate: moment(new Date('2019-01-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2019-03-31')).format('YYYY-MM-DD'),
    startTime: '2019-01-01T17:00:00Z',
    endTime: '2019-03-31T17:00:00Z',
    resourceManager: '',
    processor: '',
    description: 'Resource Request for JAVA in Resource Management',
    requestedCapacity: 35000,
    requestedUnit: 'min',
    requestedCapacityInMinutes: 35000,
  },
  {
    ID: '6209bb99-6737-4239-ad01-a97f01e6ea19',
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
    startDate: moment(new Date('2019-01-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2019-03-31')).format('YYYY-MM-DD'),
    startTime: '2019-01-01T17:00:00Z',
    endTime: '2019-03-31T17:00:00Z',
    resourceManager: '',
    processor: '',
    description: 'Resource Request for Javascript in Resource Management',
    requestedCapacity: 20000,
    requestedUnit: 'min',
    requestedCapacityInMinutes: 20000,
  },
  {
    ID: '9ee21a35-4125-4458-8870-33d013ac7bf0',
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
    startDate: moment(new Date('2019-01-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2019-03-31')).format('YYYY-MM-DD'),
    startTime: '2019-01-01T17:00:00Z',
    endTime: '2019-03-31T17:00:00Z',
    resourceManager: '',
    processor: '',
    description: 'Resource Request without distribution',
    requestedCapacity: 30000,
    requestedUnit: 'min',
    requestedCapacityInMinutes: 30000,
  },
  {
    ID: '8428a3f0-b32f-42a9-999c-966b972d3570',
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
    startDate: moment(new Date('2019-01-01')).format('YYYY-MM-DD'),
    endDate: moment(new Date('2019-03-31')).format('YYYY-MM-DD'),
    startTime: '2019-01-01T17:00:00Z',
    endTime: '2019-03-31T17:00:00Z',
    resourceManager: '',
    processor: '',
    requestedCapacity: 30000,
    requestedUnit: 'min',
    requestedCapacityInMinutes: 30000,
    description: 'Resource Request with multiple over-assignment',
  },
];