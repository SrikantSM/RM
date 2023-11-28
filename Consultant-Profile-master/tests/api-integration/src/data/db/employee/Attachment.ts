import { Attachment } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    employeeHeaderWithDescription1, employeeHeaderWithDescription2, employeeHeaderWithDescription3, employeeHeaderWithDescription4,
} from './Headers';

const Attachment1: Attachment = {
    ID: uuid(),
    content: null!,
    employee_ID: employeeHeaderWithDescription1.ID,
    fileName: null!,
};

const Attachment2: Attachment = {
    ID: uuid(),
    content: null!,
    employee_ID: employeeHeaderWithDescription2.ID,
    fileName: null!,
};

const Attachment3: Attachment = {
    ID: uuid(),
    content: null!,
    employee_ID: employeeHeaderWithDescription3.ID,
    fileName: null!,
};

const Attachment4: Attachment = {
    ID: uuid(),
    content: null!,
    employee_ID: employeeHeaderWithDescription4.ID,
    fileName: null!,
};

const allAttachments = [
    Attachment1,
    Attachment2,
    Attachment3,
    Attachment4,
];

export {
    allAttachments,
    Attachment1,
    Attachment2,
    Attachment3,
    Attachment4,
};
