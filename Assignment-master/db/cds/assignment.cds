namespace com.sap.resourceManagement.assignment;

using com.sap.resourceManagement.resourceRequest as request from '@sap/rm-resourceRequest/db/cds/resourceRequest';
using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db/cds/core/resource';
using com.sap.resourceManagement.system.data.timeDimension as timeDimension from '@sap/rm-consultantProfile/db/cds/core/timeDimension';
using {managed, sap.common.CodeList} from '@sap/cds/common';


@cds.autoexpose
@Common.ValueList
entity AssignmentStatus {
    key code : Integer enum {
      Hardbooked = 0;
      Softbooked = 1;
      Proposed   = 2;
      Accepted   = 3;
      Rejected   = 4;
    } default 0;
    name : localized String;
}


@assert.unique.requestresourcecombination: [resourceRequest,resource]
entity Assignments : managed {

  key ID                      : cds.UUID;
      bookedCapacityInMinutes : Integer;
      assignmentStatus        : Association to AssignmentStatus;
      assignmentBuckets       : Composition of many AssignmentBuckets
                                  on assignmentBuckets.assignment = $self;
      resourceRequest         : Association to request.ResourceRequests;
      resource                : Association to resource.Headers;

};

@assert.unique.assignmentStartTime: [startTime, assignment] //Should not be able to create/update buckets at an existing time
entity AssignmentBuckets : managed {

  key ID                      : cds.UUID;
      startTime               : Timestamp;
      bookedCapacityInMinutes : Integer;
      assignment              : Association to Assignments;
      capacityRequirement     : Association to request.CapacityRequirements;

};

// Aggregated Assignment Data
entity AssignmentsAggregatedView            as
  select from Assignments {

    key ID                 as assignment_ID,
        resource.ID        as resource_ID,
        resourceRequest.ID as resourceRequest_ID,
        assignmentStatus,
        min(
          assignmentBuckets.startTime
        )                  as startTime               : Timestamp,
        max(
          assignmentBuckets.startTime
        )                  as endTime                 : Timestamp,
        sum(
          assignmentBuckets.bookedCapacityInMinutes
        )                  as bookedCapacityInMinutes : Integer
  }
  group by
    ID,
    resource.ID,
    resourceRequest.ID,
    assignmentStatus;

@readonly
entity AssignmentsView                      as
  select from AssignmentsAggregatedView
  mixin {

    ResourceDetails         : Association to one resource.ResourceDetails
                                on ResourceDetails.resource_ID = resource_ID;
    ResourceRequest         : Association to one request.ResourceRequestDetails
                                on ResourceRequest.Id = resourceRequest_ID;
    timeDimension_startDate : Association to one timeDimension.Data
                                on timeDimension_startDate.DATETIMESTAMP = startTime;
    timeDimension_endDate   : Association to one timeDimension.Data
                                on timeDimension_endDate.DATETIMESTAMP = endTime; 
  }
  into {

    key assignment_ID,
        resource_ID,
        resourceRequest_ID,
        startTime,
        endTime,
        timeDimension_startDate.DATE_SQL as startDate,
        timeDimension_endDate.DATE_SQL   as endDate,
        bookedCapacityInMinutes,
        ResourceRequest.requestedUnit    as bookedCapacityUnit,
        cast ( (
          bookedCapacityInMinutes / 60
        ) as Decimal(10, 2) )  as bookedCapacity           : Decimal(10, 2), // For Now, we assume it is in Hours, therefore according to central concept dividing by 60
        (
          bookedCapacityInMinutes / 60
        )                                as bookedCapacityInHours    : Integer,
        case
          when
            ResourceRequest.requestStatus.code = 1
          then
            true // Request Closed -> assignment NOT deletable
          else
            false // Open -> assignment is deletable
        end                              as isAssignmentNotDeletable : Boolean,

        // Associations
        ResourceRequest,
        ResourceDetails,
        assignmentStatus
  };

