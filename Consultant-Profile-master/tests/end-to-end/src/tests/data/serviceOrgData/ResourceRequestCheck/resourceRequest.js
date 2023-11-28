const uuid = require('uuid').v4;
const { rrResourceOrganizations } = require('./resourceOrganization');
const { workpackage } = require('../../workPackage');
const { projectRoles } = require('../../projectRoles');
const { project } = require('../../project');

const resourceRequestStartDate = '2019-01-01';
const resourceRequestEndDate = '2019-03-01';

const resourceRequestData1 = {
    ID: uuid(),
    name: workpackage[1].name,
    displayId: workpackage[1].ID,
    isS4Cloud: true,
    demand_ID: '',
    workpackage_ID: workpackage[1].ID,
    project_ID: project[1].ID,
    projectRole_ID: projectRoles[1].ID,
    requestedResourceOrg_ID: rrResourceOrganizations[0].displayId,
    processingResourceOrg_ID: rrResourceOrganizations[0].displayId,
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
    description: 'Resource Request for ABAP in Resource Management',
};

const rrResourceRequestData = [
    resourceRequestData1,
];

module.exports = { rrResourceRequestData };
