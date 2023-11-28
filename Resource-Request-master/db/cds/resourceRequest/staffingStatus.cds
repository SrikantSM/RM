namespace com.sap.resourceManagement.resourceRequest;

using com.sap.resourceManagement.resourceRequest as resourceRequest from './resourceRequest';
using com.sap.resourceManagement.assignment as assignment from '@sap/rm-assignment/db';
using com.sap.resourceManagement.config as staffingStatus from '@sap/rm-assignment/db';

view BookedCapacitiesHardSoft as
  select from assignment.Assignments {
    key resourceRequest.ID as resourceRequest_ID,

        case
          when
            assignmentStatus.code = 1 or assignmentStatus.code = 0
          then
            bookedCapacityInMinutes
          else
            0
        end                as bookedCapacityInMinutes     : Integer,

        case
          when
            assignmentStatus.code = 1
          then
            bookedCapacityInMinutes
        end                as bookedCapacityInMinutesSoft : Integer,
        case
          when
            (
              assignmentStatus.code = 0
            )
          then
            bookedCapacityInMinutes
        end                as bookedCapacityInMinutesHard : Integer
  };

view BookedCapacities as
  select from BookedCapacitiesHardSoft {
    key resourceRequest_ID,
        SUM(bookedCapacityInMinutes)     as bookedCapacityInMinutes     : Integer,
        SUM(bookedCapacityInMinutesSoft) as bookedCapacityInMinutesSoft : Integer,
        SUM(bookedCapacityInMinutesHard) as bookedCapacityInMinutesHard : Integer
  }
  group by
    resourceRequest_ID;

view StaffedEfforts as
  select from resourceRequest.ResourceRequests
  mixin {
    bookedCapacity : Association to one BookedCapacities
                       on bookedCapacity.resourceRequest_ID = $projection.ID;
  }
  into {
    key ID,
        requestedUnit,
        requestedCapacity,
        cast(
          (
            bookedCapacity.bookedCapacityInMinutes / 60
          ) as Decimal(10, 2)
        ) as bookedCapacity,
        cast(
          (
            bookedCapacity.bookedCapacityInMinutesSoft / 60
          ) as Decimal(10, 2)
        ) as bookedCapacitySoft,
        cast(
          (
            bookedCapacity.bookedCapacityInMinutesHard / 60
          ) as Decimal(10, 2)
        ) as bookedCapacityHard
  };

view StaffedEffortsMapping as
  select from StaffedEfforts {
    key ID,
        requestedUnit,
        requestedCapacity,
        cast(
          IFNULL(
            bookedCapacity, 0
          ) as Decimal(10, 2)
        ) as bookedCapacity,
        cast(
          IFNULL(
            bookedCapacitySoft, 0
          ) as Decimal(10, 2)
        ) as bookedCapacitySoft,
        cast(
          IFNULL(
            bookedCapacityHard, 0
          ) as Decimal(10, 2)
        ) as bookedCapacityHard
  };

view StaffingStatuses as
  select from StaffedEffortsMapping
  mixin {
    staffingStatus : Association to one staffingStatus.StaffingStatus
                       on staffingStatus.StaffingCode = $projection.staffingCode;
  }
  into {
    key ID,
        requestedUnit,
        requestedCapacity,
        bookedCapacity,
        bookedCapacitySoft,
        bookedCapacityHard,
        case
          when
            bookedCapacity = 0
          then
            0
          when
            bookedCapacity < requestedCapacity
          then
            1
          when
            bookedCapacity = requestedCapacity
          then
            2
          when
            bookedCapacity > requestedCapacity
          then
            3
          else
            0
        end as staffingCode      : Integer,
        case
          when
            bookedCapacity > requestedCapacity
          then
            0
          when
            bookedCapacity <= requestedCapacity
          then
            (
              requestedCapacity - bookedCapacity
            )
        end as remainingCapacity : Decimal(10, 2),
        staffingStatus,
        staffingStatus.description as description
  };
