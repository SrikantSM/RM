const uuid = require('uuid').v4;
const { organizationDetails } = require('./organizationDetail');

const costCenterID3 = 'YYYY001';
const costCenterID4 = 'YYYY002';

const controllingArea = 'AXXX';
const companyCode = 'XXXX';
const companyCode2 = 'YYYY';
const companyCode3 = 'ZZZZ';
const unitKey1 = 'C01XYZ01';
const unitKey2 = 'C01XYZ02';
const unitKey3 = 'C01XYZ03';
const unitKey4 = 'C01XYZ04';
const unitKey5 = 'C01XYZ05';
const unitKey6 = 'C01XYZ06';
const organizationDetail1 = organizationDetails[0];
const organizationDetail2 = organizationDetails[1];

const controllingAreaID = {
    controllingArea,
};

const allcontrollingArea = [
    controllingAreaID,
];

const costCenter1 = {
    ID: uuid(),
    costCenterID: costCenterID3,
    displayName: costCenterID3,
    costCenterDesc: `${costCenterID3} (${costCenterID3})`,
    companyCode: companyCode2,
    controllingArea,
};

const costCenter2 = {
    ID: uuid(),
    costCenterID: costCenterID4,
    displayName: costCenterID4,
    costCenterDesc: `${costCenterID4} (${costCenterID4})`,
    companyCode: companyCode2,
    controllingArea,
};

const costCenter3 = {
    ID: uuid(),
    costCenterID: organizationDetail1.unitKey,
    displayName: organizationDetail1.unitKey,
    costCenterDesc: `${organizationDetail1.unitKey} (${organizationDetail1.unitKey})`,
    companyCode,
    controllingArea,
};

const costCenter4 = {
    ID: uuid(),
    costCenterID: organizationDetail2.unitKey,
    displayName: organizationDetail2.unitKey,
    costCenterDesc: `${organizationDetail2.unitKey} (${organizationDetail2.unitKey})`,
    companyCode,
    controllingArea,
};

const costCenter11 = {
    ID: uuid(),
    costCenterID: unitKey1,
    displayName: unitKey1,
    costCenterDesc: `${unitKey1} (${unitKey1})`,
    companyCode: companyCode3,
    controllingArea,
};

const costCenter12 = {
    ID: uuid(),
    costCenterID: unitKey2,
    displayName: unitKey2,
    costCenterDesc: `${unitKey2} (${unitKey2})`,
    companyCode: companyCode3,
    controllingArea,
};

const costCenter13 = {
    ID: uuid(),
    costCenterID: unitKey3,
    displayName: unitKey3,
    costCenterDesc: `${unitKey3} (${unitKey3})`,
    companyCode: companyCode3,
    controllingArea,
};

const costCenter14 = {
    ID: uuid(),
    costCenterID: unitKey4,
    displayName: unitKey4,
    costCenterDesc: `${unitKey4} (${unitKey4})`,
    companyCode: companyCode3,
    controllingArea,
};

const costCenter15 = {
    ID: uuid(),
    costCenterID: unitKey5,
    displayName: unitKey5,
    costCenterDesc: `${unitKey5} (${unitKey5})`,
    companyCode: companyCode3,
    controllingArea,
};

const costCenter16 = {
    ID: uuid(),
    costCenterID: unitKey6,
    displayName: unitKey6,
    costCenterDesc: `${unitKey6} (${unitKey6})`,
    companyCode: companyCode3,
    controllingArea,
};

const costCenters = [
    costCenter1,
    costCenter2,
    costCenter3,
    costCenter4,
    costCenter11,
    costCenter12,
    costCenter13,
    costCenter14,
    costCenter15,
    costCenter16,
];

module.exports = { costCenters, allcontrollingArea };
