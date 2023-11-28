const uuid = require('uuid').v4;
const { assignments } = require('./assignments');

const now = new Date(Date.now());
const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
const nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
const nowPlusTwoMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 2, 1));

const assignmentBucketData1 = {
    ID: uuid(),
    assignment_ID: assignments[0].ID,
    startTime: currentMonthStart.toJSON(),
    bookedCapacityInMinutes: 1200,
};
const assignmentBucketData2 = {
    ID: uuid(),
    assignment_ID: assignments[0].ID,
    startTime: nowPlusOneMonthStart.toJSON(),
    bookedCapacityInMinutes: 1200,
};

const assignmentBucketData3 = {
    ID: uuid(),
    assignment_ID: assignments[1].ID,
    startTime: nowPlusOneMonthStart.toJSON(),
    bookedCapacityInMinutes: 1200,
};
const assignmentBucketData4 = {
    ID: uuid(),
    assignment_ID: assignments[1].ID,
    startTime: nowPlusTwoMonthsStart.toJSON(),
    bookedCapacityInMinutes: 1200,
};

const assignmentBucket = [
    assignmentBucketData1,
    assignmentBucketData2,
    assignmentBucketData3,
    assignmentBucketData4,
];

module.exports = { assignmentBucket };
