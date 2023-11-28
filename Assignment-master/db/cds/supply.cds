namespace com.sap.resourceManagement.supply;

using com.sap.resourceManagement.assignment as assignment from './assignment';
using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db/cds/core/resource';
using com.sap.resourceManagement.system.data.timeDimension as timeDimension from '@sap/rm-consultantProfile/db/cds/core/timeDimension';

entity ResourceSupply {
    assignment        : Association to assignment.Assignments;
    resourceSupply_ID : String(24);
};

entity ResourceSupplyView as select from ResourceSupply {
    key assignment.ID,
        assignment.resource.ID        as resource_ID,
        assignment.resourceRequest.ID as resourceRequest_ID,
        resourceSupply_ID,
        assignment
};

// All S4 relevant details for a resource supply
entity ResourceSupplyDetails as select from ResourceSupplyView {
    key assignment.ID                                                       as assignment_ID,
        resource_ID,
        resourceSupply_ID                                                   as resourceSupply,
        assignment.resourceRequest.demand.externalID                        as resourceDemand,
        assignment.resourceRequest.workpackage.ID                           as workPackage,
        assignment.resource.workAssignment.workAssignmentID                 as workforcePersonUserID
};

entity AssignmentBucketsYearMonth as select from assignment.AssignmentBucketsView mixin {
    timeDimension_Date : Association to one timeDimension.Data on timeDimension_Date.DATETIMESTAMP = startTime;
} into {
    assignment_ID,
    timeDimension_Date.CALMONTH as yearMonth,
    startTime,
    bookedCapacityInMinutes
};

// View to be used for comparing the incoming supply distribution during replication
entity AssignmentBucketsYearMonthAggregate as select from AssignmentBucketsYearMonth {
    key assignment_ID,
    key yearMonth,
    ((SUM(bookedCapacityInMinutes)) / 60) as bookedCapacityInHours : Integer
}
group by assignment_ID, yearMonth
order by assignment_ID, yearMonth asc;