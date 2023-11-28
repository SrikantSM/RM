const uuid = require("uuid").v4;
//const org_header = require('crypto-random-string');
//const environment = require('../../utils').getEnvironment();
//const seleniumTestName = environment.seleniumTestName;

const orgHeaderCode1 = "UIV1";
const orgHeaderCode2 = "UIV2";
const orgHeaderCode3 = "UIV3";
const orgHeader1Desc = "UIVeri5Org India";
const orgHeader2Desc = "UIVeri5Org Germany";
const orgHeader3Desc = "UIVeri5Org America";

const organizationHeader1 = {
	code: orgHeaderCode1,
	description: orgHeader1Desc,
	isDelivery: "X"
};
const organizationHeader2 = {
	code: orgHeaderCode2,
	description: orgHeader2Desc,
	isDelivery: "X"
};
const organizationHeader3 = {
	code: orgHeaderCode3,
	description: orgHeader3Desc,
	isDelivery: "X"
};
const organizationHeader4 = {
	code: orgHeaderCode3,
	description: orgHeader3Desc,
	isDelivery: "X"
};
const organizationHeaders = [organizationHeader1, organizationHeader2, organizationHeader3, organizationHeader4];

module.exports = {
	organizationHeaders,
	organizationHeader1,
	organizationHeader2,
	organizationHeader3,
	organizationHeader4
};