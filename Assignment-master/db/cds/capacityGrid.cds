namespace com.sap.resourceManagement.capacityGrid;

using com.sap.resourceManagement.employee.availability as availability from '@sap/rm-consultantProfile/db/cds/core/availability';
using com.sap.resourceManagement.employee as employee from '@sap/rm-consultantProfile/db/cds/core/employee';
using com.sap.resourceManagement.employee.ProfilePhoto as profilePhoto from '@sap/rm-consultantProfile/db/cds/core/employee';
using com.sap.resourceManagement.workforce.workAssignment as workAssignment from '@sap/rm-consultantProfile/db/cds/worker/WorkAssignments';
using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db/cds/core/resource';
using com.sap.resourceManagement.system.data.timeDimension as timeDimension from '@sap/rm-consultantProfile/db/cds/core/timeDimension';
using com.sap.resourceManagement.organization as organization from '@sap/rm-consultantProfile/db/cds/core/organization';
using com.sap.resourceManagement.assignment as assignment from './assignment';
using com.sap.resourceManagement.config as resourceOrg from '@sap/rm-centralServices/db';
using com.sap.resourceManagement.project as project from '@sap/rm-resourceRequest/db/';
using com.sap.resourceManagement.resourceRequest as resourceRequest from '@sap/rm-resourceRequest/db/';

entity capacityGridWeeklyUtilizationTemporalView as
    select from capacityGridWeeklyUtilizationTemporal {

        key ID,
        key timePeriod,
            case
                when ( grossCapacityInMinutes = 0 and bookedCapacityInMinutes > 0 ) then (999)
                else utilization end     as utilization      : Integer,
            validFrom,
            bookedCapacityInMinutes / 60 as bookedHours      : Integer,
            grossCapacityInMinutes / 60  as availableHours   : Integer,
            freeCapacityInMinutes / 60   as freeHours        : Integer,
            resourceOrganizationId
    };

entity capacityGridWeeklyUtilizationTemporal         as
    select from workAssignment.JobDetailsMaxEventSequence
    mixin {

        dailyutilization : Association to many availability.CapacityDataForAvailability
                               on dailyutilization.ID = JobDetailsMaxEventSequence.parent;
        resourceOrganization   : Association to one resourceOrg.ResourceOrganizationItemsView
                               on resourceOrganization.costCenterUUID = JobDetailsMaxEventSequence.costCenterExternalID;

    }
    into {
        key JobDetailsMaxEventSequence.parent as ID,
        key dailyutilization.CALWEEK as timePeriod,
            resourceOrganization.ID  as resourceOrganizationId,
            JobDetailsMaxEventSequence.validFrom as validFrom,

            SUM(
                IFNULL(
                    dailyutilization.bookedCapacityInMinutes, 0
                )
            )                  as bookedCapacityInMinutes : Integer,
            SUM(
                IFNULL(
                    dailyutilization.grossCapacityInMinutes, 0
                )
            )                  as grossCapacityInMinutes  : Integer,
           (
            ROUND(
                 (
                    NDIV0(
                    (
                        SUM(
                            IFNULL(
                                dailyutilization.bookedCapacityInMinutes, 0
                            )
                        )
                    ), SUM(
                        IFNULL(
                            dailyutilization.grossCapacityInMinutes, 0
                        )
                    )
                ) * 100
             )
           )
         )             as utilization             : Integer,
            (
                SUM(
                    IFNULL(
                        dailyutilization.grossCapacityInMinutes, 0
                    )
                ) - SUM(
                    IFNULL(
                        dailyutilization.bookedCapacityInMinutes, 0
                    )
                )
            )                  as freeCapacityInMinutes   : Integer

    }
    where
        (
                dailyutilization.DATE_SQL >= SESSION_CONTEXT(
                'VALID-FROM'
            )
            and dailyutilization.DATE_SQL <= SESSION_CONTEXT(
                'VALID-TO'
            )
        )
        and (
                JobDetailsMaxEventSequence.validFrom  <= SESSION_CONTEXT(
                'VALID-TO'
            )
            and JobDetailsMaxEventSequence.validTo  > SESSION_CONTEXT(
                'VALID-FROM'
            )

        )
    group by
        JobDetailsMaxEventSequence.parent,
        dailyutilization.CALWEEK,
        resourceOrganization.ID,
        validFrom;


