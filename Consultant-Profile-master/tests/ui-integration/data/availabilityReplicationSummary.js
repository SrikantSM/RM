const workforcePersons = require('./workforcePersons');
const workAssignments = require('./workAssignments');
const availabilitySummaryStatus = require('./availabilitySummaryStatus');

const availabilityReplicationSummary1 = {
    resourceId: workAssignments.workAssignment1.ID,
    workForcePersonExternalId: workforcePersons.workforcePerson1.externalID,
    workAssignmentStartDate: workAssignments.workAssignment1.startDate,
    workAssignmentEndDate: workAssignments.workAssignment1.endDate,
    workAssignmentExternalId: 'H2R4377882-1',
    availabilitySummaryStatus_code: availabilitySummaryStatus.availabilitySummaryStatus1.code,
};
const availabilityReplicationSummary2 = {
    resourceId: workAssignments.workAssignment2.ID,
    workForcePersonExternalId: workforcePersons.workforcePerson2.externalID,
    workAssignmentStartDate: workAssignments.workAssignment2.startDate,
    workAssignmentEndDate: workAssignments.workAssignment2.endDate,
    workAssignmentExternalId: 'H2R4377882',
    availabilitySummaryStatus_code: availabilitySummaryStatus.availabilitySummaryStatus2.code,
};
const availabilityReplicationSummary3 = {
    resourceId: workAssignments.workAssignment3.ID,
    workForcePersonExternalId: workforcePersons.workforcePerson3.externalID,
    workAssignmentStartDate: workAssignments.workAssignment3.startDate,
    workAssignmentEndDate: workAssignments.workAssignment3.endDate,
    workAssignmentExternalId: 'EMPH2R21905',
    availabilitySummaryStatus_code: availabilitySummaryStatus.availabilitySummaryStatus3.code,
};
const availabilityReplicationSummary4 = {
    resourceId: workAssignments.workAssignment4.ID,
    workForcePersonExternalId: workforcePersons.workforcePerson4.externalID,
    workAssignmentStartDate: workAssignments.workAssignment4.startDate,
    workAssignmentEndDate: workAssignments.workAssignment4.endDate,
    workAssignmentExternalId: 'EMPH2R99217',
    availabilitySummaryStatus_code: availabilitySummaryStatus.availabilitySummaryStatus4.code,
};
const availabilityReplicationSummary5 = {
    resourceId: workAssignments.workAssignment6.ID,
    workForcePersonExternalId: workforcePersons.workforcePerson5.externalID,
    workAssignmentStartDate: workAssignments.workAssignment6.startDate,
    workAssignmentEndDate: workAssignments.workAssignment6.endDate,
    workAssignmentExternalId: 'EMPH2R99217-1',
    availabilitySummaryStatus_code: availabilitySummaryStatus.availabilitySummaryStatus4.code,
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
    availabilityReplicationSummary1,
    availabilityReplicationSummary2,
    availabilityReplicationSummary3,
    availabilityReplicationSummary4,
    availabilityReplicationSummary5,
};
