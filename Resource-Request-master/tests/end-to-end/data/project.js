const moment = require('moment');

const projects = [
    {
        ID: 'S4PROJ_CDE2E',
        name: 'P1',//testRunID will get appended automatically
        customer_ID: '1000101CDE',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(1, 'years').format('YYYY-MM-DD'),
        serviceOrganization_code: 'Org_1'
    },
    {
        ID: 'EWMPRD_CDE2E',
        name: 'P2',//testRunID will get appended automatically
        customer_ID: '2000102CDE',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(1, 'years').format('YYYY-MM-DD'),
        serviceOrganization_code: 'Org_2'
    },
    {
        ID: 'S4INTPROJ_CDE2E',
        name: 'P3',//testRunID will get appended automatically
        customer_ID: '1000101CDE',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(1, 'years').format('YYYY-MM-DD'),
        serviceOrganization_code: 'Org_1'
    },
    {
        ID: 'S4INTPROJ_CDE2E_2',
        name: 'P4',//testRunID will get appended automatically
        customer_ID: '1000101CDE',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(1, 'years').format('YYYY-MM-DD'),
        serviceOrganization_code: 'Org_1'
    }
];

module.exports = { projects };
