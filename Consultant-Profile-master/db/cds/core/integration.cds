namespace com.sap.resourceManagement.consultantProfile.integration;

using { cuid, managed, sap.common.CodeList } from '@sap/cds/common';
using com.sap.resourceManagement.employee as employee from './employee';
using com.sap.resourceManagement.resource as resource from './resource';
using com.sap.resourceManagement.organization as organization from './organization';
using com.sap.resourceManagement.employee.availability as availability from './availability';
using com.sap.resourceManagement.system.data.timeDimension as timeDimension    from './timeDimension';
using com.sap.resourceManagement.config as resourceOrg from '@sap/rm-centralServices/db/resource-organization.cds';
using com.sap.resourceManagement.workforce.workAssignment as workAssignment  from '../worker/WorkAssignments';

entity OneMDSDeltaTokenInfo : managed {
    key entityName             : String(75);
        deltaToken             : String;
        isInitialLoadCandidate : Boolean default false;
        performInitialLoad     : Boolean default false;
}

entity ExistingCustomerInfo {
    key isExistingCustomer     : Boolean default false;
}

entity MDIObjectReplicationStatus: cuid {
    key entityName : String(50);
        excludeStatus: Boolean;
}

entity ReplicationFailureStatus {
    key code        : Integer enum {
            open       = 0;
            inProgress = 1;
            closed     = 2;
        } default 0;
        description : localized String;
}

entity ReplicationErrorMessages {
    key code         : String(12); // RM_CP_004
        errorMessage : localized String(255); // Record doesn't have mandatory {0} value in {1}.
        description  : localized String(255);
}

entity ReplicationFailures : managed {
    key versionId                : cds.UUID;
    key instanceId               : cds.UUID;
        externalId               : String(100); // Represents WorkforcePersonId/S4CostCenterId for which the replication has failed.
        event                    : String(20) not null;
        replicationType          : String(50) not null;
        replicationErrorMessage  : Association to ReplicationErrorMessages;
        errorParam1              : String(100);
        errorParam2              : String(100);
        errorParam3              : String(100);
        errorParam4              : String(100);
        replicationFailureStatus : Association to one ReplicationFailureStatus;
}

entity CapacityCleanupFailures : managed {
    key versionId                           : cds.UUID;
    key instanceId                          : cds.UUID;
        capacityCleanupErrorMessage         : Association to ReplicationErrorMessages;
        capacityCleanupStatus               : Association to one ReplicationFailureStatus;
}

entity AvailabilitySummaryStatus : CodeList {
    key code : Integer;
}

entity AvailabilityReplicationSummary {
    key resourceId                     : cds.UUID;
        workAssignmentId               : String(100);
        workForcePersonExternalId      : String(100);
        costCenterId                   : cds.UUID;
        workAssignmentStartDate        : String(20);
        workAssignmentEndDate          : String(20);
        workAssignmentExternalId       : String(100);
        noOfRecordsProcessed           : Integer;
        noOfRecordsFailed              : Integer;
        noOfRecordsPassed              : Integer;
        availabilitySummaryStatus_code : Integer default 0;
        availabilitySummaryStatus      : Association to one AvailabilitySummaryStatus
                                            on availabilitySummaryStatus.code = availabilitySummaryStatus_code;
        availabilityReplicationError   : Association to many AvailabilityReplicationError
                                            on availabilityReplicationError.resourceId = resourceId;
        toProfileData                  : Association to one employee.ProfileDataBuilder
                                            on toProfileData.externalID = $self.workForcePersonExternalId;
}

@cds.autoexpose
entity AvailabilityErrorMessages {
    key code         : String(20);
        errorMessage : localized String(255);
}

entity AvailabilityReplicationError : managed {
    key resourceId               : cds.UUID;
    Key startDate                : String(20);
        s4costCenterId           : String(10);
        workAssignmentExternalId : String(100);
        error_desc               : localized String(255);
        availabilityErrorMessage : Association to AvailabilityErrorMessages;
        errorParam1              : String(100);
        errorParam2              : String(100);
        errorParam3              : String(100);
        errorParam4              : String(100);
        csvRecordIndex           : String(100);
        invalidKeys              : String(10);
}

