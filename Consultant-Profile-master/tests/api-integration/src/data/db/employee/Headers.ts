import { EmployeeHeader } from 'test-commons';
import { v4 as uuid } from 'uuid';

const employeeHeaderWithDescription1: EmployeeHeader = {
    ID: uuid(),
};

const employeeHeaderWithDescription2: EmployeeHeader = {
    ID: uuid(),
};

const employeeHeaderWithDescription3: EmployeeHeader = {
    ID: uuid(),
};

const employeeHeaderWithDescription4: EmployeeHeader = {
    ID: uuid(),
};

const technicalUserConsultantID: string = employeeHeaderWithDescription1.ID;

const loggedInUser: EmployeeHeader = {
    ID: technicalUserConsultantID,
};

const allEmployeeHeaders = [
    employeeHeaderWithDescription1,
    employeeHeaderWithDescription2,
    employeeHeaderWithDescription3,
    employeeHeaderWithDescription4,
];

export {
    allEmployeeHeaders,
    employeeHeaderWithDescription1,
    employeeHeaderWithDescription2,
    employeeHeaderWithDescription3,
    employeeHeaderWithDescription4,
    loggedInUser,
};
