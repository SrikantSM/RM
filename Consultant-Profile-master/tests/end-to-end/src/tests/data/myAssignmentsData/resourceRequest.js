const uuid = require('uuid').v4;
const { projectRoles } = require('./projectRoles');
const { workpackage } = require('./workPackage');
const { project } = require('./project');
const demand = require('./demand');

const description1 = 'Resource Request for JAVA in Resource Management MA';
const description2 = 'Resource Request for Javascript in Resource Management MA';
const resourceRequestStartDate = '2019-01-01';
const resourceRequestEndDate = '2019-03-01';

const resourceRequestDesc1 = {
    description: description1,
};

const resourceRequestDesc2 = {
    description: description2,
};

const allResourceRequestDesc = [
    resourceRequestDesc1,
    resourceRequestDesc2,
];

const resourceRequestData1 = {
    ID: uuid(),
    name: workpackage[0].name,
    displayId: workpackage[0].ID,
    isS4Cloud: true,
    demand_ID: demand.demandData1.ID,
    workpackage_ID: workpackage[0].ID,
    project_ID: project[0].ID,
    projectRole_ID: projectRoles[0].ID,
    priority_code: 2,
    requestStatus_code: 1,
    releaseStatus_code: 1,
    resourceKind_code: '1',
    startDate: resourceRequestStartDate,
    endDate: resourceRequestEndDate,
    startTime: `${resourceRequestStartDate} 00:00:00.000`,
    endTime: `${resourceRequestEndDate} 00:00:00.000`,
    resourceManager: '',
    processor: '',
    requestedCapacity: 35000,
    requestedUnit: 'min',
    requestedCapacityInMinutes: 35000,
    description: description1,
};

const resourceRequestData2 = {
    ID: uuid(),
    name: workpackage[1].name,
    displayId: workpackage[1].ID,
    isS4Cloud: true,
    demand_ID: demand.demandData2.ID,
    workpackage_ID: workpackage[1].ID,
    project_ID: project[1].ID,
    projectRole_ID: projectRoles[1].ID,
    priority_code: 2,
    requestStatus_code: 1,
    releaseStatus_code: 1,
    resourceKind_code: '1',
    startDate: resourceRequestStartDate,
    endDate: resourceRequestEndDate,
    startTime: `${resourceRequestStartDate} 00:00:00.000`,
    endTime: `${resourceRequestEndDate} 00:00:00.000`,
    resourceManager: '',
    processor: '',
    requestedCapacity: 20000,
    requestedUnit: 'min',
    requestedCapacityInMinutes: 20000,
    description: description2,
};

const resourceRequestData = [
    resourceRequestData1,
    resourceRequestData2,
];

module.exports = { resourceRequestData, allResourceRequestDesc };
