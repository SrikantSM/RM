namespace com.sap.resourceManagement.employee.myAssignments;

using {managed} from '@sap/cds/common';
using com.sap.resourceManagement.employee as employee from './employee';
using com.sap.resourceManagement.resource as resource from './resource';
using com.sap.resourceManagement.assignment as assignment from '@sap/rm-assignment/db/cds/assignment';
//using com.sap.resourceManagement.resourceRequest as request from '@sap/rm-resourceRequest/db/cds/resourceRequest';


entity ResourceCapacityBuilder as select from resource.CapacityView mixin {
    toProfile  : Association to employee.ProfileData on toProfile.ID = $projection.employee_ID;
} into {    
    key resource_id,
    key startTime,
        resource.workAssignment.parent as employee_ID,
        cast (IFNULL(grossCapacityInMinutes, 0)/ 60 as Integer)  as dayCapacity  : Integer,
        timeDimension.DATE_SQL as capacityDate,
        toProfile
} where resource.workAssignment.currentWADetails.isPrimary = true;

entity AssignmentRequestDetails as select from assignment.AssignmentRequestDetailsView mixin {
    toProfile  : Association to employee.ProfileData on toProfile.ID = $projection.employee_ID;
} into {
    key assignment_ID,
        startDate,
        endDate,
        employee_ID,
        resourceRequest_ID,
        ResourceRequest.displayId as requestDisplayId,
        ResourceRequest.name as requestName,
        ResourceRequest.projectName as projectName,
        ResourceRequest.customerName as customerName,
        ResourceRequest.workPackageStartDate as workPackageStartDate,
        ResourceRequest.workPackageEndDate as workPackageEndDate,
        assignmentStatus.code as assignmentStatusCode,
        assignmentStatus.name as assignmentStatus,
        toProfile,
        ResourceRequest.startDate as requestedStartDate,
        ResourceRequest.endDate as requestedEndDate,
        ResourceRequest.workItemName as workItemName,
        assignedCapacityinHour
} where assignmentStatus.code = 0 or assignmentStatus.code = 1; // 0 - Hardbooked, 1 - Softbooked;
         

