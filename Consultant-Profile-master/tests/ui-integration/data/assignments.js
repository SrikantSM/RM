const uuid = require('uuid').v4;
const resourceHeader = require('./resourceHeaders');
const resourceRequest = require('./resourceRequest');

const assignment1 = {
    ID: uuid(),
    bookedCapacityInMinutes: 18250,
    assignmentstatus_code: 1,
    resourceRequest_ID: resourceRequest.resourceRequestData1.ID,
    resource_ID: resourceHeader.resourceHeader2.ID,
};

const assignment2 = {
    ID: uuid(),
    bookedCapacityInMinutes: 18250,
    assignmentstatus_code: 0,
    resourceRequest_ID: resourceRequest.resourceRequestData2.ID,
    resource_ID: resourceHeader.resourceHeader2.ID,
};

const assignment3 = {
    ID: uuid(),
    bookedCapacityInMinutes: 480,
    assignmentstatus_code: 2, // proposed
    resourceRequest_ID: uuid(),
    resource_ID: resourceHeader.resourceHeader2.ID,
};

const assignments = [
    assignment1,
    assignment2,
    assignment3,
];

module.exports = {
    assignments,
    assignment1,
    assignment2,
    assignment3,
};
