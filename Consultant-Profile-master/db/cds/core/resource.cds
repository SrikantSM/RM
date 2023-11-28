namespace com.sap.resourceManagement.resource;

using { cuid, managed } from '@sap/cds/common';
using com.sap.resourceManagement.employee         as employee         from './employee';
using com.sap.resourceManagement.employee.availability     as availability     from './availability';
using com.sap.resourceManagement.organization              as organization     from './organization';
using com.sap.resourceManagement.assignment                as assignment       from '@sap/rm-assignment/db/cds/assignment';
using com.sap.resourceManagement.workforce.workAssignment  as workAssignment   from '../worker/WorkAssignments';
using com.sap.resourceManagement.workforce.workforceCommon as workforceCommons from '../worker/WorkforceCommon';
using com.sap.resourceManagement.workforce.workforcePerson as workforcePerson  from '../worker/WorkforcePersons';
using com.sap.resourceManagement.system.data.timeBucket    as timeBucket       from './timeBucket';
using com.sap.resourceManagement.system.data.timeDimension as timeDimension    from './timeDimension';


type Kind : String(1);
type TypeCode : String(100);

entity Kinds {
    key code        : Kind;
        description : String(100);
};

entity Types : managed {
    key code                        : TypeCode;
        description                 : String(1024);
        kind_code                   : Kind;
        timeBucketType_code         : timeBucket.TypeCode;
        bookingGranularityInMinutes : Integer;
        kind                        : Association to one Kinds on kind.code = kind_code;
        timeBucketType              : Association to one timeBucket.Types on timeBucketType.code = timeBucketType_code;
};

entity Headers : managed {
    key ID             : cds.UUID;
        type_code      : TypeCode;
        type           : Association to one Types on type.code = type_code;
        capacity       : Association to many CapacityView on capacity.resource_id = ID;
        workAssignment : Association to one workAssignment.WorkAssignments on workAssignment.ID = ID;
};

entity Capacity : managed {
    key resource_id                    : cds.UUID;
    key startTime                      : Timestamp;
        workingTimeInMinutes           : Integer default 0;
        overTimeInMinutes              : Integer default 0;
        plannedNonWorkingTimeInMinutes : Integer default 0;
        bookedTimeInMinutes            : Integer default 0;
        endTime                        : Timestamp;
        bookingAggregate               : Association to one BookedCapacityAggregate on bookingAggregate.resourceID = resource_id and bookingAggregate.startTime = startTime;
        resource                       : Association to one Headers on resource.ID = resource_id;
};

entity CapacityBookingAggregate as select from assignment.AssignmentBucketsView {
    resource_ID,
    startTime,
    cast (SUM(IFNULL(bookedCapacityInMinutes, 0)) as Integer) as bookedCapacityInMinutes : Integer
} group by resource_ID, startTime;

entity BookedCapacityAggregate {
    key resourceID          : cds.UUID;
    key startTime           : Timestamp;
    bookedCapacityInMinutes : Integer default 0;
    softBookedCapacityInMinutes : Integer default 0;
};

entity CapacityView as select from Capacity mixin {
    timeBucketType   : Association to one timeBucket.Types on timeBucketType.code = $projection.timeBucketType_code;
    timeBucket       : Association to one timeBucket.Data on timeBucket.type_code = $projection.timeBucketType_code and timeBucket.startTime = $projection.startTime;
    timeDimension    : Association to one timeDimension.Data on timeDimension.DATETIMESTAMP = $projection.startTime;
} into {
    * ,
    cast (workingTimeInMinutes +
        overTimeInMinutes -
        plannedNonWorkingTimeInMinutes -
        bookedTimeInMinutes
        as Integer) as grossCapacityInMinutes : Integer,
    IFNULL(bookingAggregate.bookedCapacityInMinutes, 0) as bookedCapacityInMinutes : Integer,
    resource.type.timeBucketType_code,
    @odata.navigable : false
    timeBucketType,
    @odata.navigable : false
    timeBucket,
    @odata.navigable : false
    timeDimension,
    @odata.navigable : false
    bookingAggregate
};

