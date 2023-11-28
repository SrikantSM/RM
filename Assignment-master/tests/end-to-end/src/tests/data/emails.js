const employeeHeaders = require("./employeeHeaders");
const uuid = require("uuid").v4;

const allEmailAddressData = [
	{ address: "Usere2e1@sap.com" },
	{ address: "Usere2e2@sap.com" },
	{ address: "Usere2e3@sap.com" },
	{ address: "Usere2e4@sap.com" },
	{ address: "Usere2e5@sap.com" }
];

const employeeEmail1 = {
	parent: employeeHeaders.employeeHeader1.ID,
	ID: uuid(),
	isDefault: true,
	address: "Usere2e1@sap.com"
};

const employeeEmail2 = {
	parent: employeeHeaders.employeeHeader2.ID,
	ID: uuid(),
	isDefault: true,
	address: "Usere2e2@sap.com"
};

const employeeEmail3 = {
	parent: employeeHeaders.employeeHeader3.ID,
	ID: uuid(),
	isDefault: true,
	address: "Usere2e3@sap.com"
};

const employeeEmail4 = {
	parent: employeeHeaders.employeeHeader4.ID,
	ID: uuid(),
	isDefault: true,
	address: "Usere2e4@sap.com"
};

const employeeEmail5 = {
	parent: employeeHeaders.employeeHeader5.ID,
	ID: uuid(),
	isDefault: true,
	address: "Usere2e5@sap.com"
};

const emails = [employeeEmail1, employeeEmail2, employeeEmail3, employeeEmail4, employeeEmail5];

module.exports = {allEmailAddressData, emails};