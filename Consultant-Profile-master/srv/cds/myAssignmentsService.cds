using com.sap.resourceManagement as rm from '../../db';
using sap.common as common from '@sap/cds/common';

using com.sap.resourceManagement.resourceRequest as request from '@sap/rm-resourceRequest/db/cds/resourceRequest';
using com.sap.resourceManagement.assignment as assignment from '@sap/rm-assignment/db/cds/assignment';
using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db/cds/core/resource';

service MyAssignmentsService @(requires : 'authenticated-user'){

    type WeeklyAssignmentData {
        assignmentID: String;
        calendarWeek: String;
        startDate: Date;
        bookedCapacity: Integer;
    }

    type WeeklyAssignments {
        ID: String;
        requestID: String;
        resourceID: String;
        startDate: Date;
        endDate: Date;
        bookedCapacity: Double;
        _weeklyAssignmentDistribution: array of WeeklyAssignmentData;
    }

    type WeeklyAssignmentsPayload {
       assignmentId: String;
       _weeklyAssignmentDistribution: array of WeeklyAssignmentRequest;
    }

    type WeeklyAssignmentRequest {
        calendarWeek: String;
        bookedCapacity: Integer;
    }

    type PrepareAssignmentRequestPayload {
       _weeklyAssignmentDistribution: array of WeeklyAssignmentRequest;
    }

    type Result {
        ID: String;
        requestID: String;
        resourceID: String;
        startDate: Date;
        endDate: Date;
        bookedCapacity: Double;
    }

    function checkEditEnabled() returns Boolean;

    function getWeeklyAssignments(resourceId: String, assignmentId: String) returns array of WeeklyAssignments;

    action postWeeklyAssignments(requestPayload: WeeklyAssignmentsPayload) returns Result;

    @readOnly
    entity AssignmentDetails @(restrict : [
        {
            grant : ['READ'],
            to    : ['ProjExp.Read', 'MyAssignment.Edit'],
            where : 'LOWER(resource.workAssignment.toProfileData.defaultEmail.address) = $user and resource.workAssignment.toProfileData.ID = employee_ID'
        }
    ]) as projection on assignment.ResourceAssignmentPerDayView;

        @readOnly
    entity ResourceDetails @(restrict : [
        {
            grant : ['READ'],
            to    : ['ProjExp.Read', 'MyAssignment.Edit'],
            where : 'LOWER(toProfile.emailAddress) = $user and toProfile.ID = employee_ID'
        }
    ]) as projection on rm.employee.myAssignments.ResourceCapacityBuilder;

    entity AssignmentRequestDetails @(restrict : [
        {
            grant : ['READ'],
            to    : ['ProjExp.Read', 'MyAssignment.Edit'],
            where : 'LOWER(toProfile.emailAddress) = $user and toProfile.ID = employee_ID'
        }
    ]) as projection on rm.employee.myAssignments.AssignmentRequestDetails;

}