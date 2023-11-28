import { AssignmentValidityView } from "./AssignmentValidityView";

export interface CapacityGridHeaderTemporal {
    ID: string,
    JobDetailsID: string,
    costCenterID?: string,
    startDate: Date,
    endDate: Date,
    emailAddress?: string,
    mobileNumber?: string,
    resourceName?: string,
    firstName?: string,
    lastName?: string,
    workforcePersonID?:string,
    avgUtilization: Number,
    bookedHours: Number,
    availableHours: Number,
    managerName?:string,
    jobTitle?:string|null,
    country?: string|null,
    countryCode?:string,
    costCenter?: string,
    costCenterName?:string,
    costCenterForDisplay?:string,
    assignmentExistsForTheResource: boolean,
    workerType?:string,
    isPhotoPresent?: boolean,
    resourceAssignment?: AssignmentValidityView[]
  }