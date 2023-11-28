namespace com.sap.resourceManagement.capacityGridAssignment;

using com.sap.resourceManagement.resourceRequest as request from '@sap/rm-resourceRequest/db/cds/resourceRequest';
using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db/cds/core/resource';
using com.sap.resourceManagement.system.data.timeDimension as timeDimension from '@sap/rm-consultantProfile/db/cds/core/timeDimension';
using com.sap.resourceManagement.assignment as assignment from './assignment';

entity ResourceRequestAssignmentAggregate as select from assignment.AssignmentsAggregatedView {
  key resourceRequest_ID,
  sum(bookedCapacityInMinutes) as totalRequestbookedCapacityInMinutes : Integer
} 
where assignmentStatus.code = 0 or assignmentStatus.code = 1   // 0 - Hardbooked, 1 - Softbooked
group by resourceRequest_ID;

// One record for each day of request validity
entity AssignmentTimeDimension as select from request.ResourceRequests mixin {
    timeDimensionData : Association to many timeDimension.Data on timeDimensionData.DATETIMESTAMP < endTime AND timeDimensionData.DATETIMESTAMP >= startTime AND timeDimensionData.HOUR = '00' AND timeDimensionData.MINUTE = '00' ;
    assignments : Association to many assignment.Assignments on assignments.resourceRequest.ID = ID AND ( assignments.assignmentStatus.code = 0 or assignments.assignmentStatus.code = 1 );
} into {
    key assignments.ID as assignmentID,
    key timeDimensionData.DATETIMESTAMP as datetimestamp,
    ID as resourceRequest_ID,
    startTime as requestStartTime,
    endTime as requestEndTime,
    timeDimensionData.DATE_SQL as date,
    timeDimensionData.CALMONTH as yearMonth,
    timeDimensionData.CALWEEK as yearWeek
} where assignments.ID is not null; // The request may not have any assignment

// Non-zero bookedCapacity for days with actual assignment buckets
// Zero bookedCapacity for days with missing assignment buckets within request period
entity AssignmentBucketsTimeDimension as select from AssignmentTimeDimension mixin {
    assignmentBuckets : Association to one assignment.AssignmentBucketsView 
      on assignmentBuckets.assignment_ID = assignmentID and assignmentBuckets.startTime = datetimestamp;
} into {
    key assignmentID as assignment_ID,
    key date,
    yearMonth,
    yearWeek,
    case 
      when assignmentBuckets.bookedCapacityInMinutes is null 
      then 0
      else assignmentBuckets.bookedCapacityInMinutes
    end as bookedCapacityInMinutes : Integer
};

@cds.autoexpose
entity AssignmentBucketsYearMonth as select from AssignmentBucketsTimeDimension {
    key assignment_ID,
    key yearMonth as timePeriod,
    @Core.Computed: false
    min(date) as startDate : Date,
    @Core.Computed: false
    max(date) as endDate : Date,
    @Core.Computed: false
    0 as action : Integer, // marker for editing assignment from grid
    @Core.Computed: false
    ((SUM(bookedCapacityInMinutes)) / 60) as bookedCapacityInHours : Integer
}
group by assignment_ID, yearMonth;

@cds.autoexpose
entity AssignmentBucketsYearWeek as select from AssignmentBucketsTimeDimension {
    key assignment_ID,
    key yearWeek as timePeriod,
    @Core.Computed: false
    min(date) as startDate : Date,
    @Core.Computed: false
    max(date) as endDate : Date,
    @Core.Computed: false
    0 as action : Integer, // marker for editing assignment from grid
    @Core.Computed: false
    ((SUM(bookedCapacityInMinutes)) / 60) as bookedCapacityInHours : Integer
}
group by assignment_ID, yearWeek;

@cds.autoexpose
entity AssignmentBucketsPerDay as select from AssignmentBucketsTimeDimension {
    key assignment_ID,
    key date as timePeriod : String,
    date as date,
    @Core.Computed: false
    0 as action : Integer, // marker for editing assignment from grid
    @Core.Computed: false
    (bookedCapacityInMinutes / 60) as bookedCapacityInHours : Integer
};

