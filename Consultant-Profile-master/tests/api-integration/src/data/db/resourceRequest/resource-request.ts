import { ResourceRequest } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { projectRoleWithDescription1, projectRoleWithDescription2 } from '../config/ProjectRoles';
import {
    resourceOrganization1,
    resourceOrganization2,
    resourceOrganization5,
} from '../resourceOrganization/ResourceOrganizations';
import { demand1, demand2 } from './demand';

const description1 = 'API test Resource Request for JAVA in Resource Management';
const description2 = 'API test Resource Request for Javascript in Resource Management';
const description3 = 'API test Resource Request for RO RO1 in Resource Management';
const description4 = 'API test Resource Request for RO RO2 in Resource Management';

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

const resourceRequestStartDate = '2019-01-01';
const resourceRequestEndDate = '2019-03-01';

const resourceRequestData1: ResourceRequest = {
    ID: uuid(),
    name: `Name_${uuid()}`,
    displayId: uuid().substring(26),
    isS4Cloud: true,
    demand_ID: demand1.ID,
    workpackage_ID: 'S4PROJ.1.1',
    project_ID: 'S4PROJ',
    projectRole_ID: projectRoleWithDescription1.ID,
    requestedResourceOrg_ID: resourceOrganization1.displayId,
    processingResourceOrg_ID: resourceOrganization1.displayId,
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
const resourceRequestData2: ResourceRequest = {
    ID: uuid(),
    name: `Name_${uuid()}`,
    displayId: uuid().substring(26),
    isS4Cloud: true,
    demand_ID: demand2.ID,
    workpackage_ID: 'EWMPRD.1.1',
    project_ID: 'EWMPRD',
    projectRole_ID: projectRoleWithDescription2.ID,
    requestedResourceOrg_ID: resourceOrganization2.displayId,
    processingResourceOrg_ID: resourceOrganization2.displayId,
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
const resourceRequestData3: ResourceRequest = {
    ID: uuid(),
    name: `Name_${uuid()}`,
    displayId: uuid().substring(26),
    isS4Cloud: true,
    demand_ID: '',
    workpackage_ID: 'S4PROJ.1.1',
    project_ID: 'S4PROJ',
    projectRole_ID: projectRoleWithDescription1.ID,
    requestedResourceOrg_ID: resourceOrganization5.displayId,
    processingResourceOrg_ID: resourceOrganization5.displayId,
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
    description: description3,
};
const resourceRequestData4: ResourceRequest = {
    ID: uuid(),
    name: `Name_${uuid()}`,
    displayId: uuid().substring(26),
    isS4Cloud: true,
    demand_ID: '',
    workpackage_ID: 'EWMPRD.1.1',
    project_ID: 'EWMPRD',
    projectRole_ID: projectRoleWithDescription2.ID,
    requestedResourceOrg_ID: resourceOrganization5.displayId,
    processingResourceOrg_ID: resourceOrganization5.displayId,
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
    description: description4,
};

const resourceRequestData = [
    resourceRequestData1,
    resourceRequestData2,
    resourceRequestData3,
    resourceRequestData4,
];

export {
    resourceRequestData,
    resourceRequestData1,
    resourceRequestData2,
    resourceRequestData3,
    resourceRequestData4,
    allResourceRequestDesc,
};
