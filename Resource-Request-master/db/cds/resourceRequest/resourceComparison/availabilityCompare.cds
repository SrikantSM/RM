namespace com.sap.resourceManagement.resourceRequest;

using com.sap.resourceManagement.resourceRequest as resourceRequest from '../resourceRequest';
using com.sap.resourceManagement.employee.availability as availability from '@sap/rm-consultantProfile/db';

@cds.autoexpose
view CompareResourceAvailability as 
select from availability.CapacityDataForAvailability as  resourceAvailability
inner join resourceRequest.ResourceRequests   as resourceRequests on resourceAvailability.startTime >= resourceRequests.startTime
                                                                       and  resourceAvailability.endTime <= resourceRequests.endTime
{
key resourceRequests.ID as resourceRequestId,
key resourceAvailability.ID as resourceId,  

cast (SUM(GREATEST(resourceAvailability.netCapacityInMinutes, 0)) / 60 as Integer) as netCapacityInHours    : Integer

} group by resourceRequests.ID,resourceAvailability.ID;
