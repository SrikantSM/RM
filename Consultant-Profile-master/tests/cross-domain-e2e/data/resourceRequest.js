const uuid = require('uuid').v4;
const { projectRoles } = require('./projectRoles');

const resourceRequestData1 = {
    ID: uuid(),
    name: 'Design',
    displayId: 'S4PROJ.1.1',
    isS4Cloud: true,
    demand_ID: '',
    workpackage_ID: 'S4PROJ.1.1',
    project_ID: 'S4PROJ',
    projectRole_ID: projectRoles[0].ID,
    requestedResourceOrg_ID: "Org_5",
    processingResourceOrg_ID: "Org_5",
    priority_code: 2,
    requestStatus_code: 0,
    releaseStatus_code: 1,
    resourceKind_code: '1',
    startDate: '2017-01-01',
    endDate: '2099-12-31',
    resourceManager: '',
    processor: '',
    requestedCapacity: 35000,
    requestedUnit: 'min',
    requestedCapacityInMinutes: 35000,
    description: 'Resource Request for JAVA in Resource Management',
};

const resourceRequestData2 = {
    ID: uuid(),
    name: 'Design & Concept',
    displayId: 'S4PROJ.1.2',
    isS4Cloud: true,
    demand_ID: '',
    workpackage_ID: 'S4PROJ.1.2',
    project_ID: 'S4PROJ1',
    projectRole_ID: projectRoles[0].ID,
    requestedResourceOrg_ID: "Org_6",
    processingResourceOrg_ID: "Org_6",
    priority_code: 2,
    requestStatus_code: 0,
    releaseStatus_code: 1,
    resourceKind_code: '1',
    startDate: '2017-01-01',
    endDate: '2099-12-31',
    resourceManager: '',
    processor: '',
    requestedCapacity: 35000,
    requestedUnit: 'min',
    requestedCapacityInMinutes: 35000,
    description: 'Resource Request for JAVA in Resource Management',
};

const resourceRequest = [
    resourceRequestData1,
    resourceRequestData2
];

module.exports = { resourceRequest };
