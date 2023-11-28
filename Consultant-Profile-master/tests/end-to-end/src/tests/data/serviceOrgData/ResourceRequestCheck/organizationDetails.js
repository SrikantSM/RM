const { rrOganizationHeaders } = require('./organizationHeader');
const { rrCostCenters } = require('./costCenters');

const costCenter1 = rrCostCenters[0].costCenterID;
const costCenter2 = rrCostCenters[1].costCenterID;
const companyCode = 'XBBB';
const organizationHeader1 = rrOganizationHeaders[0].code;

const organizationDetail1 = {
    code: organizationHeader1,
    unitKey: costCenter1,
    unitType: 'CS',
};

const organizationDetail2 = {
    code: organizationHeader1,
    unitKey: costCenter2,
    unitType: 'CS',
};

const organizationDetail3 = {
    code: organizationHeader1,
    unitKey: companyCode,
    unitType: 'CC',
};

const rrOrganizationDetails = [
    organizationDetail1,
    organizationDetail2,
    organizationDetail3,
];

module.exports = { rrOrganizationDetails };
