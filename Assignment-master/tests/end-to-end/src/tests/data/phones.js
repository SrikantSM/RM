const employeeHeaders = require("./employeeHeaders");
const uuid = require("uuid").v4;

const employeePhone1 = {
	ID: uuid(),
	number_extension: "1234",
	parent: employeeHeaders.employeeHeader1.ID,
	isDefault: true,
	number_area: "010",
	number_subscriber: "12345678",
	number: "49-6227-31002"
};

const employeePhone2 = {
	ID: uuid(),
	number_extension: "9876",
	parent: employeeHeaders.employeeHeader2.ID,
	isDefault: true,
	number_area: "020",
	number_subscriber: "98765432",
	number: "49-6227-31002"
};

const employeePhone3 = {
	ID: uuid(),
	number_extension: "1234",
	parent: employeeHeaders.employeeHeader3.ID,
	isDefault: true,
	number_area: "010",
	number_subscriber: "12345678",
	number: "49-6227-31002"
};

const employeePhone4 = {
	ID: uuid(),
	number_extension: "1234",
	parent: employeeHeaders.employeeHeader4.ID,
	isDefault: true,
	number_area: "010",
	number_subscriber: "12345678",
	number: "49-6227-31002"
};

const employeePhone5 = {
	ID: uuid(),
	number_extension: "1234",
	parent: employeeHeaders.employeeHeader5.ID,
	isDefault: true,
	number_area: "010",
	number_subscriber: "12345678",
	number: "49-6227-31002"
};

const phones = [employeePhone1, employeePhone2, employeePhone3, employeePhone4, employeePhone5];

module.exports = {phones};