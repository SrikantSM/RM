const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');

const phone1 = {
	ID: uuid(),
	number: '1234-10-12345678',
	parent: employeeHeaders.employeeHeader1.ID,
	isDefault: true,
};

const phone2 = {
	ID: uuid(),
	number: '2345-20-23456789',
	parent: employeeHeaders.employeeHeader2.ID,
	isDefault: true,
};

const phone3 = {
	ID: uuid(),
	number: '1234-10-12345678',
	parent: employeeHeaders.employeeHeader3.ID,
	isDefault: true,
};

const phone4 = {
	ID: uuid(),
	number: '2345-20-23456789',
	parent: employeeHeaders.employeeHeader4.ID,
	isDefault: true,
};

const phones = [
    phone1,
    phone2,
    phone3,
    phone4,
];

module.exports = {
    phones,
    phone1,
    phone2,
    phone3,
    phone4,
};
