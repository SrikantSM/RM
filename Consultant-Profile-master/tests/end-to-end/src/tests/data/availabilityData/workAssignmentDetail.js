const uuid = require('uuid').v4;
const { workAssignments } = require('./workAssignment');

const workAssignmentDetail1 = {
    ID: uuid(),
    parent: workAssignments[0].ID,
    validFrom: workAssignments[0].startDate,
    validTo: workAssignments[0].endDate,
    isPrimary: true,
};

const workAssignmentDetail2 = {
    ID: uuid(),
    workAssignmentDetailID: uuid(),
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

const workAssignmentDetail4 = {
    ID: uuid(),
    parent: workAssignments[3].ID,
    validFrom: workAssignments[3].startDate,
    validTo: workAssignments[3].endDate,
    isPrimary: true,
};

const workAssignmentDetail5 = {
    ID: uuid(),
    parent: workAssignments[4].ID,
    validFrom: workAssignments[4].startDate,
    validTo: workAssignments[4].endDate,
    isPrimary: false,
};

const workAssignmentDetails = [
    workAssignmentDetail1,
    workAssignmentDetail2,
    workAssignmentDetail3,
    workAssignmentDetail4,
    workAssignmentDetail5,
];

module.exports = { workAssignmentDetails };