@cds.errors.combined: false
entity AssignmentsDetailsForCapacityGrid as select from assignment.AssignmentsAggregatedView mixin {

  ResourceRequest : association to one request.ResourceRequests on ResourceRequest.ID = resourceRequest_ID;
  timeDimension_startDate : association to one timeDimension.Data on timeDimension_startDate.DATETIMESTAMP = startTime;
  timeDimension_endDate : association to one timeDimension.Data on timeDimension_endDate.DATETIMESTAMP = endTime;
  requestAssignmentAggregate : association to one ResourceRequestAssignmentAggregate on requestAssignmentAggregate.resourceRequest_ID = resourceRequest_ID;
  resourceDetails : Association to resource.ResourceDetailsForTimeWindow on resourceDetails.resource_ID = resource_ID;
  monthlyAggregatedAssignments : association to many AssignmentBucketsYearMonth on monthlyAggregatedAssignments.assignment_ID = assignment_ID;
  weeklyAggregatedAssignments : association to many AssignmentBucketsYearWeek on weeklyAggregatedAssignments.assignment_ID = assignment_ID;
  dailyAssignments : association to many AssignmentBucketsPerDay on dailyAssignments.assignment_ID = assignment_ID;

	} into {

  key assignment_ID,
  resource_ID,
  resourceRequest_ID,
  @Core.Computed: false
  assignmentStatus.code                                                         as assignmentStatusCode,
  assignmentStatus.name                                                         as assignmentStatusText,
  resourceDetails.costCenterID                                                  as costCenterID,

  resourceDetails.resourceOrgCode,                                               

  timeDimension_startDate.DATE_SQL                                              as assignmentStartDate,
  timeDimension_endDate.DATE_SQL                                                as assignmentEndDate,

  @Common.FieldControl: #Optional
  ResourceRequest.startDate                                                     as requestStartDate,
  @Common.FieldControl: #Optional
  ResourceRequest.endDate                                                       as requestEndDate,
  
  ResourceRequest.displayId                                                     as requestDisplayId,
  ResourceRequest.name                                                          as requestName,

  ResourceRequest.project.ID                                                    as projectId,
  ResourceRequest.project.name                                                  as projectName,

  ResourceRequest.demand.workItemName,
  
  ResourceRequest.referenceObject.displayId                                     as referenceObjectId,
  ResourceRequest.referenceObject.name                                          as referenceObjectName,
  ResourceRequest.referenceObjectType.name                                      as referenceObjectTypeName,
  ResourceRequest.referenceObjectType.code                                      as referenceObjectTypeCode, 

  ResourceRequest.project.customer.ID                                           as customerId,
  ResourceRequest.project.customer.name                                         as customerName,

  @Common.FieldControl: #Optional //There is no need to force the UI to send this field on assignment creation from grid
  ResourceRequest.projectRole.name                                              as projectRoleName,

  (requestAssignmentAggregate.totalRequestbookedCapacityInMinutes / 60)         as totalRequestBookedCapacityInHours: Integer,
  (bookedCapacityInMinutes / 60 )                                               as assignmentDurationInHours: Integer,
  (ResourceRequest.requestedCapacityInMinutes / 60)                             as requestedCapacityInHours: Integer,

  ((ResourceRequest.requestedCapacityInMinutes - requestAssignmentAggregate.totalRequestbookedCapacityInMinutes) / 60) as remainingRequestedCapacityInHours: Integer,

  case 
    when ResourceRequest.requestStatus.code = 1 then false // Resolved -> assignment not editable
    else true // Open -> assignment is editable
  end as isAssignmentEditable : Boolean,

  @Core.Computed: false
  0 as action : Integer, // marker for updating assignment from grid
  @Core.Computed: false
  null as referenceAssignment : cds.UUID,

  ResourceRequest.requestStatus.code as requestStatusCode,
  ResourceRequest.requestStatus.description as requestStatusDescription,
  
  // $expand
  monthlyAggregatedAssignments,
  weeklyAggregatedAssignments,
  dailyAssignments
}
where assignmentStatus.code = 0 or assignmentStatus.code = 1;   // 0 - Hardbooked, 1 - Softbooked


@readonly
entity RequestDetailsForEachAssignment as select from request.ResourceRequestDetails {
  key Id as resourceRequest_ID,
      displayId as requestDisplayId,
      name as requestName,
      startDate as requestStartDate,
      endDate as requestEndDate,
      requestedResourceOrg.ID as requestedResourceOrganizationDisplayId,
      requestedResourceOrg.name as requestedResourceOrganizationName,
      requestedResourceOrg.description as requestedResourceOrganizationDescription,
      requestStatus.code as requestStatusCode,
      requestStatus.description as requestStatusDescription
};