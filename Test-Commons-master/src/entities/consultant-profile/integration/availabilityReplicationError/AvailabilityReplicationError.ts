export interface AvailabilityReplicationError {
  resourceId: string;
  startDate: string;
  s4costCenterId: string;
  workAssignmentExternalId: string;
  availabilityErrorMessage_code?: string;
  errorParam1?: string;
  errorParam2?: string;
  errorParam3?: string;
  errorParam4?: string;
  csvRecordIndex?: string;
  invalidKeys?: string;
}
