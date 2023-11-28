const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');

const profilePhoto1 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader1.ID,
};

const profilePhoto2 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader2.ID,
};

const profilePhoto3 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader3.ID,
};

const profilePhoto4 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader4.ID,
};

const profilePhoto5 = {
    ID: uuid(),
    employee_ID: employeeHeaders.employeeHeader5.ID,
};

const profilePhotos = [
    profilePhoto1,
    profilePhoto2,
    profilePhoto3,
    profilePhoto4,
    profilePhoto5,
];

module.exports = {
    profilePhotos,
    profilePhoto1,
    profilePhoto2,
    profilePhoto3,
    profilePhoto4,
    profilePhoto5,
};
