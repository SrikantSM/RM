export interface WorkAssignment {
  ID: string;
  workAssignmentID: string;
  externalID: string;
  parent: string;
  startDate: string;
  endDate: string;
  isContingentWorker?: boolean;
}
