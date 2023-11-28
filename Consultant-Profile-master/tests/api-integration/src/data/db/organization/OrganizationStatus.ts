import { OrganizationStatus } from 'test-commons';

const organizationStatusYes: OrganizationStatus = {
    code: 'X',
    name: 'Yes',
};

const organizationStatusNo: OrganizationStatus = {
    code: 'N',
    name: 'No',
};

const allOrganizationStatus = [
    organizationStatusYes,
    organizationStatusNo,
];

export {
    allOrganizationStatus,
    organizationStatusYes,
    organizationStatusNo,
};
