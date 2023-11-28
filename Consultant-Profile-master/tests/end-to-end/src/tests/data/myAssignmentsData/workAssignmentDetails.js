const uuid = require('uuid').v4;
const { workAssignments } = require('./workAssignments');

const workAssignmentDetail1 = {
    ID: uuid(),
    parent: workAssignments[0].ID,
    validFrom: workAssignments[0].startDate,
    validTo: workAssignments[0].endDate,
    isPrimary: true,
};

const workAssignmentDetail2 = {
    ID: uuid(),
    parent: workAssignments[1].ID,
    validFrom: workAssignments[1].startDate,
    validTo: workAssignments[1].endDate,
    isPrimary: true,
};

const workAssignmentDetail3 = {
    ID: uuid(),
    parent: workAssignments[2].ID,
    validFrom: workAssignments[2].startDate,
    validTo: workAssignments[2].endDate,
    isPrimary: true,
};

const workAssignmentDetails = [
    workAssignmentDetail1,
    workAssignmentDetail2,
    workAssignmentDetail3,
];

module.exports = { workAssignmentDetails };
