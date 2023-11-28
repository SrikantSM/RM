const uuid = require('uuid').v4;
const resourceRequest = require('./resourceRequest');

const capacityRequirement1 = {
    ID: uuid(),
    resourceRequest_ID: resourceRequest.resourceRequestData1.ID,
    startDate: '2019-01-01',
    endDate: '2019-01-31',
    startTime: '2019-01-01 00:00:00.000',
    endTime: '2019-01-31 00:00:00.000',
    requestedCapacity: 15000,
    requestedUnit: 15000,
    requestedCapacityInMinutes: 'min',
};

const capacityRequirement2 = {
    ID: uuid(),
    resourceRequest_ID: resourceRequest.resourceRequestData1.ID,
    startDate: '2019-02-01',
    endDate: '2019-02-28',
    startTime: '2019-02-01 00:00:00.000',
    endTime: '2019-02-28 00:00:00.000',
    requestedCapacity: 11000,
    requestedUnit: 11000,
    requestedCapacityInMinutes: 'min',
};

const capacityRequirements = [
    capacityRequirement1,
    capacityRequirement2,
];

module.exports = {
    capacityRequirements,
    capacityRequirement1,
    capacityRequirement2,
};
