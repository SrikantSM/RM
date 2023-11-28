const employeeHeaders = require('./employeeHeaders');

const profileDetail1 = {   
    ID : '580c8162-64a0-11ed-9022-0242ac120002',
    firstName : 'Test',
    lastName : 'Usere2e4',
    fullName: 'Test Usere2e4',
    initials: 'TU',
    parent : employeeHeaders.employeeHeader1.ID,
    validFrom : '1999-01-02',
    validTo : '9999-12-31'

}

const profileDetails = [
    profileDetail1,
]

module.exports = {
    profileDetails,
    profileDetail1,

};
