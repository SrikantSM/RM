const uuid = require('uuid').v4;
const { resourceRequestsToUpload } = require('./resourceRequestToBeCreated');


const assignment1 = {
    ID: uuid(),
    bookedCapacityInMinutes: 1800,
    resourceRequest_ID: resourceRequestsToUpload[1].ID,
    resource_ID: uuid(),
    startDate: resourceRequestsToUpload[1].startDate,
    endDate: resourceRequestsToUpload[1].endDate
};


const assignments = [
    assignment1
];

module.exports = {
    assignments,
    assignment1
};
