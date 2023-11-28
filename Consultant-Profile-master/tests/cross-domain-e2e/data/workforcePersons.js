const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');

const workforcePerson1 = {
	ID: employeeHeaders.employeeHeader1.ID,
	externalID: 'test.usere2e1'
}

const workforcePerson2 = {
	ID: employeeHeaders.employeeHeader2.ID,
	externalID: 'test.usere2e2'
}

const workforcePerson3 = {
	ID: employeeHeaders.employeeHeader3.ID,
	externalID: 'test.usere2e3'
}

const workforcePerson4 = {
	ID: employeeHeaders.employeeHeader4.ID,
	externalID: 'test.usere2e4'
}

const workforcePerson5 = {
	ID: employeeHeaders.employeeHeader5.ID,
	externalID: 'resourceManager'
}

const workforcePerson6 = {
	ID: employeeHeaders.employeeHeader6.ID,
	externalID: 'processor'
}

const workforcePersons = [
	workforcePerson1,
	workforcePerson2,
	workforcePerson3,
	workforcePerson4,
	workforcePerson5,
	workforcePerson6

];

module.exports = { 
	workforcePersons,
	workforcePerson1,
	workforcePerson2,
	workforcePerson3,
	workforcePerson4,
	workforcePerson5,
	workforcePerson6
};
