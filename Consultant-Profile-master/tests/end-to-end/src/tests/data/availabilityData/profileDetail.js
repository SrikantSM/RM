const uuid = require('uuid').v4;
// const { workforcePersons } = require('./workforcePerson');
const { employeeHeaders } = require('./headers');

/* const workforcePersonWithDescription1 = workforcePersons[0];
const workforcePersonWithDescription2 = workforcePersons[1];
const workforcePersonManagerWithDescription = workforcePersons[2]; */

const employee1 = employeeHeaders[0];
const employee2 = employeeHeaders[1];
const employee3 = employeeHeaders[2];

const profileDetail1 = {
    ID: uuid(),
    firstName: 'firstName1',
    lastName: 'lastName1',
    fullName: 'firstName1 lastName1',
    initials: 'FL',
    parent: employee1.ID,
    validFrom: '2015-01-01',
    validTo: '2018-01-01',
};
const profileDetail4 = {
    ID: uuid(),
    firstName: 'firstName4',
    lastName: 'lastName4',
    fullName: 'firstName4 lastName4',
    initials: 'FL',
    parent: employee1.ID,
    validFrom: '2018-01-02',
    validTo: '9999-01-01',
};

const profileDetail2 = {
    ID: uuid(),
    firstName: 'firstName2',
    lastName: 'lastName2',
    fullName: 'firstName2 lastName2',
    initials: 'FL',
    parent: employee2.ID,
    validFrom: '2018-01-01',
    validTo: '2020-01-01',
};

const profileDetail3 = {
    ID: uuid(),
    firstName: 'firstName3',
    lastName: 'lastName3',
    fullName: 'firstName3 lastName3',
    initials: 'FL',
    parent: employee2.ID,
    validFrom: '2020-01-02',
    validTo: '9999-01-01',
};

const profileDetail5 = {
    ID: uuid(),
    firstName: 'firstName5',
    lastName: 'lastName5',
    fullName: 'firstName5 lastName5',
    initials: 'FL',
    parent: employee3.ID,
    validFrom: '2020-01-02',
    validTo: '9999-01-01',
};

const profileDetails = [
    profileDetail1,
    profileDetail2,
    profileDetail3,
    profileDetail4,
    profileDetail5,
];

module.exports = { profileDetails };
