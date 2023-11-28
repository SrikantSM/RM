const uuid = require('uuid').v4;
const { resourceHeaders } = require('./resourceHeaders');
const { resourceRequestData } = require('./resourceRequest');

const assignment1 = {
    ID: uuid(),
    bookedCapacityInMinutes: 9600,
    assignmentstatus_code: 1,
    resourceRequest_ID: resourceRequestData[0].ID,
    resource_ID: resourceHeaders[0].ID,
};

const assignment2 = {
    ID: uuid(),
    bookedCapacityInMinutes: 9600,
    assignmentstatus_code: 0,
    resourceRequest_ID: resourceRequestData[1].ID,
    resource_ID: resourceHeaders[0].ID,
};

const assignments = [
    assignment1,
    assignment2,
];

module.exports = { assignments };
