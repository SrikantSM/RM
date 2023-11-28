export interface RequestDetailsForEachAssignment {
  resourceRequest_ID: string,
  requestDisplayId: string,
  requestName: string,
  requestStartDate: string,
  requestEndDate: string,
  costCenterID?: string,
  projectId?: string,
  projectName?: string,
  workPackageId?: string,
  workPackageName?: string,
  customerId?: string,
  customerName?: string,
  projectStartDate?: Date,
  projectEndDate?: Date,
  projectRoleId?: string,
  projectRoleName?: string,
  workPackageStartDate?: Date,
  workPackageEndDate?: Date
  serviceOrganization_code?: string,
  
}