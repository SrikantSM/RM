const organizationHeaders = require('./organizationHeaders');

const organizationalDetailsData1 = {
    unitKey: 'CCDE',
    unitType: 'CS',
};

const organizationalDetailsData2 = {
    unitKey: 'CCIN',
    unitType: 'CS',
};

const organizationalDetailsData4 = {
    unitKey: 'CCUK',
    unitType: 'CS',
};
const organizationalDetailsData5 = {
    unitKey: 'CC01',
    unitType: 'CC',
};
const organizationalDetailsData6 = {
    unitKey: 'CC02',
    unitType: 'CC',
};
const organizationalDetailsData7 = {
    unitKey: 'CC03',
    unitType: 'CC',
};
const organizationalDetailsData8 = {
    unitKey: 'CC04',
    unitType: 'CC',
};

const organizationDetail1 = {
    code: organizationHeaders.organizationHeader1.code,
    compositeUnitKey: `${organizationHeaders.organizationHeader1.code}_${organizationalDetailsData1.unitKey}`,
};

const organizationDetail2 = {
    code: organizationHeaders.organizationHeader2.code,
    compositeUnitKey: `${organizationHeaders.organizationHeader2.code}_${organizationalDetailsData2.unitKey}`,
};

const organizationDetail4 = {
    code: organizationHeaders.organizationHeader4.code,
    compositeUnitKey: `${organizationHeaders.organizationHeader4.code}_${organizationalDetailsData4.unitKey}`,
};

const organizationDetail5 = {
    code: organizationHeaders.organizationHeader1.code,
};

const organizationDetail6 = {
    code: organizationHeaders.organizationHeader2.code,
};

const organizationDetail7 = {
    code: organizationHeaders.organizationHeader4.code,
};

const organizationDetail8 = {
    code: organizationHeaders.organizationHeader4.code,
};

Object.assign(organizationDetail1, organizationalDetailsData1);
Object.assign(organizationDetail2, organizationalDetailsData2);
Object.assign(organizationDetail4, organizationalDetailsData4);
Object.assign(organizationDetail5, organizationalDetailsData5);
Object.assign(organizationDetail6, organizationalDetailsData6);
Object.assign(organizationDetail7, organizationalDetailsData7);
Object.assign(organizationDetail8, organizationalDetailsData8);

const organizationDetails = [
    organizationDetail1,
    organizationDetail2,
    organizationDetail4,
    organizationDetail5,
    organizationDetail6,
    organizationDetail7,
    organizationDetail8,
];

module.exports = {
    organizationDetails,
    organizationDetail1,
    organizationDetail2,
    organizationDetail4,
    organizationDetail5,
    organizationDetail6,
    organizationDetail7,
    organizationDetail8,
};
