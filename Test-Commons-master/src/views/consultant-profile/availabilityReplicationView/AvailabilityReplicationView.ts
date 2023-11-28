export interface AvailabilityReplicationView {
  resourceId: string;
  workAssignmentExternalId: string;
  name: string;
  firstName: string;
  lastName: string;
  isBusinessPurposeCompleted: boolean;
  costCenterId: string;
  serviceOrg: string;
  s4costCenterId: string;
  workAssignmentStartDate: string;
  workAssignmentEndDate: string;
  workForcePersonExternalId: string;
  availabilitySummaryStatus_code: number;
}
