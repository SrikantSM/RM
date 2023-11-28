const { organizationHeaders, allOrganizationHeaders } = require('./organizationHeader');
const { testRunId } = require('./testRunID.js');

const costCenter1 = `XXXX0-${testRunId}`;
const costCenter2 = `XXXX1-${testRunId}`;
const companyCode = 'XXXX';
const companyCode2 = 'YYYY';
const companyCode3 = 'ZZZZ';
const unitKey1 = 'C01XYZ01';
const unitKey2 = 'C01XYZ02';
const unitKey3 = 'C01XYZ03';
const unitKey4 = 'C01XYZ04';
const unitKey5 = 'C01XYZ05';
const unitKey6 = 'C01XYZ06';
const organizationHeader1 = organizationHeaders[0];
const organizationHeader2 = organizationHeaders[1];
const organizationHeader11 = allOrganizationHeaders[0];
const organizationHeader12 = allOrganizationHeaders[1];
const organizationHeader13 = allOrganizationHeaders[2];

const unitKey1Object = {
    unitKey: companyCode,
};

const unitKey2Object = {
    unitKey: companyCode2,
};

const unitKey3Object = {
    unitKey: companyCode3,
};

const allUnitKeys = [
    unitKey1Object,
    unitKey2Object,
    unitKey3Object,
];

const organizationDetail1 = {
    code: organizationHeader1.code,
    unitKey: costCenter1,
    unitType: 'CS',
};

const organizationDetail2 = {
    code: organizationHeader2.code,
    unitKey: costCenter2,
    unitType: 'CS',
};

const organizationDetail3 = {
    code: organizationHeader1.code,
    unitKey: companyCode,
    unitType: 'CC',
};

const organizationDetail4 = {
    code: organizationHeader2.code,
    unitKey: companyCode,
    unitType: 'CC',
};
const organizationDetail11 = {
    code: organizationHeader11.code,
    unitKey: unitKey1,
    unitType: 'CS',
};

const organizationDetail12 = {
    code: organizationHeader11.code,
    unitKey: unitKey2,
    unitType: 'CS',
};

const organizationDetail13 = {
    code: organizationHeader12.code,
    unitKey: unitKey3,
    unitType: 'CS',
};

const organizationDetail14 = {
    code: organizationHeader12.code,
    unitKey: unitKey4,
    unitType: 'CS',
};

const organizationDetail15 = {
    code: organizationHeader13.code,
    unitKey: unitKey5,
    unitType: 'CS',
};

const organizationDetail16 = {
    code: organizationHeader13.code,
    unitKey: unitKey6,
    unitType: 'CS',
};

const organizationDetail17 = {
    code: organizationHeader12.code,
    unitKey: companyCode3,
    unitType: 'CC',
};

const organizationDetail18 = {
    code: organizationHeader11.code,
    unitKey: companyCode3,
    unitType: 'CC',
};
const organizationDetail19 = {
    code: organizationHeader13.code,
    unitKey: companyCode3,
    unitType: 'CC',
};

const organizationDetails = [
    organizationDetail1,
    organizationDetail2,
    organizationDetail3,
    organizationDetail4,
];

const allOrganizationDetails = [
    organizationDetail11,
    organizationDetail12,
    organizationDetail13,
    organizationDetail14,
    organizationDetail15,
    organizationDetail16,
    organizationDetail17,
    organizationDetail18,
    organizationDetail19,
];

module.exports = { organizationDetails, allUnitKeys, allOrganizationDetails };
