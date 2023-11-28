const { workAssignments } = require('./workAssignments');

const resourceHeader1 = {
    ID: workAssignments[0].ID,
};

const resourceHeader2 = {
    ID: workAssignments[1].ID,
};

const resourceHeaders = [
    resourceHeader1,
    resourceHeader2,
];

module.exports = { resourceHeaders };