// Consumption view for Other Domains to project Consultant Basic Details with JobDetails valid as of today
entity ResourceDetails as select from workAssignment.WorkAssignments mixin {
    granularity       : Association to Granularity on granularity.resource_ID = $projection.resource_ID;
    dailyAvailability : Association to availability.CapacityDataForAvailability on dailyAvailability.ID = $projection.resource_ID;
    toManager         : Association to employee.ManagerProfileData on toManager.externalID = $projection.managerExternalID and toManager.validFrom <= $now and toManager.validTo > $now;
} into {
        // Resource/WorkAssignment related Information
    key ID as resource_ID,
        workAssignmentID as workAssignmentID,
        externalID as workAssignmentExternalID,
        cast (currentJD.costCenter.controllingArea || currentJD.costCenter.costCenterID as String) as costCenter : String,
        cast (currentJD.costCenter.companyCode || currentJD.costCenter.costCenterID as String) as companyCodeCostCenter : String,
        currentJD.costCenter.costCenterID    as costCenterID,
        currentJD.costCenter.companyCode     as companyCode,
        currentJD.costCenter.controllingArea as controllingArea,
        currentJD.country_code,
        currentJD.country_name,
        currentJD.jobTitle as role,
        currentJD.resourceOrg.name as resourceOrg,
        currentJD.resourceOrg.ID as resourceOrgCode,
        currentJD.supervisorWorkAssignmentExternalID as managerExternalID,
        // Worker/Employee related information
        toProfileData.externalID as externalID,
        toProfileData.ID as workforcePersonID,
        toProfileData.defaultEmail.address as emailAddress,
        cast ( '+' || toProfileData.defaultPhone.number as String) as mobilePhoneNumber : String,
        toProfileData.currentProfileDetail.firstName as firstName,
        toProfileData.currentProfileDetail.lastName  as lastName,
        cast (toProfileData.currentProfileDetail.firstName || ' ' || toProfileData.currentProfileDetail.lastName as String) as fullName: String,
        cast (UPPER(SUBSTRING(toProfileData.currentProfileDetail.firstName,0,1)) || UPPER(SUBSTRING(toProfileData.currentProfileDetail.lastName,0,1)) as String) as initials: String,
        cast (currentJD.costCenter.costCenterAttributes.description || ' (' || currentJD.costCenter.costCenterID || ')' as String) as costCenterDesc: String,
        toManager,
        isContingentWorker,
        toWorkerType as workerType,
};

// Consumption view for Other Domains to project Consultant Basic Details with First JobDetails for a particular time slice
entity ResourceDetailsForTimeWindow as select from workAssignment.WorkAssignments mixin {
    granularity       : Association to Granularity on granularity.resource_ID = $projection.resource_ID;
    dailyAvailability : Association to availability.CapacityDataForAvailability on dailyAvailability.ID = $projection.resource_ID;
    toManager         : Association to employee.ManagerProfileData on toManager.externalID = $projection.managerExternalID;
} into {
        // Resource/WorkAssignment related Information
    key ID as resource_ID,
        workAssignmentID as workAssignmentID,
        externalID as workAssignmentExternalID,
        cast (firstJD.costCenter.controllingArea || firstJD.costCenter.costCenterID as String) as costCenter : String,
        cast (firstJD.costCenter.companyCode || firstJD.costCenter.costCenterID as String)     as companyCodeCostCenter : String,
        firstJD.costCenter.costCenterID    as costCenterID,
        firstJD.costCenter.companyCode     as companyCode,
        firstJD.costCenter.controllingArea as controllingArea,
        firstJD.country_code,
        firstJD.country_name,
        firstJD.jobTitle as role,
        firstJD.resourceOrg.name      as resourceOrg,
        firstJD.resourceOrg.ID as resourceOrgCode,
        firstJD.supervisorWorkAssignmentExternalID as managerExternalID,
        // Worker/Employee related information
        toProfileData.externalID,
        toProfileData.ID as workforcePersonID,
        toProfileData.defaultEmail.address as emailAddress,
        cast ( '+' || toProfileData.defaultPhone.number as String) as mobilePhoneNumber : String,
        toProfileData.currentProfileDetail.firstName as firstName,
        toProfileData.currentProfileDetail.lastName  as lastName,
        cast (toProfileData.currentProfileDetail.firstName || ' ' || toProfileData.currentProfileDetail.lastName as String) as fullName: String,
        toManager
};

entity Granularity as select from Headers {
    key ID as resource_ID,
        type.kind_code,
        type_code,
        type.timeBucketType_code,
        type.bookingGranularityInMinutes
};
