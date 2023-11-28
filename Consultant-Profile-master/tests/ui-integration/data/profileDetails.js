const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');

const profileDetail1 = {
    ID: '99e475c0-1f0b-4fd3-80f3-29b98ae5f1dc',
    firstName: 'Test',
    lastName: 'Usere2e1',
    fullName: 'Test Usere2e1',
    initials: 'TU',
    parent: employeeHeaders.employeeHeader1.ID,
    validFrom: '1985-03-03',
    validTo: '9999-12-31',
};

const profileDetail2 = {
    ID: uuid(),
    firstName: 'Test',
    lastName: 'Usere2e2',
    fullName: 'Test Usere2e2',
    initials: 'TU',
    parent: employeeHeaders.employeeHeader2.ID,
    validFrom: '1999-01-02',
    validTo: '9999-12-31',
};

const profileDetail3 = {
    ID: uuid(),
    firstName: 'Test',
    lastName: 'Usere2e3',
    fullName: 'Test Usere2e3',
    initials: 'TU',
    parent: employeeHeaders.employeeHeader3.ID,
    validFrom: '1985-03-03',
    validTo: '9999-12-31',
};

const profileDetail4 = {
    ID: uuid(),
    firstName: 'Test',
    lastName: 'Usere2e4',
    fullName: 'Test Usere2e4',
    initials: 'TU',
    parent: employeeHeaders.employeeHeader4.ID,
    validFrom: '1999-01-02',
    validTo: '9999-12-31',
};

const profileDetail5 = {
    ID: uuid(),
    firstName: 'Test',
    lastName: 'Usere2e5',
    fullName: 'Test Usere2e5',
    initials: 'TU',
    parent: employeeHeaders.employeeHeader5.ID,
    validFrom: '1999-01-02',
    validTo: '9999-12-31',
};

const profileDetails = [
    profileDetail1,
    profileDetail2,
    profileDetail3,
    profileDetail4,
    profileDetail5,
];

module.exports = {
    profileDetails,
    profileDetail1,
    profileDetail2,
    profileDetail3,
    profileDetail4,
    profileDetail5,
};
