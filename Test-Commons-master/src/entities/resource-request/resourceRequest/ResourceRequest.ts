/* eslint-disable linebreak-style */
export interface ResourceRequest {
  ID: string;
  displayId: string;
  name: string;
  isS4Cloud: boolean;
  demand_ID?: string;
  workpackage_ID?: string;
  project_ID?: string;
  projectRole_ID: string;
  priority_code: number;
  requestedResourceOrg_ID?: string;
  processingResourceOrg_ID?: string;
  requestStatus_code: number;
  releaseStatus_code: number;
  resourceKind_code: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  resourceManager: string;
  processor: string;
  requestedCapacity: number;
  requestedUnit: string;
  requestedCapacityInMinutes: number;
  description: string;
  referenceObject_ID?: string;
  referenceObjectType_code?: number;
}
