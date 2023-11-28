import { BookedCapacityAggregate } from 'test-commons';
import { assignment1, assignment2, assignment3 } from '../assignment/Assignments';
import {
    assignmentBucket11, assignmentBucket12, assignmentBucket13, assignmentBucket14, assignmentBucket15, assignmentBucket16,
    assignmentBucket31, assignmentBucket32, assignmentBucket33, assignmentBucket34, assignmentBucket35, assignmentBucket36,
} from '../assignment/AssignmentBucket';
import { assignmentBucket1Yearly, assignmentBucket2Yearly } from '../assignment/AssignmentBucket-Yearly';

const bookedCapacityAggregate11: BookedCapacityAggregate = {
    resourceID: assignment1.resource_ID!,
    startTime: assignmentBucket11.startTime,
    bookedCapacityInMinutes: assignmentBucket11.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate12: BookedCapacityAggregate = {
    resourceID: assignment1.resource_ID!,
    startTime: assignmentBucket12.startTime,
    bookedCapacityInMinutes: assignmentBucket12.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate13: BookedCapacityAggregate = {
    resourceID: assignment1.resource_ID!,
    startTime: assignmentBucket13.startTime,
    bookedCapacityInMinutes: assignmentBucket13.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate14: BookedCapacityAggregate = {
    resourceID: assignment1.resource_ID!,
    startTime: assignmentBucket14.startTime,
    bookedCapacityInMinutes: assignmentBucket14.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate15: BookedCapacityAggregate = {
    resourceID: assignment1.resource_ID!,
    startTime: assignmentBucket15.startTime,
    bookedCapacityInMinutes: assignmentBucket15.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate16: BookedCapacityAggregate = {
    resourceID: assignment1.resource_ID!,
    startTime: assignmentBucket16.startTime,
    bookedCapacityInMinutes: assignmentBucket16.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate17: BookedCapacityAggregate = {
    resourceID: assignment1.resource_ID!,
    startTime: assignmentBucket1Yearly.startTime,
    bookedCapacityInMinutes: assignmentBucket1Yearly.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate21: BookedCapacityAggregate = {
    resourceID: assignment2.resource_ID!,
    startTime: assignmentBucket2Yearly.startTime,
    bookedCapacityInMinutes: assignmentBucket2Yearly.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate31: BookedCapacityAggregate = {
    resourceID: assignment3.resource_ID!,
    startTime: assignmentBucket31.startTime,
    bookedCapacityInMinutes: assignmentBucket31.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate32: BookedCapacityAggregate = {
    resourceID: assignment3.resource_ID!,
    startTime: assignmentBucket32.startTime,
    bookedCapacityInMinutes: assignmentBucket32.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate33: BookedCapacityAggregate = {
    resourceID: assignment3.resource_ID!,
    startTime: assignmentBucket33.startTime,
    bookedCapacityInMinutes: assignmentBucket33.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate34: BookedCapacityAggregate = {
    resourceID: assignment3.resource_ID!,
    startTime: assignmentBucket34.startTime,
    bookedCapacityInMinutes: assignmentBucket34.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate35: BookedCapacityAggregate = {
    resourceID: assignment3.resource_ID!,
    startTime: assignmentBucket35.startTime,
    bookedCapacityInMinutes: assignmentBucket35.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const bookedCapacityAggregate36: BookedCapacityAggregate = {
    resourceID: assignment3.resource_ID!,
    startTime: assignmentBucket36.startTime,
    bookedCapacityInMinutes: assignmentBucket36.bookedCapacityInMinutes,
    softBookedCapacityInMinutes: 0,
};

const allBookedCapacityAggregates = [
    bookedCapacityAggregate11,
    bookedCapacityAggregate12,
    bookedCapacityAggregate13,
    bookedCapacityAggregate14,
    bookedCapacityAggregate15,
    bookedCapacityAggregate16,
    bookedCapacityAggregate31,
    bookedCapacityAggregate32,
    bookedCapacityAggregate33,
    bookedCapacityAggregate34,
    bookedCapacityAggregate35,
    bookedCapacityAggregate36,
];

const allBookedCapacityAggregatesYearly = [
    bookedCapacityAggregate17,
    bookedCapacityAggregate21,
];

export {
    allBookedCapacityAggregates,
    allBookedCapacityAggregatesYearly,
    bookedCapacityAggregate11,
    bookedCapacityAggregate12,
    bookedCapacityAggregate13,
    bookedCapacityAggregate14,
    bookedCapacityAggregate15,
    bookedCapacityAggregate16,
    bookedCapacityAggregate17,
    bookedCapacityAggregate21,
    bookedCapacityAggregate31,
    bookedCapacityAggregate32,
    bookedCapacityAggregate33,
    bookedCapacityAggregate34,
    bookedCapacityAggregate35,
    bookedCapacityAggregate36,
};
