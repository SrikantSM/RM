import { ResourceHeader } from 'test-commons';
import {
    workAssignment1,
    workAssignment2,
    workAssignment3,
    workAssignment5,
    workAssignment6,
} from '../employee/WorkAssignment';

const resourceHeader1: ResourceHeader = {
    ID: workAssignment1.ID,
    type_code: '05',
};

const resourceHeader2: ResourceHeader = {
    ID: workAssignment2.ID,
    type_code: '05',
};

const resourceHeader3: ResourceHeader = {
    ID: workAssignment3.ID,
    type_code: '05',
};

const resourceHeader5: ResourceHeader = {
    ID: workAssignment5.ID,
    type_code: '05',
};

const resourceHeader6: ResourceHeader = {
    ID: workAssignment6.ID,
    type_code: '05',
};

const allResourceHeaders = [
    resourceHeader1,
    resourceHeader2,
    resourceHeader3,
    resourceHeader5,
    resourceHeader6,
];

export {
    allResourceHeaders,
    resourceHeader1,
    resourceHeader2,
    resourceHeader3,
    resourceHeader5,
    resourceHeader6,
};
