const uuid = require('uuid').v4;
const workAssignments = require('./workAssignments');

const workAssignmentDetail1 = {
    ID: uuid(),
    validFrom: workAssignments.workAssignment1.startDate,
    validTo: workAssignments.workAssignment1.endDate,
    parent: workAssignments.workAssignment1.ID,
    isPrimary: true
};

const workAssignmentDetail2 = {
    ID: uuid(),
    validFrom: workAssignments.workAssignment2.startDate,
    validTo: workAssignments.workAssignment2.endDate,
    parent: workAssignments.workAssignment2.ID,
    isPrimary: true
};

const workAssignmentDetail3 = {
    ID: uuid(),
    validFrom: workAssignments.workAssignment3.startDate,
    validTo: workAssignments.workAssignment3.endDate,
    parent: workAssignments.workAssignment3.ID,
    isPrimary: true
};

const workAssignmentDetail4 = {
    ID: uuid(),
    validFrom: workAssignments.workAssignment4.startDate,
    validTo: workAssignments.workAssignment4.endDate,
    parent: workAssignments.workAssignment4.ID,
    isPrimary: true
};

const workAssignmentDetail5 = {
    ID: uuid(),
    validFrom: workAssignments.workAssignment5.startDate,
    validTo: workAssignments.workAssignment5.endDate,
    parent: workAssignments.workAssignment5.ID,
    isPrimary: true
};

const workAssignmentDetail6 = {
    ID: uuid(),
    validFrom: workAssignments.workAssignment6.startDate,
    validTo: workAssignments.workAssignment6.endDate,
    parent: workAssignments.workAssignment6.ID,
    isPrimary: true
};

const workAssignmentDetails = [
    workAssignmentDetail1,
    workAssignmentDetail2,
    workAssignmentDetail3,
    workAssignmentDetail4,
    workAssignmentDetail5,
    workAssignmentDetail6,
];

module.exports = {
    workAssignmentDetails,
    workAssignmentDetail1,
    workAssignmentDetail2,
    workAssignmentDetail3,
    workAssignmentDetail4,
    workAssignmentDetail5,
    workAssignmentDetail6,
};