entity AvailabilityReplicationStatus {
    key resourceId                : cds.UUID;
    key startDate                 : String(20);
        workForcePersonExternalId : String(100);
        status                    : localized String(10);
}

@cds.persistence.exists
entity ReplicationSchedule {
    key jobID                     : String(10);
    key jobName                   : String(50);
    key scheduleID                : cds.UUID;
        replicationObject         : String(50);
        description               : String(200);
        pattern                   : String(100);
        patternValue              : Integer;
        nextRun                   : DateTime;
        isActive                  : Boolean;
        isInactive                : Boolean;
        isRecurring               : Boolean;
        isOneTime                 : Boolean;
        scheduleStatusCriticality : Integer;
        scheduleStatusLabel       : String(10);
        actionCall                : String(10);
}

view AvailabilityOverallUploadStatusYearCal as select from AvailabilityReplicationSummary{
    key resourceId,
        workAssignmentStartDate,
        workAssignmentEndDate,
        cast (SUBSTRING(workAssignmentStartDate, 0, 4) as String) as workAssignmentStartYear : String(4),
        cast (SUBSTRING(workAssignmentEndDate, 0, 4) as String) as workAssignmentEndYear : String(4),
        cast (SUBSTRING(CURRENT_DATE, 0, 4) as String) as currentYear : String(4),
        cast (SUBSTRING(CURRENT_DATE, 0, 4) - 1 as String) as previousYear : String(4),
        cast (SUBSTRING(CURRENT_DATE, 0, 4) + 1 as String) as nextYear : String(4),
};

view AvailabilityOverallUploadStatusDateCal as select from AvailabilityOverallUploadStatusYearCal {
    key resourceId,
        workAssignmentStartDate,
        workAssignmentEndDate,
        //Min date calculation currentyear -1
        cast (
            case
                when (workAssignmentStartYear > previousYear or workAssignmentEndYear < previousYear)
                    then (workAssignmentStartDate)
                else (previousYear || '-' || '01' || '-' || '01')
            end 
            as String(20)) as minDate : String(20),
        // Max date calculation currentyear +1
        cast (
            case
                when (workAssignmentEndYear < nextYear)
                    then (workAssignmentEndDate)
                else (nextYear || '-' || '12' || '-' || '31')
            end 
            as String(20)) as maxDate : String(20),
};

view AvailabilityPeriodicCountView as select from resource.Capacity mixin{
    availabilityOverallUploadStatusDate: Association to many AvailabilityOverallUploadStatusDateCal on availabilityOverallUploadStatusDate.resourceId = resource_id;
    timeDimension    : Association to one timeDimension.Data on timeDimension.DATETIMESTAMP = $projection.startTime;
    monthsOfTheYear : Association to one availability.MonthsOfTheYear on monthsOfTheYear.month = $projection.MONTH;
    } into {
        key resource_id as resourceId,
        key startTime,
            timeDimension.YEAR as YEAR,
            timeDimension.MONTH as MONTH,
            timeDimension.CALMONTH as CALMONTH,
            monthsOfTheYear.description as monthYear,
            //to aggregate for the chart
            1 as dayCount: Integer
    } WHERE startTime >= availabilityOverallUploadStatusDate.minDate and
        startTime <= availabilityOverallUploadStatusDate.maxDate;

view AvailabilityErrorMessagesView as select from AvailabilityReplicationError {
    *,
    localized,
    availabilityErrorMessage.errorMessage as errorMessage
};

// This view is created to determine the workAssignment's costCenter in Maintain Availability app
// via JobDetails. This view will return the current and previous JobDetails, sorted by validTo date
// For example - WA1 has two JobDetails JD1 - validFrom 2020-01-01 validTo: 2023-01-31 costCenter: CC1
// and                                  JD2 - validFrom 2023-02-01 validTo: 9999-12-31 costCenter: CC2
// Outcome will be JD2 - validFrom 2023-02-01 validTo: 9999-12-31 costCenter: CC2 jobdetailnumber: 1
// and             JD1 - validFrom 2020-01-01 validTo: 2023-01-31 costCenter: CC1 jobdetailnumber: 2
entity JobDetailMaxSeqForWorkAssignment as select from workAssignment.JobDetailsMaxEventSequence {
    *,
    ROW_NUMBER() OVER (PARTITION BY parent ORDER BY validTo DESC) as jobdetailnumber
} where validFrom <= $now;


