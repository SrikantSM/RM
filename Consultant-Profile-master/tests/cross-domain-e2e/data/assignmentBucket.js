const uuid = require("uuid").v4;
const assignments = require("./assignments");
const now = new Date(Date.now());
const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

const assignmentBucket = [
	{
		ID: uuid(),
		assignment_ID: assignments.assignment1.ID,
		startTime: today.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
		bookedCapacityInMinutes: 1800
	},
	{
		ID: uuid(),
		assignment_ID: assignments.assignment2.ID,
		startTime: today.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
		bookedCapacityInMinutes: 1800
	}
];

module.exports = {
	assignmentBucket
};
