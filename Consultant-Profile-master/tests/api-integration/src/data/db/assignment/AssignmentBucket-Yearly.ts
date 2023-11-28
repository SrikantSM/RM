import { v4 as uuid } from 'uuid';
import { AssignmentBucket } from 'test-commons';
import { assignment1, assignment2, assignment3 } from './Assignments';

const now = new Date(Date.now());

const currentYearStart = new Date(Date.UTC(now.getFullYear(), 0, 1));

const assignmentBucket1Yearly: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment1.ID,
    startTime: currentYearStart.toJSON(),
    bookedCapacityInMinutes: 240,
};

const assignmentBucket2Yearly: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment2.ID,
    startTime: currentYearStart.toJSON(),
    bookedCapacityInMinutes: 360,
};

const assignmentBucket3Yearly: AssignmentBucket = {
    ID: uuid(),
    assignment_ID: assignment3.ID,
    startTime: currentYearStart.toJSON(),
    bookedCapacityInMinutes: 240,
};

const allAssignmentBucketsYearly = [
    assignmentBucket1Yearly,
    assignmentBucket2Yearly,
    assignmentBucket3Yearly,
];

export {
    allAssignmentBucketsYearly,
    assignmentBucket1Yearly,
    assignmentBucket2Yearly,
    assignmentBucket3Yearly,
};