// Have to create a copy to get around the cyclic dependency issue while enabling navigation for automatic refresh
// Here the join with ResourceRequests table is necessary otherwise the automatic page refresh of the FE request object
// page breaks! DO NOT use this view for anything else, use AssignmentsView instead
@readonly
entity AssignmentsDetailsView               as
  select from AssignmentsAggregatedView
  mixin {
    ResourceDetails         : Association to one resource.ResourceDetails
                                on ResourceDetails.resource_ID = resource_ID;
    resourceRequest         : Association to one request.ResourceRequests
                                on resourceRequest.ID = resourceRequest_ID;
    timeDimension_startDate : Association to one timeDimension.Data
                                on timeDimension_startDate.DATETIMESTAMP = startTime;
    timeDimension_endDate   : Association to one timeDimension.Data
                                on timeDimension_endDate.DATETIMESTAMP = endTime;                           
  }
  into {
    key assignment_ID,
        resource_ID,
        resourceRequest_ID,
        startTime,
        endTime,
        timeDimension_startDate.DATE_SQL as startDate,
        timeDimension_endDate.DATE_SQL   as endDate,
        bookedCapacityInMinutes,
        resourceRequest.requestedUnit    as bookedCapacityUnit,
        cast ((
          bookedCapacityInMinutes / 60
        )      as Decimal(10, 2) )       as bookedCapacity           : Decimal(10, 2), // For Now, we assume it is in Hours, therefore according to central concept dividing by 6
        (
          bookedCapacityInMinutes / 60
        )                                as bookedCapacityInHours    : Integer,
        case
          when
            resourceRequest.requestStatus.code = 1
          then
            true // Request Closed -> assignment NOT deletable
          else
            false // Open -> assignment is deletable
        end                              as isAssignmentNotDeletable : Boolean,

        // Associations
        resourceRequest,
        ResourceDetails,
        assignmentStatus
  };

// Assignment data on a given time for a resource against a request
entity AssignmentBucketsView                as
  select from Assignments {

    key assignmentBuckets.ID as ID,
        ID                   as assignment_ID,
        resource.ID          as resource_ID,
        resourceRequest.ID   as resourceRequest_ID,
        assignmentStatus,
        assignmentBuckets.startTime,
        assignmentBuckets.bookedCapacityInMinutes
  };

//Assignment info with validity period (which is equal to the validity of the request)
@readonly
entity AssignmentValidityView               as
  select from Assignments {
    key ID                                                      as assignment_ID,
        resourceRequest.ID                                      as resourceRequest_ID,
        resource.ID                                             as resource_ID,
        resource.workAssignment.firstJD.costCenter.costCenterID as costCenterID,
        resource.workAssignment.firstJD.resourceOrg.ID          as resourceOrgCode,
        resourceRequest.startDate                               as startDate,
        resourceRequest.endDate                                 as endDate,
        true                                                    as assignmentExists : Boolean,
        assignmentStatus.code                                   as assignmentStatusCode,
        resourceRequest.displayId,
        resourceRequest.project,
        resourceRequest.projectRole,
        resourceRequest.referenceObject.displayId               as referenceObjectId,
        resourceRequest.referenceObject.name                    as referenceObjectName,
        resourceRequest.referenceObjectType.name                as referenceObjectTypeName,
        resourceRequest.referenceObjectType.code                as referenceObjectTypeCode,
        resourceRequest.project.customer
  };

// used by ProjectTeamMemberGdprService (PDM related) for project role/name/serviceOrg and wp name
@readonly
entity ResourceAssignmentDetailsView        as
  select from AssignmentsView
  mixin {
    resource : Association to one resource.Headers
                 on resource.ID = resource_ID;
  }
  into {
    key assignment_ID,
        resource_ID,
        startDate,
        endDate,
        bookedCapacity                              as assignedCapacity,
        ResourceRequest.projectName,
        ResourceRequest.workPackageName,
        ResourceRequest.projectRoleName             as rolePlayed,
        ResourceRequest.serviceOrganization         as companyName,
        ResourceRequest.displayId                   as requestDisplayId,
        ResourceRequest.name                        as requestName,

        resource.workAssignment.parent              as employee_ID
  };

// used by InternalWorkExperience for Project role/name/serviceOrg
@readonly
entity AssignmentRequestDetailsView         as
  select from AssignmentsView
  mixin {
    resource          : Association to one resource.Headers
                          on resource.ID = resource_ID;
    SkillRequirements : Association to many request.SkillRequirementsView
                          on SkillRequirements.resourceRequestId = resourceRequest_ID;
  }
  into {
    key assignment_ID,
        resource_ID,
        resourceRequest_ID,
        assignmentStatus,
        startDate,
        endDate,
        bookedCapacity                              as assignedCapacityinHour,
        bookedCapacityInMinutes                     as assignedCapacity,
        resource.workAssignment.parent              as employee_ID,

        ResourceRequest.projectName,
        ResourceRequest.customerName,
        ResourceRequest.workPackageName,
        ResourceRequest.projectRoleName             as rolePlayed,
        ResourceRequest.serviceOrganization         as companyName,

        // Associations
        ResourceRequest,
        SkillRequirements
  };

