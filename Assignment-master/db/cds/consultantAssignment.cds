namespace com.sap.resourceManagement.consultantAssignment;

using com.sap.resourceManagement.assignment as assignment from './assignment';
using com.sap.resourceManagement.system.data.timeDimension as timeDimension from '@sap/rm-consultantProfile/db/cds/core/timeDimension';
using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db/cds/core/resource';

entity ConsultantAssignmentsView        as
    select from assignment.AssignmentsAggregatedView
    mixin {
        timeDimension_startDate : Association to one timeDimension.Data
                                      on timeDimension_startDate.DATETIMESTAMP = startTime;
        timeDimension_endDate   : Association to one timeDimension.Data
                                      on timeDimension_endDate.DATETIMESTAMP = endTime;
        resourceDetails         : Association to one resource.ResourceDetails
                                    on resourceDetails.resource_ID = resource_ID;
        _dailyAssignmentDistribution : Association to many DailyAssignmentDistribution 
                                      on _dailyAssignmentDistribution.assignmentID = assignment_ID;
        _weeklyAssignmentDistribution : Association to many WeeklyAssignmentDistribution 
                                      on _weeklyAssignmentDistribution.assignmentID = assignment_ID
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
            resourceDetails,
            _dailyAssignmentDistribution,
            _weeklyAssignmentDistribution

    }
    where assignmentStatus.code = 0 or assignmentStatus.code = 1; // 0 - Hardbooked, 1 - Softbooked

@cds.autoexpose
entity DailyAssignmentDistribution as
    select from assignment.AssignmentBuckets
    mixin {
        timeDimension : Association to one timeDimension.Data
                            on timeDimension.DATETIMESTAMP = startTime
    }
    into {
        key ID,
            assignment.ID          as assignmentID,
            timeDimension.DATE_SQL as date,
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
                        ) as                                    Decimal(10, 2)
                    )
            end                    as bookedCapacity          : Decimal(10, 2)

    }
    where assignment.assignmentStatus.code = 0 or assignment.assignmentStatus.code = 1;  // 0 - Hardbooked, 1 - Softbooked


@cds.autoexpose
entity WeeklyAssignmentDistribution as
    select from assignment.AssignmentBuckets
    mixin {
        timeDimension : Association to one timeDimension.Data
                            on timeDimension.DATETIMESTAMP = startTime
    }
    into {
        key assignment.ID          as assignmentID,
        key timeDimension.CALWEEK  as calendarWeek,
       
        @Core.Computed: false
        min(timeDimension.DATE_SQL) as startDate : Date,
        @Core.Computed: false
        ((SUM(bookedCapacityInMinutes)) / 60) as bookedCapacity : Integer
    }
    where assignment.assignmentStatus.code = 0 or assignment.assignmentStatus.code = 1  // 0 - Hardbooked, 1 - Softbooked
    group by assignment.ID, timeDimension.CALWEEK;

