const uuid = require('uuid').v4;
const { employeeHeaders } = require('./employeeHeaders');

const employeeHeader = employeeHeaders[0];

const attachment1 = {
    ID: uuid(),
    employee_ID: employeeHeader.ID,
};

const attachments = [
    attachment1,
];

module.exports = { attachments };
