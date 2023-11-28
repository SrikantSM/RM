const uuid = require('uuid').v4;
const { assignments } = require('./assignments');

const now = new Date(Date.now());
// current week
const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
const day1 = new Date(today.setDate(today.getDate() + 1));
const day2 = new Date(today.setDate(today.getDate() + 1));
const day3 = new Date(today.setDate(today.getDate() + 1));
const day4 = new Date(today.setDate(today.getDate() + 1));
const day5 = new Date(today.setDate(today.getDate() + 1));
// next week
const nextWeekDay1 = new Date(today.setDate(today.getDate() + 3));
const nextWeekDay2 = new Date(today.setDate(today.getDate() + 1));
const nextWeekDay3 = new Date(today.setDate(today.getDate() + 1));
const nextWeekDay4 = new Date(today.setDate(today.getDate() + 1));
const nextWeekDay5 = new Date(today.setDate(today.getDate() + 1));
// Set start of day
day1.setUTCHours(0, 0, 0, 0);
day2.setUTCHours(0, 0, 0, 0);
day3.setUTCHours(0, 0, 0, 0);
day4.setUTCHours(0, 0, 0, 0);
day5.setUTCHours(0, 0, 0, 0);
nextWeekDay1.setUTCHours(0, 0, 0, 0);
nextWeekDay2.setUTCHours(0, 0, 0, 0);
nextWeekDay3.setUTCHours(0, 0, 0, 0);
nextWeekDay4.setUTCHours(0, 0, 0, 0);
nextWeekDay5.setUTCHours(0, 0, 0, 0);

const assignmentBucket1Week1 = {
    ID: uuid(),
    assignment_ID: assignments[0].ID,
    startTime: day1.toJSON(),
    bookedCapacityInMinutes: 540,
};
const assignmentBucket2Week1 = {
    ID: uuid(),
    assignment_ID: assignments[1].ID,
    startTime: day2.toJSON(),
    bookedCapacityInMinutes: 420,
};
const assignmentBucket3Week1 = {
    ID: uuid(),
    assignment_ID: assignments[0].ID,
    startTime: day3.toJSON(),
    bookedCapacityInMinutes: 300,
};
const assignmentBucket4Week1 = {
    ID: uuid(),
    assignment_ID: assignments[1].ID,
    startTime: day4.toJSON(),
    bookedCapacityInMinutes: 300,
};

const assignmentBucket5Week1 = {
    ID: uuid(),
    assignment_ID: assignments[0].ID,
    startTime: day5.toJSON(),
    bookedCapacityInMinutes: 240,
};

const assignmentBucket1Week2 = {
    ID: uuid(),
    assignment_ID: assignments[0].ID,
    startTime: nextWeekDay1.toJSON(),
    bookedCapacityInMinutes: 420,
};
const assignmentBucket2Week2 = {
    ID: uuid(),
    assignment_ID: assignments[0].ID,
    startTime: nextWeekDay2.toJSON(),
    bookedCapacityInMinutes: 420,
};
const assignmentBucket3Week2 = {
    ID: uuid(),
    assignment_ID: assignments[0].ID,
    startTime: nextWeekDay3.toJSON(),
    bookedCapacityInMinutes: 120,
};
const assignmentBucket4Week2 = {
    ID: uuid(),
    assignment_ID: assignments[1].ID,
    startTime: nextWeekDay4.toJSON(),
    bookedCapacityInMinutes: 240,
};
const assignmentBucket5Week2 = {
    ID: uuid(),
    assignment_ID: assignments[1].ID,
    startTime: nextWeekDay5.toJSON(),
    bookedCapacityInMinutes: 300,
};

const assignmentBucket = [
    assignmentBucket1Week1,
    assignmentBucket2Week1,
    assignmentBucket3Week1,
    assignmentBucket4Week1,
    assignmentBucket5Week1,
    assignmentBucket1Week2,
    assignmentBucket2Week2,
    assignmentBucket3Week2,
    assignmentBucket4Week2,
    assignmentBucket5Week2,
];

module.exports = { assignmentBucket };