entity capacityGridDailyUtilizationTemporalView as
    select from capacityGridDailyUtilizationTemporal {

        key ID,
        key timePeriod,
            validFrom,
            case
                when ( grossCapacityInMinutes = 0 and bookedCapacityInMinutes > 0 ) then (999)
                else utilization end     as utilization      : Integer,
            bookedCapacityInMinutes / 60 as bookedHours      : Integer,
            grossCapacityInMinutes / 60  as availableHours   : Integer,
            freeCapacityInMinutes / 60   as freeHours        : Integer,
            resourceOrganizationId
    };

entity capacityGridDailyUtilizationTemporal        as
    select from workAssignment.JobDetailsMaxEventSequence
    mixin {

        dailyutilization : Association to many availability.CapacityDataForAvailability
                               on dailyutilization.ID = JobDetailsMaxEventSequence.parent;
        workassignment   : Association to workAssignment.WorkAssignments
                               on workassignment.ID = JobDetailsMaxEventSequence.parent;
        resourceOrganization   : Association to one resourceOrg.ResourceOrganizationItemsView
                               on resourceOrganization.costCenterUUID = JobDetailsMaxEventSequence.costCenterExternalID;


    }
    into {
        key JobDetailsMaxEventSequence.parent as ID,
        key dailyutilization.DATE_SQL as timePeriod,
        resourceOrganization.ID as resourceOrganizationId,
        JobDetailsMaxEventSequence.validFrom as validFrom,
            SUM(
                IFNULL(
                    dailyutilization.bookedCapacityInMinutes, 0
                )
            )                  as bookedCapacityInMinutes : Integer,
            SUM(
                IFNULL(
                    dailyutilization.grossCapacityInMinutes, 0
                )
            )                  as grossCapacityInMinutes  : Integer,
        (
         ROUND(
               (
                NDIV0(
                    (
                        SUM(
                            IFNULL(
                                dailyutilization.bookedCapacityInMinutes, 0
                            )
                        )
                    ), SUM(
                        IFNULL(
                            dailyutilization.grossCapacityInMinutes, 0
                        )
                    )
                ) * 100
            )
           )
         )                as utilization             : Integer,
            (
                SUM(
                    IFNULL(
                        dailyutilization.grossCapacityInMinutes, 0
                    )
                ) - SUM(
                    IFNULL(
                        dailyutilization.bookedCapacityInMinutes, 0
                    )
                )
            )                  as freeCapacityInMinutes   : Integer

    }
    where
        (
                dailyutilization.DATE_SQL >= SESSION_CONTEXT(
                'VALID-FROM'
            )
            and dailyutilization.DATE_SQL <= SESSION_CONTEXT(
                'VALID-TO'
            )
        )
        and (
                JobDetailsMaxEventSequence.validFrom <= SESSION_CONTEXT(
                'VALID-TO'
            )
            and JobDetailsMaxEventSequence.validTo   > SESSION_CONTEXT(
                'VALID-FROM'
            )

        )
        and (
                workassignment.startDate <= SESSION_CONTEXT(
                'VALID-TO'
            )
            and workassignment.endDate   >= SESSION_CONTEXT(
                'VALID-FROM'
            )

        )
    group by
        JobDetailsMaxEventSequence.parent,
        dailyutilization.DATE_SQL,
        resourceOrganization.ID,
        validFrom;

