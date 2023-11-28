import { ResourceRequest } from 'test-commons';

const moment = require('moment');
const uuid = require('uuid').v4;

const nextTwoMonths = new Date();
nextTwoMonths.setMonth(nextTwoMonths.getMonth() + 2);

// Resource request for 3 months
export const resourceRequestData: ResourceRequest[] = [
  {
    ID: '0e49a84a-92bd-4530-94b4-6edb81e48dd7',
    name: `Name_${uuid()}`,
    displayId: uuid().substring(26),
    isS4Cloud: true,
    demand_ID: '',
    workpackage_ID: '',
    project_ID: '',
    projectRole_ID: 'df420fe7-6671-44f9-911f-408c79c01c77',
    priority_code: 2,
    // requestedResourceOrg_ID: 'RDBIN',
    processingResourceOrg_ID: 'RDBIN',
    requestStatus_code: 0,
    releaseStatus_code: 1,
    resourceKind_code: '1',
    startDate: moment('2019-01-01').startOf('month').format('YYYY-MM-DD'),
    endDate: moment('2019-03-31').endOf('month').format('YYYY-MM-DD'),
    startTime: '2019-01-01T17:00:00Z',
    endTime: '2019-03-31T17:00:00Z',
    resourceManager: '',
    processor: '',
    description: 'Resource Request for JAVA in Resource Management',
    requestedCapacity: 15000,
    requestedUnit: 'min',
    requestedCapacityInMinutes: 15000,
  },
];
