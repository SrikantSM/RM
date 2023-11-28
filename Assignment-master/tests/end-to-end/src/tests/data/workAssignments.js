const uuid = require("uuid").v4;
const employeeHeaders = require("./employeeHeaders");

const workAssignment1 = {
	ID: uuid(),
	workAssignmentID: uuid(),
	parent: employeeHeaders.employeeHeader1.ID,
	externalID: "Test Usere2e1",
	startDate: "2017-12-31 11:00:00.000",
	endDate: "2099-12-31 11:00:00.000",
	isContingentWorker: true
};

const workAssignment2 = {
	ID: uuid(),
	workAssignmentID: uuid(),
	parent: employeeHeaders.employeeHeader2.ID,
	externalID: "Test Usere2e2",
	startDate: "2017-12-31 11:00:00.000",
	endDate: "2099-12-31 11:00:00.000",
	isContingentWorker: false
};

const workAssignment3 = {
	ID: uuid(),
	workAssignmentID: uuid(),
	parent: employeeHeaders.employeeHeader3.ID,
	externalID: "Test Usere2e3",
	startDate: "2017-12-31 11:00:00.000",
	endDate: "2099-12-31 11:00:00.000",
	isContingentWorker: true
};

const workAssignment4 = {
	ID: uuid(),
	workAssignmentID: uuid(),
	parent: employeeHeaders.employeeHeader4.ID,
	externalID: "Test Usere2e4",
	startDate: "2017-12-31 11:00:00.000",
	endDate: "2099-12-31 11:00:00.000",
	isContingentWorker: false
};

const workAssignment5 = {
	ID: uuid(),
	workAssignmentID: uuid(),
	parent: employeeHeaders.employeeHeader5.ID,
	externalID: "Test Usere2e5",
	startDate: "2022-07-01 11:00:00.000",
	endDate: "2099-12-31 11:00:00.000",
	isContingentWorker: false
};
const workAssignments = [workAssignment1, workAssignment2, workAssignment3, workAssignment4, workAssignment5];

module.exports = {
	workAssignments,
	workAssignment1,
	workAssignment2,
	workAssignment3,
	workAssignment4,
	workAssignment5
};
