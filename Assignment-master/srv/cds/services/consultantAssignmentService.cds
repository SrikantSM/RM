using com.sap.resourceManagement.consultantAssignment as consultantAssignment from '../../../db/cds';

service ConsultantAssignmentService @(requires: 'MyAssignment.Edit') {

    entity Assignments @(restrict: [{
        grant: '*',
        to   : 'MyAssignment.Edit'
    }]) as projection on consultantAssignment.ConsultantAssignmentsView {
        ID,
        requestID,
        resourceID,
        startDate,
        endDate,
        bookedCapacity,
        //Association
        resourceDetails,
        _dailyAssignmentDistribution,
        _weeklyAssignmentDistribution
    }

    entity DailyAssignmentDistribution @(restrict: [{
        grant: '*',
        to   : 'MyAssignment.Edit'
    }]) as projection on consultantAssignment.DailyAssignmentDistribution {
        key assignmentID,
        key date,
            bookedCapacity
    }

    entity WeeklyAssignmentDistribution @(restrict: [{
        grant: '*',
        to   : 'MyAssignment.Edit'
    }]) as projection on consultantAssignment.WeeklyAssignmentDistribution {
        key assignmentID,
        key calendarWeek,
            startDate,
            bookedCapacity
    }

};
