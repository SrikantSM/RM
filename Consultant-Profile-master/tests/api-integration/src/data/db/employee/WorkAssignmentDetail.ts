import { WorkAssignmentDetail } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    workAssignment1,
    workAssignment2,
    workAssignment3,
    workAssignment4,
    workAssignment5,
    workAssignment6,
} from './WorkAssignment';

const workAssignmentDetail1: WorkAssignmentDetail = {
    ID: uuid(),
    validFrom: workAssignment1.startDate,
    validTo: workAssignment1.endDate,
    parent: workAssignment1.ID,
    isPrimary: true,
};

const workAssignmentDetail2: WorkAssignmentDetail = {
    ID: uuid(),
    validFrom: workAssignment2.startDate,
    validTo: workAssignment2.endDate,
    parent: workAssignment2.ID,
    isPrimary: true,
};

const workAssignmentDetail3: WorkAssignmentDetail = {
    ID: uuid(),
    validFrom: workAssignment3.startDate,
    validTo: workAssignment3.endDate,
    parent: workAssignment3.ID,
    isPrimary: true,
};

const workAssignmentDetail4: WorkAssignmentDetail = {
    ID: uuid(),
    validFrom: workAssignment4.startDate,
    validTo: workAssignment4.endDate,
    parent: workAssignment4.ID,
    isPrimary: true,
};

const workAssignmentDetail5: WorkAssignmentDetail = {
    ID: uuid(),
    validFrom: workAssignment5.startDate,
    validTo: workAssignment5.endDate,
    parent: workAssignment5.ID,
    isPrimary: false,
};

const workAssignmentDetail6: WorkAssignmentDetail = {
    ID: uuid(),
    validFrom: workAssignment6.startDate,
    validTo: workAssignment6.endDate,
    parent: workAssignment6.ID,
    isPrimary: true,
};

const allWorkAssignmentDetail = [
    workAssignmentDetail1,
    workAssignmentDetail2,
    workAssignmentDetail3,
    workAssignmentDetail4,
    workAssignmentDetail5,
    workAssignmentDetail6,
];

export {
    allWorkAssignmentDetail,
    workAssignmentDetail1,
    workAssignmentDetail2,
    workAssignmentDetail3,
    workAssignmentDetail4,
    workAssignmentDetail5,
    workAssignmentDetail6,
};
