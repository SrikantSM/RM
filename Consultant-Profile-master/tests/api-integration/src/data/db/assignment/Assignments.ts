import { Assignments } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { resourceHeader2, resourceHeader3, resourceHeader6 } from '../resource/Resource-Header';
import { resourceRequestData1, resourceRequestData2 } from '../resourceRequest/resource-request';

const assignment1: Assignments = {
    ID: uuid(),
    bookedCapacityInMinutes: 1500,
    assignmentstatus_code: 1,
    resourceRequest_ID: resourceRequestData1.ID,
    resource_ID: resourceHeader2.ID,
};

const assignment2: Assignments = {
    ID: uuid(),
    bookedCapacityInMinutes: 2000,
    assignmentstatus_code: 0,
    resourceRequest_ID: resourceRequestData2.ID,
    resource_ID: resourceHeader3.ID,
};

const assignment3: Assignments = {
    ID: uuid(),
    bookedCapacityInMinutes: 1500,
    assignmentstatus_code: 1,
    resourceRequest_ID: resourceRequestData1.ID,
    resource_ID: resourceHeader6.ID,
};

const allAssignments = [
    assignment1,
    assignment2,
    assignment3,
];

export {
    allAssignments,
    assignment1,
    assignment2,
    assignment3,
};
