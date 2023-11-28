const workpackageId = require('crypto-random-string');
const { project } = require('./project');

const workpackageData1 = {
    ID: workpackageId({ length: 4 }),
    name: 'Design',
    startDate: '2019-07-01',
    endDate: '2020-10-07',
    project_ID: project[0].ID,
};

const workpackageData2 = {
    ID: workpackageId({ length: 4 }),
    name: 'Concept and Design',
    startDate: '2018-01-10',
    endDate: '2021-01-01',
    project_ID: project[1].ID,
};

const workpackage = [
    workpackageData1,
    workpackageData2,
];

module.exports = { workpackage };
