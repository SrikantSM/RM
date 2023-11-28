const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');

const workAssignment1 = {
    ID: uuid(),
    workAssignmentID: uuid(),
    parent: employeeHeaders.employeeHeader1.ID,
    externalID: 'test.usere2e1',
    startDate: '2017-01-01',
    endDate: '2019-12-31',
    isContingentWorker: true,
};

const workAssignment2 = {
    ID: uuid(),
    workAssignmentID: uuid(),
    parent: employeeHeaders.employeeHeader1.ID,
    externalID: 'test.usere2e1',
    startDate: '2020-01-01',
    endDate: '2099-12-31',
    isContingentWorker: true,
};

const workAssignment3 = {
    ID: uuid(),
    workAssignmentID: uuid(),
    parent: employeeHeaders.employeeHeader2.ID,
    externalID: 'test.usere2e2',
    startDate: '2017-12-31',
    endDate: '2099-12-31',
    isContingentWorker: true,
};

const workAssignment4 = {
    ID: uuid(),
    workAssignmentID: uuid(),
    parent: employeeHeaders.employeeHeader3.ID,
    externalID: 'test.usere2e3',
    startDate: '2017-12-31',
    endDate: '2099-12-31',
    isContingentWorker: true,
};

const workAssignment5 = {
    ID: uuid(),
    workAssignmentID: uuid(),
    parent: employeeHeaders.employeeHeader4.ID,
    externalID: 'test.usere2e4',
    startDate: '2017-12-31',
    endDate: '2099-12-31',
    isContingentWorker: true,
};

const workAssignment6 = {
    ID: uuid(),
    workAssignmentID: uuid(),
    parent: employeeHeaders.employeeHeader5.ID,
    externalID: 'test.usere2e5',
    startDate: '2017-12-31',
    endDate: '2099-12-31',
    isContingentWorker: true,
};

const workAssignments = [
    workAssignment1,
    workAssignment2,
    workAssignment3,
    workAssignment4,
    workAssignment5,
    workAssignment6,
];

module.exports = {
    workAssignments,
    workAssignment1,
    workAssignment2,
    workAssignment3,
    workAssignment4,
    workAssignment5,
    workAssignment6,
};