view AvailabilityReplicationView as select from AvailabilityReplicationSummary mixin {
    availabilityReplicationError   : Association to many AvailabilityErrorMessagesView on availabilityReplicationError.resourceId = resourceId;
    availabilityOverallUploadChart : Association to many AvailabilityPeriodicCountView on availabilityOverallUploadChart.resourceId = resourceId;
    toWorkerType                   : Association to one workAssignment.WorkerType on toWorkerType.isContingentWorker =  $projection.isContingentWorker;
    toJobDetailMaxSequence      : Association to one JobDetailMaxSeqForWorkAssignment on toJobDetailMaxSequence.parent = $projection.resourceId 
                                        and toJobDetailMaxSequence.jobdetailnumber = 1;
} into {
    key resourceId,
        workAssignmentExternalId,
        cast (toProfileData.currentProfileDetail.firstName || ' ' || toProfileData.currentProfileDetail.lastName as String) as name: String,
        toProfileData.currentProfileDetail.firstName as firstName,
        toProfileData.currentProfileDetail.lastName  as lastName,
        toProfileData.isBusinessPurposeCompleted,
        workAssignmentStartDate,
        workAssignmentEndDate,
        workForcePersonExternalId,
        availabilitySummaryStatus_code,
        availabilitySummaryStatus,
        availabilityReplicationError as availabilityUploadErrors,
        availabilityOverallUploadChart as availabilityPeriodicCount,
        // Added below attributes to calculate value at runtime to improve performance
        null as minDate: String(20),
        null as maxLimitDate: String(20),
        0 as availableDays: Integer,
        0 as requiredDays: Integer,
        0 as uploadDataPercentage : Decimal(10, 1),
        toProfileData.currentWorkAssignment.isContingentWorker as isContingentWorker,
        toWorkerType.name as workerTypeName,
        toJobDetailMaxSequence.costCenterExternalID as costCenterId,
        toJobDetailMaxSequence.costCenter.costCenterID as s4CostCenterId,
        toJobDetailMaxSequence.resourceOrg.ID as resourceOrgId,
        toJobDetailMaxSequence.resourceOrg.name as resourceOrg,
        cast ( toJobDetailMaxSequence.costCenter.costCenterAttributes.description || ' (' || toJobDetailMaxSequence.costCenter.costCenterID || ')' as String) as costCenterDisplay: String,

};

// Below view will be used for download template feature in availability app 
view AvailabilityDownloadView as select from AvailabilityReplicationSummary {
    key resourceId,
        workAssignmentExternalId,
        toProfileData.currentProfileDetail.firstName as firstName,
        toProfileData.currentProfileDetail.lastName  as lastName,
        toProfileData.isBusinessPurposeCompleted,
        toProfileData.currentWorkAssignment.currentJD.resourceOrg.name as resourceOrg,
        toProfileData.currentWorkAssignment.currentJD.costCenter.costCenterID  as s4CostCenterId,
        toProfileData.currentWorkAssignment.currentJD.costCenter.ID as costCenterId,
        workAssignmentStartDate,
        workAssignmentEndDate,
        workForcePersonExternalId
};

view AvailabilityCostCenter as select distinct key s4CostCenterId from  AvailabilityReplicationView where s4CostCenterId is not null;

view AvailabilityWorkForcePersonID as select distinct key workForcePersonExternalId,
isBusinessPurposeCompleted from  AvailabilityReplicationView where workForcePersonExternalId is not null;

view AvailabilityResourceOrg as select distinct key resourceOrgId, resourceOrg from AvailabilityReplicationView where resourceOrgId is not null;

view CostCenterMasterList as select distinct key costCenterID, 
costCenterAttributes.description as description from organization.CostCenters;

view AvailabilityCostCenterDisplay as select distinct key costCenterDisplay from  AvailabilityReplicationView where costCenterDisplay is not null;