entity averageUtilCalc                         as
    select from availability.CapacityDataForAvailability { //select from resource directly

        key ID, // Is same as WorkAssignments.ID
        NDIV0( SUM( bookedCapacityInMinutes ), 60 )  as bookedHours : Integer,
        NDIV0( SUM( grossCapacityInMinutes ), 60 ) as availableHours : Integer,
        ROUND( NDIV0( SUM( bookedCapacityInMinutes), SUM( grossCapacityInMinutes ) ) * 100 ) as avgUtilization : Integer
    }
    where
        (
                DATE_SQL >= SESSION_CONTEXT(
                'VALID-FROM'
            )
            and DATE_SQL <= SESSION_CONTEXT(
                'VALID-TO'
            )
        )
    group by
        ID;

entity profilePhotoProjection              as
    select from profilePhoto
    mixin {
        workAssignment           : Association to workAssignment.WorkAssignments
                                        on workAssignment.parent = profilePhoto.employee_ID;
    }
    into {
    key workAssignment.ID                                           as workAssignmentID,
    profilePhoto.profileThumbnail                               as profileThumbnail
    };

entity capacityGridHeaderTemporal               as
    select from workAssignment.JobDetailsMaxEventSequence
    mixin {
        workAssignment         : Association to workAssignment.WorkAssignments
                                        on workAssignment.ID = JobDetailsMaxEventSequence.parent;
        averageUtilizationCalc : Association to capacityGridHeaderKPI
                                        on averageUtilizationCalc.ID = JobDetailsMaxEventSequence.parent;
        resourceOrganization   : Association to one resourceOrg.ResourceOrganizationItemsView
                                        on resourceOrganization.costCenterUUID = JobDetailsMaxEventSequence.costCenterExternalID;           
        resourceAssignment     : Association to many assignment.AssignmentValidityView
                                        on  resourceAssignment.resource_ID =  JobDetailsMaxEventSequence.parent
                                        and resourceAssignment.startDate   <= SESSION_CONTEXT(
                                            'VALID-TO'
                                        )
                                        and resourceAssignment.endDate     >= SESSION_CONTEXT(
                                            'VALID-FROM'
                                        )
                                        and( 
                                        resourceAssignment.assignmentStatusCode = 0 
                                        or resourceAssignment.assignmentStatusCode = 1
                                        );
        managerDetails : Association to employee.ManagerProfileData
                                        on  managerDetails.externalID = JobDetailsMaxEventSequence.supervisorWorkAssignmentExternalID;
        profilePhoto : Association to profilePhotoProjection
                                        on profilePhoto.workAssignmentID = JobDetailsMaxEventSequence.parent;
    }
    into
    distinct {

        key JobDetailsMaxEventSequence.parent                                           as ID, // = WorkassignmentID
            JobDetailsMaxEventSequence.ID                                               as JobDetailsID,    
            @cds.valid.from
        key JobDetailsMaxEventSequence.validFrom,
            @cds.valid.to
            JobDetailsMaxEventSequence.validTo,

            workAssignment.startDate,
            workAssignment.endDate,
            workAssignment.toProfileData.defaultEmail.address           as emailAddress,
        
            cast(
                '+' || workAssignment.toProfileData.defaultPhone.number as                                                                          String
            )                                                           as mobileNumber                   :                                         String,
            cast(
                workAssignment.toProfileData.currentProfileDetail.firstName || ' ' || workAssignment.toProfileData.currentProfileDetail.lastName as String
            )                                                           as resourceName                   :                                         String,
            workAssignment.toProfileData.currentProfileDetail.firstName as firstName,
            workAssignment.toProfileData.currentProfileDetail.lastName  as lastName,
            workAssignment.toProfileData.ID                             as workforcePersonID,
            case 
                when ( averageUtilizationCalc.availableHours = 0 and averageUtilizationCalc.bookedHours > 0 ) then (999)
                else ROUND( NDIV0( averageUtilizationCalc.bookedHours, averageUtilizationCalc.availableHours ) * 100 ) end as avgUtilization : Integer,
            averageUtilizationCalc.bookedHours,
            averageUtilizationCalc.availableHours,
            (averageUtilizationCalc.availableHours - averageUtilizationCalc.bookedHours ) as freeHours : Integer,            
            // managerDetails.managerName                                  as managerName,
            workAssignment.parent                                       as employeeID,
            workAssignment.externalID                                   as employeeExternalID,
            workAssignment.firstJD.jobTitle                             as jobTitle,
            workAssignment.firstJD.country_name                         as country,
            workAssignment.firstJD.country_code                         as countryCode,

            resourceOrganization.name                                   as resourceOrganizationName,
            resourceOrganization.ID                                     as resourceOrganizationId,

            concat(
                IFNULL(
                    JobDetailsMaxEventSequence.costCenter.costCenterAttributes.name, ''
                ), concat(
                    ' (', concat(
                        JobDetailsMaxEventSequence.costCenter.costCenterID, ')'
                    )
                )
            ) as costCenter  :  String,
            JobDetailsMaxEventSequence.costCenter.displayName  as costCenterName,
            concat(
                IFNULL(
                    workAssignment.firstJD.costCenter.costCenterAttributes.name, ''
                ), concat(
                    ' (', concat(
                        workAssignment.firstJD.costCenter.costCenterID, ')'
                    )
                )
            )      as costCenterForDisplay : String,

            workAssignment.firstJD.resourceOrg.name                     as resourceOrganizationNameForDisplay,
            workAssignment.firstJD.resourceOrg.ID                       as resourceOrganizationIdForDisplay,
            workAssignment.toWorkerType.name                            as workerType,
            
            IFNULL(
                resourceAssignment.assignmentExists, false
            )                                                           as assignmentExistsForTheResource : Boolean,
	        case
	        when (profilePhoto.profileThumbnail is not NULL) then true
	        else false end                                              as isPhotoPresent : Boolean,
            JobDetailsMaxEventSequence.supervisorWorkAssignmentExternalID, //Needed to expose managerDetails as an association
            resourceAssignment,
            managerDetails
    }
    where
        (
                JobDetailsMaxEventSequence.validFrom <= SESSION_CONTEXT(
                'VALID-TO'
            )
            and JobDetailsMaxEventSequence.validTo   > SESSION_CONTEXT(
                'VALID-FROM'
            )
        ) and
        (
                workAssignment.startDate <= SESSION_CONTEXT(
                'VALID-TO'
            )
            and workAssignment.endDate   >= SESSION_CONTEXT(
                'VALID-FROM'
            )
        );

