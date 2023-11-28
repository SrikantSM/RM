import { OrganizationHeader } from 'test-commons';

const organizationHeaderUpload1: OrganizationHeader = {
    code: 'XYZ01',
    isDelivery: 'X',
    description: 'Organization ORG 80',
};

const organizationHeaderUpload2: OrganizationHeader = {
    code: 'XYZ02',
    isDelivery: 'X',
    description: 'Organization ORG 90',
};

const organizationHeaderUpload3: OrganizationHeader = {
    code: 'XYZ03',
    isDelivery: 'X',
    description: 'Organization ORG 100',
};

const allOrganizationHeaderUploads = [
    organizationHeaderUpload1,
    organizationHeaderUpload2,
    organizationHeaderUpload3,
];

export {
    allOrganizationHeaderUploads,
    organizationHeaderUpload1,
    organizationHeaderUpload2,
    organizationHeaderUpload3,
};
