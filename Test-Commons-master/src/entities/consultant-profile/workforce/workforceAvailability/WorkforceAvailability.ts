import { WorkforceAvailabilityInterval } from './WorkforceAvailabilityInterval';
import { WorkforceAvailabilitySupplement } from './WorkforceAvailabilitySupplement';

export interface WorkforceAvailability {
  id?: string;
  workAssignmentID: string;
  workforcePerson_ID: string;
  availabilityDate: string;
  normalWorkingTime: string;
  availabilityIntervals: WorkforceAvailabilityInterval[];
  availabilitySupplements: WorkforceAvailabilitySupplement[];
}