//******** Perf improvement changes

entity capacityGridHeaderTemporalBookedHours  as
    select from workAssignment.JobDetailsMaxEventSequence as JobDetailsMaxEventSequence
    left join resource.BookedCapacityAggregate as BookedCapacityAggregate on BookedCapacityAggregate.resourceID = JobDetailsMaxEventSequence.parent
     {

        key JobDetailsMaxEventSequence.parent                       as ID, // = WorkassignmentID
            SUM(BookedCapacityAggregate.bookedCapacityInMinutes) / 60 as bookedHours : Integer
    }
    where
        (
                JobDetailsMaxEventSequence.validFrom <= SESSION_CONTEXT(
                'VALID-TO'
            )
            and JobDetailsMaxEventSequence.validTo   > SESSION_CONTEXT(
                'VALID-FROM'
            )
            and
               BookedCapacityAggregate.startTime <= SESSION_CONTEXT(
                'VALID-TO'
            )
            and BookedCapacityAggregate.startTime >= SESSION_CONTEXT(
                'VALID-FROM'
            )
        )
    group by JobDetailsMaxEventSequence.parent;

entity capacityGridHeaderTemporalAvailableHours  as
    select from workAssignment.JobDetailsMaxEventSequence as JobDetailsMaxEventSequence
    left join resCap as ResourceCapacity on ResourceCapacity.resource_id = JobDetailsMaxEventSequence.parent
     {

        key JobDetailsMaxEventSequence.parent  as ID, // = WorkassignmentID
            JobDetailsMaxEventSequence.validFrom,
            availableHours
    }
    where
        (
                JobDetailsMaxEventSequence.validFrom <= SESSION_CONTEXT(
                'VALID-TO'
            )
            and JobDetailsMaxEventSequence.validTo   > SESSION_CONTEXT(
                'VALID-FROM'
            )
        );  

