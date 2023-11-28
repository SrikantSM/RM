const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');

const attachment1 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader1.ID,
};

const attachment2 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader2.ID,
};

const attachment3 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader3.ID,
};

const attachment4 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader4.ID,
};

const attachment5 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader5.ID,
};

const attachments = [
    attachment1,
    attachment2,
    attachment3,
    attachment4,
    attachment5,
];

module.exports = {
    attachments,
    attachment1,
    attachment2,
    attachment3,
    attachment4,
    attachment5,
};
