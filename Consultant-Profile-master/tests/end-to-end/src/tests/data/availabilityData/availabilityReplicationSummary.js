const { workforcePersons } = require('./workforcePerson');
const { workAssignments } = require('./workAssignment');
const { availabilitySummaryStatus } = require('./availabilitySummaryStatus');

const workforcePersonWithDescription1 = workforcePersons[0];
const workforcePersonWithDescription2 = workforcePersons[1];
const workforcePersonManagerWithDescription = workforcePersons[2];
const workAssignment1 = workAssignments[0];
const workAssignment2 = workAssignments[1];
const workAssignment3 = workAssignments[2];
const workAssignment4 = workAssignments[3];
const workAssignment5 = workAssignments[4];
const notStartedStatus = availabilitySummaryStatus[0];

const availabilityReplicationSummary1 = {
    resourceId: workAssignment1.ID,
    workForcePersonExternalId: workforcePersonWithDescription1.externalID,
    workAssignmentStartDate: workAssignment1.startDate,
    workAssignmentEndDate: workAssignment1.endDate,
    workAssignmentExternalId: workAssignment1.externalID,
    availabilitySummaryStatus_code: notStartedStatus.code,
};

const availabilityReplicationSummary2 = {
    resourceId: workAssignment2.ID,
    workForcePersonExternalId: workforcePersonWithDescription1.externalID,
    workAssignmentStartDate: workAssignment2.startDate,
    workAssignmentEndDate: workAssignment2.endDate,
    workAssignmentExternalId: workAssignment2.externalID,
    availabilitySummaryStatus_code: notStartedStatus.code,
};

const availabilityReplicationSummary3 = {
    resourceId: workAssignment3.ID,
    workForcePersonExternalId: workforcePersonWithDescription2.externalID,
    workAssignmentStartDate: workAssignment3.startDate,
    workAssignmentEndDate: workAssignment3.endDate,
    workAssignmentExternalId: workAssignment3.externalID,
    availabilitySummaryStatus_code: notStartedStatus.code,
};

const availabilityReplicationSummary4 = {
    resourceId: workAssignment4.ID,
    workForcePersonExternalId: workforcePersonManagerWithDescription.externalID,
    workAssignmentStartDate: workAssignment4.startDate,
    workAssignmentEndDate: workAssignment4.endDate,
    workAssignmentExternalId: workAssignment4.externalID,
    availabilitySummaryStatus_code: notStartedStatus.code,
};

const availabilityReplicationSummary5 = {
    resourceId: workAssignment5.ID,
    workForcePersonExternalId: workforcePersonWithDescription1.externalID,
    workAssignmentStartDate: workAssignment5.startDate,
    workAssignmentEndDate: workAssignment5.endDate,
    workAssignmentExternalId: workAssignment5.externalID,
    availabilitySummaryStatus_code: notStartedStatus.code,
};

const availabilityReplicationSummary = [
    availabilityReplicationSummary1,
    availabilityReplicationSummary2,
    availabilityReplicationSummary3,
    availabilityReplicationSummary4,
    availabilityReplicationSummary5,
];

module.exports = {
    availabilityReplicationSummary,
};
