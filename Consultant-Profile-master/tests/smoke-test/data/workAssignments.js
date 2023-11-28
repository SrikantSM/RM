const employeeHeaders = require('./employeeHeaders');

const workAssignment1 = {
    ID: '7df355fe-64a0-11ed-9022-0242ac120002',
    workAssignmentID: '7df35cde-64a0-11ed-9022-0242ac120002',
    parent: employeeHeaders.employeeHeader1.ID,
    externalID: 'test.usere2e4',
    startDate: '2017-12-31',
    endDate: '2099-12-31',
    isContingentWorker: false,
};

const workAssignments = [
    workAssignment1,
];

module.exports = {
    workAssignments,
    workAssignment1,
};
