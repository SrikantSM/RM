const uuid = require('uuid').v4;
const { employeeHeaders } = require('./employeeHeaders');

const employeeHeader = employeeHeaders[0];

const profilePhoto1 = {
    ID: uuid(),
    employee_ID: employeeHeader.ID,
};

const profilePhotos = [
    profilePhoto1,
];

module.exports = { profilePhotos };
