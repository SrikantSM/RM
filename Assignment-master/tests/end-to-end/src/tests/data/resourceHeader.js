const uuid = require("uuid").v4;
const workAssignments = require("./workAssignments");

const resourceHeader1 = {
	ID: workAssignments.workAssignment1.ID,
	TYPE_CODE: 1
};

const resourceHeader2 = {
	ID: workAssignments.workAssignment2.ID,
	TYPE_CODE: 1
};

const resourceHeader3 = {
	ID: workAssignments.workAssignment3.ID,
	TYPE_CODE: 1
};

const resourceHeader4 = {
	ID: workAssignments.workAssignment4.ID,
	TYPE_CODE: 1
};

const resourceHeader5 = {
	ID: workAssignments.workAssignment5.ID,
	TYPE_CODE: 1
};

const resourceHeader = [resourceHeader1, resourceHeader2, resourceHeader3, resourceHeader4, resourceHeader5];

module.exports = {
	resourceHeader,
	resourceHeader1,
	resourceHeader2,
	resourceHeader3,
	resourceHeader4,
	resourceHeader5
};