import { WorkAssignment } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    workforcePersonWithDescription1,
    workforcePersonWithDescription2,
    workforcePersonWithDescription3,
    workforcePersonManagerWithDescription,
} from './WorkforcePerson';

const workAssignment1: WorkAssignment = {
    ID: uuid(),
    workAssignmentID: 'workAssignmentExternalID1',
    externalID: 'workAssignmentExternalID1',
    startDate: '2015-11-12',
    endDate: '2019-11-12',
    parent: workforcePersonWithDescription1.ID,
    isContingentWorker: false,
};

const workAssignment2: WorkAssignment = {
    ID: uuid(),
    workAssignmentID: 'workAssignmentExternalID2',
    externalID: 'workAssignmentExternalID2',
    startDate: '2019-11-13',
    endDate: '9999-11-12',
    parent: workforcePersonWithDescription1.ID,
    isContingentWorker: false,
};

const workAssignment3: WorkAssignment = {
    ID: uuid(),
    workAssignmentID: 'workAssignmentExternalID3',
    externalID: 'workAssignmentExternalID3',
    startDate: '2018-11-12',
    endDate: '9999-11-12',
    parent: workforcePersonWithDescription2.ID,
    isContingentWorker: false,
};

const workAssignment4: WorkAssignment = {
    ID: uuid(),
    workAssignmentID: 'workAssignmentExternalID4',
    externalID: 'workAssignmentExternalID4',
    startDate: '2018-11-12',
    endDate: '9999-11-12',
    parent: workforcePersonManagerWithDescription.ID,
    isContingentWorker: false,
};

const workAssignment5: WorkAssignment = {
    ID: uuid(),
    workAssignmentID: 'workAssignmentExternalID5',
    externalID: 'workAssignmentExternalID5',
    startDate: '2019-12-13',
    endDate: '9999-11-12',
    parent: workforcePersonWithDescription1.ID,
    isContingentWorker: false,
};

const workAssignment6: WorkAssignment = {
    ID: uuid(),
    workAssignmentID: 'workAssignmentExternalID6',
    externalID: 'workAssignmentExternalID6',
    startDate: '2019-12-13',
    endDate: '9999-11-12',
    parent: workforcePersonWithDescription3.ID,
    isContingentWorker: false,
};

const allWorkAssignment = [
    workAssignment1,
    workAssignment2,
    workAssignment3,
    workAssignment4,
    workAssignment5,
    workAssignment6,
];

export {
    allWorkAssignment,
    workAssignment1,
    workAssignment2,
    workAssignment3,
    workAssignment4,
    workAssignment5,
    workAssignment6,
};
