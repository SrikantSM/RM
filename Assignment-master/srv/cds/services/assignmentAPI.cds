using com.sap.resourceManagement.assignmentAPI as assignmentAPI from '../../../db/cds';

service Assignment @(requires: 'System') {

    entity Assignments @(restrict : [{
        grant: '*', 
        to: 'System'
    }]) as projection on assignmentAPI.AssignmentsView {
        ID,
        requestID,
        resourceID,
        startDate,
        endDate,
        bookedCapacity,
        isSoftBooked,
        //Association
        _workAssignment,
        _dailyAssignmentDistribution,
        _weeklyAssignmentDistribution,
        _monthlyAssignmentDistribution
    };

    entity DailyAssignmentDistribution @(restrict : [{
        grant: '*', 
        to: 'System'
    }]) as projection on assignmentAPI.DailyAssignmentDistribution {
        *
    }

    entity WeeklyAssignmentDistribution @(restrict : [{
        grant: '*', 
        to: 'System'
    }]) as projection on assignmentAPI.WeeklyAssignmentDistributionWithStartAndEnd {
        *
    };

    entity MonthlyAssignmentDistribution @(restrict : [{
        grant: '*', 
        to: 'System'
    }]) as projection on assignmentAPI.MonthlyAssignmentDistributionWithStartAndEnd {
        *
    };

};
