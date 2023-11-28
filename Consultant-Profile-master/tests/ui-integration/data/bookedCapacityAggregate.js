const assignment = require('./assignments');
const assignmentBucket = require('./assignmentBucket');

const bookedCapacityAggregateData1 = {
    resourceID: assignment.assignment1.resource_ID,
    startTime: assignmentBucket.assignmentBucketData1.startTime,
    bookedCapacityInMinutes: 18250,
    softBookedCapacityInMinutes: 0,
};
const bookedCapacityAggregateData2 = {
    resourceID: assignment.assignment1.resource_ID,
    startTime: assignmentBucket.assignmentBucketData2.startTime,
    bookedCapacityInMinutes: 18250,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate = [
    bookedCapacityAggregateData1,
    bookedCapacityAggregateData2,
];

module.exports = {
    bookedCapacityAggregate,
    bookedCapacityAggregateData1,
    bookedCapacityAggregateData2,
};
