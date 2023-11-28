import { AvailabilityReplicationSummary } from 'test-commons';
import {
    availabilitySummaryStatus0,
    availabilitySummaryStatus1,
    availabilitySummaryStatus2,
    availabilitySummaryStatus3,
} from './AvailabilitySummaryStatus';
import {
    workAssignment1,
    workAssignment2,
    workAssignment3,
    workAssignment4,
    workAssignment5,
} from '../employee/WorkAssignment';
import {
    workforcePersonWithDescription1,
    workforcePersonWithDescription2,
    workforcePersonWithDescription3,
    workforcePersonManagerWithDescription,
} from '../employee/WorkforcePerson';

const availabilityReplicationSummary1: AvailabilityReplicationSummary = {
    resourceId: workAssignment1.ID,
    workForcePersonExternalId: workforcePersonWithDescription1.externalID,
    costCenterId: '',
    workAssignmentStartDate: workAssignment1.startDate,
    workAssignmentEndDate: workAssignment1.endDate,
    workAssignmentExternalId: workAssignment1.externalID,
    noOfRecordsProcessed: 0,
    noOfRecordsFailed: 0,
    noOfRecordsPassed: 0,
    availabilitySummaryStatus_code: availabilitySummaryStatus0.code,
};

const availabilityReplicationSummary2: AvailabilityReplicationSummary = {
    resourceId: workAssignment2.ID,
    workForcePersonExternalId: workforcePersonWithDescription2.externalID,
    costCenterId: '',
    workAssignmentStartDate: workAssignment2.startDate,
    workAssignmentEndDate: workAssignment2.endDate,
    workAssignmentExternalId: workAssignment2.externalID,
    noOfRecordsProcessed: 4,
    noOfRecordsFailed: 0,
    noOfRecordsPassed: 4,
    availabilitySummaryStatus_code: availabilitySummaryStatus1.code,
};

const availabilityReplicationSummary3: AvailabilityReplicationSummary = {
    resourceId: workAssignment3.ID,
    workForcePersonExternalId: workforcePersonWithDescription1.externalID,
    costCenterId: '',
    workAssignmentStartDate: workAssignment3.startDate,
    workAssignmentEndDate: workAssignment3.endDate,
    workAssignmentExternalId: workAssignment3.externalID,
    noOfRecordsProcessed: 4,
    noOfRecordsFailed: 2,
    noOfRecordsPassed: 2,
    availabilitySummaryStatus_code: availabilitySummaryStatus2.code,
};

const availabilityReplicationSummary4: AvailabilityReplicationSummary = {
    resourceId: workAssignment4.ID,
    workForcePersonExternalId: workforcePersonManagerWithDescription.externalID,
    costCenterId: '',
    workAssignmentStartDate: workAssignment4.startDate,
    workAssignmentEndDate: workAssignment4.endDate,
    workAssignmentExternalId: workAssignment4.externalID,
    noOfRecordsProcessed: 4,
    noOfRecordsFailed: 4,
    noOfRecordsPassed: 0,
    availabilitySummaryStatus_code: availabilitySummaryStatus3.code,
};

const availabilityReplicationSummary5: AvailabilityReplicationSummary = {
    resourceId: workAssignment5.ID,
    workForcePersonExternalId: workforcePersonWithDescription3.externalID,
    costCenterId: '',
    workAssignmentStartDate: workAssignment5.startDate,
    workAssignmentEndDate: workAssignment5.endDate,
    workAssignmentExternalId: workAssignment5.externalID,
    noOfRecordsProcessed: 4,
    noOfRecordsFailed: 4,
    noOfRecordsPassed: 0,
    availabilitySummaryStatus_code: availabilitySummaryStatus3.code,
};

const allAvailabilityReplicationSummary = [
    availabilityReplicationSummary1,
    availabilityReplicationSummary2,
    availabilityReplicationSummary3,
    availabilityReplicationSummary4,
    availabilityReplicationSummary5,
];

export {
    allAvailabilityReplicationSummary,
    availabilityReplicationSummary1,
    availabilityReplicationSummary2,
    availabilityReplicationSummary3,
    availabilityReplicationSummary4,
    availabilityReplicationSummary5,
};
