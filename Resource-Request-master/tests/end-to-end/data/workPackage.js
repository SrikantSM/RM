const moment = require('moment');

const workPackages = [
    {
        ID: 'S4PROJ_CDE2E.1.1',
        name: 'Design',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        project_ID: 'S4PROJ_CDE2E'
    },
    {
        ID: 'S4PROJ_CDE2E.1.2',
        name: 'Development',
        startDate: moment().startOf('month').add(3, 'months').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(5, 'months').endOf('month').format('YYYY-MM-DD'),
        project_ID: 'S4PROJ_CDE2E'
    },
    {
        ID: 'EWMPRD_CDE2E.1.1',
        name: 'Concept and Design',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        project_ID: 'EWMPRD_CDE2E'
    },
    {
        ID: 'mockServerStrictMode',
        name: 'MockServerStrictMode',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        project_ID: 'S4INTPROJ_CDE2E'
    },
    {
        ID: 'TimeOutWP',
        name: 'TimeOutWP',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        project_ID: 'S4INTPROJ_CDE2E_2'
    }
];

module.exports = { workPackages };
