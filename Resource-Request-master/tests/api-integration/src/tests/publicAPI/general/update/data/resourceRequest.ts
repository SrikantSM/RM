import { ResourceRequest, ResourceRequestApiStructure } from 'test-commons';
import { organizationHeaders } from '../../../commonData/organizationHeader';
import { workPackages } from './workPackages';
import { demands } from './demands';

const uuid = require('uuid').v4;

function getStructure(bIsPublished: boolean, bIsS4Cloud:boolean, projectId:string, workPackageId:string, demandId:string): ResourceRequest {
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
    demand_ID: demandId,
    workpackage_ID: workPackageId,
    project_ID: projectId,
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
    referenceObject_ID: 'b9c7ce72-9ca9-49ef-9609-766a06d29d33'
  };
}

export const unpublishedResourceRequestS4: ResourceRequest = getStructure(
  false,
  true,
  workPackages[0].project_ID,
  workPackages[0].ID,
  demands[0].ID,
);
export const publishedResourceRequestS4: ResourceRequest = getStructure(
  true,
  true,
  workPackages[0].project_ID,
  workPackages[0].ID,
  demands[1].ID,
);

export const resourceRequestNonS4: ResourceRequest = getStructure(
  false,
  false,
  '',
  '',
  '',
);

export const resourceRequestData: ResourceRequest[] = [
  unpublishedResourceRequestS4,
  publishedResourceRequestS4,
  resourceRequestNonS4,
];

export const resourceRequestAPIPayload: ResourceRequestApiStructure = {
  startDate: '2019-01-01',
  endDate: '2020-02-28',
  requiredEffort: 350,
  name: 'New Resource Request Name.',
  description: 'New Resource Request Description.',
};
