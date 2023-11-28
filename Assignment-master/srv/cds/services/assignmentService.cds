using com.sap.resourceManagement.assignment as assignment from '../../../db/cds/index';

using com.sap.resourceManagement.resourceRequest as request from '@sap/rm-resourceRequest/db/cds/resourceRequest';
using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db/cds/core/resource';
using com.sap.resourceManagement.workforce as worker from '@sap/rm-consultantProfile/db/cds/worker';


service AssignmentService @(requires: ['System', 'Asgt.Edit', 'RsceReq.Edit', 'MyAssignment.Edit']) {
  entity Assignments@(restrict: [
      { grant: ['CREATE','READ','UPDATE','UPSERT','DELETE','DRAFT_NEW','DRAFT_PATCH','DRAFT_CANCEL','draftEdit','draftPrepare','draftActivate'], to: ['System', 'Asgt.Edit', 'RsceReq.Edit', 'MyAssignment.Edit'] }
       ] ) as projection on assignment.Assignments;
  entity AssignmentBuckets as projection on assignment.AssignmentBuckets;

  annotate Assignments with @odata.draft.enabled;

  @(restrict : [{ grant: '*', to: 'Asgt.Edit' }])
  action SimulateAsgBasedOnTotalHours (
    resourceRequestId: String,
    resourceId: String,
    start: String,
    end: String,
    duration: String,
    mode: String,
    assignmentStatusCode: Integer ) returns Assignments;

  @(restrict : [{ grant: '*', to: 'Asgt.Edit' }])
    action SimulateAssignmentAsRequested (
      resourceRequestId: String,
      resourceId: String,
      mode: String
    ) returns Assignments;
      
}