entity  capacityGridHeaderKPI as
    select from capacityGridHeaderTemporalAvailableHours as AvailableHours 
    left join capacityGridHeaderTemporalBookedHours as BookedHours on BookedHours.ID = AvailableHours.ID{
        AvailableHours.ID,
        AvailableHours.validFrom,
        IFNULL(BookedHours.bookedHours,0) as bookedHours : Integer,
        IFNULL(AvailableHours.availableHours,0) as availableHours : Integer
    };

entity resCap as select from resource.Capacity as ResourceCapacity
    {
        key resource_id,
        SUM(ResourceCapacity.workingTimeInMinutes + ResourceCapacity.overTimeInMinutes - ResourceCapacity.plannedNonWorkingTimeInMinutes - ResourceCapacity.bookedTimeInMinutes) / 60 AS availableHours : Integer
    }
    where 
    ResourceCapacity.startTime <= SESSION_CONTEXT(
                'VALID-TO'
            )
            and ResourceCapacity.startTime >= SESSION_CONTEXT(
                'VALID-FROM'
            )
    group by resource_id;    

//***************** */

entity capacityGridMonthlyUtilizationTemporalView as
    select from capacityGridMonthlyUtilizationTemporal {

        key ID,
        key timePeriod,
            case
                when ( grossCapacityInMinutes = 0 and bookedCapacityInMinutes > 0 ) then (999)
                else utilization end     as utilization      : Integer,
            validFrom,
            bookedCapacityInMinutes / 60 as bookedHours      : Integer,
            grossCapacityInMinutes / 60  as availableHours   : Integer,
            freeCapacityInMinutes / 60   as freeHours        : Integer,
            resourceOrganizationId
    };

