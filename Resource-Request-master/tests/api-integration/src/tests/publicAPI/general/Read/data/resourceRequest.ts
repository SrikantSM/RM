import { exit } from 'process';
import { ResourceRequest, ResourceRequestApiStructure } from 'test-commons';
import { organizationHeaders } from '../../../commonData/organizationHeader';

const moment = require('moment');

function getApiPayload(instance: string): ResourceRequestApiStructure {
  return {
    ID: `5c4398bd-d835-441e-9636-54b2ae58b1${instance}`,
    displayId: `99999999${instance}`,
    startDate: moment(new Date(`20${instance}-01-01`)).format('YYYY-MM-DD'),
    endDate: moment(new Date(`20${instance}-02-02`)).format('YYYY-MM-DD'),
    requiredEffort: Number(instance),
    description: `publicAPIReadTest_${instance}`,
    name: `name${instance}`,
    referenceObjectId: `ec1f4084-2052-49c5-b186-415f704455${instance}`
  };
}
// eslint-disable-next-line consistent-return
function getDbStrctureFromApiStructure(apiStructure:ResourceRequestApiStructure): ResourceRequest {
  if (apiStructure.ID && apiStructure.displayId && apiStructure.name && apiStructure.description && apiStructure.requiredEffort && apiStructure.startDate && apiStructure.endDate && apiStructure.referenceObjectId) {
    return {
      ID: apiStructure.ID,
      displayId: apiStructure.displayId,
      isS4Cloud: false,
      description: apiStructure.description,
      requestedCapacity: apiStructure.requiredEffort,
      startDate: apiStructure.startDate,
      endDate: apiStructure.endDate,
      name: apiStructure.name,
      demand_ID: 'ab188671-2ce5-4258-928f-1b76ea251f46',
      workpackage_ID: 'RRAPIPROJ.1.1',
      project_ID: 'RRAPIPROJ',
      projectRole_ID: 'b2ee640f-707a-4a63-8a56-ede4ab6bbc73',
      priority_code: 2,
      requestStatus_code: 0,
      releaseStatus_code: 0,
      resourceKind_code: '0',
      startTime: '2019-01-01T00:00:00Z',
      endTime: '2019-02-02T00:00:00Z',
      resourceManager: '',
      processor: '',
      requestedUnit: 'duration-hour',
      requestedCapacityInMinutes: 0,
      referenceObject_ID : apiStructure.referenceObjectId
    };
  }
  console.log('apiStructure has missing attributes for db insert');
  exit(1);
}
export const resourceRequest1: ResourceRequestApiStructure = getApiPayload('01');
export const resourceRequest2: ResourceRequestApiStructure = getApiPayload('02');
export const resourceRequest3: ResourceRequestApiStructure = getApiPayload('03');
export const resourceRequest4: ResourceRequestApiStructure = getApiPayload('04');
export const resourceRequest5: ResourceRequestApiStructure = getApiPayload('05');
export const resourceRequest6: ResourceRequestApiStructure = getApiPayload('06');
export const resourceRequest7: ResourceRequestApiStructure = getApiPayload('07');
export const resourceRequest8: ResourceRequestApiStructure = getApiPayload('08');
export const resourceRequest9: ResourceRequestApiStructure = getApiPayload('09');
export const resourceRequest10: ResourceRequestApiStructure = getApiPayload('10');

export const resourceRequestData: ResourceRequest[] = [
  getDbStrctureFromApiStructure(resourceRequest1),
  getDbStrctureFromApiStructure(resourceRequest2),
  getDbStrctureFromApiStructure(resourceRequest3),
  getDbStrctureFromApiStructure(resourceRequest4),
  getDbStrctureFromApiStructure(resourceRequest5),
  getDbStrctureFromApiStructure(resourceRequest6),
  getDbStrctureFromApiStructure(resourceRequest7),
  getDbStrctureFromApiStructure(resourceRequest8),
  getDbStrctureFromApiStructure(resourceRequest9),
  getDbStrctureFromApiStructure(resourceRequest10),
];

export const resourceRequestApiData: ResourceRequestApiStructure[] = [
  resourceRequest1,
  resourceRequest2,
  resourceRequest3,
  resourceRequest4,
  resourceRequest5,
  resourceRequest6,
  resourceRequest7,
  resourceRequest8,
  resourceRequest9,
  resourceRequest10,
];
