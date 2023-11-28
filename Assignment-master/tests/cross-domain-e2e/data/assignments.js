const uuid = require("uuid").v4;

const assignment1 = {
	ID: uuid(),
	bookedCapacityInMinutes: 1800,
	assignmentstatus_code: 0,
	resourceRequest_ID: "",
	resource_ID: ""
};

const assignments = [assignment1];

module.exports = {
	assignments,
	assignment1
};
