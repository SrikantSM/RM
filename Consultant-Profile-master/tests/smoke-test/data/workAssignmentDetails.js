const workAssignments = require('./workAssignments');

const workAssignmentDetail1 = {
    ID: '6e173808-64a0-11ed-9022-0242ac120002',
    validFrom: workAssignments.workAssignment1.startDate,
    validTo: workAssignments.workAssignment1.endDate,
    parent: workAssignments.workAssignment1.ID,
    isPrimary: true
};

const workAssignmentDetails = [
    workAssignmentDetail1,
];

module.exports = {
    workAssignmentDetails,
    workAssignmentDetail1,
};
