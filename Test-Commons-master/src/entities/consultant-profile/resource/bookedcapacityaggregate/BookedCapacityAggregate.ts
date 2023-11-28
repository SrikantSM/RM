export interface BookedCapacityAggregate {
  resourceID: string;
  startTime: string;
  bookedCapacityInMinutes: number;
  softBookedCapacityInMinutes: number;
}
