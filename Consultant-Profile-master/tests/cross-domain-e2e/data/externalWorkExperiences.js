const uuid = require('uuid').v4;
const { employeeHeader4 } = require('./employeeHeaders');

const externalWorkExperience1 = {
    ID: uuid(),
    companyName: 'Cisco India',
    projectName: 'Master Data Management',
    customer: 'Internal',
    rolePlayed: 'Data Steward',
    startDate: '2010-02-20 00:00:00.000',
    endDate: '2012-10-17 00:00:00.000',
    employee_ID: employeeHeader4.ID,
    comments: 'Managed Customer Master Data',
};

const externalWorkExperiences = [
    externalWorkExperience1
];

module.exports = {
    externalWorkExperiences,
    externalWorkExperience1
};
