export interface AvailabilityUploadErrors {
    createdAt?: string;
    createdBy?: string;
    modifiedAt?: string;
    modifiedBy?: string;
    resourceId: string;
    startDate: string;
    s4costCenterId?: string;
    workAssignmentExternalId?: string;
    error_desc: string;
    errorParam1?: string;
    errorParam2?: string;
    errorParam3?: string;
    errorParam4?: string;
    csvRecordIndex?: string;
    invalidKeys?: string;
    errorMessage?: string;
    availabilityErrorMessage_code: string;
}
