export interface CapacityRequirement {
  ID: string;
  resourceRequest_ID: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  requestedCapacity: number;
  requestedUnit: string;
  requestedCapacityInMinutes: number;
}
