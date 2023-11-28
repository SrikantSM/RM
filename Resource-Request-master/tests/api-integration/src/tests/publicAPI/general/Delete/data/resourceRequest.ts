import { ResourceRequest } from 'test-commons';

const uuid = require('uuid').v4;

function getStructure(bIsPublished: boolean, bIsS4Cloud:boolean): ResourceRequest {
  return {
    releaseStatus_code: bIsPublished ? 1 : 0,
    isS4Cloud: bIsS4Cloud,
    requestStatus_code: 0,
    description: `description_${uuid()}`,
    ID: uuid(),
    displayId: uuid().substring(26),
    startDate: '2019-01-01',
    endDate: '2019-02-02',
    name: `name_${uuid()}`,
    demand_ID: 'ab188671-2ce5-4258-928f-1b76ea251f46',
    workpackage_ID: 'RRAPIPROJ.1.1',
    project_ID: 'RRAPIPROJ',
    projectRole_ID: 'b2ee640f-707a-4a63-8a56-ede4ab6bbc73',
    priority_code: 2,
    requestedCapacity: 10,
    resourceKind_code: '0',
    startTime: '2019-01-01T00:00:00Z',
    endTime: '2019-02-02T00:00:00Z',
    resourceManager: '',
    processor: '',
    requestedUnit: 'duration-hour',
    requestedCapacityInMinutes: 600,
  };
}

export const unpublishedResourceRequestNonS4: ResourceRequest = getStructure(false, false);
export const unpublishedResourceRequestS4: ResourceRequest = getStructure(false, true);
export const publishedNonS4: ResourceRequest = getStructure(true, false);
export const publishedS4: ResourceRequest = getStructure(true, true);

export const resourceRequestData: ResourceRequest[] = [
  unpublishedResourceRequestNonS4,
  unpublishedResourceRequestS4,
  publishedNonS4,
  publishedS4,
];
