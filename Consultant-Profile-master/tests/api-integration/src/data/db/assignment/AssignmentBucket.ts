import { AssignmentBucket } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { assignment1, assignment3 } from './Assignments';

const now = new Date(Date.now());

const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
const nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
const nowPlusTwoMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 2, 1));
const nowPlusThreeMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 3, 1));
const nowPlusFourMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 4, 1));
const nowPlusFiveMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 5, 1));

const assignmentBucket11: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment1.ID,
    startTime: currentMonthStart.toJSON(),
    bookedCapacityInMinutes: 240,
};

const assignmentBucket12: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment1.ID,
    startTime: nowPlusOneMonthStart.toJSON(),
    bookedCapacityInMinutes: 360,
};

const assignmentBucket13: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment1.ID,
    startTime: nowPlusTwoMonthsStart.toJSON(),
    bookedCapacityInMinutes: 384,
};

const assignmentBucket14: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment1.ID,
    startTime: nowPlusThreeMonthsStart.toJSON(),
    bookedCapacityInMinutes: 552,
};

const assignmentBucket15: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment1.ID,
    startTime: nowPlusFourMonthsStart.toJSON(),
    bookedCapacityInMinutes: 624,
};

const assignmentBucket16: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment1.ID,
    startTime: nowPlusFiveMonthsStart.toJSON(),
    bookedCapacityInMinutes: 0,
};

const assignmentBucket31: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment3.ID,
    startTime: currentMonthStart.toJSON(),
    bookedCapacityInMinutes: 240,
};

const assignmentBucket32: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment3.ID,
    startTime: nowPlusOneMonthStart.toJSON(),
    bookedCapacityInMinutes: 360,
};

const assignmentBucket33: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment3.ID,
    startTime: nowPlusTwoMonthsStart.toJSON(),
    bookedCapacityInMinutes: 384,
};

const assignmentBucket34: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment3.ID,
    startTime: nowPlusThreeMonthsStart.toJSON(),
    bookedCapacityInMinutes: 552,
};

const assignmentBucket35: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment3.ID,
    startTime: nowPlusFourMonthsStart.toJSON(),
    bookedCapacityInMinutes: 624,
};

const assignmentBucket36: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment3.ID,
    startTime: nowPlusFiveMonthsStart.toJSON(),
    bookedCapacityInMinutes: 0,
};

const allAssignmentBuckets = [
    assignmentBucket11,
    assignmentBucket12,
    assignmentBucket13,
    assignmentBucket14,
    assignmentBucket15,
    assignmentBucket16,
    assignmentBucket31,
    assignmentBucket32,
    assignmentBucket33,
    assignmentBucket34,
    assignmentBucket35,
    assignmentBucket36,
];

export {
    allAssignmentBuckets,
    assignmentBucket11,
    assignmentBucket12,
    assignmentBucket13,
    assignmentBucket14,
    assignmentBucket15,
    assignmentBucket16,
    assignmentBucket31,
    assignmentBucket32,
    assignmentBucket33,
    assignmentBucket34,
    assignmentBucket35,
    assignmentBucket36,
};
