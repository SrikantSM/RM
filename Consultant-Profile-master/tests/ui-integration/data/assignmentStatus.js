const assignmentStatusHardBooked = {
    code: 0,
    name: 'Hard-Booked',
};
const assignmentStatusSoftBooked = {
    code: 1,
    name: 'Soft-Booked',
};
const assignmentStatusProposed = {
    code: 2,
    name: 'Proposed',
};

const assignmentStatus = [
    assignmentStatusHardBooked,
    assignmentStatusSoftBooked,
    assignmentStatusProposed,
];

module.exports = {
    assignmentStatus,
    assignmentStatusHardBooked,
    assignmentStatusSoftBooked,
    assignmentStatusProposed,
};
