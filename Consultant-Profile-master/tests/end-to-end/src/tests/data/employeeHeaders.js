const uuid = require('uuid').v4;

const employeeHeader1 = {
    ID: uuid(),
};

const employeeHeader2 = {
    ID: uuid(),
};

const employeeHeaders = [
    employeeHeader1,
    employeeHeader2,
];

module.exports = { employeeHeaders };
