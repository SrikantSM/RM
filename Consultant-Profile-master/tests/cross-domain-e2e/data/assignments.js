const uuid = require("uuid").v4;
const { resourceHeaders } = require('./resourceHeaders');
const { resourceRequest } = require('./resourceRequest');

const assignment1 = {
	ID: uuid(),
	bookedCapacityInMinutes: 1800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequest[0].ID,
	resource_ID: resourceHeaders[2].ID
};

const assignment2 = {
	ID: uuid(),
	bookedCapacityInMinutes: 1800,
	assignmentstatus_code: 0,
	resourceRequest_ID: resourceRequest[1].ID,
	resource_ID: resourceHeaders[3].ID
};

const assignments = [assignment1, assignment2];

module.exports = {
	assignments,
	assignment1,
	assignment2
};
