const employeeHeaders = require('./employeeHeaders');

const workforcePerson1 = {
	ID: employeeHeaders.employeeHeader1.ID,
	externalID: 'test.usere2e4'
}

const workforcePersons = [
	workforcePerson1,

];

module.exports = { 
	workforcePersons,
	workforcePerson1,
};
