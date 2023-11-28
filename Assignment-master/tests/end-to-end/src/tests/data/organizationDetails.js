const { organizationHeaders } = require("./organizationHeaders");

const organizationHeader1 = organizationHeaders[0];
const organizationHeader2 = organizationHeaders[1];
const organizationHeader3 = organizationHeaders[2];
const costCenterUnitKey1 = "EXC1";
const costCenterUnitKey2 = "EXC2";
const costCenterUnitKey3 = "EXC3";
const companyCodeUnitKey1 = "C001";
const companyCodeUnitKey2 = "C002";
const companyCodeUnitKey3 = "C003";
const controlAreaUnitKey1 = "AE01";
const controlAreaUnitKey2 = "AE02";
const controlAreaUnitKey3 = "AE02";
const costCenterUnitType = "CS";
const companyCodeUnitType = "CC";
const controlAreaUnitType = "CA";

const unitKey1Object = {
	unitKey: costCenterUnitKey1
};

const unitKey2Object = {
	unitKey: costCenterUnitKey2
};

const unitKey3Object = {
	unitKey: costCenterUnitKey3
};

const unitKey4Object = {
	unitKey: companyCodeUnitKey1
};

const unitKey5Object = {
	unitKey: companyCodeUnitKey2
};

const unitKey6Object = {
	unitKey: companyCodeUnitKey3
};

const unitKey7Object = {
	unitKey: controlAreaUnitKey1
};

const unitKey8Object = {
	unitKey: controlAreaUnitKey2
};

const unitKey9Object = {
	unitKey: controlAreaUnitKey3
};

const allUnitKeys = [
	unitKey1Object,
	unitKey2Object,
	unitKey3Object,
	unitKey4Object,
	unitKey5Object,
	unitKey6Object,
	unitKey7Object,
	unitKey8Object,
	unitKey9Object
];

const organizationDetail1 = {
	code: organizationHeader1.code,
	unitKey: costCenterUnitKey1,
	unitType: costCenterUnitType,
	compositeUnitKey: organizationHeader1.code + "_" + costCenterUnitKey1
};
const organizationDetail2 = {
	code: organizationHeader2.code,
	unitKey: costCenterUnitKey2,
	unitType: costCenterUnitType,
	compositeUnitKey: organizationHeader1.code + "_" + costCenterUnitKey2
};
const organizationDetail3 = {
	code: organizationHeader3.code,
	unitKey: costCenterUnitKey3,
	unitType: costCenterUnitType,
	compositeUnitKey: organizationHeader1.code + "_" + costCenterUnitKey3
};

const organizationDetail4 = {
	code: organizationHeader1.code,
	unitKey: companyCodeUnitKey1,
	unitType: companyCodeUnitType,
	compositeUnitKey: organizationHeader1.code + "_" + companyCodeUnitKey1
};
const organizationDetail5 = {
	code: organizationHeader2.code,
	unitKey: companyCodeUnitKey2,
	unitType: companyCodeUnitType,
	compositeUnitKey: organizationHeader1.code + "_" + companyCodeUnitKey2
};
const organizationDetail6 = {
	code: organizationHeader3.code,
	unitKey: companyCodeUnitKey3,
	unitType: companyCodeUnitType,
	compositeUnitKey: organizationHeader1.code + "_" + companyCodeUnitKey3
};

const organizationDetail7 = {
	code: organizationHeader1.code,
	unitKey: controlAreaUnitKey1,
	unitType: controlAreaUnitType,
	compositeUnitKey: organizationHeader1.code + "_" + controlAreaUnitKey1
};
const organizationDetail8 = {
	code: organizationHeader2.code,
	unitKey: controlAreaUnitKey2,
	unitType: controlAreaUnitType,
	compositeUnitKey: organizationHeader1.code + "_" + controlAreaUnitKey2
};
const organizationDetail9 = {
	code: organizationHeader3.code,
	unitKey: controlAreaUnitKey3,
	unitType: controlAreaUnitType,
	compositeUnitKey: organizationHeader1.code + "_" + controlAreaUnitKey3
};

const organizationDetails = [
	organizationDetail1,
	organizationDetail2,
	organizationDetail3,
	organizationDetail4,
	organizationDetail5,
	organizationDetail6,
	organizationDetail7,
	organizationDetail8,
	organizationDetail9
];

module.exports = {organizationDetails, allUnitKeys}
