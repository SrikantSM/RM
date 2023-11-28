const projId = require('crypto-random-string');
const orgHeader = require('crypto-random-string');
const { customers } = require('./customers');

const projectData1 = {
    ID: projId({ length: 4 }),
    name: 'Implementation of SAP S/4HANA 1010',
    customer_ID: customers[0].ID,
    startDate: '2019-07-01',
    endDate: '2020-10-07',
    serviceOrganization_code: orgHeader({ length: 4 }),
};
const projectData2 = {
    ID: projId({ length: 4 }),
    name: 'Implementation of SAP S/4HANA 1011',
    customer_ID: customers[1].ID,
    startDate: '2019-07-01',
    endDate: '2020-10-07',
    serviceOrganization_code: orgHeader({ length: 4 }),
};

const project = [
    projectData1,
    projectData2,
];

module.exports = { project };
