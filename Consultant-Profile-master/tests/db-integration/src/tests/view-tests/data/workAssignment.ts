import { WorkAssignment } from 'test-commons';
import { v4 as uuid } from 'uuid';

const workAssignment1: WorkAssignment = {
    ID: uuid(),
    workAssignmentID: uuid(),
    externalID: 'randonExternalID',
    parent: uuid(),
    startDate: '2018-01-01',
    endDate: '9999-12-31',
};

const allWorkAssignments = [
    workAssignment1,
];

export {
    allWorkAssignments,
    workAssignment1,
};
