const uuid = require('uuid').v4;
const projectRoles = require('./projectRoles');
const resourceOrg = require('./resourceOrganizations');

const resourceRequestData1 = {
    ID: uuid(),
    name: 'Design',
    displayId: 'S4PROJ.1.1',
    isS4Cloud: true,
    demand_ID: '',
    workpackage_ID: 'S4PROJ.1.1',
    project_ID: 'S4PROJ',
    projectRole_ID: projectRoles.projectRole1.ID,
    requestedResourceOrg_ID: resourceOrg.resourceOrganization1.displayId,
    processingResourceOrg_ID: resourceOrg.resourceOrganization1.displayId,
    priority_code: 2,
    requestStatus_code: 1,
    releaseStatus_code: 1,
    resourceKind_code: '1',
    startDate: '2019-01-01',
    endDate: '2019-03-31',
    resourceManager: '',
    processor: '',
    requestedCapacity: 35000,
    requestedUnit: 'min',
    requestedCapacityInMinutes: 35000,
    description: 'Resource Request for JAVA in Resource Management',
};

const resourceRequestData2 = {
    ID: uuid(),
    name: 'Concept and Design',
    displayId: 'EWMPRD.1.1',
    isS4Cloud: true,
    demand_ID: '',
    workpackage_ID: 'EWMPRD.1.1',
    project_ID: 'EWMPRD',
    projectRole_ID: projectRoles.projectRole2.ID,
    requestedResourceOrg_ID: resourceOrg.resourceOrganization2.displayId,
    processingResourceOrg_ID: resourceOrg.resourceOrganization2.displayId,
    priority_code: 2,
    requestStatus_code: 1,
    releaseStatus_code: 1,
    resourceKind_code: '1',
    startDate: '2019-01-01',
    endDate: '2019-03-31',
    resourceManager: '',
    processor: '',
    requestedCapacity: 20000,
    requestedUnit: 'min',
    requestedCapacityInMinutes: 20000,
    description: 'Resource Request for Javascript in Resource Management',
};

const resourceRequestData = [
    resourceRequestData1,
    resourceRequestData2,
];

module.exports = {
    resourceRequestData,
    resourceRequestData1,
    resourceRequestData2,
};
