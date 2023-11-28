const { organizationHeaders } = require('./organizationHeaders');

const organizationHeader1 = organizationHeaders[0];
const organizationHeader2 = organizationHeaders[1];
const costCenterUnitKey1 = 'CCIN';
const costCenterUnitKey2 = 'CCDE';
const companyCodeUnitKey1 = 'C001';
const companyCodeUnitKey2 = 'C002';
const costCenterUnitType = 'CS';
const companyCodeUnitType = 'CC';

const unitKey1Object = { unitKey: costCenterUnitKey1 };
const organizationDetail1 = {
    code: organizationHeader1.code,
    unitType: costCenterUnitType,
    compositeUnitKey: organizationHeader1.code + '_' + costCenterUnitKey1
};
Object.assign(organizationDetail1, unitKey1Object);

const unitKey2Object = { unitKey: costCenterUnitKey2 };
const organizationDetail2 = {
    code: organizationHeader2.code,
    unitType: costCenterUnitType,
    compositeUnitKey: organizationHeader2.code + '_' + costCenterUnitKey2
};
Object.assign(organizationDetail2, unitKey2Object);

const unitKey3Object = { unitKey: companyCodeUnitKey1 };
const organizationDetail3 = {
    code: organizationHeader1.code,
    unitType: companyCodeUnitType,
    compositeUnitKey: organizationHeader1.code + '_' + companyCodeUnitKey1
};
Object.assign(organizationDetail3, unitKey3Object);

const unitKey4Object = { unitKey: companyCodeUnitKey2 };
const organizationDetail4 = {
    code: organizationHeader2.code,
    unitType: companyCodeUnitType,
    compositeUnitKey: organizationHeader2.code + '_' + companyCodeUnitKey2
};
Object.assign(organizationDetail4, unitKey4Object);

const allUnitKeys = [unitKey1Object, unitKey2Object, unitKey3Object, unitKey4Object];
const organizationDetails = [
    organizationDetail1,
    organizationDetail2,
    organizationDetail3,
    organizationDetail4,
];

module.exports = {
    allUnitKeys,
    organizationDetails,
    organizationDetail1,
    organizationDetail2,
    organizationDetail3,
    organizationDetail4,
};
