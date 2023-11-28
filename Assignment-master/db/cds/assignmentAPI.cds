namespace com.sap.resourceManagement.assignmentAPI;

using com.sap.resourceManagement.assignment as assignment from './assignment';
using com.sap.resourceManagement.system.data.timeDimension as timeDimension from '@sap/rm-consultantProfile/db/cds/core/timeDimension';
using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db/cds/core/resource';

entity AssignmentsView               as
    select from assignment.AssignmentsAggregatedView
    mixin {
        timeDimension_startDate        : Association to one timeDimension.Data
                                             on timeDimension_startDate.DATETIMESTAMP = startTime;
        timeDimension_endDate          : Association to one timeDimension.Data
                                             on timeDimension_endDate.DATETIMESTAMP = endTime;
        _workAssignment                : Association to one WorkAssignment
                                             on _workAssignment.resourceID = resource_ID;
        _dailyAssignmentDistribution   : Association to many DailyAssignmentDistribution
                                             on _dailyAssignmentDistribution.assignmentID = assignment_ID;
        _weeklyAssignmentDistribution  : Association to many WeeklyAssignmentDistribution
                                             on _weeklyAssignmentDistribution.assignmentID = assignment_ID;
        _monthlyAssignmentDistribution : Association to many MonthlyAssignmentDistribution
                                             on _monthlyAssignmentDistribution.assignmentID = assignment_ID
    }
    into {

        key assignment_ID                    as ID,
            resourceRequest_ID               as requestID,
            resource_ID                      as resourceID,
            timeDimension_startDate.DATE_SQL as startDate,
            timeDimension_endDate.DATE_SQL   as endDate,
            cast(
                (
                    bookedCapacityInMinutes / 60
                ) as                                             Decimal(10, 2)
            )                                as bookedCapacity : Decimal(10, 2),
            case
                when
                    assignmentStatus.code = 1
                then
                    true
                else
                    false
            end                              as isSoftBooked   : Boolean,
            _workAssignment,
            _dailyAssignmentDistribution,
            _weeklyAssignmentDistribution,
            _monthlyAssignmentDistribution

    }
    where
           assignmentStatus.code = 0
        or assignmentStatus.code = 1; // 0 - Hardbooked, 1 - Softbooked

@readonly
@cds.autoexpose
entity WorkAssignment                as
    select from resource.ResourceDetails {
        key resource_ID as resourceID,
            workAssignmentID
    };


@cds.autoexpose
entity DailyAssignmentDistribution   as
    select from assignment.AssignmentBuckets
    mixin {
        timeDimension : Association to one timeDimension.Data
                            on timeDimension.DATETIMESTAMP = startTime
    }
    into {
        key ID,
            assignment.ID          as assignmentID,
            timeDimension.DATE_SQL as date,
            timeDimension.CALWEEK  as calendarWeek,
            timeDimension.CALMONTH as calendarMonth,
            timeDimension.YEAR     as calendarYear,
            @Core.Computed: false
            case
                when
                    bookedCapacityInMinutes is null
                then
                    0
                else
                    cast(
                        (
                            bookedCapacityInMinutes / 60
                        ) as                           Decimal(10, 2)
                    )
            end                    as bookedCapacity : Decimal(10, 2)

    }
    where
           assignment.assignmentStatus.code = 0
        or assignment.assignmentStatus.code = 1; // 0 - Hardbooked, 1 - Softbooked

@cds.autoexpose
entity WeeklyAssignmentDistribution  as
    select from assignment.AssignmentBuckets
    mixin {
        timeDimension : Association to one timeDimension.Data
                            on timeDimension.DATETIMESTAMP = startTime
    }
    into {
        key assignment.ID         as assignmentID,
        key timeDimension.CALWEEK as calendarWeek,
            @Core.Computed: false
            (
                (
                    SUM(bookedCapacityInMinutes)
                ) / 60
            )                     as bookedCapacity : Integer
    }
    where
           assignment.assignmentStatus.code = 0
        or assignment.assignmentStatus.code = 1 // 0 - Hardbooked, 1 - Softbooked
    group by
        assignment.ID,
        timeDimension.CALWEEK;

@cds.autoexpose
entity MonthlyAssignmentDistribution as
    select from assignment.AssignmentBuckets
    mixin {
        timeDimension : Association to one timeDimension.Data
                            on timeDimension.DATETIMESTAMP = startTime
    }
    into {
        key assignment.ID          as assignmentID,
        key timeDimension.CALMONTH as calendarMonth,
            @Core.Computed: false
            (
                (
                    SUM(bookedCapacityInMinutes)
                ) / 60
            )                      as bookedCapacity : Integer
    }
    where
           assignment.assignmentStatus.code = 0
        or assignment.assignmentStatus.code = 1 // 0 - Hardbooked, 1 - Softbooked
    group by
        assignment.ID,
        timeDimension.CALMONTH;

entity IsoWeekStartAndEnd as select from timeDimension.Data {
    key CALWEEK as calendarWeek,
        min( DATE_SQL ) as weekStartDate  : Date,
        max( DATE_SQL ) as weekEndDate    : Date
}
group by CALWEEK;

entity IsoMonthStartAndEnd as select from timeDimension.Data {
    key CALMONTH as calendarMonth,
        min( DATE_SQL ) as monthStartDate  : Date,
        max( DATE_SQL ) as monthEndDate    : Date
}
group by CALMONTH;

entity WeeklyAssignmentDistributionWithStartAndEnd  as
    select from WeeklyAssignmentDistribution
    mixin {
        isoWeekStartAndEnd : Association to one assignmentAPI.IsoWeekStartAndEnd
                                 on isoWeekStartAndEnd.calendarWeek = calendarWeek
    }
    into {
        *,
        isoWeekStartAndEnd.weekStartDate,
        isoWeekStartAndEnd.weekEndDate
    };

entity MonthlyAssignmentDistributionWithStartAndEnd as
    select from MonthlyAssignmentDistribution
    mixin {
        isoMonthStartAndEnd : Association to one assignmentAPI.IsoMonthStartAndEnd
                                  on isoMonthStartAndEnd.calendarMonth = calendarMonth
    }
    into {
        *,
        isoMonthStartAndEnd.monthStartDate,
        isoMonthStartAndEnd.monthEndDate
    };
