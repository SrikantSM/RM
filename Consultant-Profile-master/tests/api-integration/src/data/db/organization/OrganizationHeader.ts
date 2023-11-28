import { OrganizationHeader } from 'test-commons';

const organizationHeader1: OrganizationHeader = {
    code: 'Org_9',
    isDelivery: 'X',
    description: 'Organization ORG_9 Germany',
};

const organizationHeader2: OrganizationHeader = {
    code: 'Org_8',
    isDelivery: 'X',
    description: 'Organization ORG_8 India',
};

const organizationHeader3: OrganizationHeader = {
    code: 'SO1',
    isDelivery: 'X',
    description: 'Service Organization 1',
};

const organizationHeader4: OrganizationHeader = {
    code: 'SO2',
    isDelivery: 'X',
    description: 'Service Organization 2',
};

const organizationHeader5: OrganizationHeader = {
    code: 'SO3',
    isDelivery: 'X',
    description: 'Service Organization 3',
};

const allOrganizationHeaders = [
    organizationHeader1,
    organizationHeader2,
];

const organizationHeadersForSO = [
    organizationHeader3,
    organizationHeader4,
    organizationHeader5,
];

export {
    allOrganizationHeaders,
    organizationHeadersForSO,
    organizationHeader1,
    organizationHeader2,
};
