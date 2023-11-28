const uuid = require('uuid').v4;

const employeeHeader1 = {
    ID: '6ed817cc-136a-45be-9b94-790663447716',
};

const employeeHeader2 = {
    ID: uuid(),
};

const employeeHeader3 = {
    ID: uuid(),
};

const employeeHeader4 = {
    ID: uuid(),
};

const employeeHeader5 = {
    ID: uuid(),
};

const employeeHeaders = [
    employeeHeader1,
    employeeHeader2,
    employeeHeader3,
    employeeHeader4,
    employeeHeader5,
];

module.exports = {
    employeeHeaders,
    employeeHeader1,
    employeeHeader2,
    employeeHeader3,
    employeeHeader4,
    employeeHeader5,
};