entity capacityGridMonthlyUtilizationTemporal          as
    select from workAssignment.JobDetailsMaxEventSequence
    mixin {

        dailyutilization : Association to many availability.CapacityDataForAvailability
                               on dailyutilization.ID = JobDetailsMaxEventSequence.parent;
        resourceOrganization   : Association to one resourceOrg.ResourceOrganizationItemsView
                               on resourceOrganization.costCenterUUID = JobDetailsMaxEventSequence.costCenterExternalID;

    }
    into {
        key JobDetailsMaxEventSequence.parent as ID,
        key dailyutilization.CALMONTH as timePeriod,
            resourceOrganization.ID as resourceOrganizationId,
            JobDetailsMaxEventSequence.validFrom as validFrom,

            SUM(
                IFNULL(
                    dailyutilization.bookedCapacityInMinutes, 0
                )
            )                  as bookedCapacityInMinutes : Integer,
            SUM(
                IFNULL(
                    dailyutilization.grossCapacityInMinutes, 0
                )
            )                  as grossCapacityInMinutes  : Integer,
        (
        ROUND(
               (
                NDIV0(
                    (
                        SUM(
                            IFNULL(
                                dailyutilization.bookedCapacityInMinutes, 0
                            )
                        )
                    ), SUM(
                        IFNULL(
                            dailyutilization.grossCapacityInMinutes, 0
                        )
                    )
                ) * 100
              )
            )
        )                 as utilization             : Integer,
            (
                SUM(
                    IFNULL(
                        dailyutilization.grossCapacityInMinutes, 0
                    )
                ) - SUM(
                    IFNULL(
                        dailyutilization.bookedCapacityInMinutes, 0
                    )
                )
            )  as freeCapacityInMinutes   : Integer

    }
    where
        (
                dailyutilization.DATE_SQL >= SESSION_CONTEXT(
                'VALID-FROM'
            )
            and dailyutilization.DATE_SQL <= SESSION_CONTEXT(
                'VALID-TO'
            )
        )
        and (
                JobDetailsMaxEventSequence.validFrom <= SESSION_CONTEXT(
                'VALID-TO'
            )
            and JobDetailsMaxEventSequence.validTo   > SESSION_CONTEXT(
                'VALID-FROM'
            )

        )
    group by
        JobDetailsMaxEventSequence.parent,
        dailyutilization.CALMONTH,
        resourceOrganization.ID,
        validFrom;

    entity capacityGridHeaderKPITemporal as
        select from workAssignment.JobDetailsMaxEventSequence as jobDetails
        left join workAssignment.WorkAssignments as workAssignment on workAssignment.ID = jobDetails.parent
        left join resourceOrg.ResourceOrganizationItemsView as resourceOrganization on resourceOrganization.costCenterUUID = jobDetails.costCenterExternalID
        left join organization.HeadersWithDetails as deliveryOrg on  deliveryOrg.costCenterUUID = jobDetails.costCenterExternalID
                                                    and deliveryOrg.isDelivery     = 'X'
        left join capacityGridHeaderKPI as headerKPI on jobDetails.parent = headerKPI.ID {      
        key jobDetails.parent as ID,
            0 as freeResourcesCount        : Integer,
            0 as resourceCount             : Integer,
            0 as totalAvgUtilPercentage    : Integer,
            0 as overstaffedResourcesCount : Integer,
            jobDetails.validFrom,
            resourceOrganization.ID as resourceOrganizationId,
            deliveryOrg.code as deliveryOrgCode,
            bookedHours,
            availableHours
    }     
        where (
                jobDetails.validFrom <= SESSION_CONTEXT(
                'VALID-TO'
            )
            and jobDetails.validTo   > SESSION_CONTEXT(
                'VALID-FROM'
            )
        ) and
        (
                workAssignment.startDate <= SESSION_CONTEXT(
                'VALID-TO'
            )
            and workAssignment.endDate   >= SESSION_CONTEXT(
                'VALID-FROM'
            )
        );

    entity ResourceOrganizations as
        select from resourceOrg.ResourceOrganizations distinct {
            displayId as resourceOrganizationDisplayId,
            name as resourceOrganizationName,
            description as resourceOrganizationDescription,
            items.costCenterId };

    entity ResourceOrganizationItems as
        select from resourceOrg.ResourceOrganizationItems {
        key costCenterId,
            costCenter.costCenterAttributes.description as costCenterDescription,
            resourceOrganization.displayId as resourceOrganizationDisplayId,
            resourceOrganization.name as resourceOrganizationName };

    entity WorkerTypes as
        select from workAssignment.WorkerType distinct {
            name as workerTypeName,
            descr as workerTypeDescription };

    entity RequestsGridVH as select from resourceRequest.ResourceRequestDetails {
        Id,
        displayId,
        name,
        startDate,
        endDate,
        projectName,
        projectRoleName,
        projectId,
        processingResourceOrg.name as processingResourceOrganizationName,
        processingResourceOrg.ID as processingResourceOrganizationId,
        customerId,
        customerName,
        requestedCapacityInMinutes / 60 as requestedCapacityInHours: Integer,
        requestStatus.code as requestStatusCode//So that the UI can filter for resolved requests on assignment creation 
    } where (
                    startDate <= SESSION_CONTEXT(
                    'VALID-TO'
                )
                and endDate   >= SESSION_CONTEXT(
                    'VALID-FROM'
                )
            ) and releaseStatus.code = 1; //Only published requests