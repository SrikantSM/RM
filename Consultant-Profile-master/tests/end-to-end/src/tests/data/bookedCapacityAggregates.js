const { assignmentBucket } = require('./assignmentBucket');
const { assignments } = require('./assignments');

const bookedCapacityAggregate1 = {
    resourceID: assignments[0].resource_ID,
    startTime: assignmentBucket[0].startTime,
    bookedCapacityInMinutes: assignmentBucket[0].bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};
const bookedCapacityAggregate2 = {
    resourceID: assignments[0].resource_ID,
    startTime: assignmentBucket[1].startTime,
    bookedCapacityInMinutes: assignmentBucket[1].bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate3 = {
    resourceID: assignments[1].resource_ID,
    startTime: assignmentBucket[2].startTime,
    bookedCapacityInMinutes: assignmentBucket[2].bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};
const bookedCapacityAggregate4 = {
    resourceID: assignments[1].resource_ID,
    startTime: assignmentBucket[3].startTime,
    bookedCapacityInMinutes: assignmentBucket[3].bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate = [
    bookedCapacityAggregate1,
    bookedCapacityAggregate2,
    bookedCapacityAggregate3,
    bookedCapacityAggregate4,
];

module.exports = { bookedCapacityAggregate };
