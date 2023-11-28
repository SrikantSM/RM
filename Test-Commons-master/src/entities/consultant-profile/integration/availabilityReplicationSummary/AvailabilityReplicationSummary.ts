export interface AvailabilityReplicationSummary {
  resourceId: string;
  workForcePersonExternalId: string;
  costCenterId: string;
  workAssignmentStartDate: string;
  workAssignmentEndDate: string;
  workAssignmentExternalId: string;
  noOfRecordsProcessed: number;
  noOfRecordsFailed: number;
  noOfRecordsPassed: number;
  availabilitySummaryStatus_code: number;
}
