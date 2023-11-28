import { WorkforceAvailabilitySupplement } from './WorkforceAvailabilitySupplement';
import { WorkforceAvailabilityInterval } from './WorkforceAvailabilityInterval';

export interface WorkforceAvailability {
    id?: string;
    workAssignmentID?: string;
    workforcePerson_ID?: string;
    availabilityDate?: string;
    normalWorkingTime?: string;
    availabilityIntervals?: WorkforceAvailabilityInterval[];
    availabilitySupplements?: WorkforceAvailabilitySupplement[];
}
