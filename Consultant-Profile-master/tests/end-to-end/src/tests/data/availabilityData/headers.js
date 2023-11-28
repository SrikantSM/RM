const uuid = require('uuid').v4;

const employeeHeaderWithDescription1 = {
    ID: uuid(),
};

const employeeHeaderWithDescription2 = {
    ID: uuid(),
};

const employeeHeaderWithDescription3 = {
    ID: uuid(),
};

const employeeHeaders = [
    employeeHeaderWithDescription1,
    employeeHeaderWithDescription2,
    employeeHeaderWithDescription3,
];

module.exports = { employeeHeaders };
