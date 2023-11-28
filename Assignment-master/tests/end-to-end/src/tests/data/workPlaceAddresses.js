const workAssignments = require("./workAssignments");
const uuid = require("uuid").v4;

const workPlaceAddress1 = {
	ID: uuid(),
	parent: workAssignments.workAssignment1.ID,
	officeLocation: "Bengaluru, India",
	validFrom: "2018-06-01",
	validTo: "9999-12-31"
};

const workPlaceAddress2 = {
	ID: uuid(),
	parent: workAssignments.workAssignment2.ID,
	officeLocation: "Munich, Germany",
	validFrom: "2018-06-01",
	validTo: "9999-12-31"
};

const workPlaceAddress3 = {
	ID: uuid(),
	parent: workAssignments.workAssignment3.ID,
	officeLocation: "Seattle, USA",
	validFrom: "2018-06-01",
	validTo: "9999-12-31"
};

const workPlaceAddress4 = {
	ID: uuid(),
	parent: workAssignments.workAssignment4.ID,
	officeLocation: "Walldorf, Germany",
	validFrom: "2018-06-01",
	validTo: "9999-12-31"
};
const workPlaceAddress5 = {
	ID: uuid(),
	parent: workAssignments.workAssignment5.ID,
	officeLocation: "New York, USA",
	validFrom: "2018-06-01",
	validTo: "9999-12-31"
};
const workPlaceAddresses = [workPlaceAddress1, workPlaceAddress2, workPlaceAddress3, workPlaceAddress4, workPlaceAddress5];

module.exports = {workPlaceAddresses};