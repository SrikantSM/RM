const uuid = require('uuid').v4;
const assignment = require('./assignments');

const now = new Date(Date.now());
const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
const day1 = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1));
const day2 = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 2));
const day3 = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 3));
const day4 = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 4));
const day5 = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 5));
const day6 = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 6));

const assignmentBucketData1 = {
    ID: uuid(),
    assignment_ID: assignment.assignment1.ID,
    startTime: today.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
    bookedCapacityInMinutes: 120,
};
const assignmentBucketData2 = {
    ID: uuid(),
    assignment_ID: assignment.assignment1.ID,
    startTime: day1.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
    bookedCapacityInMinutes: 300,
};
const assignmentBucketData3 = {
    ID: uuid(),
    assignment_ID: assignment.assignment2.ID,
    startTime: today.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
    bookedCapacityInMinutes: 180,
};
const assignmentBucketData4 = {
    ID: uuid(),
    assignment_ID: assignment.assignment2.ID,
    startTime: day1.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
    bookedCapacityInMinutes: 60,
};
const assignmentBucketData5 = {
    ID: uuid(),
    assignment_ID: assignment.assignment1.ID,
    startTime: day2.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
    bookedCapacityInMinutes: 180,
};
const assignmentBucketData6 = {
    ID: uuid(),
    assignment_ID: assignment.assignment2.ID,
    startTime: day2.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
    bookedCapacityInMinutes: 60,
};
const assignmentBucketData7 = {
    ID: uuid(),
    assignment_ID: assignment.assignment1.ID,
    startTime: day3.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
    bookedCapacityInMinutes: 240,
};
const assignmentBucketData8 = {
    ID: uuid(),
    assignment_ID: assignment.assignment2.ID,
    startTime: day3.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
    bookedCapacityInMinutes: 240,
};
const assignmentBucketData9 = {
    ID: uuid(),
    assignment_ID: assignment.assignment1.ID,
    startTime: day4.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
    bookedCapacityInMinutes: 240,
};
const assignmentBucketData10 = {
    ID: uuid(),
    assignment_ID: assignment.assignment2.ID,
    startTime: day4.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
    bookedCapacityInMinutes: 120,
};

const assignmentBucketData11 = {
    ID: uuid(),
    assignment_ID: assignment.assignment1.ID,
    startTime: day5.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
    bookedCapacityInMinutes: 360,
};
const assignmentBucketData12 = {
    ID: uuid(),
    assignment_ID: assignment.assignment1.ID,
    startTime: day6.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
    bookedCapacityInMinutes: 420,
};

const assignmentBucket = [
    assignmentBucketData1,
    assignmentBucketData2,
    assignmentBucketData3,
    assignmentBucketData4,
    assignmentBucketData5,
    assignmentBucketData6,
    assignmentBucketData7,
    assignmentBucketData8,
    assignmentBucketData9,
    assignmentBucketData10,
    assignmentBucketData11,
    assignmentBucketData12,
];

module.exports = {
    assignmentBucket,
    assignmentBucketData1,
    assignmentBucketData2,
    assignmentBucketData3,
    assignmentBucketData4,
    assignmentBucketData5,
    assignmentBucketData6,
    assignmentBucketData7,
    assignmentBucketData8,
    assignmentBucketData9,
    assignmentBucketData10,
    assignmentBucketData11,
    assignmentBucketData12,
};