// used by DRM for Project start/end/Id
@readOnly
entity ResourceAssignmentProjectDetailsView as
  select from Assignments {
    key ID,
        resource.workAssignment.parent    as employee_ID,
        resourceRequest.project.ID        as project_ID,
        resourceRequest.project.startDate as projectStartDate,
        resourceRequest.project.endDate   as projectEndDate
        
  };

// used by DRM for request start/end
@readOnly
entity ResourceRequestDetailsForAssignment as
  select from Assignments {
    key ID,
        resource.workAssignment.parent    as employee_ID,

        resourceRequest.startDate         as requestStartDate,
        resourceRequest.endDate           as requestEndDate
  };

// exposes association to ResourceRequestDetails used by ProjectDetails in myAssignments app  
@readonly
// Assignment data on a given day for a resource against a request
entity ResourceAssignmentPerDayView as select from AssignmentBucketsView mixin
{
  resource: Association to one resource.Headers on resource.ID = resource_ID;
  toResourceRequest : Association to one request.ResourceRequestDetails on toResourceRequest.Id = resourceRequest_ID;
  timeDimension_startDate : Association to one timeDimension.Data on timeDimension_startDate.DATETIMESTAMP = startTime;
}
into
{

  key ID,
  assignment_ID,
  resource_ID,
  resourceRequest_ID,
  startTime,
  cast ( (
          bookedCapacityInMinutes / 60
        ) as Decimal(10, 1) )  as AssignedHours           : Decimal(10, 1),

  resource.workAssignment.parent as employee_ID,
  timeDimension_startDate.DATE_SQL as assignmentStartDate,
  toResourceRequest,
  resource
}
where assignmentStatus.code is null or assignmentStatus.code = 0 or assignmentStatus.code = 1;  // 0 - Hardbooked, 1 - Softbooked, Non-booked assignments not shown in MyAssignments app

entity ResourceAggregatedBookedCapacityFromAvailableBuckets as select from AssignmentBucketsView 
{
  key resource_ID,
  key startTime,
  SUM(bookedCapacityInMinutes) as totalResourceBookedCapacityFromAvailableBucketsInMinutes : Integer
} 
where assignmentStatus.code is null or assignmentStatus.code = 0 or assignmentStatus.code = 1  // // 0 - Hardbooked, 1 - Softbooked, Non-booked assignments do not contribute to utilization
group by resource_ID, startTime;

entity ResourceAggregatedSoftBookedCapacityFromAvailableBuckets as select from AssignmentBucketsView 
{
  key resource_ID,
  key startTime,
  SUM(bookedCapacityInMinutes) as totalResourceBookedCapacityFromAvailableBucketsInMinutes : Integer
}
where assignmentStatus.code = 1 // 0 - Hardbooked, 1 - Softbooked
group by resource_ID, startTime;

entity ResourceAggregatedBookedCapacity as select from resource.Capacity mixin {
  totalResourceBookedCapacityFromAvailableBuckets: Association to one ResourceAggregatedBookedCapacityFromAvailableBuckets 
                                                                   on totalResourceBookedCapacityFromAvailableBuckets.resource_ID = resource_id and
                                                                      totalResourceBookedCapacityFromAvailableBuckets.startTime = startTime;
  totalResourceSoftBookedCapacityFromAvailableBuckets: Association to one ResourceAggregatedSoftBookedCapacityFromAvailableBuckets 
                                                                   on totalResourceSoftBookedCapacityFromAvailableBuckets.resource_ID = resource_id and
                                                                      totalResourceSoftBookedCapacityFromAvailableBuckets.startTime = startTime;
} 
into
{
  key resource_id,
  key startTime,
  IFNULL(
    totalResourceBookedCapacityFromAvailableBuckets.totalResourceBookedCapacityFromAvailableBucketsInMinutes, 0
    ) as totalResourceBookedCapacityInMinutes : Integer,
  IFNULL(
    totalResourceSoftBookedCapacityFromAvailableBuckets.totalResourceBookedCapacityFromAvailableBucketsInMinutes, 0
    ) as totalResourceSoftBookedCapacityInMinutes : Integer
};

entity AssignmentBucketsForYearWeek as select from AssignmentBuckets mixin {
  timeDimensionYearWeek : Association to timeDimension.Data on timeDimensionYearWeek.DATETIMESTAMP = startTime;
}
into {
  key ID,
  assignment.ID as assignment_ID,
  timeDimensionYearWeek.CALWEEK as yearWeek
};
