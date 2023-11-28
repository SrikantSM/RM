const orgHeaderCode1 = 'CPE1';
const orgHeaderCode2 = 'CPE2';
const orgHeaderCode11 = 'SOF1';
const orgHeaderCode12 = 'SOF2';
const orgHeaderCode13 = 'SOF3';
const orgHeader1Desc = `The description of OrgHeader1 is ${orgHeaderCode1}`;
const orgHeader2Desc = `The description of OrgHeader2 is ${orgHeaderCode2}`;
const orgHeader11Desc = 'Organization Portland';
const orgHeader12Desc = 'Organization Singapore';
const orgHeader13Desc = 'Organization Scotland';

const organizationHeader1 = {
    code: orgHeaderCode1,
    description: orgHeader1Desc,
    isDelivery: 'X',
};
const organizationHeader2 = {
    code: orgHeaderCode2,
    description: orgHeader2Desc,
    isDelivery: 'X',
};
const organizationHeader11 = {
    code: orgHeaderCode11,
    description: orgHeader11Desc,
    isDelivery: 'X',
};
const organizationHeader12 = {
    code: orgHeaderCode12,
    description: orgHeader12Desc,
    isDelivery: 'X',
};
const organizationHeader13 = {
    code: orgHeaderCode13,
    description: orgHeader13Desc,
    isDelivery: 'X',
};
const organizationHeaders = [
    organizationHeader1,
    organizationHeader2,

];

const allOrganizationHeaders = [
    organizationHeader11,
    organizationHeader12,
    organizationHeader13,

];

module.exports = { organizationHeaders, allOrganizationHeaders };
