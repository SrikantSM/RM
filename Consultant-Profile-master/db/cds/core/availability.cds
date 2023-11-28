namespace com.sap.resourceManagement.employee.availability;

using { managed } from '@sap/cds/common';
using com.sap.resourceManagement.employee as employee from './employee';
using com.sap.resourceManagement.resource as resource from './resource';
using com.sap.resourceManagement.resource as workAssignment from '../worker/WorkAssignments';
using com.sap.resourceManagement.assignment as assignment from '@sap/rm-assignment/db/cds/assignment';

entity CapacityDataForAvailability as select from resource.CapacityView {
    key resource_id as ID,
    key startTime,
        resource.workAssignment.parent as workforcePersonID,
        resource.workAssignment.currentWADetails.isPrimary as isPrimary,
        endTime,
        workingTimeInMinutes,
        overTimeInMinutes,
        plannedNonWorkingTimeInMinutes,
        bookedTimeInMinutes,
        bookedCapacityInMinutes,
        grossCapacityInMinutes,
        cast ((grossCapacityInMinutes - bookedCapacityInMinutes) as Integer) as netCapacityInMinutes : Integer,
        timeDimension.DATE_SQL,
        timeDimension.YEAR,
        timeDimension.MONTH,
        timeDimension.CALMONTH,
        timeDimension.CALWEEK,
};

entity PeriodicAvailabilityCalc as select from CapacityDataForAvailability {
    ID,
    CALMONTH,
    YEAR,
    MONTH,
    cast (SUM(IFNULL(grossCapacityInMinutes, 0)) as Integer)  as sumGrossCapacityInMinutes  : Integer,
    cast (SUM(IFNULL(netCapacityInMinutes, 0)) as Integer)   as sumNetCapacityInMinutes    : Integer,
    cast (SUM(IFNULL(bookedCapacityInMinutes, 0)) as Integer) as sumBookedCapacityInMinutes : Integer,
    //Calculate in Hours
    cast (SUM(IFNULL(grossCapacityInMinutes, 0)) / 60 as Integer) as grossCapacityInHours  : Integer,
    cast (SUM(IFNULL(netCapacityInMinutes, 0)) / 60 as Integer) as netCapacityInHours    : Integer,
    cast (SUM(IFNULL(bookedCapacityInMinutes, 0)) / 60 as Integer) as bookedCapacityInHours : Integer,
    cast (NDIV0((SUM(IFNULL(bookedCapacityInMinutes, 0))),
        SUM(IFNULL(grossCapacityInMinutes, 0))) * 100
    as Integer) as utilization : Integer
} group by CALMONTH, ID, YEAR, MONTH;

entity PrimaryPeriodicAvailabilityCalc as select from CapacityDataForAvailability {
    ID,
    workforcePersonID,
    CALMONTH,
    YEAR,
    MONTH,
    cast (SUM(IFNULL(grossCapacityInMinutes, 0)) as Integer) as sumGrossCapacityInMinutes  : Integer,
    cast (SUM(IFNULL(netCapacityInMinutes, 0)) as Integer) as sumNetCapacityInMinutes    : Integer,
    cast (SUM(IFNULL(bookedCapacityInMinutes, 0)) as Integer) as sumBookedCapacityInMinutes : Integer,
    //Calculate in Hours
    cast (SUM(IFNULL(grossCapacityInMinutes, 0)) / 60 as Integer) as grossCapacityInHours  : Integer,
    cast (SUM(IFNULL(netCapacityInMinutes, 0)) / 60 as Integer) as netCapacityInHours    : Integer,
    cast (SUM(IFNULL(bookedCapacityInMinutes, 0)) / 60 as Integer) as bookedCapacityInHours : Integer,
    cast (NDIV0((SUM(IFNULL(bookedCapacityInMinutes, 0))),
        SUM(IFNULL(grossCapacityInMinutes, 0))) * 100
    as Integer) as utilization : Integer
} where isPrimary = true group by CALMONTH, ID, workforcePersonID, YEAR, MONTH;

entity MonthsOfTheYear {
    key month       : String(2);
        description : localized String;
};

entity PeriodicAvailabilityBuilder as select from PrimaryPeriodicAvailabilityCalc mixin {
    monthsOfTheYear : Association to one MonthsOfTheYear on monthsOfTheYear.month = $projection.MONTH;
} into {
    *,
    monthsOfTheYear
};

entity PeriodicAvailability as select from PeriodicAvailabilityBuilder  mixin {
    profile : Association to employee.ProfileData on profile.ID = $projection.workforcePersonID;
} into {
    key ID,
    key CALMONTH,
        workforcePersonID,
        monthsOfTheYear.description as monthYear,
        grossCapacityInHours as grossCapacity,
        netCapacityInHours as netCapacity,
        bookedCapacityInHours as bookedCapacity,
        utilization as utilizationPercentage,
        //Criticality : 1 - red, 2- yellow and 3- green
        0 as utilizationColor : Integer,
        profile
} where CALMONTH >= SUBSTRING(TO_VARCHAR(CURRENT_DATE, 'YYYYMMDD'), 0, 6) and CALMONTH <= ADD_MONTHS(CURRENT_DATE, 5);

entity YearlyUtilization as select from PrimaryPeriodicAvailabilityCalc   {
    key ID,
    key YEAR,
    cast (NDIV0((SUM(IFNULL(sumBookedCapacityInMinutes, 0)) * 100), SUM(IFNULL(sumGrossCapacityInMinutes, 0))) as Integer) as yearlyUtilization : Integer,
        workforcePersonID
} where YEAR = SUBSTRING(CURRENT_DATE, 0, 4) group by YEAR, ID, workforcePersonID;

entity Utilization as select from YearlyUtilization mixin {
    profile : Association to employee.ProfileData on profile.ID = $projection.workforcePersonID;
} into {
    *,
    0 as utilizationColor : Integer,
    profile
};

//This view has been added for chart visualization
entity PeriodicUtilization as select from PeriodicAvailabilityBuilder  mixin {
    profile : Association to employee.ProfileData on profile.ID = $projection.workforcePersonID;
    // monthsOfTheYear : Association to one MonthsOfTheYear on monthsOfTheYear.month = $projection.MONTH;
} into {
   key ID,
   MONTH,
   YEAR,
   workforcePersonID,
   key CALMONTH,
   monthsOfTheYear.description as monthYear,
   utilization as utilizationPercentage,
    profile
} where CALMONTH >= SUBSTRING(TO_VARCHAR(CURRENT_DATE, 'YYYYMMDD'), 0, 6) and CALMONTH <= ADD_MONTHS(CURRENT_DATE, 5);
