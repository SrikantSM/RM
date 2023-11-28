export interface AvailabilityUploadData {
    resourceId: string;
    workForcePersonExternalId: string;
    name: string;
    firstName: string;
    lastName: string;
    costCenterId: string;
    resourceOrg: string | null;
    s4CostCenterId: string;
    workAssignmentStartDate: string;
    workAssignmentEndDate: string;
    workAssignmentExternalId: string;
    availabilitySummaryStatus_code: number;
    minDate: string;
    maxLimitDate: string;
    availableDays: number;
    requiredDays: number;
    isContingentWorker: boolean;
}
