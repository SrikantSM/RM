const uuid = require('uuid').v4;
const { employeeHeaders } = require('./employeeHeaders');

const employeeHeader = employeeHeaders[0];

const externalWorkExperience1 = {
    ID: uuid(),
    companyName: 'IBM India',
    projectName: 'Internal Sales',
    customer: 'Internal',
    rolePlayed: 'Sales Consultant',
    startDate: '2010-02-20 00:00:00.000',
    endDate: '2012-10-17 00:00:00.000',
    employee_ID: employeeHeader.ID,
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
};
const externalWorkExperience2 = {
    ID: uuid(),
    companyName: 'MAS',
    projectName: 'Nike SD',
    customer: 'Nike Sports',
    rolePlayed: 'ABAP Consultant',
    startDate: '2009-03-26 00:00:00.000',
    endDate: '2013-11-20 00:00:00.000',
    employee_ID: employeeHeader.ID,
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
};
const externalWorkExperiences = [
    externalWorkExperience1,
    externalWorkExperience2,
];

module.exports = { externalWorkExperiences };
