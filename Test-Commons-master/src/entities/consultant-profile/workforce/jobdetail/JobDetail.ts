export interface JobDetail {
  ID: string;
  costCenterexternalID: string;
  supervisorWorkAssignmentExternalID: string;
  jobTitle: string;
  parent: string;
  legalEntityExternalID: string;
  eventSequence?: number;
  country_code: string;
  validFrom: string;
  validTo: string;
  status_code?: string;
}
