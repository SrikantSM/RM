const workAssignments = require('./workAssignments');

const resourceHeader1 = {
    ID: workAssignments.workAssignment1.ID,
};

const resourceHeader2 = {
    ID: workAssignments.workAssignment2.ID,
};

const resourceHeader3 = {
    ID: workAssignments.workAssignment3.ID,
};

const resourceHeader4 = {
    ID: workAssignments.workAssignment4.ID,
};

const resourceHeader5 = {
    ID: workAssignments.workAssignment5.ID,
};

const resourceHeader6 = {
    ID: workAssignments.workAssignment6.ID,
};

const resourceHeaders = [
    resourceHeader1,
    resourceHeader2,
    resourceHeader3,
    resourceHeader4,
    resourceHeader5,
    resourceHeader6,
];

module.exports = {
    resourceHeaders,
    resourceHeader1,
    resourceHeader2,
    resourceHeader3,
    resourceHeader4,
    resourceHeader5,
    resourceHeader6,
};
