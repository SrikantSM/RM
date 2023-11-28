export interface ResourceCapacity {
  resource_id: string;
  startTime: string;
  workingTimeInMinutes: number;
  overTimeInMinutes: number;
  plannedNonWorkingTimeInMinutes: number;
  bookedTimeInMinutes: number;
  endTime: string;
}
