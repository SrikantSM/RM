import { v4 as uuid } from 'uuid';
import { ResourceOrganizations } from 'test-commons';

const resourceOrganization1: ResourceOrganizations = {
    ID: uuid(),
    displayId: 'Org_9',
    description: 'Organization ORG_9 Germany',
    name: 'Organization ORG_9 Germany',
    serviceOrganization_code: '',
    lifeCycleStatus_code: 0,
};

const resourceOrganization2: ResourceOrganizations = {
    ID: uuid(),
    displayId: 'Org_8',
    description: 'Organization ORG_8 India',
    name: 'Organization ORG_8 India',
    serviceOrganization_code: '',
    lifeCycleStatus_code: 0,
};

const resourceOrganization3: ResourceOrganizations = {
    ID: uuid(),
    displayId: 'RO1',
    description: 'Organization RO1 of SO1',
    name: 'Organization RO1 of SO1',
    serviceOrganization_code: 'SO1',
    lifeCycleStatus_code: 0,
};

const resourceOrganization4: ResourceOrganizations = {
    ID: uuid(),
    displayId: 'RO2',
    description: 'Organization R02 of SO2',
    name: 'Organization RO2 of SO2',
    serviceOrganization_code: 'SO2',
    lifeCycleStatus_code: 0,
};

const resourceOrganization5: ResourceOrganizations = {
    ID: uuid(),
    displayId: 'RO3',
    description: 'Organization R03 of SO3',
    name: 'Organization RO3 of SO3',
    serviceOrganization_code: 'SO3',
    lifeCycleStatus_code: 0,
};

const allResourceOrganizations = [
    resourceOrganization1,
    resourceOrganization2,
    resourceOrganization3,
    resourceOrganization4,
    resourceOrganization5,
];

export {
    allResourceOrganizations,
    resourceOrganization1,
    resourceOrganization2,
    resourceOrganization3,
    resourceOrganization4,
    resourceOrganization5,
};
