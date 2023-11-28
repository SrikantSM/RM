const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');

const work1 = {
    ID: uuid(),
    companyName: 'IBM India',
    projectName: 'Internal Sales',
    customer: 'Internal',
    rolePlayed: 'Sales Consultant',
    startDate: '2010-02-20',
    endDate: '2012-10-17',
    employee_ID: employeeHeaders.employeeHeader1.ID,
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
};

const work2 = {
    ID: uuid(),
    companyName: 'MAS',
    projectName: 'Nike SD',
    customer: 'Nike Sports',
    rolePlayed: 'ABAP Consultant',
    startDate: '2009-03-26',
    endDate: '2013-11-20',
    employee_ID: employeeHeaders.employeeHeader1.ID,
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
};

const work3 = {
    ID: uuid(),
    companyName: 'TCS',
    projectName: 'Sales',
    customer: 'Nike',
    rolePlayed: 'Consultant',
    startDate: '2007-02-10',
    endDate: '2009-10-18',
    employee_ID: employeeHeaders.employeeHeader1.ID,
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
};

const work4 = {
    ID: uuid(),
    companyName: 'MAS',
    projectName: 'Nike SD',
    customer: 'Nike Sports',
    rolePlayed: 'ABAP Consultant',
    startDate: '2009-03-26',
    endDate: '2013-11-20',
    employee_ID: employeeHeaders.employeeHeader2.ID,
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
};

const work5 = {
    ID: uuid(),
    companyName: 'IBM India',
    projectName: 'Internal Sales',
    customer: 'Internal',
    rolePlayed: 'Sales Consultant',
    startDate: '2010-02-20',
    endDate: '2012-10-17',
    employee_ID: employeeHeaders.employeeHeader3.ID,
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
};

const work6 = {
    ID: uuid(),
    companyName: 'MAS',
    projectName: 'Nike SD',
    customer: 'Nike Sports',
    rolePlayed: 'ABAP Consultant',
    startDate: '2009-03-26',
    endDate: '2013-11-20',
    employee_ID: employeeHeaders.employeeHeader3.ID,
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
};

const work7 = {
    ID: uuid(),
    companyName: 'IBM India',
    projectName: 'Internal Sales',
    customer: 'Internal',
    rolePlayed: 'Sales Consultant',
    startDate: '2010-02-20',
    endDate: '2012-10-17',
    employee_ID: employeeHeaders.employeeHeader4.ID,
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
};

const work8 = {
    ID: uuid(),
    companyName: 'MAS',
    projectName: 'Nike SD',
    customer: 'Nike Sports',
    rolePlayed: 'ABAP Consultant',
    startDate: '2009-03-26',
    endDate: '2013-11-20',
    employee_ID: employeeHeaders.employeeHeader4.ID,
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
};

const externalWorkExperiences = [
    work1,
    work2,
    work3,
    work4,
    work5,
    work6,
    work7,
    work8,
];

module.exports = {
    externalWorkExperiences,
    work1,
    work2,
    work3,
    work4,
    work5,
    work6,
    work7,
    work8,
};
