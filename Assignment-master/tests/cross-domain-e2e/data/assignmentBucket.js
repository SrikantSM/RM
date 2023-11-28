const uuid = require("uuid").v4;
const assignments = require("./assignments");
const moment = require("moment");

const assignmentBucket = [
	{
		ID: uuid(),
		assignment_ID: assignments.assignment1.ID,
		startTime: moment().startOf("month").format("YYYY-MM-DD") + " 00:00:00.000000000",
		bookedCapacityInMinutes: 1800
	}
];

module.exports = {
	assignmentBucket
};
